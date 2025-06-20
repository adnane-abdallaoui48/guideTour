import { useEffect } from 'react';
import { useFonts, Montserrat_400Regular, Montserrat_500Medium, Montserrat_700Bold, Montserrat_600SemiBold } from '@expo-google-fonts/montserrat';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignIn from './src/components/SignIn';
import SignUp from './src/components/SignUp';
import Splash from './src/components/Splach';
import Toast from 'react-native-toast-message';
import MainTabs from './src/components/MainTabs';
import DestinationDetail from './src/components/DestinationDetail';
import ProfileDetailsScreen from './src/components/Profile/ProfileDetailsScreen';
import WelcomeSc from './src/components/WelcomeSc';
import AllPlaces from './src/components/AllPlaces';
import SettingsScreen from './src/components/Profile/Cards/SettingsScreen';

const Stack = createNativeStackNavigator();
export default function App() {
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
    Montserrat_500Medium,
    Montserrat_600SemiBold
  });

  useEffect(() => {
    if (fontsLoaded) {
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;
  return (
    <>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="DestinationDetail" component={DestinationDetail} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="WelcomeSc" component={WelcomeSc} />
        <Stack.Screen name="ProfileDetails" component={ProfileDetailsScreen} />
        <Stack.Screen name="AllPlaces" component={AllPlaces} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
    <Toast />
    </>
  );
}
