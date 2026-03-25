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
import { InvoiceProvider } from './src/context/InvoiceContext';
import { AIProvider, useAI } from './src/context/AIContext';
import AIChatModal from './src/component/Dashboard/AIChatModal';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <AuthProvider>
          <InvoiceProvider>
            <SalesProvider>
              <AIProvider>
                <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
                <NavigationContainer>
                  <RootNavigator />
                </NavigationContainer>
                <GlobalAIChatWrapper />
              </AIProvider>
            </SalesProvider>
          </InvoiceProvider>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const GlobalAIChatWrapper = () => {
  const { isAIChatVisible, closeAIChat } = useAI();
  return <AIChatModal isVisible={isAIChatVisible} onClose={closeAIChat} />;
};

export default App;
