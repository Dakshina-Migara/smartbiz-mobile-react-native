import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  StatusBar 
} from 'react-native';
import { FAB } from 'react-native-paper';
import StatCard from '../../component/Dashboard/StatCard';
import ActionCard from '../../component/Dashboard/ActionCard';
import BottomNavbar from '../../component/Dashboard/BottomNavbar';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

const DashboardScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#E5E7EB" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>Welcome back! Here's your business overview.</Text>
        </View>

        <View style={styles.statsGrid}>
          <StatCard label="Total Products" value="3" />
          <StatCard label="Total Sales" value="0" />
          <StatCard label="Revenue" value="$ 0.00" />
          <StatCard label="Low Stock Item" value="0" />
        </View>

        <View style={styles.actionSection}>
          <Text style={styles.sectionTitle}>Quick Action</Text>
          
          <ActionCard 
            title="New Sale" 
            subtitle="Create a new sale entry" 
            onPress={() => navigation.navigate('Sales')}
          />
          
          <ActionCard 
            title="Manage Inventory" 
            subtitle="Add or Update Product" 
            onPress={() => navigation.navigate('Inventory')}
          />
        </View>

        {/* Space for floating navbar */}
        <View style={{ height: 100 }} />
      </ScrollView>

      <FAB
        icon="message-outline"
        style={styles.fab}
        color="#FFFFFF"
        onPress={() => console.log('FAB pressed')}
      />

      <BottomNavbar activeTab="Dashboard" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E7EB', // Slightly darker grey to match image better
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 40, // More top padding like in image
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '900', // More bold
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#4B5563',
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  actionSection: {
    width: '100%',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 10,
    bottom: 110,
    backgroundColor: '#000000', // Black FAB from image
    borderRadius: 30, // Make it more circular
  },
});

export default DashboardScreen;
