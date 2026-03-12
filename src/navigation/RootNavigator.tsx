import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../screens/dashboard/dashboard';
import InventoryScreen from '../screens/inventory/inventory';
import SalesScreen from '../screens/sales/sales';
import InvoiceScreen from '../screens/invoice/invoice';

export type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  Inventory: undefined;
  Sales: undefined;
  Invoice: undefined;
};

import LoginScreen from '../screens/auth/LoginScreen';
import { useAuth } from '../context/AuthContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const { token } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      {!token ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <>
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="Inventory" component={InventoryScreen} />
          <Stack.Screen name="Sales" component={SalesScreen} />
          <Stack.Screen name="Invoice" component={InvoiceScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
