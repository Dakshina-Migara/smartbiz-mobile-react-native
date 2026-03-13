import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import BottomNavbar from '../../component/Dashboard/BottomNavbar';
import Icon from '@react-native-vector-icons/material-design-icons';

const RECENT_INVOICES = [
  { id: '1', number: 'INV-2024-001', customer: 'Acme Corp', date: 'Mar 12, 2024', status: 'Paid', amount: '$1,250.00' },
  { id: '2', number: 'INV-2024-002', customer: 'Global Tech', date: 'Mar 10, 2024', status: 'Pending', amount: '$840.00' },
  { id: '3', number: 'INV-2024-003', customer: 'Local Shop', date: 'Mar 05, 2024', status: 'Overdue', amount: '$210.00' },
  { id: '4', number: 'INV-2024-004', customer: 'Individual Biz', date: 'Feb 28, 2024', status: 'Paid', amount: '$450.00' },
];

const InvoiceItem = ({ item }: { item: typeof RECENT_INVOICES[0] }) => (
  <View style={styles.invoiceCard}>
    <View style={styles.invoiceInfo}>
      <Text style={styles.invoiceNumber}>{item.number}</Text>
      <Text style={styles.customerName}>{item.customer}</Text>
      <Text style={styles.invoiceDate}>{item.date}</Text>
    </View>
    <View style={styles.statusInfo}>
      <Text style={styles.invoiceAmount}>{item.amount}</Text>
      <View style={[
        styles.statusBadge, 
        item.status === 'Pending' && styles.pendingBadge,
        item.status === 'Overdue' && styles.overdueBadge
      ]}>
        <Text style={[
          styles.statusText,
          item.status === 'Pending' && styles.pendingText,
          item.status === 'Overdue' && styles.overdueText
        ]}>
          {item.status}
        </Text>
      </View>
    </View>
  </View>
);

import GlobalAIChatButton from '../../component/Dashboard/GlobalAIChatButton';

const InvoiceScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Invoices</Text>
        <Text style={styles.subtitle}>Manage your billing and payments</Text>

        <TouchableOpacity style={styles.createButton}>
          <Icon name="plus" size={24} color="#FFFFFF" />
          <Text style={styles.createButtonText}>Create New Invoice</Text>
        </TouchableOpacity>

        <FlatList
          data={RECENT_INVOICES}
          renderItem={({ item }) => <InvoiceItem item={item} />}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>

      <GlobalAIChatButton onPress={() => console.log('AI Chat pressed from Invoice')} />

      <BottomNavbar activeTab="Invoice" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E7EB',
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
  createButton: {
    flexDirection: 'row',
    backgroundColor: '#000000',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginLeft: 12,
  },
  listContent: {
    paddingBottom: 100,
  },
  invoiceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  invoiceInfo: {
    flex: 1,
  },
  invoiceNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 4,
  },
  customerName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  invoiceDate: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  statusInfo: {
    alignItems: 'flex-end',
  },
  invoiceAmount: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000000',
    marginBottom: 8,
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
  overdueBadge: {
    backgroundColor: '#FEF2F2',
  },
  overdueText: {
    color: '#EF4444',
  },
});

export default InvoiceScreen;
