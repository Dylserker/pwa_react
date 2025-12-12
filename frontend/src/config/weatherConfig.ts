/**
 * Configuration centralisée de l'application météo
 */

export const WEATHER_CONFIG = {
    GEOCODING_API: 'https://geocoding-api.open-meteo.com/v1/search',
    WEATHER_API: 'https://api.open-meteo.com/v1/forecast',
    STORAGE_KEY_FAVORITES: 'meteo-pwa-favorites',
    STORAGE_KEY_THEME: 'meteo-pwa-theme',
    RAIN_CODES: [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 85, 86, 95, 96, 99],
    TEMP_THRESHOLD: 10 // Température seuil pour notification
} as const;

export const WEATHER_EMOJIS = {
    0: '☀️',      // Clear sky
    1: '🌤️',     // Mainly clear
    2: '⛅',      // Partly cloudy
    3: '☁️',      // Overcast
    45: '🌫️',    // Fog
    48: '🌫️',    // Depositing rime fog
    51: '🌦️',    // Light drizzle
    53: '🌦️',    // Moderate drizzle
    55: '🌧️',    // Dense drizzle
    56: '🌨️',    // Light freezing drizzle
    57: '🌨️',    // Dense freezing drizzle
    61: '🌧️',    // Slight rain
    63: '🌧️',    // Moderate rain
    65: '🌧️',    // Heavy rain
    66: '🌨️',    // Light freezing rain
    67: '🌨️',    // Heavy freezing rain
    71: '🌨️',    // Slight snow
    73: '🌨️',    // Moderate snow
    75: '❄️',     // Heavy snow
    77: '🌨️',    // Snow grains
    80: '🌦️',    // Slight rain showers
    81: '🌧️',    // Moderate rain showers
    82: '⛈️',     // Violent rain showers
    85: '🌨️',    // Slight snow showers
    86: '❄️',     // Heavy snow showers
    95: '⛈️',     // Thunderstorm
    96: '⛈️',     // Thunderstorm with slight hail
    99: '⛈️'      // Thunderstorm with heavy hail
} as const;
