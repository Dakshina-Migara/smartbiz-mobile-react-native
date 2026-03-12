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

const BUSINESS_ID = 1;

export const SalesProvider = ({ children }: { children: ReactNode }) => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);
  const [dashboard, setDashboard] = useState({
    totalProducts: 0,
    totalSales: 0,
    revenue: 0,
    lowStockItems: 0
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Dashboard Stats
      const stats = await mobileService.getDashboard(BUSINESS_ID);
      setDashboard({
        totalProducts: stats.totalProducts || 0,
        totalSales: stats.totalSales || 0,
        revenue: stats.revenue || 0,
        lowStockItems: stats.lowStockItems || 0
      });

      // Fetch Sales History
      const salesHistory = await mobileService.getSalesHistory(BUSINESS_ID);
      const mappedSales = salesHistory.map((s: any) => ({
        id: s.saleId.toString(),
        customer: s.customerName || 'Unknown',
        amount: `$${s.totalAmount.toFixed(2)}`,
        status: s.status === 'completed' ? 'Completed' : 'Pending',
        time: s.saleDate ? new Date(s.saleDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
      }));
      setSales(mappedSales);
    } catch (error) {
      console.error('Failed to fetch data from mobile API:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addSale = async (saleRequest: MobileSaleRequest) => {
    try {
      await mobileService.recordSale(BUSINESS_ID, saleRequest);
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
