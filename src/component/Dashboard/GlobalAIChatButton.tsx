import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import Icon from '@react-native-vector-icons/material-design-icons';

interface GlobalAIChatButtonProps {
  onPress?: () => void;
}

const GlobalAIChatButton: React.FC<GlobalAIChatButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.fab} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Icon name="message-text-outline" size={28} color="#FFFFFF" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 110,
    right: 20,
    backgroundColor: '#111827',
    width: 60,
    height: 60,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 999, // Ensure it's on top
  },
});

export default GlobalAIChatButton;
