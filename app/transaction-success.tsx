import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Platform,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { Check, Home, Share2 } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { queryClient } from './_layout';
import { fCurrency } from '@/utils/formatNumber';
import dayjs from 'dayjs';

export default function PurchaseSuccessScreen({}) {
  const transaction = queryClient.getQueryData(['trxn']) as {
    first_name: string;
    last_name: string;
    amount: number;
    status: string;
    quantity?: number;
    ref: string;
    station_name?: string;
    fuel_rate?: number;
    created_at: string;
    product: string;
    product_type: string;
  };

  const handleGoHome = () => {
    queryClient.removeQueries({ queryKey: ['trxn'] });
    router.push('/(tabs)');
  };

  const handleShare = () => {
    // Implement share functionality
    console.log('Share receipt');
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        Platform.OS === 'android' && { paddingTop: 60 },
      ]}
    >
      <StatusBar style="dark" />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Success Animation/Icon */}
        <View style={styles.successIconContainer}>
          <LinearGradient
            colors={['#10B981', '#059669']}
            style={styles.successIconBackground}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Check size={48} color="white" />
          </LinearGradient>
        </View>

        <Text style={styles.amountText}>{fCurrency(transaction?.amount)}</Text>
        <Text style={styles.successTitle}>Purchase Successful!</Text>
        <Text style={styles.successMessage}>
          Your fuel purchase has been completed successfully, you can now
          dispense fuel to the customer.
        </Text>

        {/* Purchase Details Card */}
        <Card variant="flat" style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>Purchase Details</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Customer</Text>
            <Text style={styles.detailValue}>
              {transaction?.first_name} {transaction?.last_name}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount</Text>
            <Text style={styles.detailValue}>
              {fCurrency(transaction?.amount)}
            </Text>
          </View>

          {transaction?.quantity && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Liters</Text>
              <Text style={styles.detailValue}>{transaction?.quantity} L</Text>
            </View>
          )}

          {transaction?.fuel_rate && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Price per liter</Text>
              <Text style={styles.detailValue}>
                {fCurrency(transaction?.fuel_rate)}
              </Text>
            </View>
          )}

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Product</Text>
            <Text style={styles.detailValue}>
              {transaction?.product} {transaction?.product_type}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Station</Text>
            <Text style={styles.detailValue}>{transaction?.station_name}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>
              {dayjs(transaction?.created_at).format('MMMM D, YYYY')}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Transaction Ref</Text>
            <Text style={styles.detailValue}>{transaction?.ref}</Text>
          </View>
        </Card>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Back to Home"
            onPress={handleGoHome}
            variant="primary"
            size="large"
            icon={<Home size={18} color="white" />}
          />

          <Button
            title="Share Receipt"
            onPress={handleShare}
            variant="ghost"
            size="medium"
            icon={<Share2 size={18} color="#059669" />}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  amountText: {
    color: '#1f2937',
    fontSize: 32,
    textAlign: 'center',
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
  },
  successIconContainer: {
    marginTop: 32,
    marginBottom: 24,
    alignItems: 'center',
  },
  successIconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  detailsCard: {
    width: '100%',
  },
  detailsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#059669',
    borderRadius: 8,
    paddingVertical: 14,
    width: '100%',
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: 'white',
  },
  secondaryButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderRadius: 8,
    paddingVertical: 14,
    width: '100%',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#059669',
  },
  buttonIcon: {
    marginRight: 8,
  },
});
