// src/screens/orders/OrderDetailScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useOrderStore } from '../../store/orderStore';
import { useAuthStore } from '../../store/authStore';

const STATUS_COLORS = {
  pending: '#ffa500',
  confirmed: '#4a90d9',
  in_progress: '#9b59b6',
  ready: '#2ecc71',
  picked_up: '#95a5a6',
  cancelled: '#e74c3c',
};

const STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  in_progress: 'In Progress',
  ready: 'Ready for Pickup',
  picked_up: 'Picked Up',
  cancelled: 'Cancelled',
};

export default function OrderDetailScreen({ route, navigation }) {
  const { orderId } = route.params;
  const [loading, setLoading] = useState(true);
  
  const { selectedOrder, fetchOrder, updateOrderStatus, clearSelectedOrder } = useOrderStore();
  const { user, isPastryChef, isBarista, isAdmin } = useAuthStore();

  useEffect(() => {
    loadOrder();
    return () => clearSelectedOrder();
  }, [orderId]);

  const loadOrder = async () => {
    setLoading(true);
    await fetchOrder(orderId);
    setLoading(false);
  };

  const handleStatusUpdate = async (newStatus) => {
    Alert.alert(
      'Update Status',
      `Change order status to "${STATUS_LABELS[newStatus]}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            const result = await updateOrderStatus(orderId, newStatus);
            if (result.success) {
              Alert.alert('Success', 'Order status updated');
              loadOrder();
            } else {
              Alert.alert('Error', result.message);
            }
          },
        },
      ]
    );
  };


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#d4a574" />
      </View>
    );
  }

  if (!selectedOrder) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#e74c3c" />
        <Text style={styles.errorText}>Order not found</Text>
      </View>
    );
  }

  const order = selectedOrder;
  const canUpdateStatus = isPastryChef() || isAdmin();
  const canMarkPickedUp = (isBarista() || isAdmin()) && order.status === 'ready';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Order Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.orderNumber}>{order.orderNumber}</Text>
          <Text style={styles.orderDate}>
            Ordered: {format(new Date(order.createdAt), 'MMM d, yyyy h:mm a')}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[order.status] }]}>
          <Text style={styles.statusText}>{STATUS_LABELS[order.status]}</Text>
        </View>
      </View>

      {/* Customer Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customer</Text>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={20} color="#888" />
            <Text style={styles.infoText}>{order.customer.fullName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={20} color="#888" />
            <Text style={styles.infoText}>{order.customer.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={20} color="#888" />
            <Text style={styles.infoText}>{order.customer.phone}</Text>
          </View>
        </View>
      </View>

      {/* Pickup Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pickup Details</Text>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color="#888" />
            <Text style={styles.infoText}>
              {format(new Date(order.pickupDate), 'EEEE, MMMM d, yyyy')}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={20} color="#888" />
            <Text style={styles.infoText}>{order.pickupTime}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="storefront-outline" size={20} color="#888" />
            <Text style={styles.infoText}>
              Order Source: {order.orderSource === 'website' ? 'Website Pre-order' : 'In-Person'}
            </Text>
          </View>
        </View>
      </View>

      {/* Order Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Items</Text>
        <View style={styles.card}>
          {order.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.productName}</Text>
                <Text style={styles.itemQty}>× {item.quantity}</Text>
                {item.customMessage && (
                  <Text style={styles.itemNote}>📝 "{item.customMessage}"</Text>
                )}
                {item.includeCandle && (
                  <Text style={styles.itemNote}>🕯️ Candle included</Text>
                )}
              </View>
              <Text style={styles.itemPrice}>
                ${(item.unitPrice * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
          
          <View style={styles.divider} />
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>${order.subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tax</Text>
            <Text style={styles.totalValue}>${order.tax.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.grandTotalLabel}>Total</Text>
            <Text style={styles.grandTotalValue}>${order.total.toFixed(2)}</Text>
          </View>
        </View>
      </View>


      {/* Order Notes */}
      {order.notes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <View style={styles.card}>
            <Text style={styles.notesText}>{order.notes}</Text>
          </View>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actions}>
        {/* Pastry Chef Actions */}
        {canUpdateStatus && order.status === 'confirmed' && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#9b59b6' }]}
            onPress={() => handleStatusUpdate('in_progress')}
          >
            <Ionicons name="restaurant-outline" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Start Preparing</Text>
          </TouchableOpacity>
        )}

        {canUpdateStatus && order.status === 'in_progress' && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#2ecc71' }]}
            onPress={() => handleStatusUpdate('ready')}
          >
            <Ionicons name="checkmark-circle-outline" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Mark as Ready</Text>
          </TouchableOpacity>
        )}

        {/* Barista Actions */}
        {canMarkPickedUp && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#d4a574' }]}
            onPress={() => handleStatusUpdate('picked_up')}
          >
            <Ionicons name="bag-check-outline" size={24} color="#1a1a2e" />
            <Text style={[styles.actionButtonText, { color: '#1a1a2e' }]}>
              Mark as Picked Up
            </Text>
          </TouchableOpacity>
        )}

        {/* Cancel (Admin only) */}
        {isAdmin() && !['picked_up', 'cancelled'].includes(order.status) && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#e74c3c' }]}
            onPress={() => handleStatusUpdate('cancelled')}
          >
            <Ionicons name="close-circle-outline" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Cancel Order</Text>
          </TouchableOpacity>
        )}
      </View>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 18,
    marginTop: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  orderNumber: {
    color: '#d4a574',
    fontSize: 24,
    fontWeight: '600',
  },
  orderDate: {
    color: '#888',
    fontSize: 14,
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#d4a574',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#2d2d44',
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  infoText: {
    color: '#fff',
    fontSize: 15,
    flex: 1,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  itemQty: {
    color: '#888',
    fontSize: 14,
    marginTop: 2,
  },
  itemNote: {
    color: '#d4a574',
    fontSize: 13,
    marginTop: 4,
    fontStyle: 'italic',
  },
  itemPrice: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#3d3d54',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  totalLabel: {
    color: '#888',
    fontSize: 14,
  },
  totalValue: {
    color: '#fff',
    fontSize: 14,
  },
  grandTotalLabel: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  grandTotalValue: {
    color: '#d4a574',
    fontSize: 22,
    fontWeight: '600',
  },
  notesText: {
    color: '#fff',
    fontSize: 15,
    lineHeight: 22,
  },
  actions: {
    marginTop: 8,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

