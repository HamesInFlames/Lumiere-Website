// src/navigation/MainTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/authStore';

// Screens
import CalendarScreen from '../screens/calendar/CalendarScreen';
import OrderDetailScreen from '../screens/orders/OrderDetailScreen';
import NewOrderScreen from '../screens/orders/NewOrderScreen';
import InventoryScreen from '../screens/inventory/InventoryScreen';
import InventoryDetailScreen from '../screens/inventory/InventoryDetailScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import AdminScreen from '../screens/admin/AdminScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Calendar/Orders Stack
function OrdersStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#1a1a2e' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Stack.Screen 
        name="Calendar" 
        component={CalendarScreen} 
        options={{ title: 'Orders Calendar' }}
      />
      <Stack.Screen 
        name="OrderDetail" 
        component={OrderDetailScreen} 
        options={{ title: 'Order Details' }}
      />
      <Stack.Screen 
        name="NewOrder" 
        component={NewOrderScreen} 
        options={{ title: 'New Order' }}
      />
    </Stack.Navigator>
  );
}

// Inventory Stack
function InventoryStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#1a1a2e' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Stack.Screen 
        name="InventoryList" 
        component={InventoryScreen} 
        options={{ title: 'Inventory' }}
      />
      <Stack.Screen 
        name="InventoryDetail" 
        component={InventoryDetailScreen} 
        options={{ title: 'Item Details' }}
      />
    </Stack.Navigator>
  );
}

// Admin Stack
function AdminStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#1a1a2e' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Stack.Screen 
        name="AdminPanel" 
        component={AdminScreen} 
        options={{ title: 'Admin Panel' }}
      />
    </Stack.Navigator>
  );
}

export default function MainTabNavigator() {
  const { isAdmin, isBarista } = useAuthStore();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1a1a2e',
          borderTopColor: '#2d2d44',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarActiveTintColor: '#d4a574',
        tabBarInactiveTintColor: '#888',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'OrdersTab':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            case 'InventoryTab':
              iconName = focused ? 'cube' : 'cube-outline';
              break;
            case 'ProfileTab':
              iconName = focused ? 'person' : 'person-outline';
              break;
            case 'AdminTab':
              iconName = focused ? 'settings' : 'settings-outline';
              break;
            default:
              iconName = 'ellipse';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="OrdersTab" 
        component={OrdersStack}
        options={{ tabBarLabel: 'Orders' }}
      />
      <Tab.Screen 
        name="InventoryTab" 
        component={InventoryStack}
        options={{ tabBarLabel: 'Inventory' }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen}
        options={{ 
          tabBarLabel: 'Profile',
          headerShown: true,
          headerStyle: { backgroundColor: '#1a1a2e' },
          headerTintColor: '#fff',
          title: 'My Profile',
        }}
      />
      {isAdmin() && (
        <Tab.Screen 
          name="AdminTab" 
          component={AdminStack}
          options={{ tabBarLabel: 'Admin' }}
        />
      )}
    </Tab.Navigator>
  );
}

