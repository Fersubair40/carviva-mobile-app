import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import {
  Fuel as GasPump,
  ShoppingBag,
  Clock,
  Bell,
  User,
  ChevronRight,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { fCurrency, fNumber } from '@/utils/formatNumber';
import { useGetUserProfile } from '@/api/queries/user';

export default function HomeScreen() {
  const { data } = useGetUserProfile();
  const isAdmin = data?.data?.user?.role?.name === 'admin';

  // Function to get time-based greeting
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) {
      return 'Good morning';
    } else if (hours >= 12 && hours < 17) {
      return 'Good afternoon';
    } else {
      return 'Good evening';
    }
  };

  const handleDispenseFuel = () => {
    router.push('/fuel-token');
  };

  const handleBuyFuel = () => {
    router.push('/buy-fuel');
  };

  const handleTransactionHistory = () => {
    // router.push('/transactions');
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        // Add padding for Android status bar
        Platform.OS === 'android' && { paddingTop: 60 },
      ]}
    >
      <StatusBar style="dark" />

      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()},</Text>
          <Text style={styles.username}>
            {data?.data?.user.first_name || 'User'}
          </Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Bell size={22} color="#1F2937" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <User size={22} color="#1F2937" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Fuel Status Card */}
        <View style={styles.balanceCard}>
          <LinearGradient
            colors={['#1E40AF', '#3B82F6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.balanceBackground}
          >
            <Text style={styles.balanceLabel}>Total Fuel Dispensed Today</Text>
            <Text style={styles.balanceAmount}>
              <FontAwesome6 name="naira-sign" size={32} color="white" />
              {fNumber(1000000)}
            </Text>
            <Text style={styles.balanceSubtext}>
              Last updated: {/* Display the last updated time */}
              <Clock size={10} color="white" />{' '}
              {new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </LinearGradient>
        </View>

        {/* Main Actions */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Actions</Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.actionButton, styles.dispenseButtonBg]}
              onPress={handleDispenseFuel}
            >
              <GasPump size={24} color="#1E40AF" />
              <Text style={styles.actionButtonText}>Dispense Fuel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.buyButtonBg]}
              onPress={handleBuyFuel}
            >
              <ShoppingBag size={24} color="#059669" />
              <Text style={styles.actionButtonText}>Buy Fuel</Text>
            </TouchableOpacity>
          </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#F9FAFB',
  },
  greeting: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  username: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
    marginLeft: 12,
    backgroundColor: '#F3F4F6',
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  balanceCard: {
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  balanceBackground: {
    padding: 20,
    height: 140,
    borderRadius: 12,
  },
  balanceLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: 'white',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: 'white',
    marginBottom: 4,
  },
  balanceSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  actionsContainer: {
    marginBottom: 32,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    height: 100,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  dispenseIcon: {
    backgroundColor: '#EFF6FF',
  },
  buyIcon: {
    backgroundColor: '#ECFDF5',
  },
  historyIcon: {
    backgroundColor: '#F5F3FF',
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftContent: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    height: 100,
    gap: 10,
  },

  dispenseButtonBg: {
    backgroundColor: '#EFF6FF', // Light blue background
  },
  buyButtonBg: {
    backgroundColor: '#ECFDF5', // Light green background
  },
  arrowContainer: {
    position: 'absolute',
    bottom: 20, // tweak to taste
    right: 12, // tweak to taste
  },
});
