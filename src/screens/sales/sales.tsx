import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import BottomNavbar from '../../component/Dashboard/BottomNavbar';
import { useSales, Sale } from '../../context/SalesContext';
import GlobalAIChatButton from '../../component/Dashboard/GlobalAIChatButton';

const SaleItem = ({ item }: { item: Sale }) => (
  <View style={styles.saleCard}>
    <View style={styles.saleHeader}>
      <View style={styles.customerInfo}>
        <Text style={styles.customerName}>{item.customer}</Text>
        <Text style={styles.saleTime}>{item.time}</Text>
      </View>
      <View style={styles.amountInfo}>
        <Text style={styles.saleAmount}>{item.amount}</Text>
        <View style={[styles.statusBadge, item.status === 'Pending' && styles.pendingBadge]}>
          <Text style={[styles.statusText, item.status === 'Pending' && styles.pendingText]}>
            {item.status}
          </Text>
        </View>
      </View>
    </View>
  </View>
);

const SalesScreen = () => {
  const { sales, totalSales, totalRevenue } = useSales();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>Sales</Text>
          <Text style={styles.subtitle}>Overview of your business earnings</Text>

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

          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          {sales.map(sale => (
            <SaleItem key={sale.id} item={sale} />
          ))}
          
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
    backgroundColor: '#E5E7EB',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
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
    marginBottom: 24,
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
