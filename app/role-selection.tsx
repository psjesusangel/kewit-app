import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import OnboardingHeader from '../components/OnboardingHeader';
import { useOnboarding } from '../lib/OnboardingContext';

type Role = 'listener' | 'performer';

export default function RoleSelectionScreen() {
  const router = useRouter();
  const { data, updateData } = useOnboarding();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    updateData('role', role);
    // Auto-advance after brief visual feedback
    setTimeout(() => {
      router.push('/signup-name');
    }, 300);
  };

  return (
    <View className="flex-1 bg-background">
      <OnboardingHeader currentStep={1} totalSteps={4} />

      <View className="flex-1 px-6 pt-16">
        {/* Header */}
        <View className="mb-12">
          <Text className="text-white text-3xl font-bold text-center mb-3">
            How will you use Kewit?
          </Text>
          <Text className="text-gray-400 text-center text-base">
            You can always change this later
          </Text>
        </View>

        {/* Role Options */}
        <View className="gap-4">
          {/* Listener Option */}
          <Pressable
            className={`p-6 rounded-2xl border-2 active:scale-95 flex-row items-center ${
              selectedRole === 'listener'
                ? 'bg-primary-purple/20 border-primary-purple'
                : 'bg-surface border-gray-700'
            }`}
            onPress={() => handleRoleSelect('listener')}
          >
            {/* Left icon / Headphone emoji */}
            <Text className="text-4xl leading-none">🎧</Text>

            {/* Right Text Block */}
            <View className="flex-1 ml-6">
              <Text className="text-white text-2xl mb-1">Listener</Text>
              <Text className="text-gray-400 text-sm">
                Discover live music, request songs, and support artists
              </Text>
            </View>
          </Pressable>

          {/* Performer Option */}
          <Pressable
            className={`p-6 rounded-2xl border-2 active:scale-95 flex-row items-center ${
              selectedRole === 'performer'
                ? 'bg-primary-purple/20 border-primary-purple'
                : 'bg-surface border-gray-700'
            }`}
            onPress={() => handleRoleSelect('performer')}
          >
            {/* Left icon / Mic emoji */}
            <Text className="text-4xl leading-none">🎤</Text>

            <View className="flex-1 ml-6">
              <Text className="text-white text-2xl mb-1">Performer</Text>
              <Text className="text-gray-400 text-sm">
                Share your music, post events, and receive payment
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
}