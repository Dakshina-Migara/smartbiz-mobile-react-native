import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { TextInput, Button, List, Divider } from 'react-native-paper';
import { useSales } from '../../context/SalesContext';
import { customerService, mobileService, CustomerData, InventoryData } from '../../services/api';

interface NewSaleModalProps {
  visible: boolean;
  onClose: () => void;
}

const BUSINESS_ID = 1;

const NewSaleModal: React.FC<NewSaleModalProps> = ({ visible, onClose }) => {
  const { addSale } = useSales();
  
  // Customer State
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(null);
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [showCustomerList, setShowCustomerList] = useState(false);

  // Product State
  const [products, setProducts] = useState<InventoryData[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<InventoryData | null>(null);
  const [productSearch, setProductSearch] = useState('');
  const [showProductList, setShowProductList] = useState(false);
  const [quantity, setQuantity] = useState('1');

  useEffect(() => {
    if (visible) {
      loadData();
    }
  }, [visible]);

  const loadData = async () => {
    setLoadingCustomers(true);
    try {
      const [customerData, inventoryData] = await Promise.all([
        customerService.getCustomers(BUSINESS_ID),
        mobileService.getInventory(BUSINESS_ID)
      ]);
      setCustomers(customerData);
      setProducts(inventoryData);
    } catch (error) {
      console.error('Failed to load modal data:', error);
    } finally {
      setLoadingCustomers(false);
    }
  };

  const handleSelectCustomer = (cust: CustomerData) => {
    setSelectedCustomer(cust);
    setCustomerSearch(cust.name);
    setShowCustomerList(false);
  };

  const handleSelectProduct = (prod: InventoryData) => {
    setSelectedProduct(prod);
    setProductSearch(prod.productName);
    setShowProductList(false);
  };

  const handleAddSale = async () => {
    if (!selectedCustomer && !customerSearch) return;
    if (!selectedProduct) return;

    try {
      await addSale({
        customerName: selectedCustomer ? selectedCustomer.name : customerSearch,
        customerEmail: selectedCustomer?.email,
        customerPhone: selectedCustomer?.phone,
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
    setCustomerSearch('');
    setSelectedCustomer(null);
    setProductSearch('');
    setSelectedProduct(null);
    setQuantity('1');
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(customerSearch.toLowerCase())
  );

  const filteredProducts = products.filter(p => 
    p.productName.toLowerCase().includes(productSearch.toLowerCase())
  );

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
            <Text style={styles.title}>New Sale</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form} keyboardShouldPersistTaps="handled">
            {/* Customer Selection */}
            <View style={[styles.inputContainer, { zIndex: 3000 }]}>
              <Text style={styles.label}>Select Customer</Text>
              <TextInput
                value={customerSearch}
                onChangeText={(text) => {
                  setCustomerSearch(text);
                  setSelectedCustomer(null);
                  setShowCustomerList(text.length > 0);
                }}
                onFocus={() => setShowCustomerList(true)}
                mode="outlined"
                style={styles.input}
                outlineColor="#E5E7EB"
                activeOutlineColor="#000000"
                placeholder="Search database customers..."
                right={loadingCustomers ? <TextInput.Icon icon={() => <ActivityIndicator size="small" />} /> : null}
              />
              
              {showCustomerList && filteredCustomers.length > 0 && (
                <View style={styles.dropdown}>
                  <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
                    {filteredCustomers.map((cust) => (
                      <TouchableOpacity 
                        key={cust.customerId}
                        style={styles.item}
                        onPress={() => handleSelectCustomer(cust)}
                      >
                        <Text style={styles.itemText}>{cust.name}</Text>
                        <Text style={styles.itemSubtext}>{cust.phone || 'No phone'}</Text>
                        <Divider />
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Product Selection */}
            <View style={[styles.inputContainer, { zIndex: 2000, marginTop: 10 }]}>
              <Text style={styles.label}>Select Product</Text>
              <TextInput
                value={productSearch}
                onChangeText={(text) => {
                  setProductSearch(text);
                  setSelectedProduct(null);
                  setShowProductList(text.length > 0);
                }}
                onFocus={() => setShowProductList(true)}
                mode="outlined"
                style={styles.input}
                outlineColor="#E5E7EB"
                activeOutlineColor="#000000"
                placeholder="Search products..."
              />
              
              {showProductList && filteredProducts.length > 0 && (
                <View style={styles.dropdown}>
                  <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
                    {filteredProducts.map((prod) => (
                      <TouchableOpacity 
                        key={prod.productId}
                        style={styles.item}
                        onPress={() => handleSelectProduct(prod)}
                      >
                        <View style={styles.row}>
                          <Text style={styles.itemText}>{prod.productName}</Text>
                          <Text style={styles.priceText}>${prod.price.toFixed(2)}</Text>
                        </View>
                        <Text style={styles.itemSubtext}>In Stock: {prod.stockLevel}</Text>
                        <Divider />
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Quantity */}
            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.label}>Quantity</Text>
                <TextInput
                  value={quantity}
                  onChangeText={setQuantity}
                  mode="outlined"
                  keyboardType="numeric"
                  style={styles.input}
                  outlineColor="#E5E7EB"
                  activeOutlineColor="#000000"
                />
              </View>
              <View style={{ flex: 2 }}>
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
              disabled={(!selectedCustomer && !customerSearch) || !selectedProduct}
            >
              Confirm Sale
            </Button>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    minHeight: '75%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#000000',
  },
  closeButton: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
  },
  dropdown: {
    position: 'absolute',
    top: 85,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 5000,
  },
  item: {
    padding: 16,
  },
  itemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  itemSubtext: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#10B981',
  },
  totalDisplay: {
    height: 50,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginTop: 6,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000000',
  },
  submitButton: {
    marginTop: 32,
    backgroundColor: '#000000',
    borderRadius: 16,
  },
  submitButtonContent: {
    height: 56,
  },
  submitButtonLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});

export default NewSaleModal;
