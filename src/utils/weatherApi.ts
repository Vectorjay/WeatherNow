import { WeatherData, ForecastData } from './types';

// Replace with your OpenWeatherMap API key
// Get a free key at: https://openweathermap.org/api
const API_KEY = process.env.OPENWEATHER_API_KEY || 'YOUR_API_KEY_HERE';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

function formatTime(timestamp: number, timezoneOffset: number): string {
  const date = new Date((timestamp + timezoneOffset) * 1000);
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

function getDayName(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

export async function fetchWeather(city: string): Promise<WeatherData> {
  const response = await fetch(
    `${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`City "${city}" not found. Please check the spelling.`);
    }
    if (response.status === 401) {
      throw new Error('Invalid API key. Please check your OpenWeatherMap API key.');
    }
    throw new Error('Failed to fetch weather data. Please try again.');
  }

  const data = await response.json();

  return {
    city: data.name,
    country: data.sys.country,
    temp: data.main.temp,
    feelsLike: data.main.feels_like,
    condition: data.weather[0].description,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    visibility: data.visibility,
    pressure: data.main.pressure,
    sunrise: formatTime(data.sys.sunrise, data.timezone),
    sunset: formatTime(data.sys.sunset, data.timezone),
  };
}

export async function fetchForecast(city: string): Promise<ForecastData[]> {
  const response = await fetch(
    `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
  );

  if (!response.ok) {
    return []; // gracefully return empty on forecast failure
  }

  const data = await response.json();

  // Group by day and get daily min/max
  const dailyMap: Record<string, { maxTemp: number; minTemp: number; conditions: string[] }> = {};

  data.list.forEach((item: any) => {
    const date = item.dt_txt.split(' ')[0];
    const today = new Date().toISOString().split('T')[0];
    if (date === today) return; // skip today

    if (!dailyMap[date]) {
      dailyMap[date] = {
        maxTemp: item.main.temp_max,
        minTemp: item.main.temp_min,
        conditions: [],
      };
    }
    dailyMap[date].maxTemp = Math.max(dailyMap[date].maxTemp, item.main.temp_max);
    dailyMap[date].minTemp = Math.min(dailyMap[date].minTemp, item.main.temp_min);
    dailyMap[date].conditions.push(item.weather[0].description);
  });

  return Object.entries(dailyMap)
    .slice(0, 5)
    .map(([date, values]) => ({
      day: getDayName(date),
      maxTemp: values.maxTemp,
      minTemp: values.minTemp,
      condition: values.conditions[Math.floor(values.conditions.length / 2)],
    }));
}
