
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

export default function BuyFuel() {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(1); // 1: Input details, 2: Confirm and enter PIN
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // QR Code scanning related states
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const previousBarcode = useRef<string | null>(null);
  const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

    // Validate the scanned data - phone number format
    if (data && /^\d+$/.test(data)) {
      // Set the phone number to the scanned data
      setPhoneNumber(data);
    } else {
      // Show error if invalid format
      Alert.alert(
        'Invalid QR Code',
        'The scanned QR code does not contain a valid phone number.',
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

  const handleNext = () => {
    // Validate input fields
    if (!amount) {
      Alert.alert('Error', 'Please enter an amount');
      return;
    }

    if (!phoneNumber) {
      Alert.alert('Error', 'Please enter a phone number');
      return;
    }

    // Move to PIN step
    setStep(2);
  };

  const handlePinComplete = () => {
    setPinError('');
  };

  const handleSubmit = () => {
    // Validate PIN
    if (!pin || pin.length !== 4) {
      setPinError('Please enter a valid 4-digit PIN');
      return;
    }

    setIsSubmitting(true);

    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/fuel-token');
      // Alert.alert(
      //   'Transaction Successful',
      //   `You have successfully purchased fuel for ${amount} to wallet ID ${phoneNumber}`,
      //   [
      //     {
      //       text: 'OK',
      //       onPress: () => {
      //         // Reset and go back to step 1
      //         setStep(1);
      //         setAmount('');
      //         setPhoneNumber('');
      //         setPin('');
      //       },
      //     },
      //   ]
      // );
    }, 1500);
  };

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
                      value={amount}
                      onChangeText={setAmount}
                      placeholder="0.00"
                      // precision={2}
                      // keyboardType="numeric"
                      // style={styles.input}
                    />

                    <Input
                      label="Phone Number (Wallet ID)"
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                      keyboardType="phone-pad"
                      placeholder="Enter phone number"
                      // style={styles.phoneInput}
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
                          {fCurrency(+amount)}
                        </Text>
                      </View>
                      <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Phone Number:</Text>
                        <Text style={styles.summaryValue}>{phoneNumber}</Text>
                      </View>
                    </View>

                    <View style={styles.pinContainer}>
                      <Text style={styles.pinLabel}>Enter PIN to confirm</Text>
                      <TokenInput
                        title="PIN"
                        length={4}
                        onComplete={handlePinComplete}
                        error={pinError}
                        value={pin}
                        onChange={(p) => {
                          setPin(p);
                          setPinError('');
                        }}
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
                        onPress={handleSubmit}
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
