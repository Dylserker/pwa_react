import { useEffect, useCallback, useState } from 'react';
  // État pour savoir si l'utilisateur est hors ligne
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
import { useFavorites } from './hooks/useFavorites';
import './App.css';
import { useWeather } from './hooks/useWeather';
import { WEATHER_EMOJIS } from './config/weatherConfig';
import { serviceWorkerService } from './services/serviceWorkerService';
import { SearchBar } from './components/SearchBar';
import { WeatherDisplay } from './components/WeatherDisplay';
import { HourlyForecast } from './components/HourlyForecast';
import { NotificationButton } from './components/NotificationButton';
import { DarkModeToggle } from './components/DarkModeToggle';
import { useNotifications } from './hooks/useNotifications';

function App() {
  const { currentCity, weatherData, loading, error, searchCity, clearError } = useWeather();
  const { permissionStatus, sendNotification } = useNotifications();
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    // Initialiser le Service Worker au chargement
    serviceWorkerService.register();

    // Ajouter le manifest au head
    const manifest = document.querySelector('link[rel="manifest"]');
    if (!manifest) {
      const link = document.createElement('link');
      link.rel = 'manifest';
      link.href = '/pwa_react/manifest.json';
      document.head.appendChild(link);
    }

    // Gérer l'état en ligne/hors ligne
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fonction pour gérer la recherche et la notification
  const handleSearch = useCallback(async (query: string) => {
    await searchCity(query);
    // Si notifications activées, envoyer une notification météo détaillée
    const notifEnabled = localStorage.getItem('notifications-enabled') === 'true';
    if (permissionStatus === 'granted' && notifEnabled && query) {
      // Récupérer les données météo après la recherche
      setTimeout(() => {
        // On relit les données du hook (elles sont mises à jour après searchCity)
        const temp = weatherData?.current?.temperature_2m;
        const code = weatherData?.current?.weather_code;
        const emoji = code !== undefined ? WEATHER_EMOJIS[code as keyof typeof WEATHER_EMOJIS] || '' : '';
        if (temp !== undefined && code !== undefined) {
          sendNotification(`Météo à ${query}`, {
            body: `${emoji} ${temp}°C actuellement.`
          });
        } else {
          sendNotification('Recherche météo', { body: `Voici la météo pour ${query} !` });
        }
      }, 200);
    }
  }, [searchCity, permissionStatus, sendNotification, weatherData]);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🌤️ MétéoPWA</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <NotificationButton />
          <DarkModeToggle />
        </div>
      </header>


      <main className="app-main">
        <section className="search-section">
          <SearchBar onSearch={handleSearch} disabled={loading} />
        </section>

        {favorites.length > 0 && (
          <section style={{ marginBottom: '2rem' }}>
            <h3>⭐ Vos villes favorites</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {favorites.map((fav) => (
                <button
                  key={fav}
                  onClick={() => handleSearch(fav)}
                  style={{
                    background: '#fffbe6',
                    border: '1px solid #FFD700',
                    borderRadius: '8px',
                    padding: '0.5rem 1rem',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    color: '#b8860b',
                  }}
                  title={`Voir la météo pour ${fav}`}
                >
                  ★ {fav}
                </button>
              ))}
            </div>
          </section>
        )}

        {error && (
          <div className="error-message" role="alert">
            <p>{error}</p>
            <button onClick={clearError}>Fermer</button>
          </div>
        )}

        {loading && (
          <div className="loading" role="status">
            <p>⏳ Chargement des données...</p>
          </div>
        )}

        {weatherData && currentCity && (
          <>
            <WeatherDisplay
              cityName={currentCity.name}
              data={weatherData}
              isFavorite={isFavorite(currentCity.name.split(',')[0].trim())}
              onToggleFavorite={() => {
                const cityOnly = currentCity.name.split(',')[0].trim();
                if (isFavorite(cityOnly)) {
                  removeFavorite(cityOnly);
                } else {
                  addFavorite(cityOnly);
                }
              }}
            />
            <HourlyForecast data={weatherData} />
          </>
        )}

        {!loading && !weatherData && !error && (
          <div className="welcome-message">
            <p>Bienvenue sur MétéoPWA ! 👋</p>
            <p>Recherchez une ville pour voir la météo actuelle et les prévisions.</p>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Données fournies par Open-Meteo</p>
      </footer>
    </div>
  );
}

export default App;
