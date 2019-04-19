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

export default class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await setTimeout(firebase.auth().onAuthStateChanged(),
        2000
    )

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(userToken ? 'Home' : 'Auth');
  };

  // Render any loading content that you like here
  render() {
    return (
        <View style = {{marginTop: 280}}>
        <TouchableOpacity onPress 
         ={() => this.props.navigation.navigate('SignIn')}>
               <Image
            source={
             __DEV__
                ? require('../assets/images/logo.png')
                : require('../assets/images/logo.png')
           }
           style={{alignSelf: 'center',height: 90, width: 90 }}
          />
          </TouchableOpacity>
            </View>
    );
  }
}