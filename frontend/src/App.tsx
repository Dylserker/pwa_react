import { useEffect, useCallback } from 'react';
import './App.css';
import { useWeather } from './hooks/useWeather';
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
  }, []);

  // Fonction pour gérer la recherche et la notification
  const handleSearch = useCallback(async (query: string) => {
    await searchCity(query);
    // Si notifications activées, envoyer une notification météo
    const notifEnabled = localStorage.getItem('notifications-enabled') === 'true';
    if (permissionStatus === 'granted' && notifEnabled && query) {
      sendNotification('Recherche météo', { body: `Voici la météo pour ${query} !` });
    }
  }, [searchCity, permissionStatus, sendNotification]);

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
            <WeatherDisplay cityName={currentCity.name} data={weatherData} />
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
