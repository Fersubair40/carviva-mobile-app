import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
// import { SplashScreen } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { PortalProvider } from '@gorhom/portal';
import Toast, { BaseToastProps } from 'react-native-toast-message';
import * as SplashScreen from 'expo-splash-screen';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Text, View, StyleSheet } from 'react-native';

interface CustomToastProps extends BaseToastProps {
  text1?: string;
  text2?: string;
}

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 5 minutes
    },
  },
});

// Prevent the splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function RootLayout() {
  const { isLoading } = useAuth();
  const toastConfig = {
    error: ({ text1, text2 }: CustomToastProps) => (
      <View style={styles.errorContainer}>
        {text1 ? <Text style={styles.errorText}>{text1}</Text> : null}
      </View>
    ),
    success: ({ text1, text2 }: CustomToastProps) => (
      <View style={styles.successContainer}>
        {text1 ? <Text style={styles.successText}>{text1}</Text> : null}
      </View>
    ),
    delete: ({ text1, text2 }: CustomToastProps) => (
      <View style={styles.errorContainer}>
        {text1 ? <Text style={styles.errorText}>{text1}</Text> : null}
      </View>
    ),
  };

  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  // Use useEffect to hide the splash screen once fonts are loaded
  useEffect(() => {
    if ((fontsLoaded || fontError) && !isLoading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Return null to keep splash screen visible while fonts load
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView>
        <PortalProvider>
          <BottomSheetModalProvider>
            <AuthProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen
                  name="login"
                  options={{ gestureEnabled: false }}
                />
                <Stack.Screen
                  name="(tabs)"
                  options={{ gestureEnabled: false }}
                />
                <Stack.Screen name="+not-found" />
              </Stack>
              <Toast config={toastConfig} />
              <StatusBar style="dark" />
            </AuthProvider>
          </BottomSheetModalProvider>
        </PortalProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '90%',
    height: 52,
    borderWidth: 1,
    borderColor: '#D92D20',
    backgroundColor: '#FEF3F2',
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    color: '#D92D20',
    fontSize: 12,
    fontWeight: '600',
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '90%',
    height: 52,
    borderWidth: 1,
    borderColor: '#ABEFC6',
    backgroundColor: '#ECFDF3',
    padding: 12,
    borderRadius: 8,
  },
  successText: {
    color: '#067647',
    fontSize: 12,
    fontWeight: '600',
  },
  secondaryText: {
    color: 'white',
  },
});
