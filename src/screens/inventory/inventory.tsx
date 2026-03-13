import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  RefreshControl,
  Alert
} from 'react-native';
import BottomNavbar from '../../component/Dashboard/BottomNavbar';
import Icon from '@react-native-vector-icons/material-design-icons';
import { mobileService, InventoryData, ProductRequest } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import ProductCard from '../../component/Inventory/ProductCard';
import InventoryModal from '../../component/Inventory/InventoryModal';
import GlobalAIChatButton from '../../component/Dashboard/GlobalAIChatButton';

const InventoryScreen = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState<InventoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<InventoryData | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchInventory = async () => {
    if (!user?.businessId) return;
    try {
      setLoading(true);
      const data = await mobileService.getInventory(user.businessId);
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
      Alert.alert('Error', 'Failed to fetch inventory data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [user?.businessId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchInventory();
  };

  const handleSaveProduct = async (data: ProductRequest) => {
    if (!user?.businessId) return;
    setActionLoading(true);
    try {
      if (selectedProduct) {
        await mobileService.updateProduct(user.businessId, selectedProduct.productId, data);
        Alert.alert('Success', 'Product updated successfully!');
      } else {
        await mobileService.addProduct(user.businessId, data);
        Alert.alert('Success', 'Product added successfully!');
      }
      setModalVisible(false);
      fetchInventory();
    } catch (error) {
      console.error('Error saving product:', error);
      Alert.alert('Error', 'Failed to save product. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (product: InventoryData) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const handleDelete = (product: InventoryData) => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete ${product.productName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            if (!user?.businessId) return;
            try {
              await mobileService.deleteProduct(user.businessId, product.productId);
              Alert.alert('Success', 'Product deleted successfully.');
              fetchInventory();
            } catch (error) {
              console.error('Error deleting product:', error);
              Alert.alert('Error', 'Failed to delete product.');
            }
          }
        }
      ]
    );
  };

  const filteredProducts = products.filter(p => 
    p.productName.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Inventory</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => {
            setSelectedProduct(null);
            setModalVisible(true);
          }}
        >
          <Text style={styles.addButtonText}>Add +</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="magnify" size={24} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          placeholder="Search Product..."
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {loading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#111827" />
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={({ item }) => (
            <ProductCard 
              item={item} 
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
          keyExtractor={item => item.productId.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Text style={styles.emptyText}>No products found</Text>
            </View>
          }
        />
      )}

      <InventoryModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveProduct}
        initialData={selectedProduct}
        loading={actionLoading}
      />

      <GlobalAIChatButton onPress={() => console.log('AI Chat pressed from Inventory')} />

      <BottomNavbar activeTab="Inventory" />
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6', // softer light grey
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111827',
  },
  addButton: {
    backgroundColor: '#1F2937',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    paddingHorizontal: 20,
    height: 56,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 160,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
});

export default InventoryScreen;
