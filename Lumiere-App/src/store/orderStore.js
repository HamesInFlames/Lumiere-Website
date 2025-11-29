// src/store/orderStore.js
// Zustand store for order management

import { create } from 'zustand';
import api from '../config/api';
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';

export const useOrderStore = create((set, get) => ({
  orders: [],
  calendarData: {},
  selectedOrder: null,
  isLoading: false,
  error: null,
  currentView: 'daily', // daily, weekly, monthly, yearly

  // Fetch orders with optional filters
  fetchOrders: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.view) params.append('view', filters.view);
      if (filters.all) params.append('all', 'true');

      const response = await api.get(`/api/orders?${params.toString()}`);
      
      if (filters.view === 'calendar') {
        set({ calendarData: response.data.data, isLoading: false });
      } else {
        set({ orders: response.data.orders, isLoading: false });
      }
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch orders';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // Fetch orders for calendar view based on current view
  fetchCalendarOrders: async (date = new Date(), view = 'daily') => {
    set({ isLoading: true, error: null, currentView: view });
    
    let startDate, endDate;
    
    switch (view) {
      case 'daily':
        startDate = startOfDay(date);
        endDate = endOfDay(date);
        break;
      case 'weekly':
        startDate = startOfWeek(date, { weekStartsOn: 1 });
        endDate = endOfWeek(date, { weekStartsOn: 1 });
        break;
      case 'monthly':
        startDate = startOfMonth(date);
        endDate = endOfMonth(date);
        break;
      case 'yearly':
        startDate = startOfYear(date);
        endDate = endOfYear(date);
        break;
      default:
        startDate = startOfDay(date);
        endDate = endOfDay(date);
    }

    try {
      const response = await api.get('/api/orders', {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          view: 'calendar',
        },
      });
      
      set({ calendarData: response.data.data, isLoading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch orders';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // Get single order
  fetchOrder: async (orderId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/api/orders/${orderId}`);
      set({ selectedOrder: response.data.order, isLoading: false });
      return { success: true, order: response.data.order };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch order';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // Update order status (for pastry chefs - marking as fulfilled)
  updateOrderStatus: async (orderId, status) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.patch(`/api/orders/${orderId}/status`, { status });
      
      // Update local state
      const { orders } = get();
      const updatedOrders = orders.map(order => 
        order.id === orderId ? { ...order, status } : order
      );
      
      set({ orders: updatedOrders, isLoading: false });
      return { success: true, order: response.data.order };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update order';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // Mark order as paid (for baristas)
  markOrderPaid: async (orderId, paymentMethod = 'cash') => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.patch(`/api/orders/${orderId}/pay`, { paymentMethod });
      
      // Update local state
      const { orders } = get();
      const updatedOrders = orders.map(order => 
        order.id === orderId ? { ...order, isPaid: true } : order
      );
      
      set({ orders: updatedOrders, isLoading: false });
      return { success: true, order: response.data.order };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to mark order as paid';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // Create in-person order (for baristas)
  createInPersonOrder: async (orderData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/api/orders', {
        ...orderData,
        orderSource: 'in_person',
      });
      
      // Add to local state
      const { orders } = get();
      set({ orders: [response.data.order, ...orders], isLoading: false });
      
      return { success: true, order: response.data.order };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create order';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // Set current view
  setCurrentView: (view) => set({ currentView: view }),

  // Clear selected order
  clearSelectedOrder: () => set({ selectedOrder: null }),

  // Clear error
  clearError: () => set({ error: null }),
}));

