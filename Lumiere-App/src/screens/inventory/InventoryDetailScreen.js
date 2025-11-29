// src/screens/inventory/InventoryDetailScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useInventoryStore } from '../../store/inventoryStore';
import { useAuthStore } from '../../store/authStore';

const ACTION_BUTTONS = [
  { action: 'add', label: 'Add Stock', icon: 'add-circle', color: '#2ecc71' },
  { action: 'remove', label: 'Use Stock', icon: 'remove-circle', color: '#e74c3c' },
  { action: 'adjust', label: 'Adjust', icon: 'create', color: '#f39c12' },
];

export default function InventoryDetailScreen({ route, navigation }) {
  const { itemId } = route.params;
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedAction, setSelectedAction] = useState('add');
  const [updating, setUpdating] = useState(false);

  const { items, itemLogs, fetchItemLogs, updateQuantity, deleteItem } = useInventoryStore();
  const { isAdmin } = useAuthStore();

  useEffect(() => {
    const foundItem = items.find(i => i.id === itemId);
    if (foundItem) {
      setItem(foundItem);
      setLoading(false);
    }
    fetchItemLogs(itemId);
  }, [itemId, items]);

  const handleUpdate = async () => {
    const qty = Number(quantity);
    if (isNaN(qty) || qty <= 0) {
      Alert.alert('Error', 'Please enter a valid quantity');
      return;
    }

    setUpdating(true);
    const result = await updateQuantity(itemId, selectedAction, qty, notes);
    setUpdating(false);

    if (result.success) {
      setQuantity('');
      setNotes('');
      Alert.alert('Success', 'Inventory updated');
      fetchItemLogs(itemId);
    } else {
      Alert.alert('Error', result.message);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete "${item.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteItem(itemId);
            if (result.success) {
              navigation.goBack();
            } else {
              Alert.alert('Error', result.message);
            }
          },
        },
      ]
    );
  };

  if (loading || !item) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#d4a574" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Item Header */}
      <View style={styles.header}>
        <Text style={styles.itemName}>{item.name}</Text>
        <View style={[
          styles.categoryBadge,
          { backgroundColor: item.category === 'pastry' ? '#9b59b6' : item.category === 'barista' ? '#3498db' : '#2ecc71' }
        ]}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
      </View>

      {/* Current Stock */}
      <View style={styles.stockCard}>
        <View style={styles.stockMain}>
          <Text style={[styles.stockValue, item.isLowStock && styles.lowStock]}>
            {item.currentQuantity}
          </Text>
          <Text style={styles.stockUnit}>{item.unit}</Text>
        </View>

        {item.isLowStock && (
          <View style={styles.lowStockBanner}>
            <Ionicons name="warning" size={20} color="#ffa500" />
            <Text style={styles.lowStockText}>Low Stock Alert</Text>
          </View>
        )}

        <View style={styles.stockMeta}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Minimum</Text>
            <Text style={styles.metaValue}>{item.minimumQuantity} {item.unit}</Text>
          </View>
          {item.lastRestocked && (
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Last Restocked</Text>
              <Text style={styles.metaValue}>
                {format(new Date(item.lastRestocked), 'MMM d, yyyy')}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Update Stock */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Update Stock</Text>

        <View style={styles.actionButtons}>
          {ACTION_BUTTONS.map(btn => (
            <TouchableOpacity
              key={btn.action}
              style={[
                styles.actionButton,
                selectedAction === btn.action && { backgroundColor: btn.color },
              ]}
              onPress={() => setSelectedAction(btn.action)}
            >
              <Ionicons
                name={btn.icon}
                size={24}
                color={selectedAction === btn.action ? '#fff' : btn.color}
              />
              <Text style={[
                styles.actionButtonText,
                selectedAction === btn.action && { color: '#fff' },
              ]}>
                {btn.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, styles.quantityInput]}
            placeholder="Quantity"
            placeholderTextColor="#666"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
          />
          <Text style={styles.unitLabel}>{item.unit}</Text>
        </View>

        <TextInput
          style={[styles.input, styles.notesInput]}
          placeholder="Notes (optional)"
          placeholderTextColor="#666"
          value={notes}
          onChangeText={setNotes}
          multiline
        />

        <TouchableOpacity
          style={[styles.updateButton, updating && styles.updateButtonDisabled]}
          onPress={handleUpdate}
          disabled={updating}
        >
          {updating ? (
            <ActivityIndicator color="#1a1a2e" />
          ) : (
            <Text style={styles.updateButtonText}>Update Stock</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Activity Log */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        
        {itemLogs.length > 0 ? (
          <View style={styles.logList}>
            {itemLogs.map((log, index) => (
              <View key={log.id || index} style={styles.logItem}>
                <View style={styles.logIcon}>
                  <Ionicons
                    name={log.quantityChange > 0 ? 'add-circle' : 'remove-circle'}
                    size={20}
                    color={log.quantityChange > 0 ? '#2ecc71' : '#e74c3c'}
                  />
                </View>
                <View style={styles.logContent}>
                  <View style={styles.logHeader}>
                    <Text style={styles.logAction}>{log.action.replace('_', ' ')}</Text>
                    <Text style={styles.logChange}>
                      {log.quantityChange > 0 ? '+' : ''}{log.quantityChange}
                    </Text>
                  </View>
                  <Text style={styles.logMeta}>
                    {log.performedBy} • {format(new Date(log.createdAt), 'MMM d, h:mm a')}
                  </Text>
                  {log.notes && (
                    <Text style={styles.logNotes}>{log.notes}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noLogs}>No activity recorded</Text>
        )}
      </View>

      {/* Delete Button (Admin only) */}
      {isAdmin() && (
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={20} color="#e74c3c" />
          <Text style={styles.deleteButtonText}>Delete Item</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  itemName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
    flex: 1,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  stockCard: {
    backgroundColor: '#2d2d44',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  stockMain: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  stockValue: {
    color: '#fff',
    fontSize: 56,
    fontWeight: '600',
  },
  lowStock: {
    color: '#e74c3c',
  },
  stockUnit: {
    color: '#888',
    fontSize: 20,
  },
  lowStockBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 165, 0, 0.15)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  lowStockText: {
    color: '#ffa500',
    fontSize: 14,
    fontWeight: '600',
  },
  stockMeta: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#3d3d54',
    paddingTop: 16,
  },
  metaItem: {
    alignItems: 'center',
  },
  metaLabel: {
    color: '#888',
    fontSize: 12,
    marginBottom: 4,
  },
  metaValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#d4a574',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#2d2d44',
    gap: 4,
  },
  actionButtonText: {
    color: '#888',
    fontSize: 12,
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#2d2d44',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#3d3d54',
  },
  quantityInput: {
    flex: 1,
    fontSize: 20,
    textAlign: 'center',
  },
  unitLabel: {
    color: '#888',
    fontSize: 16,
    width: 60,
  },
  notesInput: {
    marginBottom: 16,
  },
  updateButton: {
    backgroundColor: '#d4a574',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  updateButtonDisabled: {
    opacity: 0.7,
  },
  updateButtonText: {
    color: '#1a1a2e',
    fontSize: 18,
    fontWeight: '600',
  },
  logList: {
    backgroundColor: '#2d2d44',
    borderRadius: 12,
    overflow: 'hidden',
  },
  logItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3d3d54',
  },
  logIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  logContent: {
    flex: 1,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  logAction: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  logChange: {
    color: '#d4a574',
    fontSize: 14,
    fontWeight: '600',
  },
  logMeta: {
    color: '#888',
    fontSize: 12,
  },
  logNotes: {
    color: '#aaa',
    fontSize: 13,
    marginTop: 4,
    fontStyle: 'italic',
  },
  noLogs: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    padding: 24,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e74c3c',
    borderRadius: 12,
    marginTop: 8,
  },
  deleteButtonText: {
    color: '#e74c3c',
    fontSize: 16,
    fontWeight: '500',
  },
});

