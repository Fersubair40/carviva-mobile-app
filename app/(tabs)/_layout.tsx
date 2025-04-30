import React from 'react';
import { Redirect, SplashScreen, Tabs } from 'expo-router';
import { Platform, StyleSheet } from 'react-native';
import { Fuel as GasPump, History, Settings, Home } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';

export default function TabLayout() {
  const { isLoading } = useAuth();

  if (isLoading) {
    SplashScreen.preventAutoHideAsync();
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#1E40AF',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,

        // headerShown: true,
        // headerStyle: styles.header,
        // headerTitleStyle: styles.headerTitle,
        // headerLargeTitle: true,
        // headerLargeTitleStyle: styles.headerLargeTitle,
        // headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: 'Home',
          // tabBarLabel: 'Home',
          // headerTitle: 'Fuel Station',
          // headerTitleAlign: 'left',
          // headerLargeTitle: true,
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          headerShown: false,
          // title: 'History',
          tabBarLabel: 'History',
          // headerTitle: 'Transaction History',
          tabBarIcon: ({ color, size }) => (
            <History size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          // title: 'Settings',
          tabBarLabel: 'Settings',
          // headerTitle: 'Account Settings',
          tabBarIcon: ({ color, size }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    height: Platform.OS === 'ios' ? 88 : 64,
    paddingBottom: Platform.OS === 'ios' ? 28 : 8,
    paddingTop: 8,
  },
  tabBarLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  header: {
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  headerLargeTitle: {
    fontSize: 34,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
});
