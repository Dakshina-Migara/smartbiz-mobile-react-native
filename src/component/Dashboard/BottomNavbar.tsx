import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from '@react-native-vector-icons/material-design-icons';

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
  >
    <Icon 
      name={icon as any} 
      size={24} 
      color={isActive ? '#0F172A' : '#64748B'} 
    />
    <Text style={[styles.navLabel, isActive && styles.activeNavLabel]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const BottomNavbar = () => {
  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <NavItem label="Dashboard" icon="grid-view" isActive={true} />
        <NavItem label="Inventory" icon="home" />
        <NavItem label="Sales" icon="shopping-cart" />
        <NavItem label="Invoice" icon="description" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30, // Positioned at the bottom with some margin
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  navbar: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB', // Solid light grey matching the background or slightly different
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
    flex: 1, // Equal width for items
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 40,
  },
  activeNavItem: {
    backgroundColor: '#FFFFFF', // White pill for active item
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
