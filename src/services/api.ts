import axios from 'axios';
import { Platform } from 'react-native';

const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8080/api/v1' : 'http://localhost:8080/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface TransactionData {
  transactionId?: number;
  type: string;
  category: string;
  description: string;
  amount: number;
  date?: string;
  businessId: number;
}

export interface CustomerData {
  customerId?: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  businessId: number;
}

export interface InventoryData {
  productId: number;
  productName: string;
  sku: string;
  category: string;
  price: number;
  stockLevel: number;
}

export interface SaleItemData {
  productId: number;
  qty: number;
  price: number;
}

export interface MobileSaleRequest {
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  items: SaleItemData[];
  paymentMethod: string;
  status: string;
}

export const mobileService = {
  getDashboard: async (businessId: number) => {
    try {
      const response = await api.get(`/mobile/${businessId}/dashboard`);
      return response.data;
    } catch (error) {
      console.error('Error fetching mobile dashboard:', error);
      throw error;
    }
  },

  getInventory: async (businessId: number) => {
    try {
      const response = await api.get(`/mobile/${businessId}/inventory`);
      return response.data;
    } catch (error) {
      console.error('Error fetching inventory:', error);
      throw error;
    }
  },

  recordSale: async (businessId: number, data: MobileSaleRequest) => {
    try {
      const response = await api.post(`/mobile/${businessId}/sales`, data);
      return response.data;
    } catch (error) {
      console.error('Error recording sale:', error);
      throw error;
    }
  },

  getSalesHistory: async (businessId: number) => {
    try {
      const response = await api.get(`/mobile/${businessId}/sales`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sales history:', error);
      throw error;
    }
  },
};

export const customerService = {
  getCustomers: async (businessId: number) => {
    try {
      const response = await api.get(`/business/${businessId}/customers/getAllCustomers`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },
};

export default api;
