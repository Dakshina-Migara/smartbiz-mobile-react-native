import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../screens/dashboard/dashboard';
import InventoryScreen from '../screens/inventory/inventory';
import SalesScreen from '../screens/sales/sales';
import InvoiceScreen from '../screens/invoice/invoice';

export type RootStackParamList = {
  Dashboard: undefined;
  Inventory: undefined;
  Sales: undefined;
  Invoice: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false,
        animation: 'fade', // Smooth transitions
      }}
    >
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="Inventory" component={InventoryScreen} />
      <Stack.Screen name="Sales" component={SalesScreen} />
      <Stack.Screen name="Invoice" component={InvoiceScreen} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
