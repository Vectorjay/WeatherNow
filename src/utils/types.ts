export interface WeatherData {
  city: string;
  country: string;
  temp: number;
  feelsLike: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  pressure: number;
  sunrise: string;
  sunset: string;
}

export interface ForecastData {
  day: string;
  maxTemp: number;
  minTemp: number;
  condition: string;
}
