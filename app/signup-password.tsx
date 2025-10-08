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
  const [touched, setTouched] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }, []);

  const isValid = password.length >= 6;

  const getBorderColor = () => {
    if (!touched && !password) return 'border-gray-700';
    if (isValid) return 'border-green-500';
    return 'border-red-500';
  };

  const getErrorMessage = () => {
    if (!touched || !password) return null;
    if (password.length < 6) return 'Must be at least 6 characters';
    return null;
  };

  const handleSignUp = async () => {
    if (!isValid) return;
    
    setLoading(true);
    setError('');
    updateData('password', password);

    try {
      // Step 1: Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password,
        options: {
          data: { 
            full_name: data.name,
            role: data.role 
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('No user returned from signup');

      // Step 2: Wait for session to be established
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!sessionData.session) {
        throw new Error('No session established. Please try logging in.');
      }

      // Step 3: Create profile (now that session is confirmed)
      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        full_name: data.name,
        handle: data.handle,
        display_name: data.name, // Defaults to full_name
        role: data.role,
        // Performer fields are NULL for now
        artist_name: null,
        genre_tags: null,
        location_tags: null,
        // Set profile_completed based on role
        profile_completed: data.role === 'listener' ? true : false,
      });

      if (profileError) throw profileError;

      // Step 4: Route based on role
      if (data.role === 'performer') {
        // Performers go to profile completion
        router.replace('/complete-profile');
      } else {
        // Listeners go straight to app
        router.replace('/(tabs)');
      }
    } catch (e: any) {
      console.error('Signup error:', e);
      setError(e.message || 'Failed to create account');
      setLoading(false);
    }
  };

  return (
    <OnboardingLayout>
      <OnboardingHeader currentStep={5} totalSteps={5} />
      <View className="flex-1 px-6 pt-8">
        <Text className="text-white text-3xl font-bold mb-3">Create a password</Text>
        <Text className="text-gray-400 text-base mb-8">
          Must be at least 6 characters
        </Text>

        <TextInput
          ref={inputRef}
          className={`bg-surface border-2 ${getBorderColor()} rounded-xl px-4 py-4 text-white text-lg`}
          style={{ lineHeight: 22 }}
          placeholder="Enter password"
          placeholderTextColor="#6b7280"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (!touched) setTouched(true);
            if (error) setError('');
          }}
          secureTextEntry
          returnKeyType="done"
          onSubmitEditing={handleSignUp}
        />

        {/* Error or Success Message */}
        {error ? (
          <Text className="text-red-500 text-sm mt-2 ml-1">{error}</Text>
        ) : getErrorMessage() ? (
          <Text className="text-red-500 text-sm mt-2 ml-1">{getErrorMessage()}</Text>
        ) : isValid && touched ? (
          <Text className="text-green-500 text-sm mt-2 ml-1">✓ Strong password</Text>
        ) : null}

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