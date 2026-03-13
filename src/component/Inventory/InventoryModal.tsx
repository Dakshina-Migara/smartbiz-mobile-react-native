import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator
} from 'react-native';
import Icon from '@react-native-vector-icons/material-design-icons';
import { InventoryData, ProductRequest } from '../../services/api';

interface InventoryModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: ProductRequest) => Promise<void>;
  initialData?: InventoryData | null;
  loading?: boolean;
}

const InventoryModal: React.FC<InventoryModalProps> = ({ 
  visible, 
  onClose, 
  onSave, 
  initialData,
  loading 
}) => {
  const [formData, setFormData] = useState<ProductRequest>({
    productName: '',
    sku: '',
    category: '',
    price: 0,
    stockLevel: 0
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ProductRequest, string>>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        productName: initialData.productName,
        sku: initialData.sku,
        category: initialData.category,
        price: initialData.price,
        stockLevel: initialData.stockLevel
      });
    } else {
      setFormData({
        productName: '',
        sku: '',
        category: '',
        price: 0,
        stockLevel: 0
      });
    }
    setErrors({});
  }, [initialData, visible]);

  const validate = () => {
    const newErrors: Partial<Record<keyof ProductRequest, string>> = {};
    if (!formData.productName) newErrors.productName = 'Name is required';
    if (!formData.sku) newErrors.sku = 'SKU is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (formData.stockLevel < 0) newErrors.stockLevel = 'Stock cannot be negative';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (validate()) {
      await onSave(formData);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContent}
        >
          <View style={styles.header}>
            <Text style={styles.title}>{initialData ? 'Edit Product' : 'Add New Product'}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Product Name</Text>
              <TextInput
                style={[styles.input, errors.productName && styles.inputError]}
                value={formData.productName}
                onChangeText={(text) => setFormData({ ...formData, productName: text })}
                placeholder="e.g. Wireless Mouse"
              />
              {errors.productName && <Text style={styles.errorText}>{errors.productName}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>SKU</Text>
              <TextInput
                style={[styles.input, errors.sku && styles.inputError]}
                value={formData.sku}
                onChangeText={(text) => setFormData({ ...formData, sku: text })}
                placeholder="e.g. WM-001"
              />
              {errors.sku && <Text style={styles.errorText}>{errors.sku}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Category</Text>
              <TextInput
                style={[styles.input, errors.category && styles.inputError]}
                value={formData.category}
                onChangeText={(text) => setFormData({ ...formData, category: text })}
                placeholder="e.g. Electronics"
              />
              {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
            </View>

            <View style={styles.row}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.label}>Price ($)</Text>
                <TextInput
                  style={[styles.input, errors.price && styles.inputError]}
                  value={formData.price.toString()}
                  onChangeText={(text) => setFormData({ ...formData, price: parseFloat(text) || 0 })}
                  keyboardType="numeric"
                  placeholder="0.00"
                />
                {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
              </View>

              <View style={[styles.inputContainer, { flex: 1, marginLeft: 10 }]}>
                <Text style={styles.label}>Stock Level</Text>
                <TextInput
                  style={[styles.input, errors.stockLevel && styles.inputError]}
                  value={formData.stockLevel.toString()}
                  onChangeText={(text) => setFormData({ ...formData, stockLevel: parseInt(text) || 0 })}
                  keyboardType="numeric"
                  placeholder="0"
                />
                {errors.stockLevel && <Text style={styles.errorText}>{errors.stockLevel}</Text>}
              </View>
            </View>
          </ScrollView>

          <TouchableOpacity 
            style={[styles.saveButton, loading && styles.saveButtonDisabled]} 
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>{initialData ? 'Update Product' : 'Add Product'}</Text>
            )}
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  form: {
    paddingBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
  },
  saveButton: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: Platform.OS === 'ios' ? 24 : 0,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default InventoryModal;
