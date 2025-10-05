import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background px-6 justify-center">
      {/* Logo/Branding */}
      <View className="items-center mb-12">
        <Text className="text-white text-4xl font-bold">🥝 Kewit</Text>
        <Text className="text-gray-400 text-center mt-4 text-lg">
          Discover, support, and request{"\n"} from local musicians
        </Text>
      </View>

      {/* Action Buttons */}
      <View className="gap-4 w-full max-w-xs self-center">
        {/* Primary CTA - Sign Up */}
        <Pressable 
          className="bg-primary-purple py-4 rounded-xl active:opacity-80"
          onPress={() => router.push('/role-selection')}
        >
          <Text className="text-white text-center text-lg font-semibold">
            Get Started
          </Text>
        </Pressable>

        {/* Secondary - Guest Mode */}
        <Pressable 
          className="border-2 border-gray-700 py-4 rounded-xl active:opacity-60"
          onPress={() => router.push('/(tabs)')}
        >
          <Text className="text-white text-center text-lg">
            Continue as Guest
          </Text>
        </Pressable>

        {/* Tertiary - Log In */}
        <Pressable onPress={() => router.push('/login')}>
          <Text className="text-gray-400 text-center mt-2">
            Already have an account? <Text className="text-primary-blue">Log in</Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
}