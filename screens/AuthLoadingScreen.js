import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
  TouchableOpacity,
  Image
} from 'react-native';
import * as firebase from 'firebase';

/**
 * loading screen class, displays this page while app is retreiving user info from database
 * 
 * @author nickhsiao, richardpham
 */
export default class AuthLoadingScreen extends React.Component {
  /**
   * default constructor
   * 
   * @param {*} props properties object
   */
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  /**
   *  Fetch the token from storage then navigate to appropriate page
   * 
   */
  _bootstrapAsync = async () => {
    const userFound = await firebase.auth().onAuthStateChanged(user => {
      this.props.navigation.navigate(user ? 'Home' : 'SignIn')
    });
  };

  /**
   * renders the screen, defines all user interface components and listeners for this screen
   * 
   */
  render() {
    return (
      <View style={{ marginTop: 280 }}>
        <TouchableOpacity onPress
          ={() => this.props.navigation.navigate('SignIn')}>
          <Image
            source={
              __DEV__
                ? require('../assets/images/logo.png')
                : require('../assets/images/logo.png')
            }
            style={{ alignSelf: 'center', height: 90, width: 90 }}
          />
        </TouchableOpacity>
      </View>
    );
  }
}