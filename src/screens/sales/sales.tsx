import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import BottomNavbar from '../../component/Dashboard/BottomNavbar';
import { useSales, Sale } from '../../context/SalesContext';
import GlobalAIChatButton from '../../component/Dashboard/GlobalAIChatButton';
import NewSaleForm from '../../component/Sales/NewSaleForm';
import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';
import { mobileService, InventoryData } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const SaleItem = ({ item, onDelete }: { item: Sale, onDelete: (id: string) => void }) => (
  <View style={styles.saleCard}>
    <View style={styles.saleHeader}>
      <View style={styles.customerInfo}>
        <Text style={styles.customerName}>{item.customer}</Text>
        <Text style={styles.saleTime}>{item.time}</Text>
      </View>
      <View style={styles.amountInfo}>
        <Text style={styles.saleAmount}>{item.amount}</Text>
        <View style={styles.actionRow}>
          <View style={[styles.statusBadge, item.status === 'Pending' && styles.pendingBadge]}>
            <Text style={[styles.statusText, item.status === 'Pending' && styles.pendingText]}>
              {item.status}
            </Text>
          </View>
          <TouchableOpacity 
            onPress={() => onDelete(item.id)}
            style={styles.deleteIcon}
          >
            <MaterialCommunityIcons name="delete-outline" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </View>
);

const SalesScreen = () => {
  const { sales, totalSales, totalRevenue, refreshData, deleteSale, loading } = useSales();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState<InventoryData[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [user?.businessId]);

  const fetchProducts = async () => {
    if (!user?.businessId) return;
    setLoadingProducts(true);
    try {
      const data = await mobileService.getInventory(user.businessId);
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products for sales form:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleSaleSuccess = () => {
    setShowForm(false);
    refreshData();
  };

  const handleDeleteSale = (id: string) => {
    Alert.alert(
      'Delete Sale',
      'Are you sure you want to remove this record? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteSale(id);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete sale');
            }
          }
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refreshData} />
        }
      >
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.title}>Sales</Text>
              <Text style={styles.subtitle}>Overview of your business earnings</Text>
            </View>
            <TouchableOpacity
              style={styles.headerAddButton}
              onPress={() => setShowForm(!showForm)}
            >
              <MaterialCommunityIcons
                name={showForm ? "chevron-up" : "plus"}
                size={24}
                color="#FFF"
              />
            </TouchableOpacity>
          </View>

          {showForm && (
            <View style={styles.formContainer}>
              {loadingProducts ? (
                <ActivityIndicator color="#000" style={{ marginVertical: 40 }} />
              ) : (
                <NewSaleForm
                  products={products}
                  onCancel={() => setShowForm(false)}
                  onSuccess={handleSaleSuccess}
                />
              )}
              <View style={styles.sectionDivider} />
            </View>
          )}

          {!showForm && (
            <View style={styles.summaryCard}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Today's Revenue</Text>
                <Text style={styles.summaryValue}>$ {totalRevenue.toFixed(2)}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Total Sales</Text>
                <Text style={styles.summaryValue}>{totalSales}</Text>
              </View>
            </View>
          )}

          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          {sales.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="receipt" size={48} color="#D1D5DB" />
              <Text style={styles.emptyText}>No sales recorded yet</Text>
            </View>
          ) : (
            sales.map(sale => (
              <SaleItem 
                key={sale.id} 
                item={sale} 
                onDelete={handleDeleteSale} 
              />
            ))
          )}

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      <GlobalAIChatButton onPress={() => console.log('AI Chat pressed from Sales')} />

      <BottomNavbar activeTab="Sales" />
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#4B5563',
    fontWeight: '500',
  },
  headerAddButton: {
    backgroundColor: '#000',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  formContainer: {
    marginBottom: 24,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginTop: 24,
    marginBottom: 8,
  },
  summaryCard: {
    backgroundColor: '#000000',
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    color: '#9CA3AF',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  summaryValue: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#374151',
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  saleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  saleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  saleTime: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  amountInfo: {
    alignItems: 'flex-end',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteIcon: {
    marginLeft: 12,
    padding: 4,
  },
  saleAmount: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000000',
    marginBottom: 6,
  },
  statusBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
  },
  pendingBadge: {
    backgroundColor: '#FFFBEB',
  },
  pendingText: {
    color: '#D97706',
  },
});

export default SalesScreen;
