import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Switch,
  Alert,
  ScrollView,
  Image,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  User,
  ChevronRight,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  Moon,
  Sun,
} from 'lucide-react-native';
import { Stack, router } from 'expo-router';
import Icon from '@expo/vector-icons/MaterialIcons'; // Make sure to install this package

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGetUserProfile } from '@/api/queries/user';
import InitialsAvatar from '@/components/InitialsAvatar';
export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();
  const { data } = useGetUserProfile();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const handleLogout = async () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Are you sure you want to log out?');
      if (confirmed) {
        await logout();
      }
    } else {
      Alert.alert(
        'Confirm Logout',
        'Are you sure you want to log out?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Logout',
            onPress: async () => {
              await logout();
            },
          },
        ],
        { cancelable: true }
      );
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleNotifications = () => {
    setNotifications(!notifications);
  };

  const HEADER_HEIGHT = Platform.OS === 'ios' ? 96 : 56; // tweak as needed

  const user = data?.data?.user;

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Account Settings',
          headerTitleAlign: 'left',
          headerLargeTitle: true,
          headerLargeTitleStyle: {
            fontFamily: 'Inter-Bold',
          },
          headerLargeStyle: {
            backgroundColor: '#F9FAFB',
          },
          // Enable this next property to make sure the header collapses properly
          headerTransparent: Platform.OS === 'ios',
          headerBlurEffect: 'regular',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#F9FAFB',
          },
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: '700',
            color: '#1F2937',
            fontFamily: 'Inter-Bold',
          },
        }}
      />

      <SafeAreaView
        style={[
          styles.container,
          {
            paddingTop: Platform.OS === 'ios' ? insets.top + HEADER_HEIGHT : 0,
          },
        ]}
      >
        <ScrollView
          // style={{ flex: 1, paddingTop: 30 }}
          contentInsetAdjustmentBehavior="automatic"
          // This is important - it helps the header collapse correctly
          contentContainerStyle={{
            paddingTop: Platform.OS === 'ios' ? HEADER_HEIGHT : 0,
          }}
        >
          <View style={styles.profilesection}>
            <Card variant="flat">
              {/* Header with avatar and name */}
              <View style={styles.header}>
                <View style={styles.avatarContainer}>
                  <InitialsAvatar
                    firstName={user?.first_name}
                    lastName={user?.last_name}
                    size={70}
                    // style={styles.avatar}
                  />
                </View>

                <View style={styles.nameContainer}>
                  <Text style={styles.userName}>
                    {user?.first_name} {user?.last_name}
                  </Text>
                  <Text style={styles.userRole}>{user?.role?.name}</Text>
                </View>
              </View>

              {/* Divider */}
              <View style={styles.divider} />

              {/* Info items */}
              <View style={styles.infoSection}>
                <View style={styles.infoItem}>
                  <Icon
                    name="local-gas-station"
                    size={20}
                    color="#1E40AF"
                    style={styles.icon}
                  />
                  <Text style={styles.infoText}>
                    {user?.fuel_stations?.name || 'No station assigned'}
                  </Text>
                </View>

                <View style={styles.infoItem}>
                  <Icon
                    name="phone"
                    size={20}
                    color="#1E40AF"
                    style={styles.icon}
                  />
                  <Text style={styles.infoText}>
                    {user?.phone_number || 'No phone number'}
                  </Text>
                </View>

                {/* You can add more info items here as needed */}
              </View>
            </Card>
          </View>
          {/* <View style={styles.profileSection}>
            <View style={styles.profileImageContainer}>
              <InitialsAvatar
                firstName={data?.data?.user?.first_name}
                lastName={data?.data?.user?.last_name}
                size={50}
                style={styles.profileImage}
              />
            </View>
            <Text style={styles.userName}>
              {data?.data?.user?.first_name} {data?.data?.user?.last_name}{' '}
            </Text>
            <Text style={styles.userRole}>{data?.data?.user?.role?.name}</Text>
            <Text style={styles.userRole}>
              {data?.data?.user?.fuel_stations?.name}
            </Text>
            <Text style={styles.userPhone}>
              {data?.data?.user?.phone_number}
            </Text>
          </View> */}

          <View style={styles.settingsContainer}>
            <Text style={styles.sectionTitle}>Account Settings</Text>

            <Card style={styles.settingsCard} variant="flat">
              <TouchableOpacity style={styles.settingsItem}>
                <View style={styles.settingsItemLeft}>
                  <User size={20} color="#1E40AF" />
                  <Text style={styles.settingsItemText}>
                    Personal Information
                  </Text>
                </View>
                <ChevronRight size={20} color="#6B7280" />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity style={styles.settingsItem}>
                <View style={styles.settingsItemLeft}>
                  <Shield size={20} color="#1E40AF" />
                  <Text style={styles.settingsItemText}>Security</Text>
                </View>
                <ChevronRight size={20} color="#6B7280" />
              </TouchableOpacity>
            </Card>

            {/* <Text style={styles.sectionTitle}>App Settings</Text>

            <Card style={styles.settingsCard} variant="outlined">
              <View style={styles.settingsToggleItem}>
                <View style={styles.settingsItemLeft}>
                  {darkMode ? (
                    <Moon size={20} color="#1E40AF" />
                  ) : (
                    <Sun size={20} color="#1E40AF" />
                  )}
                  <Text style={styles.settingsItemText}>Dark Mode</Text>
                </View>
                <Switch
                  value={darkMode}
                  onValueChange={toggleDarkMode}
                  trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                  thumbColor={darkMode ? '#1E40AF' : '#F9FAFB'}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.settingsToggleItem}>
                <View style={styles.settingsItemLeft}>
                  <Bell size={20} color="#1E40AF" />
                  <Text style={styles.settingsItemText}>Notifications</Text>
                </View>
                <Switch
                  value={notifications}
                  onValueChange={toggleNotifications}
                  trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                  thumbColor={notifications ? '#1E40AF' : '#F9FAFB'}
                />
              </View>
            </Card> */}

            <Text style={styles.sectionTitle}>Support</Text>

            <Card style={styles.settingsCard} variant="flat">
              <TouchableOpacity style={styles.settingsItem}>
                <View style={styles.settingsItemLeft}>
                  <HelpCircle size={20} color="#1E40AF" />
                  <Text style={styles.settingsItemText}>Help & Support</Text>
                </View>
                <ChevronRight size={20} color="#6B7280" />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity style={styles.settingsItem}>
                <View style={styles.settingsItemLeft}>
                  <Shield size={20} color="#1E40AF" />
                  <Text style={styles.settingsItemText}>Privacy Policy</Text>
                </View>
                <ChevronRight size={20} color="#6B7280" />
              </TouchableOpacity>
            </Card>

            <View style={styles.logoutContainer}>
              <Button
                title="Log Out"
                onPress={handleLogout}
                variant="outline"
                icon={<LogOut size={20} color="#DC2626" />}
                style={styles.logoutButton}
                textStyle={styles.logoutText}
                size="medium"
              />
            </View>

            <Text style={styles.versionText}>Version 1.0.0</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  profilesection: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    width: '100%',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    borderRadius: 35,
    backgroundColor: '#4A90E2',
  },
  nameContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 16,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 16,
  },
  infoSection: {
    marginTop: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    marginRight: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#444',
  },

  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  headerLargeTitle: {
    fontSize: 44,
    fontFamily: 'Inter-Bold',
    color: 'red',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  // userName: {
  //   fontSize: 20,
  //   fontWeight: '600',
  //   color: '#1F2937',
  //   marginBottom: 4,
  //   fontFamily: 'Inter-SemiBold',
  // },
  // userRole: {
  //   fontSize: 14,
  //   color: '#1E40AF',
  //   fontWeight: '500',
  //   marginBottom: 4,
  //   fontFamily: 'Inter-Medium',
  // },
  userPhone: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  settingsContainer: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
    fontFamily: 'Inter-SemiBold',
  },
  settingsCard: {
    padding: 0,
    overflow: 'hidden',
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // paddingHorizontal: 14,
    paddingVertical: 4,
    // padding: 16,
  },
  settingsToggleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsItemText: {
    fontSize: 14,
    color: '#1F2937',
    marginLeft: 12,
    fontFamily: 'Inter-Regular',
  },
  // divider: {
  //   height: 1,
  //   backgroundColor: '#E5E7EB',
  // },
  logoutContainer: {
    marginTop: 24,
    marginBottom: 16,
  },
  logoutButton: {
    borderColor: '#FEE2E2',
    backgroundColor: '#FEF2F2',
  },
  logoutText: {
    color: '#DC2626',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 8,
    marginBottom: 24,
    fontFamily: 'Inter-Regular',
  },
});
