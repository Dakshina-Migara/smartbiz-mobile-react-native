import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TextInput, TouchableOpacity } from 'react-native';
import BottomNavbar from '../../component/Dashboard/BottomNavbar';
import Icon from '@react-native-vector-icons/material-design-icons';

const SAMPLE_PRODUCTS = [
  { id: '1', name: 'Premium Coffee Beans', price: '$24.99', stock: 15, category: 'Beverages' },
  { id: '2', name: 'Organic Green Tea', price: '$18.50', stock: 8, category: 'Beverages' },
  { id: '3', name: 'Dark Chocolate Bar', price: '$5.00', stock: 45, category: 'Snacks' },
  { id: '4', name: 'Assorted Nuts Mix', price: '$12.00', stock: 0, category: 'Snacks' }, // Out of stock
];

const ProductItem = ({ item }: { item: typeof SAMPLE_PRODUCTS[0] }) => (
  <View style={styles.productCard}>
    <View style={styles.productInfo}>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productCategory}>{item.category}</Text>
      <Text style={styles.productPrice}>{item.price}</Text>
    </View>
    <View style={styles.stockContainer}>
      <Text style={[styles.stockText, item.stock === 0 && styles.outOfStock]}>
        {item.stock > 0 ? `${item.stock} in stock` : 'Out of Stock'}
      </Text>
      <TouchableOpacity style={styles.editButton}>
        <Icon name="pencil" size={18} color="#6B7280" />
      </TouchableOpacity>
    </View>
  </View>
);

const InventoryScreen = () => {
  const [search, setSearch] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Inventory</Text>
        <Text style={styles.subtitle}>Total 4 items in your catalog</Text>

        <View style={styles.searchContainer}>
          <Icon name="magnify" size={24} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            placeholder="Search products..."
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <FlatList
          data={SAMPLE_PRODUCTS}
          renderItem={({ item }) => <ProductItem item={item} />}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>
      <BottomNavbar activeTab="Inventory" />
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 24,
    height: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 100,
  },
  productCard: {
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
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '900',
    color: '#000000',
  },
  stockContainer: {
    alignItems: 'flex-end',
  },
  stockText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10B981', // Green for in stock
    marginBottom: 12,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  outOfStock: {
    color: '#EF4444', // Red for out of stock
    backgroundColor: '#FEF2F2',
  },
  editButton: {
    backgroundColor: '#F3F4F6',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default InventoryScreen;
