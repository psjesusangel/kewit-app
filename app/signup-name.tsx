import { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import OnboardingHeader from '../components/OnboardingHeader';
import OnboardingLayout from '../components/OnboardingLayout';
import { useOnboarding } from '../lib/OnboardingContext';

export default function SignUpNameScreen() {
  const router = useRouter();
  const { data, updateData } = useOnboarding();
  const [name, setName] = useState(data.name);
  const [error, setError] = useState('');
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
  requestAnimationFrame(() => {
    inputRef.current?.focus();
    });
  }, []);

  const validateName = (value: string): boolean => {
    if (!value.trim()) return setError('Name is required'), false;
    if (value.trim().length < 2) return setError('Name must be at least 2 characters'), false;
    setError('');
    return true;
  };

  const handleContinue = () => {
    if (validateName(name)) {
      updateData('name', name.trim());
      router.push('/signup-email');
    }
  };

  const isValid = name.trim().length >= 2;

  return (
    <OnboardingLayout>
      <OnboardingHeader currentStep={2} totalSteps={4} />
      <View className="flex-1 px-6 pt-8">
        <Text className="text-white text-3xl font-bold mb-3">What's your name?</Text>
        <Text className="text-gray-400 text-base mb-8">
          This is how you'll appear to others
        </Text>

        <TextInput
          ref={inputRef}
          className={`bg-surface border-2 ${
            error ? 'border-red-500' : isValid ? 'border-green-500' : 'border-gray-700'
          } rounded-xl px-4 py-4 text-white text-lg`}
          style={{ lineHeight: 22 }} 
          placeholder="Your name"
          placeholderTextColor="#6b7280"
          value={name}
          onChangeText={(text) => {
            setName(text);
            if (error) validateName(text);
          }}
          autoCapitalize="words"
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
