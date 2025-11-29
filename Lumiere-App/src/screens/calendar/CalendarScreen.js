// src/screens/calendar/CalendarScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, eachHourOfInterval, startOfDay, endOfDay, setHours, isToday } from 'date-fns';
import { useOrderStore } from '../../store/orderStore';
import { useAuthStore } from '../../store/authStore';

const VIEW_OPTIONS = [
  { id: 'daily', label: 'Day' },
  { id: 'weekly', label: 'Week' },
  { id: 'monthly', label: 'Month' },
];

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
  ready: 'Ready',
  picked_up: 'Picked Up',
  cancelled: 'Cancelled',
};

export default function CalendarScreen({ navigation }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('weekly');
  const [refreshing, setRefreshing] = useState(false);
  
  const { calendarData, isLoading, fetchCalendarOrders } = useOrderStore();
  const { isBarista } = useAuthStore();

  useEffect(() => {
    loadOrders();
  }, [selectedDate, currentView]);

  const loadOrders = async () => {
    await fetchCalendarOrders(selectedDate, currentView);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const getMarkedDates = () => {
    const marked = {};
    const selectedStr = format(selectedDate, 'yyyy-MM-dd');
    
    // Mark dates with orders
    Object.keys(calendarData).forEach(date => {
      const orders = calendarData[date];
      if (orders && orders.length > 0) {
        marked[date] = {
          marked: true,
          dotColor: '#d4a574',
          selected: date === selectedStr,
          selectedColor: '#d4a574',
        };
      }
    });
    
    // Always mark selected date (even if no orders)
    if (!marked[selectedStr]) {
      marked[selectedStr] = {
        selected: true,
        selectedColor: '#d4a574',
      };
    }
    
    // Mark today
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    if (marked[todayStr] && todayStr !== selectedStr) {
      marked[todayStr].today = true;
      marked[todayStr].todayTextColor = '#d4a574';
    } else if (!marked[todayStr]) {
      marked[todayStr] = {
        today: true,
        todayTextColor: '#d4a574',
      };
    }
    
    return marked;
  };

  const getOrdersForDate = (date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return calendarData[dateKey] || [];
  };

  const getOrdersForSelectedDate = () => {
    return getOrdersForDate(selectedDate);
  };

  const getWeekDays = () => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 0 }); // Sunday
    return eachDayOfInterval({ start, end: addDays(start, 6) });
  };

  const getHourlyOrders = () => {
    const orders = getOrdersForSelectedDate();
    const hourlyData = {};
    
    // Initialize hours (8 AM to 6 PM)
    for (let hour = 8; hour <= 18; hour++) {
      const timeStr = format(setHours(new Date(), hour), 'h:00 a');
      hourlyData[timeStr] = [];
    }
    
    // Sort orders into hours
    orders.forEach(order => {
      const pickupTime = order.pickupTime;
      // Parse time (e.g., "10:00 AM" or "2:30 PM")
      const timeMatch = pickupTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (timeMatch) {
        let hour = parseInt(timeMatch[1]);
        const minutes = parseInt(timeMatch[2]);
        const period = timeMatch[3].toUpperCase();
        
        if (period === 'PM' && hour !== 12) hour += 12;
        if (period === 'AM' && hour === 12) hour = 0;
        
        const timeKey = format(setHours(new Date(), hour), 'h:00 a');
        if (hourlyData[timeKey]) {
          hourlyData[timeKey].push(order);
        }
      }
    });
    
    return Object.entries(hourlyData).map(([time, orders]) => ({
      time,
      orders,
    }));
  };

  const handleDayPress = (day) => {
    setSelectedDate(new Date(day.dateString));
  };

  const renderOrderCard = ({ item }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderNumber}>{item.orderNumber}</Text>
        <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[item.status] }]}>
          <Text style={styles.statusText}>{STATUS_LABELS[item.status]}</Text>
        </View>
      </View>
      
      <Text style={styles.customerName}>{item.customerName}</Text>
      
      <View style={styles.orderMeta}>
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={14} color="#888" />
          <Text style={styles.metaText}>{item.pickupTime}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="cart-outline" size={14} color="#888" />
          <Text style={styles.metaText}>{item.itemCount} items</Text>
        </View>
      </View>
      
      <Text style={styles.orderTotal}>${item.total.toFixed(2)}</Text>
    </TouchableOpacity>
  );

  const renderHourlySlot = ({ item }) => (
    <View style={styles.hourlySlot}>
      <Text style={styles.hourLabel}>{item.time}</Text>
      <View style={styles.hourOrders}>
        {item.orders.length > 0 ? (
          item.orders.map(order => (
            <TouchableOpacity
              key={order.id}
              style={[styles.hourOrderCard, { borderLeftColor: STATUS_COLORS[order.status] }]}
              onPress={() => navigation.navigate('OrderDetail', { orderId: order.id })}
            >
              <Text style={styles.hourOrderNumber}>{order.orderNumber}</Text>
              <Text style={styles.hourCustomer} numberOfLines={1}>{order.customerName}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyHour} />
        )}
      </View>
    </View>
  );

  const renderWeeklyView = () => {
    const weekDays = getWeekDays();
    
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.weeklyContainer}>
        <View style={styles.weeklyGrid}>
          {weekDays.map((day, index) => {
            const dayOrders = getOrdersForDate(day);
            const isSelected = format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
            const isTodayDate = isToday(day);
            
            return (
              <View key={index} style={styles.weekDayColumn}>
                <TouchableOpacity
                  style={[
                    styles.weekDayHeader,
                    isSelected && styles.weekDayHeaderSelected,
                    isTodayDate && !isSelected && styles.weekDayHeaderToday,
                  ]}
                  onPress={() => handleDayPress({ dateString: format(day, 'yyyy-MM-dd') })}
                >
                  <Text style={[styles.weekDayName, isSelected && styles.weekDayNameSelected]}>
                    {format(day, 'EEE')}
                  </Text>
                  <Text style={[styles.weekDayNumber, isSelected && styles.weekDayNumberSelected]}>
                    {format(day, 'd')}
                  </Text>
                </TouchableOpacity>
                <ScrollView style={styles.weekDayOrders}>
                  {dayOrders.map(order => (
                    <TouchableOpacity
                      key={order.id}
                      style={[styles.weekOrderCard, { borderLeftColor: STATUS_COLORS[order.status] }]}
                      onPress={() => navigation.navigate('OrderDetail', { orderId: order.id })}
                    >
                      <Text style={styles.weekOrderTime}>{order.pickupTime}</Text>
                      <Text style={styles.weekOrderNumber} numberOfLines={1}>{order.orderNumber}</Text>
                      <Text style={styles.weekOrderCustomer} numberOfLines={1}>{order.customerName}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            );
          })}
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {/* View Selector */}
      <View style={styles.viewSelector}>
        {VIEW_OPTIONS.map(option => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.viewOption,
              currentView === option.id && styles.viewOptionActive,
            ]}
            onPress={() => setCurrentView(option.id)}
          >
            <Text
              style={[
                styles.viewOptionText,
                currentView === option.id && styles.viewOptionTextActive,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Calendar (for monthly view) */}
      {currentView === 'monthly' && (
        <Calendar
          current={format(selectedDate, 'yyyy-MM-dd')}
          onDayPress={handleDayPress}
          markedDates={getMarkedDates()}
          theme={{
            backgroundColor: '#1a1a2e',
            calendarBackground: '#1a1a2e',
            textSectionTitleColor: '#d4a574',
            selectedDayBackgroundColor: '#d4a574',
            selectedDayTextColor: '#1a1a2e',
            todayTextColor: '#d4a574',
            dayTextColor: '#fff',
            textDisabledColor: '#444',
            dotColor: '#d4a574',
            selectedDotColor: '#1a1a2e',
            arrowColor: '#d4a574',
            monthTextColor: '#fff',
            textMonthFontWeight: '600',
            textDayHeaderFontWeight: '500',
            textDayFontWeight: '400',
          }}
          style={styles.calendar}
        />
      )}

      {/* Date Navigation (for daily/weekly) */}
      {currentView !== 'monthly' && (
        <View style={styles.dateNav}>
          <TouchableOpacity
            onPress={() => setSelectedDate(addDays(selectedDate, currentView === 'daily' ? -1 : -7))}
          >
            <Ionicons name="chevron-back" size={28} color="#d4a574" />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => setSelectedDate(new Date())}>
            <Text style={styles.todayButton}>Today</Text>
          </TouchableOpacity>
          
          <Text style={styles.dateTitle}>
            {currentView === 'daily'
              ? format(selectedDate, 'EEEE, MMMM d, yyyy')
              : `${format(startOfWeek(selectedDate, { weekStartsOn: 0 }), 'MMM d')} - ${format(endOfWeek(selectedDate, { weekStartsOn: 0 }), 'MMM d, yyyy')}`
            }
          </Text>
          
          <TouchableOpacity
            onPress={() => setSelectedDate(addDays(selectedDate, currentView === 'daily' ? 1 : 7))}
          >
            <Ionicons name="chevron-forward" size={28} color="#d4a574" />
          </TouchableOpacity>
        </View>
      )}

      {/* Orders List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#d4a574" />
        </View>
      ) : currentView === 'weekly' ? (
        renderWeeklyView()
      ) : currentView === 'daily' ? (
        <FlatList
          data={getHourlyOrders()}
          renderItem={renderHourlySlot}
          keyExtractor={(item) => item.time}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#d4a574" />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={48} color="#444" />
              <Text style={styles.emptyText}>No orders for this day</Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={getOrdersForSelectedDate()}
          renderItem={renderOrderCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#d4a574" />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={48} color="#444" />
              <Text style={styles.emptyText}>No orders for this date</Text>
            </View>
          }
        />
      )}

      {/* FAB for baristas to add in-person orders */}
      {isBarista() && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('NewOrder')}
        >
          <Ionicons name="add" size={28} color="#1a1a2e" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  viewSelector: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
    backgroundColor: '#2d2d44',
    borderBottomWidth: 1,
    borderBottomColor: '#3d3d5c',
  },
  viewOption: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
  },
  viewOptionActive: {
    backgroundColor: '#d4a574',
  },
  viewOptionText: {
    color: '#888',
    fontWeight: '500',
    fontSize: 14,
  },
  viewOptionTextActive: {
    color: '#1a1a2e',
    fontWeight: '600',
  },
  calendar: {
    borderBottomWidth: 1,
    borderBottomColor: '#2d2d44',
    paddingBottom: 10,
  },
  dateNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2d2d44',
    backgroundColor: '#1a1a2e',
  },
  todayButton: {
    color: '#d4a574',
    fontSize: 14,
    fontWeight: '500',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  dateTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  orderCard: {
    backgroundColor: '#2d2d44',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderNumber: {
    color: '#d4a574',
    fontSize: 16,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  customerName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
  },
  orderMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: '#888',
    fontSize: 13,
  },
  orderTotal: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'right',
  },
  hourlySlot: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#2d2d44',
    minHeight: 60,
  },
  hourLabel: {
    width: 80,
    color: '#888',
    fontSize: 13,
    paddingTop: 12,
    paddingRight: 12,
    textAlign: 'right',
  },
  hourOrders: {
    flex: 1,
    paddingVertical: 8,
    gap: 4,
  },
  hourOrderCard: {
    backgroundColor: '#2d2d44',
    borderRadius: 8,
    padding: 10,
    borderLeftWidth: 3,
    marginBottom: 4,
  },
  hourOrderNumber: {
    color: '#d4a574',
    fontSize: 13,
    fontWeight: '600',
  },
  hourCustomer: {
    color: '#fff',
    fontSize: 14,
  },
  emptyHour: {
    height: 40,
  },
  weeklyContainer: {
    flex: 1,
  },
  weeklyGrid: {
    flexDirection: 'row',
    flex: 1,
  },
  weekDayColumn: {
    width: 120,
    borderRightWidth: 1,
    borderRightColor: '#2d2d44',
    backgroundColor: '#1a1a2e',
  },
  weekDayHeader: {
    padding: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#2d2d44',
    backgroundColor: '#1a1a2e',
  },
  weekDayHeaderSelected: {
    backgroundColor: '#d4a574',
  },
  weekDayHeaderToday: {
    borderTopWidth: 2,
    borderTopColor: '#d4a574',
  },
  weekDayName: {
    color: '#888',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  weekDayNameSelected: {
    color: '#1a1a2e',
  },
  weekDayNumber: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  weekDayNumberSelected: {
    color: '#1a1a2e',
  },
  weekDayOrders: {
    flex: 1,
  },
  weekOrderCard: {
    backgroundColor: '#2d2d44',
    margin: 4,
    padding: 8,
    borderRadius: 6,
    borderLeftWidth: 3,
  },
  weekOrderTime: {
    color: '#d4a574',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 2,
  },
  weekOrderNumber: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  weekOrderCustomer: {
    color: '#888',
    fontSize: 11,
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
});
