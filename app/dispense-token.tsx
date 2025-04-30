import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Stack, router } from 'expo-router';
import TokenInput from '@/components/TokenInput';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Select from '@/components/ui/Select'; // Import the custom Select component
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFormik } from 'formik';
import { useDispsenseFuelToken } from '@/api/mutations/fuel-token';
import * as Yup from 'yup';
import Toast from 'react-native-toast-message';
import { queryClient } from './_layout';

// Fuel options for the select component
const fuelOptions = [
  { label: 'Petrol', value: 'petrol' },
  { label: 'Diesel', value: 'diesel' },
];

export default function DispenseTokenScreen() {
  const insets = useSafeAreaInsets();
  const { dispenseToken } = queryClient.getQueryData(['dist']) as {
    dispenseToken: string;
  };

  const { mutate, isPending } = useDispsenseFuelToken();

  const handleCodeComplete = (code: string) => {
    // setDispenseCode(code);
    // Only clear error if user is actively changing the code
    // if (dispenseCodeError) {
    //   setDispenseCodeError('');
    // }
  };

  const form = useFormik({
    initialValues: {
      dispense_token: dispenseToken || '',
      service: '',
    },
    validationSchema: Yup.object().shape({
      dispense_token: Yup.string()
        .required('Dispense code is required')
        .length(7, 'Dispense code must be 7 characters long'),
      service: Yup.string().required('Service type is required'),
    }),
    onSubmit: (values) => {
      mutate(values, {
        onSuccess: (response) => {
          router.push({
            pathname: '/transaction-success',
          });
          queryClient.setQueryData(['trxn'], response?.data?.payments);
        },
        onError: (error) => {
          Toast.show({
            type: 'error',
            text1: error?.response?.data?.error,
          });
        },
      });
    },
    validateOnChange: false,
    validateOnBlur: false,
    enableReinitialize: true,
  });

  return (
    <>
      <Stack.Screen
        options={{
          animation: 'ios_from_right',
          title: 'Enter Dispense Code',
          headerShown: true,
          headerLargeTitle: true,
          headerLargeTitleStyle: styles.headerLargeTitle,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#F9FAFB',
          },
          headerBackButtonDisplayMode: 'default',
          headerBackTitle: 'Go back',
          headerBackVisible: true,
        }}
      />

      <SafeAreaView
        style={[
          styles.safeArea,
          { paddingTop: Platform.OS === 'ios' ? insets.top : 0 },
        ]}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              contentInsetAdjustmentBehavior="automatic"
            >
              <>
                <Text style={styles.description}>
                  Enter the dispense code to verify and authorize fuel
                  dispensing
                </Text>

                <Card style={styles.card} variant="outlined">
                  {/* Add Select components for fuel type and pump */}
                  <Select
                    label="Service type"
                    placeholder="Select service type"
                    options={fuelOptions}
                    value={form.values.service}
                    onChange={(value) => {
                      form.setFieldValue('service', value as string);
                      form.setFieldError('service', '');
                      // setFuelError('');
                    }}
                    error={form.errors.service}
                  />

                  <TokenInput
                    title="Dispense Code"
                    length={7}
                    value={form.values.dispense_token}
                    onComplete={handleCodeComplete}
                    error={form.errors.dispense_token}
                    onChange={(code) => {
                      form.setFieldValue('dispense_token', code);
                      form.setFieldError('dispense_token', '');
                    }}
                  />

                  <Button
                    title="Verify Transaction"
                    onPress={form.handleSubmit}
                    isLoading={isPending}
                    variant="primary"
                    style={styles.verifyButton}
                  />
                </Card>
              </>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    padding: 16,
  },
  headerLargeTitle: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 24,
    textAlign: 'left',
  },
  card: {
    marginBottom: 16,
    // padding: 16,
  },
  fuelTokenLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  fuelTokenValue: {
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  verifyButton: {
    marginTop: 24,
  },
  verifiedContainer: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 24,
  },
  resultIcon: {
    marginBottom: 16,
  },
  verifiedTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#059669',
    marginBottom: 8,
    textAlign: 'center',
  },
  verifiedText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  transactionContainer: {
    width: '100%',
    marginBottom: 32,
  },
  transactionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  completeButton: {
    width: '100%',
  },
  backButton: {
    // padding: 8,
  },
});
