import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from '@react-native-vector-icons/material-design-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

interface NavItemProps {
  label: string;
  icon: string;
  isActive?: boolean;
  onPress?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ label, icon, isActive, onPress }) => (
  <TouchableOpacity 
    style={[styles.navItem, isActive && styles.activeNavItem]} 
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Icon 
      name={icon as any} 
      size={24} 
      color={isActive ? '#000000' : '#6B7280'} 
    />
    <Text style={[styles.navLabel, isActive && styles.activeNavLabel]}>
      {label}
    </Text>
  </TouchableOpacity>
);

interface BottomNavbarProps {
  activeTab?: keyof RootStackParamList;
}

const BottomNavbar: React.FC<BottomNavbarProps> = ({ activeTab }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const navigateTo = (screen: keyof RootStackParamList) => {
    if (activeTab === screen) return;
    navigation.reset({
      index: 0,
      routes: [{ name: screen as any }],
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <NavItem 
          label="Dashboard" 
          icon="view-dashboard" 
          isActive={activeTab === 'Dashboard'} 
          onPress={() => navigateTo('Dashboard')}
        />
        <NavItem 
          label="Inventory" 
          icon="home-variant-outline" 
          isActive={activeTab === 'Inventory'} 
          onPress={() => navigateTo('Inventory')}
        />
        <NavItem 
          label="Sales" 
          icon="cart-outline" 
          isActive={activeTab === 'Sales'} 
          onPress={() => navigateTo('Sales')}
        />
        <NavItem 
          label="Invoice" 
          icon="file-document-outline" 
          isActive={activeTab === 'Invoice'} 
          onPress={() => navigateTo('Invoice')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  navbar: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    borderRadius: 50,
    paddingHorizontal: 8,
    paddingVertical: 8,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 40,
  },
  activeNavItem: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  navLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    marginTop: 4,
  },
  activeNavLabel: {
    color: '#000000',
  },
});

export default BottomNavbar;
