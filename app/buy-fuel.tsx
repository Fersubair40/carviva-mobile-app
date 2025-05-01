import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Platform,
  StyleSheet,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import { router, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from 'expo-camera';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import TokenInput from '@/components/TokenInput';
import { Camera, ArrowRight } from 'lucide-react-native';
import AmountInput from '@/components/ui/AmountInput';
import { fCurrency } from '@/utils/formatNumber';
import { useFormik } from 'formik';
import { useBuyFuel } from '@/api/mutations/buy-fuel';
import { queryClient } from './_layout';
import Toast from 'react-native-toast-message';
import { base64ToString } from '@/utils/convertBase64ToString';
import * as Yup from 'yup';

export default function BuyFuel() {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(1);

  const { mutate, isPending: isSubmitting } = useBuyFuel();

  // QR Code scanning related states
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const previousBarcode = useRef<string | null>(null);
  const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const form = useFormik({
    initialValues: {
      wallet_id: '',
      amount: '',
      pin: '',
    },
    validationSchema: Yup.object().shape({
      wallet_id: Yup.string()
        .required('Phone number is required')
        .test(
          'phone-validation',
          'Invalid phone number format',
          function (value) {
            if (!value) return false;

            if (value.startsWith('234')) {
              return value.length === 13 && /^\d+$/.test(value);
            } else {
              return value.length === 11 && /^\d+$/.test(value);
            }
          }
        ),
      amount: Yup.number()
        .required('Amount is required')
        .positive('Amount must be positive'),
      pin: Yup.string()
        .required('PIN is required')
        .length(4, 'PIN must be 4 digits'),
    }),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values) => {
      const formattedWalletId = values.wallet_id.startsWith('234')
        ? values.wallet_id
        : `234${Number(values.wallet_id)}`;
      mutate(
        {
          ...values,
          amount: +values.amount,
          wallet_id: formattedWalletId,
        },
        {
          onSuccess: (response) => {
            if (response?.data?.settings?.ignore_dispense_token) {
              queryClient.setQueryData(['trxn'], response?.data?.payments);
              router.push('/transaction-success');
            } else {
              router.push('/fuel-token');
            }
          },
          onError: (error) => {
            Toast.show({
              type: 'error',
              text1: error?.response?.data?.error,
            });
          },
        }
      );
    },
  });

  // Handle scanning QR code
  const handleBarCodeScanned = ({ type, data }: BarcodeScanningResult) => {
    if (scanned || data === previousBarcode.current) {
      return;
    }

    setScanned(true);
    previousBarcode.current = data;

    if (scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current);
    }

    setShowScanner(false);

    if (data) {
      const phoneNumber = base64ToString(data);

      form.setFieldValue('wallet_id', phoneNumber);
    } else {
      Alert.alert(
        'Invalid QR Code',
        'The scanned QR code does not contain a valid phone number.',
        [{ text: 'OK' }]
      );
    }

    scanTimeoutRef.current = setTimeout(() => {
      previousBarcode.current = null;
      setScanned(false);
    }, 5000);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }
    };
  }, []);

  const handleOpenScanner = async () => {
    if (!permission?.granted) {
      const { status } = await requestPermission();
      if (status !== 'granted') {
        Alert.alert(
          'Camera Permission',
          'Camera permission is required to scan QR codes',
          [{ text: 'OK' }]
        );
        return;
      }
    }

    setScanned(false);
    previousBarcode.current = null;
    setShowScanner(true);
  };

  const handleNext = () => {
    // form.validateForm();
    // Validate input fields
    if (!form.values.amount) {
      form.setFieldError('amount', 'Please enter an amount');
      return;
    }

    if (!form.values.wallet_id) {
      form.setFieldError('wallet_id', 'Please enter a phone number');
      return;
    }

    // Move to PIN step
    setStep(2);
  };

  const handlePinComplete = () => {
    // setPinError('');
  };

  //   // Validate PIN
  //   if (!pin || pin.length !== 4) {
  //     setPinError('Please enter a valid 4-digit PIN');
  //     return;
  //   }

  //   setIsSubmitting(true);

  //   // Simulate API request
  //   setTimeout(() => {
  //     setIsSubmitting(false);
  //     router.push('/fuel-token');
  //     // Alert.alert(
  //     //   'Transaction Successful',
  //     //   `You have successfully purchased fuel for ${amount} to wallet ID ${phoneNumber}`,
  //     //   [
  //     //     {
  //     //       text: 'OK',
  //     //       onPress: () => {
  //     //         // Reset and go back to step 1
  //     //         setStep(1);
  //     //         setAmount('');
  //     //         setPhoneNumber('');
  //     //         setPin('');
  //     //       },
  //     //     },
  //     //   ]
  //     // );
  //   }, 1500);
  // };

  return (
    <>
      <Stack.Screen
        options={{
          animation: 'ios_from_right',
          title: 'Buy Fuel',
          headerShown: true,
          headerLargeTitle: true,
          headerLargeTitleStyle: styles.headerLargeTitle,
          headerStyle: {
            backgroundColor: '#F9FAFB',
          },
          headerBackButtonDisplayMode: 'default',
          headerBackTitle: 'Go back',
          headerBackVisible: true,
          headerShadowVisible: false,
        }}
      />

      <SafeAreaView
        style={[
          styles.safeArea,
          { paddingTop: Platform.OS === 'ios' ? insets.top : 0 },
        ]}
      >
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.content}>
              {step === 1 ? (
                <>
                  <Text style={styles.description}>
                    Enter phone number to buy fuel from wallet
                  </Text>

                  <Card style={styles.card} variant="outlined">
                    <AmountInput
                      label="Amount"
                      value={form.values.amount}
                      onChangeText={form.handleChange('amount')}
                      error={form.errors.amount}
                      placeholder="0.00"
                    />

                    <Input
                      label="Phone number (Wallet ID)"
                      value={form.values.wallet_id}
                      onChangeText={form.handleChange('wallet_id')}
                      error={form.errors.wallet_id}
                      keyboardType="phone-pad"
                      placeholder="Enter phone number ( 090xxxxxxx )"
                    />
                    <TouchableOpacity
                      style={styles.scanButton}
                      onPress={handleOpenScanner}
                    >
                      <Camera size={20} color="#1F2937" />
                      <Text style={styles.scanButtonText}>Scan QR</Text>
                    </TouchableOpacity>

                    <Button
                      title="Next"
                      onPress={handleNext}
                      variant="primary"
                      style={styles.nextButton}
                      icon={<ArrowRight size={20} color="white" />}
                    />
                  </Card>
                </>
              ) : (
                <>
                  <Text style={styles.description}>
                    Confirm purchase details and enter PIN
                  </Text>

                  <Card style={styles.card} variant="outlined">
                    <View style={styles.summaryContainer}>
                      <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Amount:</Text>
                        <Text style={styles.summaryValue}>
                          {fCurrency(+form.values.amount)}
                        </Text>
                      </View>
                      <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Phone Number:</Text>
                        <Text style={styles.summaryValue}>
                          {form.values.wallet_id}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.pinContainer}>
                      <Text style={styles.pinLabel}>Enter PIN to confirm</Text>
                      <TokenInput
                        title="PIN"
                        length={4}
                        onComplete={handlePinComplete}
                        error={form.errors.pin}
                        value={form.values.pin}
                        onChange={(p) => {
                          form.setFieldValue('pin', p);
                          form.setFieldError('pin', '');
                        }}
                        secureTextEntry
                        // secureTextEntry={true}
                      />
                    </View>

                    <View style={styles.actionButtons}>
                      <Button
                        title="Back"
                        onPress={() => setStep(1)}
                        variant="secondary"
                        style={styles.backButton}
                      />
                      <Button
                        title="Confirm"
                        onPress={form.handleSubmit}
                        isLoading={isSubmitting}
                        variant="primary"
                        style={styles.confirmButton}
                      />
                    </View>
                  </Card>
                </>
              )}
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>

        {/* QR Code Scanner Modal */}
        <Modal
          visible={showScanner}
          animationType="slide"
          onRequestClose={() => setShowScanner(false)}
        >
          <SafeAreaView style={styles.scannerContainer}>
            <View style={styles.scannerHeader}>
              <Text style={styles.scannerTitle}>Scan Wallet QR Code</Text>
              <Button
                title="Close"
                onPress={() => setShowScanner(false)}
                variant="secondary"
                size="small"
              />
            </View>

            {permission?.granted && (
              <CameraView
                facing="back"
                style={styles.camera}
                barcodeScannerSettings={{
                  barcodeTypes: ['qr'],
                }}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
              >
                <View style={styles.overlay}>
                  <View style={styles.scanWindow}>
                    <Text style={styles.scanText}>
                      {scanned ? 'Processing QR code...' : 'Align QR code here'}
                    </Text>
                  </View>
                </View>
              </CameraView>
            )}

            <Button
              title={scanned ? 'Scan Again' : 'Reset Scanner'}
              onPress={() => {
                setScanned(false);
                previousBarcode.current = null;
              }}
              variant="primary"
              style={styles.resetButton}
              disabled={!scanned}
            />
          </SafeAreaView>
        </Modal>
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
  content: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 16,
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
    // padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  phoneInput: {
    flex: 1,
    marginRight: 8,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    marginBottom: 8,
  },
  scanButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
  },
  nextButton: {
    marginTop: 8,
  },
  summaryContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#4B5563',
  },
  summaryValue: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
  },
  pinContainer: {
    marginBottom: 24,
  },
  pinLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#4B5563',
    marginBottom: 16,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    flex: 1,
    marginRight: 8,
  },
  confirmButton: {
    flex: 1,
    marginLeft: 8,
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  scannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1F2937',
  },
  scannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanWindow: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  scanText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    textAlign: 'center',
    padding: 16,
  },
  resetButton: {
    margin: 16,
  },
});
