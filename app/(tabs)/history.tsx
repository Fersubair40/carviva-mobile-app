import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { Stack } from 'expo-router';
import { Transaction } from '@/types/transaction';
import TransactionCard from '@/components/ui/TransactionCard';
import Button from '@/components/ui/Button';
import { Filter, X, ArrowLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Mock transactions data
const mockTransactions: Transaction[] = [
  {
    id: 'trx-123456',
    stationId: 'station-1',
    pumpId: '03',
    fuelType: 'Premium Petrol',
    amount: 25.5,
    price: 250.0,
    totalPrice: 6375.0,
    timestamp: new Date().toISOString(),
    status: 'completed',
    attendantId: '1',
    fuelToken: '123456',
    dispenseToken: '654321',
  },
  {
    id: 'trx-123457',
    stationId: 'station-1',
    pumpId: '01',
    fuelType: 'Diesel',
    amount: 40.0,
    price: 210.0,
    totalPrice: 8400.0,
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    status: 'completed',
    attendantId: '1',
    fuelToken: '123457',
    dispenseToken: '654322',
  },
  {
    id: 'trx-123458',
    stationId: 'station-1',
    pumpId: '02',
    fuelType: 'Regular Petrol',
    amount: 15.0,
    price: 180.0,
    totalPrice: 2700.0,
    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    status: 'completed',
    attendantId: '1',
    fuelToken: '123458',
    dispenseToken: '654323',
  },
  {
    id: 'trx-123459',
    stationId: 'station-1',
    pumpId: '04',
    fuelType: 'Premium Petrol',
    amount: 18.5,
    price: 250.0,
    totalPrice: 4625.0,
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    status: 'completed',
    attendantId: '1',
    fuelToken: '123459',
    dispenseToken: '654324',
  },
  {
    id: 'trx-123460',
    stationId: 'station-1',
    pumpId: '01',
    fuelType: 'Diesel',
    amount: 35.0,
    price: 210.0,
    totalPrice: 7350.0,
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    status: 'cancelled',
    attendantId: '1',
    fuelToken: '123460',
    dispenseToken: '654325',
  },
];

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filter, setFilter] = useState<{
    fuelType: string | null;
    status: string | null;
  }>({
    fuelType: null,
    status: null,
  });

  useEffect(() => {
    // Load mock transactions
    setTransactions(mockTransactions);
  }, []);

  // const handleBack = () => {
  //   // Handle navigation back
  //   router.back();
  // };

  const handleTransactionPress = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const applyFilter = () => {
    setFilterModalVisible(false);

    // Filter the transactions based on selected criteria
    let filteredTransactions = [...mockTransactions];

    if (filter.fuelType) {
      filteredTransactions = filteredTransactions.filter(
        (t) => t.fuelType === filter.fuelType
      );
    }

    if (filter.status) {
      filteredTransactions = filteredTransactions.filter(
        (t) => t.status === filter.status
      );
    }

    setTransactions(filteredTransactions);
  };

  const resetFilter = () => {
    setFilter({
      fuelType: null,
      status: null,
    });
    setTransactions(mockTransactions);
    setFilterModalVisible(false);
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

  return (
    <>
      <Stack.Screen
        options={{
          title: 'History',
          headerShown: true,
          headerLargeTitle: true,
          headerTitleAlign: 'left',
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: '700',
            color: '#1F2937',
            fontFamily: 'Inter-Bold',
          },
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#F9FAFB',

            // borderBottomWidth: 0,
            // elevation: 0,
          },

          headerRight: () => (
            <TouchableOpacity
              style={styles.headerRightButton}
              onPress={() => setFilterModalVisible(true)}
            >
              <Filter size={24} color="#1F2937" />
            </TouchableOpacity>
          ),
        }}
      />

      <SafeAreaView
        style={[
          styles.container,
          { paddingTop: Platform.OS === 'ios' ? insets.top : 0 },
        ]}
      >
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TransactionCard
              transaction={item}
              onPress={() => handleTransactionPress(item)}
            />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No transactions found for the selected filters.
              </Text>
              <Button
                title="Reset Filters"
                onPress={resetFilter}
                variant="outline"
                style={styles.resetButton}
              />
            </View>
          }
        />

        {/* Transaction Details Modal */}
        <Modal
          visible={modalVisible}
          // transparent={true}
          animationType="slide"
          onRequestClose={closeModal}
          presentationStyle="pageSheet"
        >
          <SafeAreaView>
            <View>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Transaction Details</Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={closeModal}
                  >
                    <X size={24} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalBody}>
                  {selectedTransaction && (
                    <>
                      <View style={styles.detailSection}>
                        <Text style={styles.sectionTitle}>
                          Transaction Info
                        </Text>
                        <View style={styles.detailItem}>
                          <Text style={styles.detailLabel}>
                            Transaction ID:
                          </Text>
                          <Text style={styles.detailValue}>
                            {selectedTransaction.id}
                          </Text>
                        </View>
                        <View style={styles.detailItem}>
                          <Text style={styles.detailLabel}>Date & Time:</Text>
                          <Text style={styles.detailValue}>
                            {formatDate(selectedTransaction.timestamp)}
                          </Text>
                        </View>
                        <View style={styles.detailItem}>
                          <Text style={styles.detailLabel}>Status:</Text>
                          <View
                            style={[
                              styles.statusBadge,
                              {
                                backgroundColor:
                                  selectedTransaction.status === 'completed'
                                    ? '#059669'
                                    : selectedTransaction.status === 'pending'
                                    ? '#D97706'
                                    : '#DC2626',
                              },
                            ]}
                          >
                            <Text style={styles.statusText}>
                              {selectedTransaction.status}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <View style={styles.detailSection}>
                        <Text style={styles.sectionTitle}>Fuel Details</Text>
                        <View style={styles.detailItem}>
                          <Text style={styles.detailLabel}>Fuel Type:</Text>
                          <Text style={styles.detailValue}>
                            {selectedTransaction.fuelType}
                          </Text>
                        </View>
                        <View style={styles.detailItem}>
                          <Text style={styles.detailLabel}>Quantity:</Text>
                          <Text style={styles.detailValue}>
                            {selectedTransaction.amount} L
                          </Text>
                        </View>
                        <View style={styles.detailItem}>
                          <Text style={styles.detailLabel}>
                            Price per Liter:
                          </Text>
                          <Text style={styles.detailValue}>
                            ₦{selectedTransaction.price.toFixed(2)}
                          </Text>
                        </View>
                        <View style={styles.detailItem}>
                          <Text style={styles.detailLabel}>Total Amount:</Text>
                          <Text style={styles.detailValueTotal}>
                            ₦{selectedTransaction.totalPrice.toFixed(2)}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.detailSection}>
                        <Text style={styles.sectionTitle}>Station Info</Text>
                        <View style={styles.detailItem}>
                          <Text style={styles.detailLabel}>Station ID:</Text>
                          <Text style={styles.detailValue}>
                            {selectedTransaction.stationId}
                          </Text>
                        </View>
                        <View style={styles.detailItem}>
                          <Text style={styles.detailLabel}>Pump Number:</Text>
                          <Text style={styles.detailValue}>
                            #{selectedTransaction.pumpId}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.detailSection}>
                        <Text style={styles.sectionTitle}>Verification</Text>
                        <View style={styles.detailItem}>
                          <Text style={styles.detailLabel}>Fuel Token:</Text>
                          <Text style={styles.detailValue}>
                            {selectedTransaction.fuelToken}
                          </Text>
                        </View>
                        <View style={styles.detailItem}>
                          <Text style={styles.detailLabel}>
                            Dispense Token:
                          </Text>
                          <Text style={styles.detailValue}>
                            {selectedTransaction.dispenseToken}
                          </Text>
                        </View>
                      </View>
                    </>
                  )}
                </ScrollView>

                <View style={styles.modalFooter}>
                  <Button
                    title="Close"
                    onPress={closeModal}
                    variant="outline"
                    style={styles.closeModalButton}
                  />
                </View>
              </View>
            </View>
          </SafeAreaView>
        </Modal>

        {/* Filter Modal */}
        <Modal
          visible={filterModalVisible}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setFilterModalVisible(false)}
        >
          <View>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Filter Transactions</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setFilterModalVisible(false)}
                >
                  <X size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                <Text style={styles.filterSectionTitle}>Fuel Type</Text>
                <View style={styles.filterOptions}>
                  {['Premium Petrol', 'Regular Petrol', 'Diesel'].map(
                    (type) => (
                      <TouchableOpacity
                        key={type}
                        style={[
                          styles.filterOption,
                          filter.fuelType === type &&
                            styles.filterOptionSelected,
                        ]}
                        onPress={() =>
                          setFilter({
                            ...filter,
                            fuelType: filter.fuelType === type ? null : type,
                          })
                        }
                      >
                        <Text
                          style={[
                            styles.filterOptionText,
                            filter.fuelType === type &&
                              styles.filterOptionTextSelected,
                          ]}
                        >
                          {type}
                        </Text>
                      </TouchableOpacity>
                    )
                  )}
                </View>

                <Text style={styles.filterSectionTitle}>Status</Text>
                <View style={styles.filterOptions}>
                  {['completed', 'pending', 'cancelled'].map((status) => (
                    <TouchableOpacity
                      key={status}
                      style={[
                        styles.filterOption,
                        filter.status === status && styles.filterOptionSelected,
                      ]}
                      onPress={() =>
                        setFilter({
                          ...filter,
                          status: filter.status === status ? null : status,
                        })
                      }
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          filter.status === status &&
                            styles.filterOptionTextSelected,
                        ]}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              <View style={styles.modalFooter}>
                <Button
                  title="Reset"
                  onPress={resetFilter}
                  variant="outline"
                  style={styles.filterButton1}
                />
                <Button
                  title="Apply Filters"
                  onPress={applyFilter}
                  variant="primary"
                  style={styles.filterButton2}
                />
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  headerLargeTitle: {
    fontSize: 44,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: 'Inter-Bold',
  },
  headerRightButton: {
    padding: 12,
    marginRight: 8,
  },
  backButton: {
    padding: 12,
  },
  listContent: {
    padding: 16,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'Inter-Regular',
  },
  resetButton: {
    width: 150,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Inter-SemiBold',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 16,
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
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
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
  detailValueTotal: {
    fontSize: 16,
    color: '#1E40AF',
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
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
    fontFamily: 'Inter-Medium',
  },
  modalFooter: {
    paddingHorizontal: 16,
    paddingVertical: 30,
    // padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
  },
  closeModalButton: {
    flex: 1,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
    marginTop: 8,
    fontFamily: 'Inter-SemiBold',
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginRight: 8,
    marginBottom: 8,
  },
  filterOptionSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#1E40AF',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter-Medium',
  },
  filterOptionTextSelected: {
    color: '#1E40AF',
  },
  filterButton1: {
    flex: 1,
    marginRight: 8,
  },
  filterButton2: {
    flex: 1,
    marginLeft: 8,
  },
});
