import { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import OnboardingHeader from '../components/OnboardingHeader';
import OnboardingLayout from '../components/OnboardingLayout';
import { useOnboarding } from '../lib/OnboardingContext';

export default function SignUpEmailScreen() {
  const router = useRouter();
  const { data, updateData } = useOnboarding();
  const [email, setEmail] = useState(data.email);
  const [touched, setTouched] = useState(false); // Track if user has started typing
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }, []);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(email);

  const handleContinue = () => {
    if (isValid) {
      updateData('email', email.trim().toLowerCase());
      router.push('/signup-password');
    }
  };

  const getBorderColor = () => {
    if (!touched && !email) return 'border-gray-700'; // Initial state
    if (isValid) return 'border-green-500'; // Valid email
    return 'border-red-500'; // Invalid email
  };

  const getErrorMessage = () => {
    if (!touched || !email) return null;
    if (!isValid) return 'Please enter a valid email';
    return null;
  };

  return (
    <OnboardingLayout>
      <OnboardingHeader currentStep={4} totalSteps={5} />
      <View className="flex-1 px-6 pt-8">
        <Text className="text-white text-3xl font-bold mb-3">What's your email?</Text>
        <Text className="text-gray-400 text-base mb-8">
          We'll use this for login and updates
        </Text>

        <TextInput
          ref={inputRef}
          className={`bg-surface border-2 ${getBorderColor()} rounded-xl px-4 py-4 text-white text-lg`}
          style={{ lineHeight: 22 }}
          placeholder="you@example.com"
          placeholderTextColor="#6b7280"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (!touched) setTouched(true); // Mark as touched on first change
          }}
          autoCapitalize="none"
          keyboardType="email-address"
          returnKeyType="next"
          onSubmitEditing={handleContinue}
        />
        
        {/* Error Message */}
        {getErrorMessage() && (
          <Text className="text-red-500 text-sm mt-2 ml-1">{getErrorMessage()}</Text>
        )}

        {/* Success Indicator */}
        {isValid && touched && (
          <Text className="text-green-500 text-sm mt-2 ml-1">✓ Valid email</Text>
        )}

        <Pressable
          className={`py-4 rounded-xl mt-8 ${
            isValid ? 'bg-primary-purple active:opacity-80' : 'bg-gray-700'
          }`}
          onPress={handleContinue}
          disabled={!isValid}
        >
          <Text className="text-white text-center text-lg font-semibold">Continue</Text>
        </Pressable>
      </View>
    </OnboardingLayout>
  );
}