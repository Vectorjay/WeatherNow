import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WeatherData } from '../utils/types';

interface Props {
  weather: WeatherData;
}

export default function WeatherCard({ weather }: Props) {
  const getWeatherEmoji = (condition: string) => {
    const c = condition.toLowerCase();
    if (c.includes('clear') || c.includes('sunny')) return '☀️';
    if (c.includes('cloud')) return '☁️';
    if (c.includes('rain') || c.includes('drizzle')) return '🌧️';
    if (c.includes('thunder') || c.includes('storm')) return '⛈️';
    if (c.includes('snow')) return '❄️';
    if (c.includes('mist') || c.includes('fog') || c.includes('haze')) return '🌫️';
    if (c.includes('wind')) return '💨';
    return '🌤️';
  };

  return (
    <View style={styles.card}>
      <View style={styles.locationRow}>
        <Text style={styles.cityName}>{weather.city}</Text>
        <Text style={styles.country}>{weather.country}</Text>
      </View>

      <Text style={styles.weatherEmoji}>{getWeatherEmoji(weather.condition)}</Text>
      <Text style={styles.temp}>{Math.round(weather.temp)}°C</Text>
      <Text style={styles.condition}>{weather.condition}</Text>
      <Text style={styles.feelsLike}>Feels like {Math.round(weather.feelsLike)}°C</Text>

      <View style={styles.divider} />

      <View style={styles.detailsGrid}>
        <View style={styles.detailItem}>
          <Text style={styles.detailEmoji}>💧</Text>
          <Text style={styles.detailValue}>{weather.humidity}%</Text>
          <Text style={styles.detailLabel}>Humidity</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailEmoji}>💨</Text>
          <Text style={styles.detailValue}>{weather.windSpeed} m/s</Text>
          <Text style={styles.detailLabel}>Wind</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailEmoji}>👁️</Text>
          <Text style={styles.detailValue}>{(weather.visibility / 1000).toFixed(1)} km</Text>
          <Text style={styles.detailLabel}>Visibility</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailEmoji}>🌡️</Text>
          <Text style={styles.detailValue}>{weather.pressure} hPa</Text>
          <Text style={styles.detailLabel}>Pressure</Text>
        </View>
      </View>

      <View style={styles.sunRow}>
        <Text style={styles.sunText}>🌅 {weather.sunrise}</Text>
        <Text style={styles.sunText}>🌇 {weather.sunset}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 24,
    marginHorizontal: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginBottom: 8,
  },
  cityName: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '800',
  },
  country: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 16,
    fontWeight: '600',
  },
  weatherEmoji: {
    fontSize: 80,
    marginVertical: 8,
  },
  temp: {
    color: '#ffffff',
    fontSize: 64,
    fontWeight: '200',
    letterSpacing: -2,
  },
  condition: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 18,
    fontWeight: '600',
    textTransform: 'capitalize',
    marginTop: 4,
  },
  feelsLike: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 14,
    marginTop: 4,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginVertical: 20,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  detailItem: {
    alignItems: 'center',
    gap: 4,
  },
  detailEmoji: {
    fontSize: 22,
  },
  detailValue: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  detailLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
  },
  sunRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
    paddingHorizontal: 8,
  },
  sunText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    fontWeight: '600',
  },
});
