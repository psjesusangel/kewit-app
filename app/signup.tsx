import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';
import OnboardingHeader from '../components/OnboardingHeader';

type FormErrors = {
  name?: string;
  email?: string;
  password?: string;
};

export default function SignUpScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
  });

  // Validation functions
  const validateName = (name: string): string | undefined => {
    if (!name.trim()) return 'Name is required';
    if (name.trim().length < 2) return 'Name must be at least 2 characters';
    return undefined;
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Invalid email address';
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Must be at least 6 characters';
    return undefined;
  };

  // Handle field changes with validation
  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });
    
    // Validate on change if already touched
    if (touched[field]) {
      let error: string | undefined;
      if (field === 'name') error = validateName(value);
      if (field === 'email') error = validateEmail(value);
      if (field === 'password') error = validatePassword(value);
      
      setErrors({ ...errors, [field]: error });
    }
  };

  // Handle field blur (when user leaves input)
  const handleBlur = (field: keyof typeof formData) => {
    setTouched({ ...touched, [field]: true });
    
    let error: string | undefined;
    if (field === 'name') error = validateName(formData.name);
    if (field === 'email') error = validateEmail(formData.email);
    if (field === 'password') error = validatePassword(formData.password);
    
    setErrors({ ...errors, [field]: error });
  };

  // Get border color based on validation state
  const getBorderColor = (field: keyof typeof formData) => {
    if (!touched[field]) return 'border-gray-700';
    if (errors[field]) return 'border-red-500';
    if (formData[field]) return 'border-green-500';
    return 'border-gray-700';
  };

  const handleSignUp = async () => {
    // Validate all fields
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    setErrors({
      name: nameError,
      email: emailError,
      password: passwordError,
    });

    setTouched({ name: true, email: true, password: true });

    // Stop if any errors
    if (nameError || emailError || passwordError) return;

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
          },
        },
      });

      if (error) throw error;

      router.push('/permissions');
    } catch (error: any) {
      setErrors({ ...errors, email: error.message });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = !errors.name && !errors.email && !errors.password && 
                      formData.name && formData.email && formData.password;

  return (
    <View className="flex-1 bg-background">
      <OnboardingHeader currentStep={2} totalSteps={3} />

      <ScrollView 
        className="flex-1 px-6"
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mb-8">
          <Text className="text-white text-3xl font-bold mb-2">
            Create your account
          </Text>
          <Text className="text-gray-400 text-base">
            Join the local music community
          </Text>
        </View>

        {/* Form */}
        <View className="gap-5 mb-8">
          {/* Name Input */}
          <View>
            <Text className="text-gray-400 text-sm mb-2 ml-1">Name</Text>
            <TextInput
              className={`bg-surface border-2 ${getBorderColor('name')} rounded-xl px-4 py-4 text-white text-base`}
              placeholder="Your name"
              placeholderTextColor="#6b7280"
              value={formData.name}
              onChangeText={(text) => handleChange('name', text)}
              onBlur={() => handleBlur('name')}
              autoCapitalize="words"
              returnKeyType="next"
            />
            {touched.name && errors.name && (
              <Text className="text-red-500 text-xs mt-1 ml-1">{errors.name}</Text>
            )}
          </View>

          {/* Email Input */}
          <View>
            <Text className="text-gray-400 text-sm mb-2 ml-1">Email</Text>
            <TextInput
              className={`bg-surface border-2 ${getBorderColor('email')} rounded-xl px-4 py-4 text-white text-base`}
              placeholder="you@example.com"
              placeholderTextColor="#6b7280"
              value={formData.email}
              onChangeText={(text) => handleChange('email', text)}
              onBlur={() => handleBlur('email')}
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next"
            />
            {touched.email && errors.email && (
              <Text className="text-red-500 text-xs mt-1 ml-1">{errors.email}</Text>
            )}
          </View>

          {/* Password Input */}
          <View>
            <Text className="text-gray-400 text-sm mb-2 ml-1">Password</Text>
            <TextInput
              className={`bg-surface border-2 ${getBorderColor('password')} rounded-xl px-4 py-4 text-white text-base`}
              placeholder="At least 6 characters"
              placeholderTextColor="#6b7280"
              value={formData.password}
              onChangeText={(text) => handleChange('password', text)}
              onBlur={() => handleBlur('password')}
              secureTextEntry
              autoCapitalize="none"
              returnKeyType="done"
              onSubmitEditing={handleSignUp}
            />
            {touched.password && errors.password && (
              <Text className="text-red-500 text-xs mt-1 ml-1">{errors.password}</Text>
            )}
          </View>
        </View>

        {/* Submit Button */}
        <Pressable
          className={`py-4 rounded-xl ${
            !isFormValid || loading ? 'bg-gray-700' : 'bg-primary-purple active:opacity-80'
          }`}
          onPress={handleSignUp}
          disabled={!isFormValid || loading}
        >
          <Text className="text-white text-center text-lg font-semibold">
            {loading ? 'Creating account...' : 'Continue'}
          </Text>
        </Pressable>

        {/* Terms */}
        <Text className="text-gray-500 text-xs text-center mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </ScrollView>
    </View>
  );
}