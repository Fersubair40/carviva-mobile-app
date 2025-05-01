import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  Alert,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { Stack, router } from 'expo-router';
import TokenInput from '@/components/TokenInput';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { ArrowRight, Camera } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BarcodeScanningResult, CameraView } from 'expo-camera';
import { useCameraPermissions } from 'expo-camera';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useVerifyFuelToken } from '@/api/mutations/fuel-token';
import Toast from 'react-native-toast-message';
import { queryClient } from './_layout';
import { base64ToString, isValidBase64 } from '@/utils/convertBase64ToString';

export default function FuelTokenScreen() {
  const insets = useSafeAreaInsets();
  const { mutate, isPending: isSubmitting } = useVerifyFuelToken();

  const form = useFormik({
    initialValues: {
      fuel_token: '',
    },
    validationSchema: Yup.object().shape({
      fuel_token: Yup.string()
        .required('Fuel token is required')
        .matches(/^\d{7}$/, 'Fuel token must be a 7-digit number'),
    }),

    onSubmit: (values) => {
      mutate(values, {
        onSuccess: (data) => {
          router.push({
            pathname: '/dispense-token',
          });
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
  });

  // QR Code scanning related states
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const previousBarcode = useRef<string | null>(null);
  const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTokenComplete = () => {
    // setFuelTokenError('');
  };

  // Handle scanning QR code
  const handleBarCodeScanned = ({ type, data }: BarcodeScanningResult) => {
    // Prevent multiple scans of the same barcode in quick succession
    if (scanned || data === previousBarcode.current) {
      return;
    }

    // Set state to prevent immediate re-scanning
    setScanned(true);
    previousBarcode.current = data;

    // Clear any existing timeout
    if (scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current);
    }

    // Close scanner modal
    setShowScanner(false);

    // Validate the scanned data - should be a 6-digit code
    if (data) {
      const tokens = data?.split(',');
      const fuelToken = base64ToString(tokens[0]);
      const dispenseToken = base64ToString(tokens[1]);
      form.setFieldValue('fuel_token', fuelToken);
      queryClient.setQueryData(['dist'], { dispenseToken: dispenseToken });
    } else {
      // Show error if invalid format
      Alert.alert(
        'Invalid QR Code',
        'The scanned QR code does not contain a valid 6-digit fuel token.',
        [{ text: 'OK' }]
      );
    }

    // Reset the previous barcode reference after a delay
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

  return (
    <>
      <Stack.Screen
        options={{
          animation: 'ios_from_right',
          title: 'Enter Fuel Token',
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
        <KeyboardAvoidingView style={styles.container}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.content}>
              <Text style={styles.description}>
                Enter the 7-digit fuel token to authorize the transaction
              </Text>

              <Card style={styles.card} variant="outlined">
                <TokenInput
                  title="Fuel token"
                  length={7}
                  onComplete={handleTokenComplete}
                  error={form.errors.fuel_token}
                  value={form.values.fuel_token}
                  onChange={(c) => {
                    form.setFieldValue('fuel_token', c);
                    // setFuelTokenError('');
                  }}
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
                  onPress={form.handleSubmit}
                  isLoading={isSubmitting}
                  variant="primary"
                  style={styles.nextButton}
                  icon={<ArrowRight size={20} color="white" />}
                />
              </Card>
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
              <Text style={styles.scannerTitle}>Scan Fuel Token QR Code</Text>
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
    paddingHorizontal: 16,
  },
  card: {
    marginBottom: 16,
  },
  tokenInputContainer: {
    flexDirection: 'column',
    width: '100%',
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
    marginTop: 24,
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
    borderColor: '#FFFFFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  scanText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
    padding: 16,
  },
  resetButton: {
    margin: 16,
  },
});
