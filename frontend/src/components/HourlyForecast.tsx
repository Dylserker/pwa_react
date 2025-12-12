/**
 * Composant pour afficher les prévisions horaires
 */

import React from 'react';
import { WEATHER_EMOJIS, WEATHER_CONFIG } from '../config/weatherConfig';
import type { WeatherData, HourlyItem } from '../types/weather';

interface HourlyForecastProps {
    data: WeatherData;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ data }) => {
    const getWeatherEmoji = (code: number): string => {
        return WEATHER_EMOJIS[code as keyof typeof WEATHER_EMOJIS] || '🌤️';
    };

    const getHourlyItems = (): HourlyItem[] => {
        const currentHour = new Date().getHours();
        const items: HourlyItem[] = [];

        for (let i = 0; i < 4; i++) {
            const hourIndex = currentHour + i + 1;
            if (hourIndex < data.hourly.time.length) {
                const time = new Date(data.hourly.time[hourIndex]);
                const temp = data.hourly.temperature_2m[hourIndex];
                const code = data.hourly.weather_code[hourIndex];
                const isRain = WEATHER_CONFIG.RAIN_CODES.includes(code as any);
                const isHighTemp = temp > WEATHER_CONFIG.TEMP_THRESHOLD;

                items.push({
                    time,
                    temp,
                    code,
                    isRain,
                    isHighTemp
                });
            }
        }

        return items;
    };

    const hourlyItems = getHourlyItems();

    return (
        <div className="hourly-forecast">
            <h3>Prévisions (4 prochaines heures)</h3>
            <div className="hourly-list">
                {hourlyItems.map((item) => (
                    <div
                        key={`${item.time.getHours()}-${item.code}`}
                        className={`hourly-item ${item.isRain ? 'rain-alert' : ''} ${
                            item.isHighTemp ? 'temp-alert' : ''
                        }`}
                    >
                        <div className="hourly-time">{item.time.getHours()}h</div>
                        <div className="hourly-icon">
                            {getWeatherEmoji(item.code)}
                        </div>
                        <div className="hourly-temp">{Math.round(item.temp)}°C</div>
                    </div>
                ))}
            </div>
        </div>
    );
};
