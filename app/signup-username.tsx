import { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import OnboardingHeader from '../components/OnboardingHeader';
import OnboardingLayout from '../components/OnboardingLayout';
import { useOnboarding } from '../lib/OnboardingContext';
import { supabase } from '../lib/supabase';

export default function SignUpUsernameScreen() {
  const router = useRouter();
  const { data, updateData } = useOnboarding();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const checkTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }, []);

  // Debounced availability check
  useEffect(() => {
    // Clear previous timeout
    if (checkTimeoutRef.current) {
      clearTimeout(checkTimeoutRef.current);
    }

    // Reset states
    setIsAvailable(false);
    setError('');

    // Validate format first
    if (!username) return;

    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    if (!/^[a-z0-9_]+$/.test(username)) {
      setError('Only lowercase letters, numbers, and underscores');
      return;
    }

    // Check availability after 300ms of no typing
    setIsChecking(true);
    checkTimeoutRef.current = setTimeout(async () => {
      try {
        const { data: existingProfile, error: checkError } = await supabase
          .from('profiles')
          .select('handle')
          .eq('handle', username)
          .maybeSingle();

        if (checkError) throw checkError;

        if (existingProfile) {
          setError('Username is already taken');
          setIsAvailable(false);
        } else {
          setIsAvailable(true);
        }
      } catch (e) {
        console.error('Username check error:', e);
        setError('Could not check availability');
      } finally {
        setIsChecking(false);
      }
    }, 300);

    return () => {
      if (checkTimeoutRef.current) {
        clearTimeout(checkTimeoutRef.current);
      }
    };
  }, [username]);

  const handleContinue = () => {
    if (isAvailable && !isChecking) {
      updateData('handle', username);
      router.push('/signup-email');
    }
  };

  const getBorderColor = () => {
    if (error) return 'border-red-500';
    if (isChecking) return 'border-yellow-500';
    if (isAvailable) return 'border-green-500';
    return 'border-gray-700';
  };

  return (
    <OnboardingLayout>
      <OnboardingHeader currentStep={3} totalSteps={5} />
      <View className="flex-1 px-6 pt-8">
        <Text className="text-white text-3xl font-bold mb-3">Pick a username</Text>
        <Text className="text-gray-400 text-base mb-8">
          This is how others will find you
        </Text>

        {/* Username Input */}
        <View className={`bg-surface border-2 ${getBorderColor()} rounded-xl px-4 py-4 flex-row items-center`}>
          <Text className="text-gray-400 text-lg mr-1">@</Text>
          <TextInput
            ref={inputRef}
            className="flex-1 text-white text-lg"
            style={{ lineHeight: 22 }}
            placeholder="username"
            placeholderTextColor="#6b7280"
            value={username}
            onChangeText={(text) => setUsername(text.toLowerCase())}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            onSubmitEditing={handleContinue}
          />
          {isChecking && (
            <ActivityIndicator size="small" color="#9333ea" />
          )}
        </View>

        {/* Error or Success Message */}
        {error ? (
          <Text className="text-red-500 text-sm mt-2 ml-1">{error}</Text>
        ) : isAvailable ? (
          <Text className="text-green-500 text-sm mt-2 ml-1">✓ Username is available</Text>
        ) : null}

        {/* Helper Text (temp) */}
        <Text className="text-gray-500 text-xs mt-4 ml-1">
          3+ characters, lowercase letters, numbers, and underscores only
        </Text>

        {/* Continue Button */}
        <Pressable
          className={`py-4 rounded-xl mt-8 ${
            isAvailable && !isChecking ? 'bg-primary-purple active:opacity-80' : 'bg-gray-700'
          }`}
          onPress={handleContinue}
          disabled={!isAvailable || isChecking}
        >
          <Text className="text-white text-center text-lg font-semibold">Continue</Text>
        </Pressable>
      </View>
    </OnboardingLayout>
  );
}