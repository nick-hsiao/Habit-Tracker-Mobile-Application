import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import AppNavigator from './navigation/AppNavigator';
import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyACH0_AOg1RApKqWuxhdETxshQhz5i5_c4",
  authDomain: "cmpe133-afef7.firebaseapp.com",
  databaseURL: "https://cmpe133-afef7.firebaseio.com",
  projectId: "cmpe133-afef7",
  storageBucket: "cmpe133-afef7.appspot.com",
  messagingSenderId: "458015107320"
};

firebase.initializeApp(firebaseConfig);


/**
 * handles loading state and initializes firebase
 * 
 * @author nickhsiao, richardpham
 */
export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <AppNavigator />
        </View>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        ...Icon.Ionicons.font, 
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ]);
  };

  _handleLoadingError = error => {
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

/**
 * styles sheet used to for styling and positioning of components and text
 * 
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});