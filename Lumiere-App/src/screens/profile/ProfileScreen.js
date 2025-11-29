// src/screens/profile/ProfileScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import { CommonActions } from '@react-navigation/native';
import { navigationRef } from '../../../App';

const ROLE_INFO = {
  admin: { label: 'Administrator', color: '#e74c3c', icon: '👑' },
  pastry_chef: { label: 'Pastry Chef', color: '#9b59b6', icon: '🧁' },
  barista: { label: 'Front End / Barista', color: '#3498db', icon: '☕' },
};

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            // Reset navigation to Login screen
            if (navigationRef.current?.isReady()) {
              navigationRef.current.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                })
              );
            }
          },
        },
      ]
    );
  };

  const roleInfo = ROLE_INFO[user?.role] || ROLE_INFO.barista;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </Text>
        </View>

        <Text style={styles.name}>{user?.fullName}</Text>
        <Text style={styles.email}>{user?.email}</Text>

        <View style={[styles.roleBadge, { backgroundColor: roleInfo.color }]}>
          <Text style={styles.roleIcon}>{roleInfo.icon}</Text>
          <Text style={styles.roleLabel}>{roleInfo.label}</Text>
        </View>
      </View>

      {/* Role Description */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Permissions</Text>
        <View style={styles.card}>
          {user?.role === 'admin' && (
            <>
              <PermissionItem icon="checkmark-circle" text="Manage all orders" />
              <PermissionItem icon="checkmark-circle" text="Manage all inventory" />
              <PermissionItem icon="checkmark-circle" text="Create signup keys" />
              <PermissionItem icon="checkmark-circle" text="Manage workers" />
              <PermissionItem icon="checkmark-circle" text="View analytics" />
            </>
          )}
          {user?.role === 'pastry_chef' && (
            <>
              <PermissionItem icon="checkmark-circle" text="View all orders" />
              <PermissionItem icon="checkmark-circle" text="Mark orders as in progress" />
              <PermissionItem icon="checkmark-circle" text="Mark orders as ready" />
              <PermissionItem icon="checkmark-circle" text="Manage pastry inventory" />
            </>
          )}
          {user?.role === 'barista' && (
            <>
              <PermissionItem icon="checkmark-circle" text="View all orders" />
              <PermissionItem icon="checkmark-circle" text="Create in-person orders" />
              <PermissionItem icon="checkmark-circle" text="Mark orders as picked up" />
              <PermissionItem icon="checkmark-circle" text="Manage barista inventory" />
            </>
          )}
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Tips</Text>
        <View style={styles.card}>
          <Text style={styles.tipText}>
            📅 Use the calendar view to see orders organized by pickup date and time.
          </Text>
          <Text style={styles.tipText}>
            📦 Check inventory alerts regularly to avoid running out of supplies.
          </Text>
          <Text style={styles.tipText}>
            ✉️ Customers receive automatic emails when their order is ready.
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#e74c3c" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={styles.appName}>Lumière Pâtisserie</Text>
        <Text style={styles.appVersion}>Worker App v1.0.0</Text>
      </View>
    </ScrollView>
  );
}

function PermissionItem({ icon, text, negative }) {
  return (
    <View style={styles.permissionItem}>
      <Ionicons
        name={icon}
        size={20}
        color={negative ? '#e74c3c' : '#2ecc71'}
      />
      <Text style={[styles.permissionText, negative && styles.permissionNegative]}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  profileCard: {
    backgroundColor: '#2d2d44',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#d4a574',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    fontSize: 32,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  name: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  email: {
    color: '#888',
    fontSize: 14,
    marginBottom: 16,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  roleIcon: {
    fontSize: 18,
  },
  roleLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#d4a574',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#2d2d44',
    borderRadius: 12,
    padding: 16,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  permissionText: {
    color: '#fff',
    fontSize: 15,
  },
  permissionNegative: {
    color: '#888',
  },
  tipText: {
    color: '#aaa',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 12,
  },
  actions: {
    marginBottom: 32,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e74c3c',
    borderRadius: 12,
  },
  logoutText: {
    color: '#e74c3c',
    fontSize: 16,
    fontWeight: '600',
  },
  appInfo: {
    alignItems: 'center',
  },
  appName: {
    color: '#d4a574',
    fontSize: 16,
    letterSpacing: 2,
  },
  appVersion: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
});

