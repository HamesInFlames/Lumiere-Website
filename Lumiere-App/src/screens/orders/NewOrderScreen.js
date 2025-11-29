// src/screens/orders/NewOrderScreen.js
// For baristas to create in-person orders
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format, addDays } from 'date-fns';
import { useOrderStore } from '../../store/orderStore';
import api from '../../config/api';

export default function NewOrderScreen({ navigation }) {
  const [customer, setCustomer] = useState({
    fullName: '',
    email: '',
    phone: '',
  });
  const [products, setProducts] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [pickupDate, setPickupDate] = useState(addDays(new Date(), 2));
  const [pickupTime, setPickupTime] = useState('10:00 AM');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const { createInPersonOrder } = useOrderStore();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await api.get('/api/products');
      setProducts(response.data.products || response.data || []);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const addItem = (product) => {
    const existing = selectedItems.find(item => item.productId === product._id);
    if (existing) {
      setSelectedItems(selectedItems.map(item =>
        item.productId === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setSelectedItems([
        ...selectedItems,
        {
          productId: product._id,
          productName: product.name,
          category: product.category,
          price: product.price,
          quantity: 1,
          customMessage: '',
          includeCandle: false,
        },
      ]);
    }
  };

  const updateItemQuantity = (productId, delta) => {
    setSelectedItems(selectedItems.map(item => {
      if (item.productId === productId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const removeItem = (productId) => {
    setSelectedItems(selectedItems.filter(item => item.productId !== productId));
  };

  const calculateTotal = () => {
    const subtotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.13;
    return { subtotal, tax, total: subtotal + tax };
  };

  const handleSubmit = async () => {
    // Validation
    if (!customer.fullName.trim()) {
      Alert.alert('Error', 'Please enter customer name');
      return;
    }
    if (!customer.email.trim()) {
      Alert.alert('Error', 'Please enter customer email');
      return;
    }
    if (!customer.phone.trim()) {
      Alert.alert('Error', 'Please enter customer phone');
      return;
    }
    if (selectedItems.length === 0) {
      Alert.alert('Error', 'Please add at least one item');
      return;
    }

    setLoading(true);

    const result = await createInPersonOrder({
      customer,
      items: selectedItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        customMessage: item.customMessage,
        includeCandle: item.includeCandle,
      })),
      pickupDate: pickupDate.toISOString(),
      pickupTime,
      isPaid: false, // Payment handled physically
      paymentMethod: 'pending',
      notes,
    });

    setLoading(false);

    if (result.success) {
      Alert.alert(
        'Order Created',
        `Order ${result.order.orderNumber} created successfully!`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } else {
      Alert.alert('Error', result.message);
    }
  };

  const { subtotal, tax, total } = calculateTotal();

  const PICKUP_TIMES = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Customer Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customer Information</Text>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#666"
          value={customer.fullName}
          onChangeText={(text) => setCustomer({ ...customer, fullName: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#666"
          value={customer.email}
          onChangeText={(text) => setCustomer({ ...customer, email: text })}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Phone"
          placeholderTextColor="#666"
          value={customer.phone}
          onChangeText={(text) => setCustomer({ ...customer, phone: text })}
          keyboardType="phone-pad"
        />
      </View>

      {/* Products */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Add Items</Text>
        {loadingProducts ? (
          <ActivityIndicator color="#d4a574" />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {products.map((product) => (
              <TouchableOpacity
                key={product._id}
                style={styles.productCard}
                onPress={() => addItem(product)}
              >
                <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
                <View style={styles.addButton}>
                  <Ionicons name="add" size={20} color="#d4a574" />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Selected Items */}
      {selectedItems.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          <View style={styles.card}>
            {selectedItems.map((item) => (
              <View key={item.productId} style={styles.orderItem}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.productName}</Text>
                  <Text style={styles.itemPrice}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </Text>
                </View>
                <View style={styles.quantityControls}>
                  <TouchableOpacity
                    style={styles.qtyButton}
                    onPress={() => updateItemQuantity(item.productId, -1)}
                  >
                    <Ionicons name="remove" size={18} color="#fff" />
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.qtyButton}
                    onPress={() => updateItemQuantity(item.productId, 1)}
                  >
                    <Ionicons name="add" size={18} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeItem(item.productId)}
                  >
                    <Ionicons name="trash-outline" size={18} color="#e74c3c" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>${subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tax (13%)</Text>
              <Text style={styles.totalValue}>${tax.toFixed(2)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.grandTotalLabel}>Total</Text>
              <Text style={styles.grandTotalValue}>${total.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      )}

      {/* Pickup Time */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pickup Time</Text>
        <Text style={styles.dateLabel}>{format(pickupDate, 'EEEE, MMMM d, yyyy')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {PICKUP_TIMES.map((time) => (
            <TouchableOpacity
              key={time}
              style={[
                styles.timeChip,
                pickupTime === time && styles.timeChipActive,
              ]}
              onPress={() => setPickupTime(time)}
            >
              <Text style={[
                styles.timeChipText,
                pickupTime === time && styles.timeChipTextActive,
              ]}>
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>


      {/* Notes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Notes</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Any special instructions..."
          placeholderTextColor="#666"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
        />
      </View>

      {/* Submit */}
      <TouchableOpacity
        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#1a1a2e" />
        ) : (
          <>
            <Ionicons name="checkmark-circle" size={24} color="#1a1a2e" />
            <Text style={styles.submitButtonText}>Create Order</Text>
          </>
        )}
      </TouchableOpacity>
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
  input: {
    backgroundColor: '#2d2d44',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#fff',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3d3d54',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  productCard: {
    backgroundColor: '#2d2d44',
    borderRadius: 12,
    padding: 12,
    width: 120,
    marginRight: 12,
  },
  productName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    height: 36,
  },
  productPrice: {
    color: '#d4a574',
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#3d3d54',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#2d2d44',
    borderRadius: 12,
    padding: 16,
  },
  orderItem: {
    marginBottom: 12,
  },
  itemInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemName: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  itemPrice: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qtyButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#3d3d54',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    width: 32,
    textAlign: 'center',
  },
  removeButton: {
    marginLeft: 'auto',
    padding: 8,
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
  dateLabel: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 12,
  },
  timeChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#2d2d44',
    marginRight: 8,
  },
  timeChipActive: {
    backgroundColor: '#d4a574',
  },
  timeChipText: {
    color: '#888',
    fontSize: 14,
  },
  timeChipTextActive: {
    color: '#1a1a2e',
    fontWeight: '600',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#d4a574',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#d4a574',
  },
  checkboxLabel: {
    color: '#fff',
    fontSize: 16,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#d4a574',
    paddingVertical: 18,
    borderRadius: 12,
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#1a1a2e',
    fontSize: 18,
    fontWeight: '600',
  },
});

