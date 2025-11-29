// src/store/inventoryStore.js
// Zustand store for inventory management

import { create } from 'zustand';
import api from '../config/api';

export const useInventoryStore = create((set, get) => ({
  items: [],
  lowStockAlerts: [],
  selectedItem: null,
  itemLogs: [],
  isLoading: false,
  error: null,

  // Fetch all inventory items
  fetchInventory: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.lowStock) params.append('lowStock', 'true');

      const response = await api.get(`/api/inventory?${params.toString()}`);
      set({ items: response.data.items, isLoading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch inventory';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // Fetch low stock alerts
  fetchLowStockAlerts: async () => {
    try {
      const response = await api.get('/api/inventory/alerts');
      set({ lowStockAlerts: response.data.items });
      return { success: true, count: response.data.count };
    } catch (error) {
      console.error('Failed to fetch low stock alerts:', error);
      return { success: false };
    }
  },

  // Create new inventory item
  createItem: async (itemData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/api/inventory', itemData);
      
      // Add to local state
      const { items } = get();
      set({ items: [...items, response.data.item], isLoading: false });
      
      return { success: true, item: response.data.item };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create item';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // Update inventory quantity
  updateQuantity: async (itemId, action, quantity, notes = '') => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.patch(`/api/inventory/${itemId}/quantity`, {
        action,
        quantity,
        notes,
      });
      
      // Update local state
      const { items } = get();
      const updatedItems = items.map(item => 
        item.id === itemId 
          ? { ...item, currentQuantity: response.data.item.currentQuantity, isLowStock: response.data.item.isLowStock }
          : item
      );
      
      set({ items: updatedItems, isLoading: false });
      return { success: true, item: response.data.item };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update quantity';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // Update inventory item details
  updateItem: async (itemId, itemData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put(`/api/inventory/${itemId}`, itemData);
      
      // Update local state
      const { items } = get();
      const updatedItems = items.map(item => 
        item.id === itemId ? { ...item, ...response.data.item } : item
      );
      
      set({ items: updatedItems, isLoading: false });
      return { success: true, item: response.data.item };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update item';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // Delete inventory item (admin only)
  deleteItem: async (itemId) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/api/inventory/${itemId}`);
      
      // Remove from local state
      const { items } = get();
      const filteredItems = items.filter(item => item.id !== itemId);
      
      set({ items: filteredItems, isLoading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete item';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // Fetch item logs
  fetchItemLogs: async (itemId, limit = 50) => {
    try {
      const response = await api.get(`/api/inventory/${itemId}/logs?limit=${limit}`);
      set({ itemLogs: response.data.logs });
      return { success: true, logs: response.data.logs };
    } catch (error) {
      console.error('Failed to fetch item logs:', error);
      return { success: false };
    }
  },

  // End of day bulk update
  endOfDayUpdate: async (updates) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/api/inventory/end-of-day', { updates });
      
      // Refresh inventory after bulk update
      await get().fetchInventory();
      
      set({ isLoading: false });
      return { success: true, results: response.data.results };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update inventory';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // Set selected item
  setSelectedItem: (item) => set({ selectedItem: item }),

  // Clear selected item
  clearSelectedItem: () => set({ selectedItem: null, itemLogs: [] }),

  // Clear error
  clearError: () => set({ error: null }),
}));

