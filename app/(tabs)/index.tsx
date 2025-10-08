import { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import * as Location from 'expo-location';

export default function DiscoverScreen() {
  const [locationGranted, setLocationGranted] = useState(false);
  const [loading, setLoading] = useState(false);

  const requestLocationPermission = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setLocationGranted(true);
        // Future ticket: fetch nearby events here
      }
    } catch (error) {
      console.error('Location permission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="pt-16 px-6">
        {/* Header */}
        <Text className="text-white text-4xl font-bold mb-2">Discover</Text>
        <Text className="text-gray-400 text-base mb-8">
          Find live music near you
        </Text>

        {/* Empty State */}
        {!locationGranted ? (
          <View className="items-center justify-center py-20">
            <Text className="text-6xl mb-6">📍</Text>
            <Text className="text-white text-2xl font-bold text-center mb-3">
              Find shows near you
            </Text>
            <Text className="text-gray-400 text-center mb-8 px-4">
              Enable location access to discover live performances happening around you
            </Text>
            
            <Pressable
              className={`py-4 px-8 rounded-xl ${
                loading ? 'bg-gray-700' : 'bg-primary-purple active:opacity-80'
              }`}
              onPress={requestLocationPermission}
              disabled={loading}
            >
              <Text className="text-white text-center text-lg font-semibold">
                {loading ? 'Requesting...' : 'Enable Location'}
              </Text>
            </Pressable>
          </View>
        ) : (
          <View className="items-center justify-center py-20">
            <Text className="text-6xl mb-6">🎵</Text>
            <Text className="text-white text-xl font-bold text-center mb-3">
              No shows nearby yet
            </Text>
            <Text className="text-gray-400 text-center px-4">
              Check back soon or explore performers in your area
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}