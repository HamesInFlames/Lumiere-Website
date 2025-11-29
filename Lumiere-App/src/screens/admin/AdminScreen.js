// src/screens/admin/AdminScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  FlatList,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import api from '../../config/api';

export default function AdminScreen() {
  const [activeTab, setActiveTab] = useState('keys');
  const [signupKeys, setSignupKeys] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddKeyModal, setShowAddKeyModal] = useState(false);
  const [newKey, setNewKey] = useState({
    key: '',
    role: 'barista',
    description: '',
    maxUsage: '',
  });

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'keys') {
        const response = await api.get('/api/auth/signup-keys');
        setSignupKeys(response.data.keys);
      } else {
        const response = await api.get('/api/auth/workers');
        setWorkers(response.data.workers);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleCreateKey = async () => {
    if (!newKey.key.trim()) {
      Alert.alert('Error', 'Please enter a signup key');
      return;
    }

    try {
      await api.post('/api/auth/signup-keys', {
        key: newKey.key.trim().toUpperCase(),
        role: newKey.role,
        description: newKey.description,
        maxUsage: newKey.maxUsage ? Number(newKey.maxUsage) : null,
      });

      setShowAddKeyModal(false);
      setNewKey({ key: '', role: 'barista', description: '', maxUsage: '' });
      loadData();
      Alert.alert('Success', 'Signup key created');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to create key');
    }
  };

  const handleDeactivateKey = async (keyId) => {
    Alert.alert(
      'Deactivate Key',
      'This key will no longer work for new signups. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Deactivate',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/api/auth/signup-keys/${keyId}`);
              loadData();
            } catch (error) {
              Alert.alert('Error', 'Failed to deactivate key');
            }
          },
        },
      ]
    );
  };

  const handleToggleWorker = async (workerId, currentStatus) => {
    const action = currentStatus ? 'deactivate' : 'activate';
    Alert.alert(
      `${action.charAt(0).toUpperCase() + action.slice(1)} Worker`,
      `Are you sure you want to ${action} this worker?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              await api.patch(`/api/auth/workers/${workerId}/toggle-active`);
              loadData();
            } catch (error) {
              Alert.alert('Error', 'Failed to update worker');
            }
          },
        },
      ]
    );
  };

  const renderKeyItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.keyInfo}>
          <Text style={styles.keyValue}>{item.key}</Text>
          <View style={[
            styles.roleBadge,
            { backgroundColor: item.role === 'pastry_chef' ? '#9b59b6' : '#3498db' }
          ]}>
            <Text style={styles.roleText}>
              {item.role === 'pastry_chef' ? '🧁 Pastry Chef' : '☕ Barista'}
            </Text>
          </View>
        </View>
        <View style={[
          styles.statusIndicator,
          { backgroundColor: item.isValid ? '#2ecc71' : '#e74c3c' }
        ]} />
      </View>

      {item.description && (
        <Text style={styles.description}>{item.description}</Text>
      )}

      <View style={styles.cardMeta}>
        <Text style={styles.metaText}>
          Used: {item.usageCount}{item.maxUsage ? ` / ${item.maxUsage}` : ''}
        </Text>
        <Text style={styles.metaText}>
          Created: {format(new Date(item.createdAt), 'MMM d, yyyy')}
        </Text>
      </View>

      {item.isActive && (
        <TouchableOpacity
          style={styles.deactivateButton}
          onPress={() => handleDeactivateKey(item.id)}
        >
          <Text style={styles.deactivateText}>Deactivate</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderWorkerItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.workerName}>{item.fullName}</Text>
          <Text style={styles.workerEmail}>{item.email}</Text>
        </View>
        <View style={[
          styles.statusIndicator,
          { backgroundColor: item.isActive ? '#2ecc71' : '#e74c3c' }
        ]} />
      </View>

      <View style={[
        styles.roleBadge,
        { backgroundColor: item.role === 'pastry_chef' ? '#9b59b6' : '#3498db', alignSelf: 'flex-start' }
      ]}>
        <Text style={styles.roleText}>
          {item.role === 'pastry_chef' ? '🧁 Pastry Chef' : '☕ Barista'}
        </Text>
      </View>

      <View style={styles.cardMeta}>
        <Text style={styles.metaText}>
          Joined: {format(new Date(item.createdAt), 'MMM d, yyyy')}
        </Text>
        {item.lastLogin && (
          <Text style={styles.metaText}>
            Last login: {format(new Date(item.lastLogin), 'MMM d, h:mm a')}
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.toggleButton,
          { borderColor: item.isActive ? '#e74c3c' : '#2ecc71' }
        ]}
        onPress={() => handleToggleWorker(item.id, item.isActive)}
      >
        <Text style={[
          styles.toggleText,
          { color: item.isActive ? '#e74c3c' : '#2ecc71' }
        ]}>
          {item.isActive ? 'Deactivate' : 'Activate'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'keys' && styles.tabActive]}
          onPress={() => setActiveTab('keys')}
        >
          <Ionicons
            name="key"
            size={20}
            color={activeTab === 'keys' ? '#d4a574' : '#888'}
          />
          <Text style={[styles.tabText, activeTab === 'keys' && styles.tabTextActive]}>
            Signup Keys
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'workers' && styles.tabActive]}
          onPress={() => setActiveTab('workers')}
        >
          <Ionicons
            name="people"
            size={20}
            color={activeTab === 'workers' ? '#d4a574' : '#888'}
          />
          <Text style={[styles.tabText, activeTab === 'workers' && styles.tabTextActive]}>
            Workers
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <FlatList
        data={activeTab === 'keys' ? signupKeys : workers}
        renderItem={activeTab === 'keys' ? renderKeyItem : renderWorkerItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#d4a574" />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons
              name={activeTab === 'keys' ? 'key-outline' : 'people-outline'}
              size={48}
              color="#444"
            />
            <Text style={styles.emptyText}>
              No {activeTab === 'keys' ? 'signup keys' : 'workers'} yet
            </Text>
          </View>
        }
      />

      {/* Add Key FAB */}
      {activeTab === 'keys' && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setShowAddKeyModal(true)}
        >
          <Ionicons name="add" size={28} color="#1a1a2e" />
        </TouchableOpacity>
      )}

      {/* Add Key Modal */}
      <Modal
        visible={showAddKeyModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowAddKeyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Signup Key</Text>
              <TouchableOpacity onPress={() => setShowAddKeyModal(false)}>
                <Ionicons name="close" size={24} color="#888" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Signup Key (e.g., PASTRY2024)"
              placeholderTextColor="#666"
              value={newKey.key}
              onChangeText={(text) => setNewKey({ ...newKey, key: text.toUpperCase() })}
              autoCapitalize="characters"
            />

            <Text style={styles.inputLabel}>Role</Text>
            <View style={styles.roleSelect}>
              <TouchableOpacity
                style={[
                  styles.roleOption,
                  newKey.role === 'pastry_chef' && styles.roleOptionActive,
                ]}
                onPress={() => setNewKey({ ...newKey, role: 'pastry_chef' })}
              >
                <Text style={styles.roleOptionIcon}>🧁</Text>
                <Text style={[
                  styles.roleOptionText,
                  newKey.role === 'pastry_chef' && styles.roleOptionTextActive,
                ]}>
                  Pastry Chef
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.roleOption,
                  newKey.role === 'barista' && styles.roleOptionActive,
                ]}
                onPress={() => setNewKey({ ...newKey, role: 'barista' })}
              >
                <Text style={styles.roleOptionIcon}>☕</Text>
                <Text style={[
                  styles.roleOptionText,
                  newKey.role === 'barista' && styles.roleOptionTextActive,
                ]}>
                  Barista
                </Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Description (optional)"
              placeholderTextColor="#666"
              value={newKey.description}
              onChangeText={(text) => setNewKey({ ...newKey, description: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="Max Usage (leave empty for unlimited)"
              placeholderTextColor="#666"
              value={newKey.maxUsage}
              onChangeText={(text) => setNewKey({ ...newKey, maxUsage: text })}
              keyboardType="numeric"
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleCreateKey}>
              <Text style={styles.submitButtonText}>Create Key</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  tabs: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#2d2d44',
  },
  tabActive: {
    backgroundColor: '#3d3d54',
    borderWidth: 1,
    borderColor: '#d4a574',
  },
  tabText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#d4a574',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#2d2d44',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  keyInfo: {
    flex: 1,
  },
  keyValue: {
    color: '#d4a574',
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  description: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 12,
  },
  cardMeta: {
    borderTopWidth: 1,
    borderTopColor: '#3d3d54',
    paddingTop: 12,
    gap: 4,
  },
  metaText: {
    color: '#888',
    fontSize: 12,
  },
  workerName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  workerEmail: {
    color: '#888',
    fontSize: 14,
    marginTop: 2,
  },
  deactivateButton: {
    marginTop: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e74c3c',
    borderRadius: 8,
    alignItems: 'center',
  },
  deactivateText: {
    color: '#e74c3c',
    fontSize: 14,
    fontWeight: '500',
  },
  toggleButton: {
    marginTop: 12,
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    marginTop: 12,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#d4a574',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1a1a2e',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#2d2d44',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#fff',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#3d3d54',
  },
  inputLabel: {
    color: '#d4a574',
    fontSize: 14,
    marginBottom: 8,
  },
  roleSelect: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  roleOption: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#2d2d44',
  },
  roleOptionActive: {
    backgroundColor: '#d4a574',
  },
  roleOptionIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  roleOptionText: {
    color: '#888',
    fontSize: 13,
  },
  roleOptionTextActive: {
    color: '#1a1a2e',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#d4a574',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#1a1a2e',
    fontSize: 18,
    fontWeight: '600',
  },
});

