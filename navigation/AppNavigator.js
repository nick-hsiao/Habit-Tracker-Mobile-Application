import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator} from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import HabitScreen from '../screens/HabitScreen';
import SignUpScreen from '../screens/SignUpScreen';
import PasswordChangeScreen from '../screens/PasswordChangeScreen';
import PasswordForgetScreen from '../screens/PasswordForgetScreen';
import SignInScreen from '../screens/SignInScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
  Settings: SettingsScreen,
  SignIn: SignInScreen,
  PasswordChange: PasswordChangeScreen,
  PasswordForget: PasswordForgetScreen,
  HabitScreen: HabitScreen,
  SignUpScreen: SignUpScreen
  },
  {
    initialRouteName: 'Home',
    defaultNavigationOptions:  {
      
      header: null
  }
    
  }
);


export default createAppContainer(createSwitchNavigator({
  
  Main: HomeStack,
}));