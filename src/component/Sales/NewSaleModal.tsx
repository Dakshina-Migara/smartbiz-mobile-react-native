import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Button, List, Divider, Searchbar } from 'react-native-paper';
import { useSales } from '../../context/SalesContext';
import { customerService, mobileService, CustomerData, InventoryData } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface NewSaleModalProps {
  visible: boolean;
  onClose: () => void;
}

const NewSaleModal: React.FC<NewSaleModalProps> = ({ visible, onClose }) => {
  const { addSale } = useSales();
  const { user } = useAuth();
  
  // Data State
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [products, setProducts] = useState<InventoryData[]>([]);
  const [loading, setLoading] = useState(false);

  // Selection State
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<InventoryData | null>(null);
  const [quantity, setQuantity] = useState('1');

  // UI State for "Dropboxes" (Expandable Lists)
  const [isCustomerExpanded, setIsCustomerExpanded] = useState(false);
  const [isProductExpanded, setIsProductExpanded] = useState(false);

  useEffect(() => {
    if (visible) {
      loadData();
    }
  }, [visible]);

  const loadData = async () => {
    if (!user?.businessId) return;
    
    setLoading(true);
    try {
      const [customerData, inventoryData] = await Promise.all([
        customerService.getCustomers(user.businessId),
        mobileService.getInventory(user.businessId)
      ]);
      setCustomers(customerData);
      setProducts(inventoryData);
    } catch (error) {
      console.error('Failed to load modal data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSale = async () => {
    if (!selectedCustomer || !selectedProduct) return;

    try {
      await addSale({
        customerName: selectedCustomer.name,
        customerEmail: selectedCustomer.email,
        customerPhone: selectedCustomer.phone,
        items: [
          {
            productId: selectedProduct.productId,
            qty: parseInt(quantity, 10),
            price: selectedProduct.price
          }
        ],
        paymentMethod: 'cash',
        status: 'completed',
      });

      onClose();
      resetForm();
    } catch (error) {
      console.error('Failed to add sale:', error);
    }
  };

  const resetForm = () => {
    setSelectedCustomer(null);
    setSelectedProduct(null);
    setQuantity('1');
    setIsCustomerExpanded(false);
    setIsProductExpanded(false);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Quick Sale</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form} keyboardShouldPersistTaps="handled">
            {loading && !customers.length ? (
              <ActivityIndicator color="#000" style={{ marginVertical: 20 }} />
            ) : (
              <>
                {/* Customer Dropbox */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Customer</Text>
                  <TouchableOpacity 
                    style={styles.dropboxHeader} 
                    onPress={() => {
                      setIsCustomerExpanded(!isCustomerExpanded);
                      setIsProductExpanded(false);
                    }}
                  >
                    <Text style={[styles.dropboxValue, !selectedCustomer && styles.placeholder]}>
                      {selectedCustomer ? selectedCustomer.name : 'Choose a customer'}
                    </Text>
                    <Text style={styles.chevron}>{isCustomerExpanded ? '▲' : '▼'}</Text>
                  </TouchableOpacity>
                  
                  {isCustomerExpanded && (
                    <View style={styles.dropboxContent}>
                      <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled>
                        {customers.map((cust) => (
                          <TouchableOpacity 
                            key={cust.customerId}
                            style={styles.dropItem}
                            onPress={() => {
                              setSelectedCustomer(cust);
                              setIsCustomerExpanded(false);
                            }}
                          >
                            <Text style={styles.itemTitle}>{cust.name}</Text>
                            {cust.phone && <Text style={styles.itemSub}>{cust.phone}</Text>}
                            <Divider />
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>

                {/* Product Dropbox */}
                <View style={[styles.inputContainer, { marginTop: 10 }]}>
                  <Text style={styles.label}>Product</Text>
                  <TouchableOpacity 
                    style={styles.dropboxHeader} 
                    onPress={() => {
                      setIsProductExpanded(!isProductExpanded);
                      setIsCustomerExpanded(false);
                    }}
                  >
                    <Text style={[styles.dropboxValue, !selectedProduct && styles.placeholder]}>
                      {selectedProduct ? selectedProduct.productName : 'Choose a product'}
                    </Text>
                    <Text style={styles.chevron}>{isProductExpanded ? '▲' : '▼'}</Text>
                  </TouchableOpacity>
                  
                  {isProductExpanded && (
                    <View style={styles.dropboxContent}>
                      <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled>
                        {products.map((prod) => (
                          <TouchableOpacity 
                            key={prod.productId}
                            style={styles.dropItem}
                            onPress={() => {
                              setSelectedProduct(prod);
                              setIsProductExpanded(false);
                            }}
                          >
                            <View style={styles.itemRow}>
                              <Text style={styles.itemTitle}>{prod.productName}</Text>
                              <Text style={styles.itemPrice}>${prod.price.toFixed(2)}</Text>
                            </View>
                            <Text style={styles.itemSub}>Stock: {prod.stockLevel}</Text>
                            <Divider />
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>

                {/* Calculation Area */}
                <View style={styles.calcRow}>
                  <View style={{ flex: 1, marginRight: 12 }}>
                    <Text style={styles.label}>Qty</Text>
                    <View style={styles.qtyContainer}>
                      <TouchableOpacity 
                        onPress={() => setQuantity(Math.max(1, parseInt(quantity || '0', 10) - 1).toString())}
                        style={styles.qtyBtn}
                      >
                        <Text style={styles.qtyBtnText}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.qtyText}>{quantity}</Text>
                      <TouchableOpacity 
                        onPress={() => setQuantity((parseInt(quantity || '0', 10) + 1).toString())}
                        style={styles.qtyBtn}
                      >
                        <Text style={styles.qtyBtnText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={{ flex: 1.5 }}>
                    <Text style={styles.label}>Total Amount</Text>
                    <View style={styles.totalDisplay}>
                      <Text style={styles.totalValue}>
                        ${selectedProduct ? (selectedProduct.price * parseInt(quantity || '0', 10)).toFixed(2) : '0.00'}
                      </Text>
                    </View>
                  </View>
                </View>

                <Button 
                  mode="contained" 
                  onPress={handleAddSale}
                  style={styles.submitButton}
                  labelStyle={styles.submitButtonLabel}
                  contentStyle={styles.submitButtonContent}
                  disabled={!selectedCustomer || !selectedProduct}
                >
                  Process Sale
                </Button>
              </>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    padding: 24,
    minHeight: '70%',
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#111827',
  },
  closeButton: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '700',
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
    zIndex: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4B5563',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dropboxHeader: {
    height: 60,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  dropboxValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  placeholder: {
    color: '#9CA3AF',
  },
  chevron: {
    fontSize: 12,
    color: '#6B7280',
  },
  dropboxContent: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    overflow: 'hidden',
  },
  dropItem: {
    padding: 16,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  itemSub: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
    fontWeight: '500',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#10B981',
  },
  calcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 10,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 8,
  },
  qtyBtn: {
    width: 40,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  qtyBtnText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#000000',
  },
  qtyText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  totalDisplay: {
    height: 56,
    backgroundColor: '#111827',
    borderRadius: 16,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  submitButton: {
    marginTop: 32,
    backgroundColor: '#000000',
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
  },
  submitButtonContent: {
    height: 60,
  },
  submitButtonLabel: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});

export default NewSaleModal;
