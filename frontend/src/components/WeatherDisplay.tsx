/**
 * Composant d'affichage des données météo actuelles
 */

import React from 'react';
import { WEATHER_EMOJIS } from '../config/weatherConfig';
import type { WeatherData } from '../types/weather';

interface WeatherDisplayProps {
    cityName: string;
    data: WeatherData;
}

export const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ cityName, data }) => {
    const current = data.current;

    const getWeatherEmoji = (code: number): string => {
        return WEATHER_EMOJIS[code as keyof typeof WEATHER_EMOJIS] || '🌤️';
    };

    return (
        <div className="weather-section">
            <h2 className="city-name">{cityName}</h2>
            
            <div className="weather-current">
                <div className="weather-icon">
                    {getWeatherEmoji(current.weather_code)}
                </div>
                <div className="weather-info">
                    <div className="temperature">
                        {Math.round(current.temperature_2m)}°C
                    </div>
                    <div className="feels-like">
                        Ressenti: {Math.round(current.apparent_temperature)}°C
                    </div>
                </div>
            </div>

            <div className="weather-details">
                <div className="detail-item">
                    <span className="label">Vent</span>
                    <span className="value">{Math.round(current.wind_speed_10m)} km/h</span>
                </div>
                <div className="detail-item">
                    <span className="label">Humidité</span>
                    <span className="value">{current.relative_humidity_2m}%</span>
                </div>
            </div>
        </div>
    );
};
