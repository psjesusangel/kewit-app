import { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import OnboardingHeader from '../components/OnboardingHeader';
import OnboardingLayout from '../components/OnboardingLayout';
import { useOnboarding } from '../lib/OnboardingContext';
import { supabase } from '../lib/supabase';

export default function SignUpPasswordScreen() {
  const router = useRouter();
  const { data, updateData } = useOnboarding();
  const [password, setPassword] = useState(data.password);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    requestAnimationFrame(() => {
        inputRef.current?.focus();
    });
  }, []);

  const validatePassword = (value: string): boolean => {
    if (!value) return setError('Password is required'), false;
    if (value.length < 6) return setError('Must be at least 6 characters'), false;
    setError('');
    return true;
  };

  const handleSignUp = async () => {
    if (!validatePassword(password)) return;
    setLoading(true);
    updateData('password', password);
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password,
        options: {
          data: { full_name: data.name, role: data.role },
        },
      });
      if (error) throw error;
      router.push('/permissions');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const isValid = password.length >= 6;

  return (
    <OnboardingLayout>
      <OnboardingHeader currentStep={4} totalSteps={4} />
      <View className="flex-1 px-6 pt-8">
        <Text className="text-white text-3xl font-bold mb-3">Create a password</Text>
        <Text className="text-gray-400 text-base mb-8">
          Must be at least 6 characters
        </Text>

        <TextInput
          ref={inputRef}
          className={`bg-surface border-2 ${
            error ? 'border-red-500' : isValid ? 'border-green-500' : 'border-gray-700'
          } rounded-xl px-4 py-4 text-white text-lg`}
          style={{ lineHeight: 22 }} 
          placeholder="Enter password"
          placeholderTextColor="#6b7280"
          value={password}
          onChangeText={(t) => {
            setPassword(t);
            if (error) validatePassword(t);
          }}
          secureTextEntry
          returnKeyType="done"
          onSubmitEditing={handleSignUp}
        />
        {error ? <Text className="text-red-500 text-sm mt-2 ml-1">{error}</Text> : null}

        <Text className="text-gray-500 text-xs mt-6 text-center">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>

        <Pressable
          className={`py-4 rounded-xl mt-8 ${
            !isValid || loading ? 'bg-gray-700' : 'bg-primary-purple active:opacity-80'
          }`}
          onPress={handleSignUp}
          disabled={!isValid || loading}
        >
          <Text className="text-white text-center text-lg font-semibold">
            {loading ? 'Creating account...' : 'Create account'}
          </Text>
        </Pressable>
      </View>
    </OnboardingLayout>
  );
}
