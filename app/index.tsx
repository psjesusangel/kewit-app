import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // Simulate splash delay, then navigate to welcome
    const timer = setTimeout(() => {
      router.replace('/welcome');
    }, 2000); // 2 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 bg-background items-center justify-center">
      <Text className="text-white text-2xl">🥝 Kewit</Text>
    </View>
  );
}