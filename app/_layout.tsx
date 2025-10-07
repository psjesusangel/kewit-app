import { Stack } from 'expo-router';
import { OnboardingProvider } from '../lib/OnboardingContext';

export default function RootLayout() {
  return (
    <OnboardingProvider>
      <Stack 
        screenOptions={{ 
          headerShown: false, 
          animation: 'slide_from_right'
        }} 
      />
    </OnboardingProvider>
  );
}