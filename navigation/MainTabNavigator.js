import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import HabitScreen from '../screens/HabitScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SignUpScreen from '../screens/SignUpScreen';
import PasswordChangeScreen from '../screens/PasswordChangeScreen';
import PasswordForgetScreen from '../screens/PasswordForgetScreen';
import SignInScreen from '../screens/SignInScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? 'ios-home'
          : 'md-home'
      }
    />
  ),
};

const HabitStack = createStackNavigator({
  Links: HabitScreen,
});

HabitStack.navigationOptions = {
  tabBarLabel: 'Habits',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-list-box' : 'md-list-box'}
    />
  ),
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
    />
  ),
};

// Signup Screen
const SignUpStack = createStackNavigator({
  SignUp: SignUpScreen,
});

SignUpStack.navigationOptions = {
  tabBarLabel: 'Sign Up',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-add' : 'md-add'}
    />
  ),
};

// Password Change Screen
const PasswordChangeStack = createStackNavigator({
  PasswordChange: PasswordChangeScreen,
});

PasswordChangeStack.navigationOptions = {
  tabBarLabel: 'Change Password',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-refresh' : 'md-refresh'}
    />
  ),
};

// Password Forget Screen
const PasswordForgetStack = createStackNavigator({
  PasswordForget: PasswordForgetScreen,
});

PasswordForgetStack.navigationOptions = {
  tabBarLabel: 'Forgot Password',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-help' : 'md-help'}
    />
  ),
};

// Signup Screen
const SignInStack = createStackNavigator({
  SignIn: SignInScreen,
});


  SignInStack.navigationOptions = {
    tabBarLabel: 'Sign In',
    tabBarIcon: ({ focused }) => (
      <TabBarIcon
        focused={focused}
        name={Platform.OS === 'ios' ? 'ios-add' : 'md-add'}
      />
    ),
  };






export default createBottomTabNavigator({
  HomeStack,
  HabitStack,
  SettingsStack,
  SignUpStack,
  PasswordChangeStack,
  PasswordForgetStack,
  SignInStack,
});

