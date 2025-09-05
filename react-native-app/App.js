import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';


// Importa telas
import Login from './src/pages/Login/Login';
import Home from './src/pages/MainTabs/Home/Home';
import Funcionalidades from './src/pages/MainTabs/Funcionalidades/Funcionalidades';
import Perfil from './src/pages/MainTabs/Perfil/Perfil';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator
function TabNavigator() {
  return (
    <Tab.Navigator
  screenOptions={{
    headerShown: false,
    tabBarActiveTintColor: "#2480F9",
    tabBarInactiveTintColor: "#888",
    tabBarLabelStyle: { fontSize: 12, marginBottom: 5 },
    tabBarStyle: { height: 90, paddingTop: 5, paddingBottom: 10 },
    tabBarLabelPosition: "below-icon",
    tabBarSafeAreaInsets: { bottom: 10 } // garante espaço da área segura
  }}
>
  <Tab.Screen 
    name="Início" 
    component={Home} 
    options={{
      tabBarIcon: ({ color, size }) => <Feather name="home" size={22} color={color} />,
    }}
  />
  <Tab.Screen 
    name="Funcionalidades" 
    component={Funcionalidades} 
    options={{
      tabBarIcon: ({ color, size }) => <Feather name="heart" size={22} color={color} />,
    }}
  />
  <Tab.Screen 
    name="Perfil" 
    component={Perfil} 
    options={{
      tabBarIcon: ({ color, size }) => <Feather name="user" size={22} color={color} />,
    }}
  />
</Tab.Navigator>
  );
}

// Stack Navigator
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="MainTabs" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
