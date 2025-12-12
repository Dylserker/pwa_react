/**
 * Types et interfaces pour l'application météo
 */

export interface WeatherCode {
    [key: number]: string;
}

export interface Location {
    name: string;
    admin1?: string;
    country: string;
    latitude: number;
    longitude: number;
}

export interface GeocodingResponse {
    results: Location[];
}

export interface CurrentWeather {
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    weather_code: number;
    wind_speed_10m: number;
}

export interface HourlyData {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
    precipitation_probability: number[];
}

export interface WeatherData {
    current: CurrentWeather;
    hourly: HourlyData;
}

export interface CurrentCity {
    name: string;
    lat: number;
    lon: number;
}

export interface HourlyItem {
    time: Date;
    temp: number;
    code: number;
    isRain: boolean;
    isHighTemp: boolean;
}

export type NotificationType = 'rain' | 'temp' | 'info';
