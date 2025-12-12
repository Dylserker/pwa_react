/**
 * Hook personnalisé pour gérer la météo
 */

import { useState, useCallback } from 'react';
import { weatherService } from '../services/weatherService';
import { notificationService } from '../services/notificationService';
import { WEATHER_CONFIG } from '../config/weatherConfig';
import type { CurrentCity, WeatherData } from '../types/weather';

interface UseWeatherReturn {
    currentCity: CurrentCity | null;
    weatherData: WeatherData | null;
    loading: boolean;
    error: string | null;
    searchCity: (query: string) => Promise<void>;
    clearError: () => void;
}

export function useWeather(): UseWeatherReturn {
    const [currentCity, setCurrentCity] = useState<CurrentCity | null>(null);
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const searchCity = useCallback(async (query: string) => {
        const trimmedQuery = query.trim();

        if (!trimmedQuery) {
            setError('Veuillez entrer un nom de ville.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const result = await weatherService.searchCity(trimmedQuery);

            const cityObj = {
                name: result.cityName,
                lat: result.city.latitude,
                lon: result.city.longitude
            };
            setCurrentCity(cityObj);
            setWeatherData(result.weather);

            // Sauvegarde dans le localStorage
            localStorage.setItem('lastWeather', JSON.stringify({
                city: cityObj,
                weather: result.weather,
                timestamp: Date.now()
            }));

            // Vérifier les alertes météo
            checkWeatherAlerts(result.weather, result.cityName);
        } catch (err) {
            // Si erreur réseau, tenter de charger la dernière météo stockée
            const cached = localStorage.getItem('lastWeather');
            if (cached) {
                try {
                    const parsed = JSON.parse(cached);
                    setCurrentCity(parsed.city);
                    setWeatherData(parsed.weather);
                    setError('Affichage des dernières données météo enregistrées (hors ligne).');
                } catch (e) {
                    setError('Impossible de lire les données locales.');
                }
            } else {
                setError(err instanceof Error ? err.message : 'Une erreur est survenue');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return { currentCity, weatherData, loading, error, searchCity, clearError };
}

/**
 * Vérifier les alertes météo pour les 4 prochaines heures
 */
function checkWeatherAlerts(data: WeatherData, cityName: string): void {
    const hourly = data.hourly;
    const currentHour = new Date().getHours();

    let rainAlert = false;
    let tempAlert = false;
    let rainHour = 0;
    let highTemp = 0;

    // Vérifier les 4 prochaines heures
    for (let i = 1; i <= 4; i++) {
        const hourIndex = currentHour + i;
        if (hourIndex < hourly.time.length) {
            const code = hourly.weather_code[hourIndex];
            const temp = hourly.temperature_2m[hourIndex];

            // Vérifier la pluie
            if (!rainAlert && WEATHER_CONFIG.RAIN_CODES.includes(code as any)) {
                rainAlert = true;
                rainHour = i;
            }

            // Vérifier la température
            if (!tempAlert && temp > WEATHER_CONFIG.TEMP_THRESHOLD) {
                tempAlert = true;
                highTemp = Math.round(temp);
            }
        }
    }

    // Envoyer les notifications
    if (rainAlert) {
        notificationService.sendWeatherNotification(
            cityName,
            `🌧️ Pluie prévue dans ${rainHour} heure${rainHour > 1 ? 's' : ''} !`,
            'rain'
        );
    }

    if (tempAlert) {
        notificationService.sendWeatherNotification(
            cityName,
            `🌡️ Température supérieure à ${WEATHER_CONFIG.TEMP_THRESHOLD}°C prévue (${highTemp}°C)`,
            'temp'
        );
    }
}
