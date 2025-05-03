// ... Previous code remains the same

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Button from './ui/Button';
import { X } from 'lucide-react-native';
import { Reports } from '@/types/reports';
import { fNumber } from '@/utils/formatNumber';

const TransactionDetailsModal = ({
  visible,
  transaction,
  onClose,
}: {
  visible: boolean;
  transaction: Reports | null;
  onClose: () => void;
}) => {
  if (!transaction) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return {
          bg: '#ECFDF5',
          text: '#059669',
          border: '#A7F3D0',
        };
      case 'pending':
        return {
          bg: '#FEF3C7',
          text: '#D97706',
          border: '#FDE68A',
        };
      case 'failed':
        return {
          bg: '#FEE2E2',
          text: '#DC2626',
          border: '#FECACA',
        };
      default:
        return {
          bg: '#F3F4F6',
          text: '#6B7280',
          border: '#E5E7EB',
        };
    }
  };

  const statusColors = getStatusColor(transaction?.payments?.status);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalSafeArea}>
        <View style={styles.modalContent}>
          {/* Header with transaction ID and status */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Transaction Details</Text>
              <Text style={styles.transactionId}>{transaction.ref}</Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              accessibilityLabel="Close details"
            >
              <X size={22} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Status indicator banner */}
          <View
            style={[
              styles.statusBanner,
              {
                backgroundColor: statusColors.bg,
                borderColor: statusColors.border,
              },
            ]}
          >
            <Text style={[styles.statusText, { color: statusColors.text }]}>
              {transaction?.payments?.status?.charAt(0).toUpperCase() +
                transaction?.payments?.status?.slice(1)}
            </Text>
            <Text style={[styles.statusDate, { color: statusColors.text }]}>
              {formatDate(transaction?.created_at)}
            </Text>
          </View>

          <ScrollView
            style={styles.modalBody}
            showsVerticalScrollIndicator={false}
          >
            {/* Price summary card */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Amount</Text>
                <Text style={styles.summaryTotal}>
                  ₦{fNumber(Number(transaction?.amount))}
                </Text>
              </View>
              {transaction?.payments?.quantity &&
                transaction?.payments?.fuel_rate && (
                  <>
                    <View style={styles.divider} />
                    {transaction?.payments?.quantity && (
                      <View style={styles.summaryRow}>
                        <Text style={styles.detailLabel}>Quantity</Text>
                        <Text style={styles.detailValue}>
                          {transaction?.payments?.quantity} L
                        </Text>
                      </View>
                    )}

                    {transaction?.payments?.fuel_rate && (
                      <View style={styles.summaryRow}>
                        <Text style={styles.detailLabel}>Price per Liter</Text>
                        <Text style={styles.detailValue}>
                          ₦{fNumber(Number(transaction?.payments?.fuel_rate))}
                        </Text>
                      </View>
                    )}
                  </>
                )}
            </View>

            <View style={styles.detailSection}>
              <Text style={styles.sectionTitle}>Payments Information</Text>
              <View style={styles.detailCard}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Name</Text>
                  <Text style={styles.detailValue}>
                    {transaction?.payments?.first_name}{' '}
                    {transaction?.payments?.last_name}
                  </Text>
                </View>
                <View style={styles.detailDivider} />
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Product</Text>
                  <Text style={styles.detailValue}>
                    {transaction?.payments?.product}{' '}
                    {transaction?.payments?.product_type}
                  </Text>
                </View>
              </View>
            </View>

            {/* Fuel Details Section */}
            <View style={styles.detailSection}>
              <Text style={styles.sectionTitle}>Fuel Information</Text>
              <View style={styles.detailCard}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Fuel Type</Text>
                  <Text style={styles.detailValue}>{transaction.service}</Text>
                </View>
                <View style={styles.detailDivider} />
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Station Name</Text>
                  <Text style={styles.detailValue}>
                    {transaction?.fuel_stations?.name}
                  </Text>
                </View>
              </View>
            </View>

            {/* Verification Tokens Section */}
            <View style={styles.detailSection}>
              <Text style={styles.sectionTitle}>Token Status</Text>
              <View style={styles.detailCard}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Fuel Token</Text>
                  <Text style={styles.tokenValue}>
                    {transaction.payments?.fuel_token?.status}
                  </Text>
                </View>
                <View style={styles.detailDivider} />
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Dispense Token</Text>
                  <Text style={styles.tokenValue}>
                    {transaction.payments?.fuel_token?.status}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            {transaction.payments?.status === 'approved' && (
              <Button
                title="Download Receipt"
                variant="outline"
                onPress={() => {}}
                style={styles.footerButton}
              />
            )}
            <Button
              title="Close"
              onPress={onClose}
              variant={
                transaction.payments?.status === 'approved'
                  ? 'primary'
                  : 'outline'
              }
              style={styles.footerButton}
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default TransactionDetailsModal;
// Add these styles for the Transaction Details Modal
const styles = StyleSheet.create({
  modalSafeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalContent: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Inter-SemiBold',
  },
  transactionId: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
    fontFamily: 'Inter-Regular',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  statusBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  statusDate: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
  },
  modalBody: {
    flex: 1,
    padding: 16,
  },
  summaryCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#4B5563',
    fontFamily: 'Inter-Medium',
  },
  summaryTotal: {
    fontSize: 18,
    color: '#1E40AF',
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  detailSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
    fontFamily: 'Inter-SemiBold',
  },
  detailCard: {
    borderRadius: 12,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  detailDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  detailValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  tokenValue: {
    fontSize: 14,
    color: '#1E40AF',
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: 'white',
  },
  footerButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});
