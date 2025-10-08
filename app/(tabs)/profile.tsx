import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function ProfileScreen() {
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace('/welcome');
  };

  return (
    <View className="flex-1 bg-background pt-16 px-6">
      <Text className="text-white text-4xl font-bold mb-8">Profile</Text>
      
      <View className="items-center justify-center flex-1">
        <Text className="text-gray-400 text-center mb-8">
          Profile features coming soon
        </Text>
        
        <Pressable
          className="bg-red-500/20 border-2 border-red-500 py-3 px-6 rounded-xl active:opacity-80"
          onPress={handleSignOut}
        >
          <Text className="text-red-500 font-semibold">Sign Out</Text>
        </Pressable>
      </View>
    </View>
  );
}