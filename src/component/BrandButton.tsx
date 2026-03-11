import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

interface BrandButtonProps {
  onPress: () => void;
  children: string;
  mode?: 'contained' | 'outlined' | 'text';
  style?: any;
}

const BrandButton: React.FC<BrandButtonProps> = ({ 
  onPress, 
  children, 
  mode = 'contained',
  style 
}) => {
  return (
    <Button
      mode={mode}
      onPress={onPress}
      style={[styles.button, style]}
      labelStyle={styles.buttonLabel}
      contentStyle={styles.buttonContent}
    >
      {children}
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    backgroundColor: '#6366F1', // Indigo 500
    elevation: 0,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  buttonContent: {
    height: 56,
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'none',
  },
});

export default BrandButton;
