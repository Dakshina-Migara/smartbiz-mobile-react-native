import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { mobileService } from '../services/api';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customer: string;
  date: string;
  amount: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  saleId: string;
}

interface InvoiceContextType {
  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber' | 'date'>) => void;
  deleteInvoice: (invoiceId: string) => Promise<void>;
  loading: boolean;
  refreshInvoices: () => Promise<void>;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const InvoiceProvider = ({ children }: { children: ReactNode }) => {
  const { user, token } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInvoices = async () => {
    if (!user?.businessId || !token) return;
    setLoading(true);
    try {
      const data = await mobileService.getInvoices(user.businessId);
      if (Array.isArray(data)) {
        const mappedInvoices: Invoice[] = data.map((inv: any) => ({
          id: inv.invoiceId?.toString() || Math.random().toString(),
          invoiceNumber: inv.invoiceNumber || `INV-${inv.invoiceId}`,
          customer: inv.customerName || 'Walk-in Customer',
          date: inv.issuedDate ? new Date(inv.issuedDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'N/A',
          amount: `$${(inv.totalAmount || 0).toFixed(2)}`,
          status: (inv.status || 'Pending') as 'Paid' | 'Pending' | 'Overdue',
          saleId: inv.saleId?.toString() || '',
        }));
        setInvoices(mappedInvoices);
      }
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [user?.businessId, token]);

  const addInvoice = (data: Omit<Invoice, 'id' | 'invoiceNumber' | 'date'>) => {
    // This might be handled by recordSale on the backend, 
    // but in case we need local addition:
    const newInvoice: Invoice = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    };
    setInvoices(prev => [newInvoice, ...prev]);
  };

  const deleteInvoice = async (invoiceId: string) => {
    setLoading(true);
    try {
      setInvoices(prev => prev.filter(inv => inv.id !== invoiceId));
      await new Promise(resolve => setTimeout(() => resolve(null), 500));
    } finally {
      setLoading(false);
    }
  };

  const refreshInvoices = async () => {
    await fetchInvoices();
  };

  return (
    <InvoiceContext.Provider value={{ invoices, addInvoice, deleteInvoice, loading, refreshInvoices }}>
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoices = () => {
  const context = useContext(InvoiceContext);
  if (context === undefined) {
    throw new Error('useInvoices must be used within an InvoiceProvider');
  }
  return context;
};
