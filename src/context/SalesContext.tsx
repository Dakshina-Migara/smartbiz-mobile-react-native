import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { mobileService, MobileSaleRequest, SaleItemData } from '../services/api';

export interface Sale {
  id: string;
  customer: string;
  amount: string;
  status: 'Completed' | 'Pending';
  time: string;
}

interface SalesContextType {
  sales: Sale[];
  addSale: (saleData: MobileSaleRequest) => Promise<void>;
  totalSales: number;
  totalRevenue: number;
  totalProducts: number;
  lowStockItems: number;
  loading: boolean;
  refreshData: () => Promise<void>;
}

const SalesContext = createContext<SalesContextType | undefined>(undefined);

import { useAuth } from './AuthContext';

export const SalesProvider = ({ children }: { children: ReactNode }) => {
  const { user, token } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);
  const [dashboard, setDashboard] = useState({
    totalProducts: 0,
    totalSales: 0,
    revenue: 0,
    lowStockItems: 0
  });

  const fetchData = async () => {
    if (!user?.businessId || !token) {
      console.log('FetchData skipped: Missing user.businessId or token');
      return;
    }
    
    setLoading(true);
    try {
      const businessId = user.businessId;
      console.log(`Fetching mobile data for Business ID: ${businessId}`);
      
      // Fetch Dashboard Stats
      const stats = await mobileService.getDashboard(businessId);
      console.log('Dashboard KPI Response:', stats);
      
      setDashboard({
        totalProducts: stats?.totalProducts || 0,
        totalSales: stats?.totalSales || 0,
        revenue: stats?.revenue || 0,
        lowStockItems: stats?.lowStockItems || 0
      });

      // Fetch Sales History
      const salesHistory = await mobileService.getSalesHistory(businessId);
      console.log('Sales History Response:', salesHistory);
      
      if (Array.isArray(salesHistory)) {
        const mappedSales = salesHistory.map((s: any) => ({
          id: s.saleId?.toString() || Math.random().toString(),
          customer: s.customerName || 'Walk-in Customer',
          amount: `$${(s.totalAmount || 0).toFixed(2)}`,
          status: (s.status === 'completed' ? 'Completed' : 'Pending') as 'Completed' | 'Pending',
          time: s.saleDate ? new Date(s.saleDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
        }));
        setSales(mappedSales);
      } else {
        console.warn('Sales history is not an array:', salesHistory);
        setSales([]);
      }
    } catch (error: any) {
      console.error('Failed to fetch data from mobile API:', error);
      if (error.response) {
        console.error('Error Status:', error.response.status);
        console.error('Error Data:', error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.businessId, token]);

  const addSale = async (saleRequest: MobileSaleRequest) => {
    if (!user?.businessId) return;
    try {
      await mobileService.recordSale(user.businessId, saleRequest);
      // Refresh after adding
      await fetchData();
    } catch (error) {
      console.error('Failed to record sale:', error);
      throw error;
    }
  };

  return (
    <SalesContext.Provider value={{ 
      sales, 
      addSale, 
      totalSales: dashboard.totalSales, 
      totalRevenue: dashboard.revenue,
      totalProducts: dashboard.totalProducts,
      lowStockItems: dashboard.lowStockItems,
      loading,
      refreshData: fetchData
    }}>
      {children}
    </SalesContext.Provider>
  );
};

export const useSales = () => {
  const context = useContext(SalesContext);
  if (context === undefined) {
    throw new Error('useSales must be used within a SalesProvider');
  }
  return context;
};
