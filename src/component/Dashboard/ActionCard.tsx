import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

interface ActionCardProps {
  title: string;
  subtitle: string;
  onPress?: () => void;
}

const ActionCard: React.FC<ActionCardProps> = ({ title, subtitle, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24, // Matches StatCard
    padding: 24, // More padding
    marginBottom: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  content: {
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800', // Bolder
    color: '#000000',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#4B5563',
  },
});

export default ActionCard;
