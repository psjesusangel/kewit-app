import { Tabs } from 'expo-router';
import { View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1a1a1a',
          borderTopColor: '#2a2a2a',
          borderTopWidth: 1,
          height: 85,
          paddingBottom: 25,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#a855f7',
        tabBarInactiveTintColor: '#6b7280',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, size }) => (
            <View>
              <View style={{ width: size, height: size }}>
                {/* I'll add proper icons later */}
                <View style={{ 
                  width: size, 
                  height: size, 
                  backgroundColor: color, 
                  borderRadius: size / 2 
                }} />
              </View>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <View>
              <View style={{ width: size, height: size }}>
                <View style={{ 
                  width: size, 
                  height: size, 
                  backgroundColor: color, 
                  borderRadius: size / 2 
                }} />
              </View>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}