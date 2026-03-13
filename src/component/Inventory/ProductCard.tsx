import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from '@react-native-vector-icons/material-design-icons';
import { InventoryData } from '../../services/api';

interface ProductCardProps {
  item: InventoryData;
  onEdit?: (item: InventoryData) => void;
  onDelete?: (item: InventoryData) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ item, onEdit, onDelete }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.productName}>{item.productName}</Text>
      <View style={styles.actionIcons}>
        <TouchableOpacity style={styles.iconButton} onPress={() => onEdit?.(item)}>
          <Icon name="pencil-outline" size={18} color="#4B5563" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => onDelete?.(item)}>
          <Icon name="delete-outline" size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
    <Text style={styles.productDetail}>SKU: {item.sku}</Text>
    <Text style={styles.productDetail}>Category: {item.category}</Text>
    <View style={styles.priceQtyRow}>
      <Text style={styles.priceQtyText}>Qty: <Text style={styles.boldText}>{item.stockLevel}</Text></Text>
      <Text style={styles.priceQtyText}>Price: <Text style={styles.boldText}>${item.price.toFixed(2)}</Text></Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  actionIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
  },
  iconButton: {
    padding: 2,
  },
  productDetail: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 2,
  },
  priceQtyRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  priceQtyText: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '600',
  },
  boldText: {
    fontWeight: '900',
    color: '#000000',
  },
});

export default ProductCard;
