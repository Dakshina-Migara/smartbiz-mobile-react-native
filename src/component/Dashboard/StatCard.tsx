import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

interface StatCardProps {
  label: string;
  value: string | number;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2; // 20px padding on each side + 20px gap

const StatCard: React.FC<StatCardProps> = ({ label, value }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: CARD_WIDTH,
    height: 140,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    // Slightly more pronounced shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '700', // Bolder label
    color: '#000000', // Pure black like image looks
    marginBottom: 8,
    textAlign: 'center',
  },
  value: {
    fontSize: 40, // Much larger value
    fontWeight: '900', // Heavy bold
    color: '#000000',
    textAlign: 'center',
  },
});

export default StatCard;
