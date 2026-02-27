import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  RefreshControl,
  ImageBackground,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { fetchWeather, fetchForecast } from '../utils/weatherApi';
import WeatherCard from '../components/WeatherCard';
import ForecastCard from '../components/ForecastCard';
import { WeatherData, ForecastData } from '../utils/types';

export default function HomeScreen() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastCity, setLastCity] = useState('');

  const handleSearch = useCallback(async (searchCity?: string) => {
    const target = searchCity || city;
    if (!target.trim()) {
      Alert.alert('Please enter a city name');
      return;
    }
    setLoading(true);
    try {
      const [weatherData, forecastData] = await Promise.all([
        fetchWeather(target),
        fetchForecast(target),
      ]);
      setWeather(weatherData);
      setForecast(forecastData);
      setLastCity(target);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Could not fetch weather. Check city name.');
    } finally {
      setLoading(false);
    }
  }, [city]);

  const handleRefresh = useCallback(async () => {
    if (!lastCity) return;
    setRefreshing(true);
    try {
      const [weatherData, forecastData] = await Promise.all([
        fetchWeather(lastCity),
        fetchForecast(lastCity),
      ]);
      setWeather(weatherData);
      setForecast(forecastData);
    } catch (error) {
      // silent fail on refresh
    } finally {
      setRefreshing(false);
    }
  }, [lastCity]);

  const getGradientColors = () => {
    if (!weather) return { top: '#1a1a2e', bottom: '#16213e' };
    const temp = weather.temp;
    if (temp <= 0) return { top: '#0f2027', bottom: '#2c5364' };
    if (temp <= 15) return { top: '#1c3a5e', bottom: '#2d6a8f' };
    if (temp <= 25) return { top: '#1a1a2e', bottom: '#16213e' };
    if (temp <= 35) return { top: '#4a1942', bottom: '#c31432' };
    return { top: '#8b0000', bottom: '#ff4500' };
  };

  const colors = getGradientColors();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.top }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#fff"
            />
          }
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.appTitle}>🌤 WeatherNow</Text>
            <Text style={styles.appSubtitle}>Real-time weather worldwide</Text>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search city..."
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={city}
              onChangeText={setCity}
              onSubmitEditing={() => handleSearch()}
              returnKeyType="search"
              autoCapitalize="words"
            />
            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => handleSearch()}
              activeOpacity={0.8}
            >
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
          </View>

          {/* Loading */}
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#ffffff" />
              <Text style={styles.loadingText}>Fetching weather...</Text>
            </View>
          )}

          {/* Weather Display */}
          {!loading && weather && (
            <>
              <WeatherCard weather={weather} />

              {forecast.length > 0 && (
                <View style={styles.forecastSection}>
                  <Text style={styles.forecastTitle}>5-Day Forecast</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {forecast.map((item, index) => (
                      <ForecastCard key={index} data={item} />
                    ))}
                  </ScrollView>
                </View>
              )}
            </>
          )}

          {/* Empty State */}
          {!loading && !weather && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🌍</Text>
              <Text style={styles.emptyTitle}>Search for a city</Text>
              <Text style={styles.emptySubtitle}>
                Enter any city name above to get{'\n'}current weather and forecasts
              </Text>
              <View style={styles.exampleCities}>
                {['Lagos', 'London', 'New York', 'Tokyo'].map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={styles.exampleChip}
                    onPress={() => {
                      setCity(c);
                      handleSearch(c);
                    }}
                  >
                    <Text style={styles.exampleChipText}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 16,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  appSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 20,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#ffffff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  searchButton: {
    backgroundColor: '#4f8ef7',
    borderRadius: 14,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 16,
  },
  loadingText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
  },
  forecastSection: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  forecastTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 32,
  },
  emptyEmoji: {
    fontSize: 72,
    marginBottom: 16,
  },
  emptyTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySubtitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  exampleCities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginTop: 24,
  },
  exampleChip: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  exampleChipText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
