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
  const [error, setError] = useState('');
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    requestAnimationFrame(() => {
        inputRef.current?.focus();
    });
    }, []);

  const validateEmail = (value: string): boolean => {
    if (!value.trim()) return setError('Email is required'), false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return setError('Please enter a valid email'), false;
    setError('');
    return true;
  };

  const handleContinue = () => {
    if (validateEmail(email)) {
      updateData('email', email.trim().toLowerCase());
      router.push('/signup-password');
    }
  };

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <OnboardingLayout>
      <OnboardingHeader currentStep={3} totalSteps={4} />
      <View className="flex-1 px-6 pt-8">
        <Text className="text-white text-3xl font-bold mb-3">What's your email?</Text>
        <Text className="text-gray-400 text-base mb-8">
          We'll use this for login and updates
        </Text>

        <TextInput
          ref={inputRef}
          className={`bg-surface border-2 ${
            error ? 'border-red-500' : isValid ? 'border-green-500' : 'border-gray-700'
          } rounded-xl px-4 py-4 text-white text-lg`}
          style={{ lineHeight: 22 }} 
          placeholder="you@example.com"
          placeholderTextColor="#6b7280"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (error) validateEmail(text);
          }}
          autoCapitalize="none"
          keyboardType="email-address"
          returnKeyType="next"
          onSubmitEditing={handleContinue}
        />
        {error ? <Text className="text-red-500 text-sm mt-2 ml-1">{error}</Text> : null}

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
