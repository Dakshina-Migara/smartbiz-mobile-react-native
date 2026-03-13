import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customer: string;
  date: string;
  amount: string;
  status: 'Paid' | 'Pending' | 'Overdue';
}

interface InvoiceContextType {
  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber' | 'date'>) => void;
  loading: boolean;
  refreshInvoices: () => Promise<void>;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const InvoiceProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock initial data or fetch from backend if available
  useEffect(() => {
    const mockInvoices: Invoice[] = [
      { id: '1', invoiceNumber: 'INV-2024-001', customer: 'Acme Corp', date: 'Mar 12, 2024', status: 'Paid', amount: '$1,250.00' },
      { id: '2', invoiceNumber: 'INV-2024-002', customer: 'Global Tech', date: 'Mar 10, 2024', status: 'Pending', amount: '$840.00' },
    ];
    setInvoices(mockInvoices);
  }, []);

  const addInvoice = (data: Omit<Invoice, 'id' | 'invoiceNumber' | 'date'>) => {
    const newInvoice: Invoice = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    };
    setInvoices(prev => [newInvoice, ...prev]);
  };

  const refreshInvoices = async () => {
    // In a real app, this would fetch from /api/v1/mobile/${businessId}/invoices
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(() => resolve(null), 800));
    } finally {
      setLoading(false);
    }
  };

  return (
    <InvoiceContext.Provider value={{ invoices, addInvoice, loading, refreshInvoices }}>
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
