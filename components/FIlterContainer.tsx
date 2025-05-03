// ... Previous code remains the same

import { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  SafeAreaView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Button from './ui/Button';
import { X } from 'lucide-react-native';
// Filter Modal Component
const FilterModal = ({
  visible,
  filter,
  onApply,
  onReset,
  onClose,
}: {
  visible: boolean;
  onApply: (filter: any) => {};
  onReset: () => void;
  onClose: () => void;
  filter: {
    fuelType: string | null;
    status: string | null;
  };
}) => {
  const [localFilter, setLocalFilter] = useState(filter);

  useEffect(() => {
    // Update local filter when the parent filter changes
    setLocalFilter(filter);
  }, [filter, visible]);

  const toggleFuelType = (type: string) => {
    setLocalFilter({
      ...localFilter,
      fuelType: localFilter.fuelType === type ? null : type,
    });
  };

  const toggleStatus = (status: string) => {
    setLocalFilter({
      ...localFilter,
      status: localFilter.status === status ? null : status,
    });
  };

  const handleApply = () => {
    onApply(localFilter);
  };

  const handleReset = () => {
    setLocalFilter({
      fuelType: null,
      status: null,
    });
    onReset();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.filterModalSafeArea}>
        <View style={styles.filterModalContent}>
          <View style={styles.filterModalHeader}>
            <Text style={styles.filterModalTitle}>Filter Transactions</Text>
            <TouchableOpacity
              style={styles.filterCloseButton}
              onPress={onClose}
              accessibilityLabel="Close filters"
            >
              <X size={22} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.filterModalBody}
            showsVerticalScrollIndicator={false}
          >
            {/* Active filters summary */}
            {(localFilter.fuelType || localFilter.status) && (
              <View style={styles.activeFiltersContainer}>
                <Text style={styles.activeFiltersTitle}>Active Filters</Text>
                <View style={styles.activeFiltersList}>
                  {localFilter.fuelType && (
                    <View style={styles.activeFilterChip}>
                      <Text style={styles.activeFilterText}>
                        {localFilter.fuelType}
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          toggleFuelType(localFilter.fuelType as string)
                        }
                        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                      >
                        <X size={14} color="#4B5563" />
                      </TouchableOpacity>
                    </View>
                  )}
                  {localFilter.status && (
                    <View style={styles.activeFilterChip}>
                      <Text style={styles.activeFilterText}>
                        {localFilter.status.charAt(0).toUpperCase() +
                          localFilter.status.slice(1)}
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          toggleStatus(localFilter?.status as string)
                        }
                        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                      >
                        <X size={14} color="#4B5563" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* Fuel Type Section */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Fuel Type</Text>
              <View style={styles.filterOptionGrid}>
                {['Premium Petrol', 'Regular Petrol', 'Diesel'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.filterOptionCard,
                      localFilter.fuelType === type &&
                        styles.filterOptionSelected,
                    ]}
                    onPress={() => toggleFuelType(type)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        localFilter.fuelType === type &&
                          styles.filterOptionTextSelected,
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Status Section */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Status</Text>
              <View style={styles.filterStatusContainer}>
                {[
                  { value: 'completed', label: 'Completed', color: '#059669' },
                  { value: 'pending', label: 'Pending', color: '#D97706' },
                  { value: 'cancelled', label: 'Cancelled', color: '#DC2626' },
                ].map((status) => (
                  <TouchableOpacity
                    key={status.value}
                    style={[
                      styles.filterStatusOption,
                      localFilter.status === status.value &&
                        styles.filterStatusSelected,
                    ]}
                    onPress={() => toggleStatus(status.value)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.statusIndicator,
                        { backgroundColor: status.color },
                      ]}
                    />
                    <Text
                      style={[
                        styles.filterStatusText,
                        localFilter.status === status.value &&
                          styles.filterStatusTextSelected,
                      ]}
                    >
                      {status.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* We could add more filter sections here like date range, etc. */}
          </ScrollView>

          <View style={styles.filterModalFooter}>
            <Button
              title="Reset"
              onPress={handleReset}
              variant="outline"
              style={styles.filterFooterButton}
            />
            <Button
              title="Apply Filters"
              onPress={handleApply}
              variant="primary"
              style={styles.filterFooterButton}
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default FilterModal;
// Use this component in the main HistoryScreen component:
// return (
//   <>
//     <Stack.Screen ... />
//     <SafeAreaView ... >
//       {isLoading ? ... : ... }
//
//       <TransactionDetailsModal ... />
//
//       {/* Now use the new FilterModal component */}
//       <FilterModal
//         visible={filterModalVisible}
//         filter={filter}
//         onApply={(newFilter) => {
//           setFilter(newFilter);
//           applyFilter();
//         }}
//         onReset={resetFilter}
//         onClose={() => setFilterModalVisible(false)}
//       />
//     </SafeAreaView>
//   </>
// );

// Add these styles for the Filter Modal
const styles = StyleSheet.create({
  filterModalSafeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  filterModalContent: {
    flex: 1,
    backgroundColor: 'white',
  },
  filterModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  filterModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Inter-SemiBold',
  },
  filterCloseButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  filterModalBody: {
    flex: 1,
    padding: 16,
  },
  activeFiltersContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },
  activeFiltersTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
    marginBottom: 8,
    fontFamily: 'Inter-Medium',
  },
  activeFiltersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  activeFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeFilterText: {
    fontSize: 13,
    color: '#4B5563',
    marginRight: 6,
    fontFamily: 'Inter-Medium',
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
    fontFamily: 'Inter-SemiBold',
  },
  filterOptionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  filterOptionCard: {
    flex: 1,
    minWidth: '30%',
    margin: 6,
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterOptionSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
    fontFamily: 'Inter-Medium',
  },
  filterOptionTextSelected: {
    color: '#1E40AF',
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  filterStatusContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterStatusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: 'white',
  },
  filterStatusSelected: {
    backgroundColor: '#EFF6FF',
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  filterStatusText: {
    fontSize: 14,
    color: '#4B5563',
    fontFamily: 'Inter-Medium',
  },
  filterStatusTextSelected: {
    color: '#1E40AF',
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  filterModalFooter: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: 'white',
  },
  filterFooterButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});
