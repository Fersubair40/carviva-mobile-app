import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Card from './Card';
import { Transaction } from '@/types/transaction';
import { Fuel as GasPump, Calendar, CreditCard } from 'lucide-react-native';

interface TransactionCardProps {
  transaction: Transaction;
  onPress?: () => void;
}

const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  onPress,
}) => {
  const formatCurrency = (amount: number) => {
    return `₦${amount.toFixed(2)}`;
  };

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#059669';
      case 'pending':
        return '#D97706';
      case 'cancelled':
        return '#DC2626';
      default:
        return '#6B7280';
    }
  };

  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress} activeOpacity={0.8}>
      <Card style={styles.card} variant="outlined">
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <GasPump size={20} color="#1E40AF" />
            <Text style={styles.title}>{transaction.fuelType}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(transaction.status) },
            ]}
          >
            <Text style={styles.statusText}>{transaction.status}</Text>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.row}>
            <Text style={styles.label}>Amount:</Text>
            <Text style={styles.value}>{transaction.amount} L</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Price:</Text>
            <Text style={styles.value}>
              {formatCurrency(transaction.price)}/L
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Total:</Text>
            <Text style={styles.valueTotal}>
              {formatCurrency(transaction.totalPrice)}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerItem}>
            <Calendar size={16} color="#6B7280" />
            <Text style={styles.footerText}>
              {formatDate(transaction.timestamp)}
            </Text>
          </View>

          <View style={styles.footerItem}>
            <CreditCard size={16} color="#6B7280" />
            <Text style={styles.footerText}>Pump #{transaction.pumpId}</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    color: '#1F2937',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  detailsContainer: {
    marginVertical: 8,
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  label: {
    color: '#6B7280',
    fontSize: 13,
  },
  value: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '500',
  },
  valueTotal: {
    color: '#1E40AF',
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    marginLeft: 4,
    color: '#6B7280',
    fontSize: 12,
  },
});

export default TransactionCard;
