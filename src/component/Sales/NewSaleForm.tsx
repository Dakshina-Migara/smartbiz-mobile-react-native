import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator } from 'react-native';
import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';
import { useSales } from '../../context/SalesContext';
import { useInvoices } from '../../context/InvoiceContext';
import { useAuth } from '../../context/AuthContext';
import { InventoryData, customerService, CustomerData } from '../../services/api';

interface SaleItem {
  productId: number;
  name: string;
  qty: number;
  price: number;
}

interface NewSaleFormProps {
  onCancel: () => void;
  onSuccess: () => void;
  products: InventoryData[];
}

const NewSaleForm: React.FC<NewSaleFormProps> = ({ onCancel, onSuccess, products }) => {
  const { addSale } = useSales();
  const { addInvoice } = useInvoices();
  const { user } = useAuth();
  
  // Data State
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);

  // Form State
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(null);
  const [items, setItems] = useState<SaleItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // UI State
  const [showProductPicker, setShowProductPicker] = useState(false);
  const [showCustomerPicker, setShowCustomerPicker] = useState(false);
  const [showPaymentPicker, setShowPaymentPicker] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, [user?.businessId]);

  const fetchCustomers = async () => {
    if (!user?.businessId) return;
    setLoadingCustomers(true);
    try {
      const data = await customerService.getCustomers(user.businessId);
      setCustomers(data);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoadingCustomers(false);
    }
  };

  const handleAddItem = (product: InventoryData) => {
    const existing = items.find(i => i.productId === product.productId);
    if (existing) {
      if (existing.qty + 1 > product.stockLevel) {
        Alert.alert('Stock Limit Reached', `Only ${product.stockLevel} units of ${product.productName} are available in stock.`);
        return;
      }
      setItems(items.map(i => i.productId === product.productId ? { ...i, qty: i.qty + 1 } : i));
    } else {
      if (product.stockLevel < 1) {
        Alert.alert('Out of Stock', `${product.productName} is currently unavailable.`);
        return;
      }
      setItems([...items, { 
        productId: product.productId, 
        name: product.productName, 
        qty: 1, 
        price: product.price 
      }]);
    }
    setShowProductPicker(false);
  };

  const handleUpdateQty = (productId: number, delta: number) => {
    const product = products.find(p => p.productId === productId);
    if (!product) return;

    setItems(items.map(item => {
      if (item.productId === productId) {
        const newQty = item.qty + delta;
        
        if (delta > 0 && newQty > product.stockLevel) {
          Alert.alert('Stock Limit Reached', `Only ${product.stockLevel} units of ${item.name} are available.`);
          return item;
        }
        
        return { ...item, qty: Math.max(1, newQty) };
      }
      return item;
    }));
  };

  const handleRemoveItem = (productId: number) => {
    setItems(items.filter(i => i.productId !== productId));
  };

  const handleCompleteSale = async () => {
    if (!selectedCustomer) {
      Alert.alert('Required Field', 'Please select a customer');
      return;
    }
    if (items.length === 0) {
      Alert.alert('No Items', 'Please add at least one item to the sale');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await addSale({
        customerName: selectedCustomer.name,
        customerEmail: selectedCustomer.email || undefined,
        customerPhone: selectedCustomer.phone || undefined,
        items: items.map(item => ({
          productId: item.productId,
          qty: item.qty,
          price: item.price
        })),
        paymentMethod: paymentMethod,
        status: 'completed',
      });
      
      const newSaleId = response?.saleId || response?.id || Math.random().toString();

      // Generate the invoice after sale success
      addInvoice({
        customer: selectedCustomer.name,
        amount: `$${totalAmount.toFixed(2)}`,
        status: 'Paid',
        saleId: newSaleId.toString(),
      });
      
      Alert.alert('Success', 'Sale completed and Invoice generated successfully');
      onSuccess();
    } catch (error) {
      console.error('Sale error:', error);
      Alert.alert('Error', 'Failed to complete sale. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.qty), 0);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>New Sale</Text>
        <TouchableOpacity onPress={onCancel}>
          <MaterialCommunityIcons name="close" size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <View style={styles.voiceTip}>
        <MaterialCommunityIcons name="lightbulb-outline" size={18} color="#D97706" />
        <Text style={styles.voiceTipText}>
          Use voice input: Say "Add 5 wireless mouse" to quickly add items
        </Text>
      </View>

      {/* Customer Selection Card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Customer Information</Text>
        
        <Text style={styles.label}>Select Customer *</Text>
        <TouchableOpacity 
          style={styles.pickerTrigger} 
          onPress={() => setShowCustomerPicker(true)}
        >
          {loadingCustomers ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <>
              <Text style={[styles.pickerValue, !selectedCustomer && styles.placeholder]}>
                {selectedCustomer ? selectedCustomer.name : 'Choose from registered customers'}
              </Text>
              <MaterialCommunityIcons name="chevron-down" size={20} color="#6B7280" />
            </>
          )}
        </TouchableOpacity>

        {selectedCustomer && (
          <View style={styles.customerDetails}>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="email-outline" size={14} color="#6B7280" />
              <Text style={styles.detailText}>{selectedCustomer.email || 'No email'}</Text>
            </View>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="phone-outline" size={14} color="#6B7280" />
              <Text style={styles.detailText}>{selectedCustomer.phone || 'No phone'}</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.itemsHeader}>
        <Text style={styles.title}>Items</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowProductPicker(true)}>
          <Text style={styles.addButtonText}>Add +</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.itemsCard}>
        {items.length === 0 ? (
          <View style={styles.emptyItems}>
            <Text style={styles.emptyText}>No items added yet</Text>
            <TouchableOpacity style={styles.addFirstButton} onPress={() => setShowProductPicker(true)}>
              <Text style={styles.addFirstText}>Add First Item</Text>
            </TouchableOpacity>
          </View>
        ) : (
          items.map((item) => (
            <View key={item.productId} style={styles.itemRow}>
              <View style={styles.itemMain}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPriceText}>Price: ${item.price.toFixed(2)}</Text>
                
                {/* Quantity Controls */}
                <View style={styles.qtyContainer}>
                  <TouchableOpacity 
                    style={styles.qtyBtn} 
                    onPress={() => handleUpdateQty(item.productId, -1)}
                  >
                    <Text style={styles.qtyBtnText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyValue}>{item.qty}</Text>
                  <TouchableOpacity 
                    style={styles.qtyBtn}
                    onPress={() => handleUpdateQty(item.productId, 1)}
                  >
                    <Text style={styles.qtyBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.itemRight}>
                <Text style={styles.itemTotal}>${(item.price * item.qty).toFixed(2)}</Text>
                <TouchableOpacity onPress={() => handleRemoveItem(item.productId)}>
                  <MaterialCommunityIcons name="delete-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>

      {items.length > 0 && (
        <>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount:</Text>
            <Text style={styles.totalValue}>${totalAmount.toFixed(2)}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <TouchableOpacity 
              style={styles.pickerTrigger} 
              onPress={() => setShowPaymentPicker(true)}
            >
              <View style={styles.pickerLabelRow}>
                <MaterialCommunityIcons 
                  name={paymentMethod === 'cash' ? "cash" : "credit-card-outline"} 
                  size={20} 
                  color="#111827" 
                  style={{ marginRight: 10 }}
                />
                <Text style={styles.pickerValue}>
                  {paymentMethod === 'cash' ? 'Cash' : 'Card'}
                </Text>
              </View>
              <MaterialCommunityIcons name="chevron-down" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </>
      )}

      <TouchableOpacity 
        style={[styles.completeButton, (isSubmitting || !selectedCustomer) && styles.disabledButton]} 
        onPress={handleCompleteSale}
        disabled={isSubmitting || !selectedCustomer}
      >
        <MaterialCommunityIcons name="cart-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
        <Text style={styles.completeButtonText}>
          {isSubmitting ? 'Processing...' : 'Complete Sale & Generate Invoice'}
        </Text>
      </TouchableOpacity>

      {/* Payment Method Picker */}
      {showPaymentPicker && (
        <View style={styles.pickerOverlay}>
          <View style={styles.pickerContainer}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Payment Method</Text>
              <TouchableOpacity onPress={() => setShowPaymentPicker(false)}>
                <Text style={styles.closePicker}>Close</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity 
              style={styles.productItem}
              onPress={() => {
                setPaymentMethod('cash');
                setShowPaymentPicker(false);
              }}
            >
              <View style={styles.pickerLabelRow}>
                <MaterialCommunityIcons name="cash" size={20} color="#6B7280" style={{ marginRight: 12 }} />
                <Text style={styles.productName}>Cash</Text>
              </View>
              {paymentMethod === 'cash' && <MaterialCommunityIcons name="check" size={20} color="#10B981" />}
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.productItem}
              onPress={() => {
                setPaymentMethod('card');
                setShowPaymentPicker(false);
              }}
            >
              <View style={styles.pickerLabelRow}>
                <MaterialCommunityIcons name="credit-card-outline" size={20} color="#6B7280" style={{ marginRight: 12 }} />
                <Text style={styles.productName}>Card</Text>
              </View>
              {paymentMethod === 'card' && <MaterialCommunityIcons name="check" size={20} color="#10B981" />}
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Customer Picker Modal Replacement */}
      {showCustomerPicker && (
        <View style={styles.pickerOverlay}>
          <View style={styles.pickerContainer}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Select Customer</Text>
              <TouchableOpacity onPress={() => setShowCustomerPicker(false)}>
                <Text style={styles.closePicker}>Close</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 400 }}>
              {customers.map((c) => (
                <TouchableOpacity 
                  key={c.customerId} 
                  style={styles.productItem}
                  onPress={() => {
                    setSelectedCustomer(c);
                    setShowCustomerPicker(false);
                  }}
                >
                  <View>
                    <Text style={styles.productName}>{c.name}</Text>
                    <Text style={styles.productPrice}>{c.phone || 'No phone'}</Text>
                  </View>
                  <MaterialCommunityIcons name="check-circle-outline" size={20} color={selectedCustomer?.customerId === c.customerId ? "#10B981" : "#D1D5DB"} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      {/* Product Picker Modal Replacement */}
      {showProductPicker && (
        <View style={styles.pickerOverlay}>
          <View style={styles.pickerContainer}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Select Product</Text>
              <TouchableOpacity onPress={() => setShowProductPicker(false)}>
                <Text style={styles.closePicker}>Close</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 400 }}>
              {products.length === 0 ? (
                <Text style={styles.emptyText}>No products found in inventory</Text>
              ) : (
                products.map((p) => (
                  <TouchableOpacity 
                    key={p.productId} 
                    style={styles.productItem}
                    onPress={() => handleAddItem(p)}
                  >
                    <View>
                      <Text style={styles.productName}>{p.productName}</Text>
                      <Text style={styles.productPrice}>${p.price.toFixed(2)} • Stock: {p.stockLevel}</Text>
                    </View>
                    <MaterialCommunityIcons name="plus-circle-outline" size={24} color="#10B981" />
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  voiceTip: {
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  voiceTipText: {
    fontSize: 12,
    color: '#1E40AF',
    marginLeft: 8,
    flex: 1,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 10,
  },
  pickerTrigger: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  pickerValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
  },
  placeholder: {
    color: '#9CA3AF',
    fontWeight: '500',
  },
  customerDetails: {
    marginTop: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#4B5563',
    marginLeft: 6,
    fontWeight: '500',
  },
  itemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  itemsCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    minHeight: 120,
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  emptyItems: {
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 12,
  },
  addFirstButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    width: '100%',
    alignItems: 'center',
  },
  addFirstText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  itemMain: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  itemPriceText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    alignSelf: 'flex-start',
    padding: 2,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    backgroundColor: '#FFF',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
  },
  qtyBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  qtyValue: {
    paddingHorizontal: 12,
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  itemRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 70,
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 24,
    paddingRight: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginRight: 12,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111827',
  },
  completeButton: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  completeButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.7,
  },
  pickerOverlay: {
    position: 'absolute',
    top: -500, // Move it relative to screen or use a Modal
    left: -20,
    right: -20,
    bottom: -1000,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
    zIndex: 1000,
  },
  pickerContainer: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  closePicker: {
    color: '#EF4444',
    fontWeight: '700',
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
  },
  productPrice: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  pickerLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default NewSaleForm;
