import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Image,
  Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Phone, Lock } from 'lucide-react-native';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useLogin } from '@/api/mutations/auth';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

export default function LoginScreen() {
  // const { isLoading, error, isAuthenticated } = useAuth();

  const { mutate, isPending: isLoading, error } = useLogin();
  const logoAnimation = new Animated.Value(0);

  useEffect(() => {
    // Animated entrance for logo
    Animated.timing(logoAnimation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  // const handleLogin = async () => {
  //   // Reset errors
  //   setPhoneError('');
  //   setPasswordError('');

  //   // Basic validation
  //   let isValid = true;

  //   if (!phone) {
  //     setPhoneError('Phone number is required');
  //     isValid = false;
  //   } else if (!/^\d{10}$/.test(phone)) {
  //     setPhoneError('Please enter a valid 10-digit phone number');
  //     isValid = false;
  //   }

  //   if (!password) {
  //     setPasswordError('Password is required');
  //     isValid = false;
  //   }

  //   if (isValid) {
  //     try {
  //       await login(phone, password);
  //     } catch (error) {
  //       console.error('Login error:', error);
  //     }
  //   }
  // };

  const form = useFormik({
    initialValues: {
      phone_number: '',
      password: '',
    },
    validationSchema: Yup.object({
      phone_number: Yup.string()
        .required('Phone number is required')
        .matches(/^\d{11}$/, 'Please enter a valid 11-digit phone number'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: (values) => {
      mutate(
        {
          ...values,
          phone_number: `234${Number(values.phone_number)}`,
        },
        {
          onSuccess: async (response) => {
            await SecureStore.setItemAsync(
              'token',
              response?.data?.access_token
            );
            router.navigate('/');
          },
        }
      );
      // login(values.phone, values.password);
    },
  });

  const logoScale = logoAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  const logoOpacity = logoAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar style="dark" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoContainer}>
            <Animated.View
              style={[
                styles.logoInner,
                {
                  opacity: logoOpacity,
                  transform: [{ scale: logoScale }],
                },
              ]}
            >
              <Image
                source={{
                  uri: 'https://ik.imagekit.io/lpobtgz99/Black%20Logo%20PNG.png?updatedAt=1693637992308',
                }}
                style={styles.logoImage}
              />
            </Animated.View>
            <Text style={styles.appName}>Carviva Fuel Dispense</Text>
            {/* <Text style={styles.tagline}>Efficient fuel management</Text> */}
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.loginTitle}>Login to your account</Text>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                  {error?.response?.data?.error}
                </Text>
              </View>
            )}

            <Input
              label="Phone number"
              placeholder="Enter your phone number"
              value={form.values.phone_number}
              onChangeText={form.handleChange('phone_number')}
              keyboardType="phone-pad"
              autoCapitalize="none"
              error={form.errors.phone_number}
              icon={<Phone size={20} color="#6B7280" />}
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={form.values.password}
              onChangeText={form.handleChange('password')}
              secureTextEntry
              autoCapitalize="none"
              error={form.errors.password}
              icon={<Lock size={20} color="#6B7280" />}
            />

            {/* <Text style={styles.helperText}>
              Demo login:{'\n'}
              Admin: 1234567890 / password{'\n'}
              Attendant: 0987654321 / password
            </Text> */}

            <Button
              title="Login"
              onPress={form.handleSubmit}
              isLoading={isLoading}
              variant="primary"
              size="large"
              style={styles.loginButton}
            />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 48,
    marginBottom: 24,
  },
  logoInner: {
    width: 220,
    height: 220,
    // borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 16,
  },
  logoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    color: '#2ac18a',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  formContainer: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  loginTitle: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 24,
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  loginButton: {
    marginTop: 16,
  },
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
    marginTop: 16,
    marginBottom: 8,
    lineHeight: 18,
  },
});
