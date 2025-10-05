import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

type OnboardingHeaderProps = {
  currentStep: number;
  totalSteps: number;
  showBack?: boolean;
};

export default function OnboardingHeader({ 
  currentStep, 
  totalSteps, 
  showBack = true 
}: OnboardingHeaderProps) {
  const router = useRouter();

  return (
    <View className="pt-12 pb-6 px-6">
      {/* Back Button */}
      {showBack && (
        <Pressable 
          onPress={() => router.back()}
          className="mb-4 active:opacity-60"
        >
          <Text className="text-white text-2xl">←</Text>
        </Pressable>
      )}

      {/* Progress Bar */}
      <View className="flex-row gap-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <View
            key={index}
            className={`flex-1 h-1 rounded-full ${
              index < currentStep ? 'bg-primary-purple' : 'bg-gray-700'
            }`}
          />
        ))}
      </View>
    </View>
  );
}