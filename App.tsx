/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar, useColorScheme } from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import { SalesProvider } from './src/context/SalesContext';
import { AuthProvider } from './src/context/AuthContext';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <AuthProvider>
          <SalesProvider>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </SalesProvider>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

export default App;
