import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ForecastData } from '../utils/types';

interface Props {
  data: ForecastData;
}

export default function ForecastCard({ data }: Props) {
  const getWeatherEmoji = (condition: string) => {
    const c = condition.toLowerCase();
    if (c.includes('clear') || c.includes('sunny')) return '☀️';
    if (c.includes('cloud')) return '☁️';
    if (c.includes('rain') || c.includes('drizzle')) return '🌧️';
    if (c.includes('thunder') || c.includes('storm')) return '⛈️';
    if (c.includes('snow')) return '❄️';
    if (c.includes('mist') || c.includes('fog') || c.includes('haze')) return '🌫️';
    return '🌤️';
  };

  return (
    <View style={styles.card}>
      <Text style={styles.day}>{data.day}</Text>
      <Text style={styles.emoji}>{getWeatherEmoji(data.condition)}</Text>
      <Text style={styles.maxTemp}>{Math.round(data.maxTemp)}°</Text>
      <Text style={styles.minTemp}>{Math.round(data.minTemp)}°</Text>
      <Text style={styles.condition} numberOfLines={2}>{data.condition}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 14,
    marginRight: 10,
    alignItems: 'center',
    width: 90,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  day: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emoji: {
    fontSize: 30,
    marginVertical: 8,
  },
  maxTemp: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  minTemp: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  condition: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
});
