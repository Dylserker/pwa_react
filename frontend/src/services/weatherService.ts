/**
 * Service pour les appels API météo
 */

import { WEATHER_CONFIG } from '../config/weatherConfig';
import type { GeocodingResponse, WeatherData, Location } from '../types/weather';

class WeatherService {
    /**
     * Geocoder une ville pour obtenir ses coordonnées
     */
    async geocodeCity(query: string): Promise<Location> {
        const response = await fetch(
            `${WEATHER_CONFIG.GEOCODING_API}?name=${encodeURIComponent(query)}&count=1&language=fr&format=json`
        );

        if (!response.ok) {
            throw new Error('Erreur de géocodage');
        }

        const data: GeocodingResponse = await response.json();

        if (!data.results || data.results.length === 0) {
            throw new Error(`Ville "${query}" non trouvée. Vérifiez l'orthographe.`);
        }

        return data.results[0];
    }

    /**
     * Récupérer les données météo pour des coordonnées
     */
    async getWeatherData(lat: number, lon: number): Promise<WeatherData> {
        const response = await fetch(
            `${WEATHER_CONFIG.WEATHER_API}?latitude=${lat}&longitude=${lon}` +
            `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m` +
            `&hourly=temperature_2m,weather_code,precipitation_probability` +
            `&timezone=auto&forecast_days=1`
        );

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des données météo');
        }

        return await response.json();
    }

    /**
     * Rechercher une ville et récupérer la météo
     */
    async searchCity(query: string): Promise<{ city: Location; weather: WeatherData; cityName: string }> {
        const location = await this.geocodeCity(query);
        const weather = await this.getWeatherData(location.latitude, location.longitude);
        
        const cityName = `${location.name}${location.admin1 ? ', ' + location.admin1 : ''}, ${location.country}`;

        return { city: location, weather, cityName };
    }
}

export const weatherService = new WeatherService();
