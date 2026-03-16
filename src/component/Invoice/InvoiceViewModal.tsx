import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';
import { mobileService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface InvoiceViewModalProps {
  visible: boolean;
  onClose: () => void;
  saleId: string;
  invoiceNumber: string;
}

const InvoiceViewModal = ({ visible, onClose, saleId, invoiceNumber }: InvoiceViewModalProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saleDetails, setSaleDetails] = useState<any>(null);

  useEffect(() => {
    if (visible && saleId && user?.businessId) {
      fetchSaleDetails();
    }
  }, [visible, saleId]);

  const fetchSaleDetails = async () => {
    setLoading(true);
    try {
      const data = await mobileService.getSaleDetails(user!.businessId!, saleId);
      setSaleDetails(data);
    } catch (error) {
      console.error('Failed to fetch sale details:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialCommunityIcons name="close" size={28} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Invoice Details</Text>
          <View style={{ width: 40 }} />
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#000" />
            <Text style={styles.loadingText}>Loading Invoice...</Text>
          </View>
        ) : saleDetails ? (
          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.invoiceHead}>
              <View>
                <Text style={styles.brandTitle}>SMARTBIZ</Text>
                <Text style={styles.invoiceLabel}>Official Receipt</Text>
              </View>
              <View style={styles.invoiceNumberBox}>
                <Text style={styles.invNoLabel}>Invoice No</Text>
                <Text style={styles.invNoValue}>{invoiceNumber}</Text>
              </View>
            </View>

            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Customer</Text>
                <Text style={styles.infoValue}>{saleDetails.customerName || 'Walk-in Customer'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Date</Text>
                <Text style={styles.infoValue}>
                  {new Date(saleDetails.saleDate).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Status</Text>
                <View style={styles.paidBadge}>
                  <Text style={styles.paidText}>PAID</Text>
                </View>
              </View>
            </View>

            <View style={styles.tableHeader}>
              <Text style={[styles.columnHeader, { flex: 2 }]}>Item</Text>
              <Text style={[styles.columnHeader, { flex: 1, textAlign: 'center' }]}>Qty</Text>
              <Text style={[styles.columnHeader, { flex: 1.5, textAlign: 'right' }]}>Price</Text>
            </View>

            {saleDetails.items && saleDetails.items.map((item: any, index: number) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.itemName, { flex: 2 }]}>{item.productName}</Text>
                <Text style={[styles.itemQty, { flex: 1, textAlign: 'center' }]}>{item.qty}</Text>
                <Text style={[styles.itemPrice, { flex: 1.5, textAlign: 'right' }]}>
                  ${(item.price * item.qty).toFixed(2)}
                </Text>
              </View>
            ))}

            <View style={styles.totalSection}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Subtotal</Text>
                <Text style={styles.totalValue}>${saleDetails.totalAmount.toFixed(2)}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Discount</Text>
                <Text style={styles.totalValue}>$0.00</Text>
              </View>
              <View style={[styles.totalRow, styles.grandTotalRow]}>
                <Text style={styles.grandTotalLabel}>TOTAL</Text>
                <Text style={styles.grandTotalValue}>${saleDetails.totalAmount.toFixed(2)}</Text>
              </View>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Thank you for your business!</Text>
              <Text style={styles.companyName}>SmartBiz - Empowering Your Business</Text>
            </View>
          </ScrollView>
        ) : (
          <View style={styles.errorContainer}>
            <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#EF4444" />
            <Text style={styles.errorText}>Could not load invoice details</Text>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#000',
  },
  scrollContent: {
    flex: 1,
    padding: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  invoiceHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 40,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 2,
    color: '#000',
  },
  invoiceLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
    marginTop: 4,
  },
  invoiceNumberBox: {
    alignItems: 'flex-end',
  },
  invNoLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '700',
  },
  invNoValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#000',
  },
  infoSection: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    color: '#000',
    fontWeight: '700',
  },
  paidBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  paidText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#10B981',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    paddingBottom: 12,
    marginBottom: 12,
  },
  columnHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: '#000',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  itemQty: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
  totalSection: {
    marginTop: 32,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: '#F3F4F6',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 14,
    color: '#000',
    fontWeight: '700',
  },
  grandTotalRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  grandTotalLabel: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000',
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000',
  },
  footer: {
    marginTop: 60,
    alignItems: 'center',
    marginBottom: 40,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default InvoiceViewModal;
