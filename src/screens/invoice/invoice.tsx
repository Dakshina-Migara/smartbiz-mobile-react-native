import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import BottomNavbar from '../../component/Dashboard/BottomNavbar';
import { useInvoices, Invoice } from '../../context/InvoiceContext';
import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';
import InvoiceViewModal from '../../component/Invoice/InvoiceViewModal';
import { useAuth } from '../../context/AuthContext';

const InvoiceItem = ({ item, onView }: { item: Invoice, onView: (item: Invoice) => void }) => (
  <TouchableOpacity style={styles.invoiceCard} onPress={() => onView(item)}>
    <View style={styles.invoiceInfo}>
      <Text style={styles.invoiceNumber}>{item.invoiceNumber}</Text>
      <Text style={styles.customerName}>{item.customer}</Text>
      <Text style={styles.invoiceDate}>{item.date}</Text>
    </View>
    <View style={styles.statusInfo}>
      <Text style={styles.invoiceAmount}>{item.amount}</Text>
      <View style={styles.actionRow}>
        <View style={[
          styles.statusBadge, 
          styles.paidBadge
        ]}>
          <Text style={[
            styles.statusText,
            styles.paidText
          ]}>
            PAID
          </Text>
        </View>
        <View style={styles.viewIcon}>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#9CA3AF" />
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

import GlobalAIChatButton from '../../component/Dashboard/GlobalAIChatButton';

const InvoiceScreen = () => {
  const { invoices, loading, refreshInvoices } = useInvoices();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsModalVisible(true);
  };


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>invoices</Text>
        <Text style={styles.subtitle}>Manage your billing and payments</Text>



        {invoices.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="receipt" size={64} color="#D1D5DB" />
            <Text style={styles.emptyText}>No invoices generated yet</Text>
            <TouchableOpacity style={styles.refreshButton} onPress={refreshInvoices}>
              <Text style={styles.refreshButtonText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={invoices}
            renderItem={({ item }) => <InvoiceItem item={item} onView={handleViewInvoice} />}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={refreshInvoices} />
            }
          />
        )}
      </View>

      {selectedInvoice && (
        <InvoiceViewModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          saleId={selectedInvoice.saleId}
          invoiceNumber={selectedInvoice.invoiceNumber}
        />
      )}

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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  statusInfo: {
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
  paidBadge: {
    backgroundColor: '#ECFDF5',
  },
  paidText: {
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
  viewIcon: {
    marginLeft: 8,
  },
  refreshButton: {
    marginTop: 16,
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  refreshButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default InvoiceScreen;
