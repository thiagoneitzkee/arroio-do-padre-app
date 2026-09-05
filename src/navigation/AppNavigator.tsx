import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuthStore } from '../store/authStore';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// App Screens
import HomeScreen from '../screens/app/HomeScreen';
// import RequestsScreen from '../screens/app/RequestsScreen';
// import NewRequestScreen from '../screens/app/NewRequestScreen';
// import ProfileScreen from '../screens/app/ProfileScreen';
// import RequestDetailsScreen from '../screens/app/RequestDetailsScreen';

const AuthStack = createNativeStackNavigator();
const AppStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

function AppTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#2E7D32',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          borderTopColor: '#DDD',
          borderTopWidth: 1,
          backgroundColor: '#FFF',
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="RequestsTab"
        component={HomeScreen}
        options={{
          title: 'Solicitações',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="file-document-multiple" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="NewTab"
        component={HomeScreen}
        options={{
          title: 'Nova',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="plus-circle" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={HomeScreen}
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" color={color} size={24} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  return (
    <AppStack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#2E7D32',
        },
        headerTintColor: '#FFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <AppStack.Screen
        name="Home"
        component={AppTabNavigator}
        options={{ headerShown: false }}
      />
      {/* Add other app screens here */}
    </AppStack.Navigator>
  );
}

export function RootNavigator() {
  const { isAuthenticated } = useAuthStore();

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
