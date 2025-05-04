import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import Card from './Card';
import { Reports } from '@/types/reports';
import { fCurrency } from '@/utils/formatNumber';

interface TransactionCardProps {
  transaction: Reports;
  onPress?: () => void;
}

const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  onPress,
}) => {
  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'approved':
        return {
          color: '#059669',
          backgroundColor: '#ECFDF5',
          icon: '✓',
        };
      case 'pending':
        return {
          color: '#D97706',
          backgroundColor: '#FFFBEB',
          icon: '⏳',
        };
      case 'failed':
        return {
          color: '#DC2626',
          backgroundColor: '#FEF2F2',
          icon: '✕',
        };
      default:
        return {
          color: '#6B7280',
          backgroundColor: '#F3F4F6',
          icon: '•',
        };
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const { first_name, last_name, status } = transaction.payments;
  const statusInfo = getStatusInfo(status);
  const initials = getInitials(first_name, last_name);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.wrapper}
      activeOpacity={0.7}
    >
      <Card style={styles.card} variant="outlined">
        <View style={styles.container}>
          {/* Avatar/Initials */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
          </View>

          {/* Content */}
          <View style={styles.content}>
            {/* Top Row: Service Name */}
            <Text style={styles.service} numberOfLines={1}>
              {transaction.service}
            </Text>

            {/* Middle Row: Customer Name */}
            <Text style={styles.name} numberOfLines={1}>
              {first_name} {last_name}
            </Text>

            {/* Bottom Row: Date */}
            <Text style={styles.date}>
              {formatDate(transaction.created_at)}
            </Text>
          </View>

          {/* Right Side */}
          <View style={styles.rightContainer}>
            {/* Amount */}
            <Text style={styles.amount}>
              {fCurrency(Number(transaction.amount))}
            </Text>

            {/* Status */}
            <View
              style={[
                styles.statusContainer,
                { backgroundColor: statusInfo.backgroundColor },
              ]}
            >
              <Text style={[styles.statusIcon, { color: statusInfo.color }]}>
                {statusInfo.icon}
              </Text>
              <Text style={[styles.statusText, { color: statusInfo.color }]}>
                {status}
              </Text>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  card: {
    // borderRadius: 12,
    // padding: 0,
    // overflow: 'hidden',
    // borderWidth: 0,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4F46E5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  service: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
    textTransform: 'capitalize',
  },
  name: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: '#6B7280',
  },
  rightContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
});

export default TransactionCard;
