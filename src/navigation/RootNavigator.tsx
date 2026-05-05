import React, { useEffect, useRef } from 'react';
import { View, ActivityIndicator, Keyboard, Platform } from 'react-native';
import { NavigationContainer, NavigationState } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useAuth } from '../store/AuthContext';
import { useTabSwipe } from '../store/TabSwipeContext';
import { CustomTabBar } from '../components/CustomTabBar';
import { Colors } from '../constants/colors';

import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { FeedScreen } from '../screens/FeedScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { CreatePostScreen } from '../screens/CreatePostScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { AnalyticsScreen } from '../screens/AnalyticsScreen';

const Stack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

function MainTabs() {
  const { swipeEnabled } = useTabSwipe();
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      tabBarPosition="bottom"
      screenOptions={{ swipeEnabled, animationEnabled: true, lazy: true }}
    >
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Create" component={CreatePostScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function MainStackNav() {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="Tabs" component={MainTabs} />
      <MainStack.Screen name="Analytics" component={AnalyticsScreen} />
    </MainStack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

const KEYBOARD_ALLOWED_ROUTES = new Set(['Create', 'Login', 'Register', 'Search']);

function getActiveRoute(
  state: NavigationState | undefined
): { key: string; name: string } | undefined {
  if (!state) return undefined;
  const route = state.routes[state.index];
  const childState = route.state as NavigationState | undefined;
  if (childState && typeof childState.index === 'number') {
    return getActiveRoute(childState);
  }
  return { key: route.key, name: route.name };
}

export function RootNavigator() {
  const { user, isLoading } = useAuth();
  const lastRouteKey = useRef<string | undefined>(undefined);
  const activeRouteName = useRef<string | undefined>(undefined);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const sub = Keyboard.addListener(showEvent, () => {
      const name = activeRouteName.current;
      if (name && !KEYBOARD_ALLOWED_ROUTES.has(name)) {
        Keyboard.dismiss();
      }
    });
    return () => sub.remove();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={Colors.accent} />
      </View>
    );
  }

  return (
    <NavigationContainer
      onStateChange={(state) => {
        const active = getActiveRoute(state);
        if (active && lastRouteKey.current && active.key !== lastRouteKey.current) {
          Keyboard.dismiss();
        }
        lastRouteKey.current = active?.key;
        activeRouteName.current = active?.name;
      }}
    >
      {user ? <MainStackNav /> : <AuthStack />}
    </NavigationContainer>
  );
}
