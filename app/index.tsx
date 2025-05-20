import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './Context/AuthContext';
import App from './Screen/App';  // Đảm bảo bạn không có NavigationContainer trong Index
import { useFonts } from 'expo-font';

const Index = () => {
  const [loaded, error] = useFonts({
    'Cairo-Bold': require('../assets/Fonts/Cairo-Bold.ttf'),
    'Cairo-Regular': require('../assets/Fonts/Cairo-Regular.ttf'),
    'Cairo-SemiBold': require('../assets/Fonts/Cairo-SemiBold.ttf'),
    'Cairo-ExtraBold': require('../assets/Fonts/Cairo-ExtraBold.ttf'),
    'Cairo-Medium': require('../assets/Fonts/Cairo-Medium.ttf'),
    'Cairo-Light': require('../assets/Fonts/Cairo-Light.ttf'),
  });

  if (!loaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <AuthProvider>
        <App /> 
      </AuthProvider>
    </GestureHandlerRootView>
  );
};

export default Index;
