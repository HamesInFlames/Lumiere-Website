// src/screens/inventory/InventoryScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useInventoryStore } from '../../store/inventoryStore';
import { useAuthStore } from '../../store/authStore';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'pastry', label: 'Pastry', icon: '🧁' },
  { id: 'barista', label: 'Barista', icon: '☕' },
  { id: 'shared', label: 'Shared', icon: '📦' },
];

export default function InventoryScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'shared',
    unit: 'pieces',
    currentQuantity: 0,
    minimumQuantity: 0,
  });

  const { items, lowStockAlerts, isLoading, fetchInventory, fetchLowStockAlerts, createItem } = useInventoryStore();
  const { user, isPastryChef, isBarista } = useAuthStore();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([
      fetchInventory(),
      fetchLowStockAlerts(),
    ]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleAddItem = async () => {
    if (!newItem.name.trim()) {
      Alert.alert('Error', 'Please enter item name');
      return;
    }

    const result = await createItem(newItem);
    if (result.success) {
      setShowAddModal(false);
      setNewItem({
        name: '',
        category: 'shared',
        unit: 'pieces',
        currentQuantity: 0,
        minimumQuantity: 0,
      });
      Alert.alert('Success', 'Item added to inventory');
    } else {
      Alert.alert('Error', result.message);
    }
  };

  const filteredItems = selectedCategory === 'all'
    ? items
    : items.filter(item => item.category === selectedCategory);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemCard}
      onPress={() => navigation.navigate('InventoryDetail', { itemId: item.id })}
    >
      <View style={styles.itemHeader}>
        <Text style={styles.itemName}>{item.name}</Text>
        <View style={[
          styles.categoryBadge,
          { backgroundColor: item.category === 'pastry' ? '#9b59b6' : item.category === 'barista' ? '#3498db' : '#2ecc71' }
        ]}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
      </View>

      <View style={styles.itemStats}>
        <View style={styles.quantityContainer}>
          <Text style={[
            styles.quantityValue,
            item.isLowStock && styles.lowStock
          ]}>
            {item.currentQuantity}
          </Text>
          <Text style={styles.quantityUnit}>{item.unit}</Text>
        </View>

        {item.isLowStock && (
          <View style={styles.alertBadge}>
            <Ionicons name="warning" size={14} color="#ffa500" />
            <Text style={styles.alertText}>Low Stock</Text>
          </View>
        )}

        <Ionicons name="chevron-forward" size={24} color="#666" />
      </View>

      {item.minimumQuantity > 0 && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min((item.currentQuantity / (item.minimumQuantity * 3)) * 100, 100)}%`,
                  backgroundColor: item.isLowStock ? '#e74c3c' : '#2ecc71',
                },
              ]}
            />
          </View>
          <Text style={styles.minLabel}>Min: {item.minimumQuantity}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Low Stock Alert Banner */}
      {lowStockAlerts.length > 0 && (
        <TouchableOpacity
          style={styles.alertBanner}
          onPress={() => setSelectedCategory('all')}
        >
          <Ionicons name="warning" size={20} color="#ffa500" />
          <Text style={styles.alertBannerText}>
            {lowStockAlerts.length} item{lowStockAlerts.length > 1 ? 's' : ''} running low
          </Text>
        </TouchableOpacity>
      )}

      {/* Category Filter */}
      <View style={styles.categoryFilter}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoryChip,
              selectedCategory === cat.id && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(cat.id)}
          >
            {cat.icon && <Text style={styles.categoryIcon}>{cat.icon}</Text>}
            <Text style={[
              styles.categoryChipText,
              selectedCategory === cat.id && styles.categoryChipTextActive,
            ]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Inventory List */}
      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#d4a574" />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="cube-outline" size={48} color="#444" />
            <Text style={styles.emptyText}>No inventory items</Text>
          </View>
        }
      />

      {/* Add Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowAddModal(true)}
      >
        <Ionicons name="add" size={28} color="#1a1a2e" />
      </TouchableOpacity>

      {/* Add Item Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Inventory Item</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color="#888" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Item Name"
              placeholderTextColor="#666"
              value={newItem.name}
              onChangeText={(text) => setNewItem({ ...newItem, name: text })}
            />

            <Text style={styles.inputLabel}>Category</Text>
            <View style={styles.categorySelect}>
              {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryOption,
                    newItem.category === cat.id && styles.categoryOptionActive,
                  ]}
                  onPress={() => setNewItem({ ...newItem, category: cat.id })}
                >
                  <Text style={styles.categoryOptionIcon}>{cat.icon}</Text>
                  <Text style={[
                    styles.categoryOptionText,
                    newItem.category === cat.id && styles.categoryOptionTextActive,
                  ]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.input}
              placeholder="Unit (e.g., pieces, kg, liters)"
              placeholderTextColor="#666"
              value={newItem.unit}
              onChangeText={(text) => setNewItem({ ...newItem, unit: text })}
            />

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.inputLabel}>Current Qty</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor="#666"
                  value={String(newItem.currentQuantity)}
                  onChangeText={(text) => setNewItem({ ...newItem, currentQuantity: Number(text) || 0 })}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.inputLabel}>Min Qty</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor="#666"
                  value={String(newItem.minimumQuantity)}
                  onChangeText={(text) => setNewItem({ ...newItem, minimumQuantity: Number(text) || 0 })}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleAddItem}
            >
              <Text style={styles.submitButtonText}>Add Item</Text>
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
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 165, 0, 0.15)',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 165, 0, 0.3)',
  },
  alertBannerText: {
    color: '#ffa500',
    fontSize: 14,
    fontWeight: '500',
  },
  categoryFilter: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#2d2d44',
  },
  categoryChipActive: {
    backgroundColor: '#d4a574',
  },
  categoryIcon: {
    fontSize: 14,
  },
  categoryChipText: {
    color: '#888',
    fontSize: 13,
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: '#1a1a2e',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  itemCard: {
    backgroundColor: '#2d2d44',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    flex: 1,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  itemStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  quantityValue: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '600',
  },
  lowStock: {
    color: '#e74c3c',
  },
  quantityUnit: {
    color: '#888',
    fontSize: 14,
  },
  alertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 165, 0, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  alertText: {
    color: '#ffa500',
    fontSize: 12,
    fontWeight: '500',
  },
  progressContainer: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#3d3d54',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  minLabel: {
    color: '#888',
    fontSize: 12,
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
  categorySelect: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  categoryOption: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#2d2d44',
  },
  categoryOptionActive: {
    backgroundColor: '#d4a574',
  },
  categoryOptionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryOptionText: {
    color: '#888',
    fontSize: 12,
  },
  categoryOptionTextActive: {
    color: '#1a1a2e',
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
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

