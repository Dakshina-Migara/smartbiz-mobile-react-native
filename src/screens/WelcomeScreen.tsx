import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BrandButton from '../component/BrandButton';

const { width } = Dimensions.get('window');

const WelcomeScreen = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/images/welcome_hero.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>Welcome to SmartBiz</Text>
          <Text style={styles.subtitle}>
            Empower your business with smart digital solutions. Manage, grow, and scale with ease.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <BrandButton onPress={() => console.log('Get Started pressed')}>
            Get Started
          </BrandButton>
          
          <TouchableOpacity 
            style={styles.loginContainer}
            activeOpacity={0.7}
            onPress={() => console.log('Login pressed')}
          >
            <Text style={styles.loginText}>
              Already have an account? <Text style={styles.loginLink}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  imageContainer: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  image: {
    width: width * 0.85,
    height: width * 0.85,
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0F172A', // Slate 900
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B', // Slate 500
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
  },
  loginContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 15,
    color: '#64748B', // Slate 500
  },
  loginLink: {
    color: '#6366F1',
    fontWeight: '700',
  },
});

export default WelcomeScreen;
