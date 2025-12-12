/**
 * Composant d'affichage des données météo actuelles
 */

import React from 'react';
import { WEATHER_EMOJIS } from '../config/weatherConfig';
import type { WeatherData } from '../types/weather';

interface WeatherDisplayProps {
    cityName: string;
    data: WeatherData;
    isFavorite?: boolean;
    onToggleFavorite?: (city: string) => void;
}

export const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ cityName, data, isFavorite, onToggleFavorite }) => {
    const current = data.current;

    const getWeatherEmoji = (code: number): string => {
        return WEATHER_EMOJIS[code as keyof typeof WEATHER_EMOJIS] || '🌤️';
    };

    return (
        <div className="weather-section">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 className="city-name">{cityName}</h2>
                {onToggleFavorite && (
                  <button
                    aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                    onClick={() => onToggleFavorite(cityName)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '2rem',
                      cursor: 'pointer',
                      color: isFavorite ? '#FFD700' : '#bbb',
                      marginLeft: '1rem',
                    }}
                    title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                  >
                    {isFavorite ? '★' : '☆'}
                  </button>
                )}
            </div>
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
