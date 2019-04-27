import React from 'react';
import { Image, Button, Text, View, StyleSheet, Alert } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import { Header, Body } from "native-base";
import * as firebase from 'firebase';


export default class SettingsScreen2 extends React.Component {

  _forgotPassword = () => {
    this.props.navigation.navigate('PasswordForget');
  }
  _changePassword = () => {
    this.props.navigation.navigate('PasswordChange')
  }
  _updateInfo = () => {
    this.props.navigation.navigate('UpdateInfo')
  }
  _signOut = event => {
    firebase.auth().signOut().then(function () {
      // Sign-out successful.
      console.log(firebase.auth().currentUser);
      //this.props.navigation.navigate('Auth');
      Alert.alert("You Have Signed Out.");
      //nav
    }).catch(function (error) {
      //this.props.navigation.navigate('Home');
      Alert.alert("Sign Out Error" + error);
    });

    event.preventDefault();

  };

  _goBack = () => {
    this.props.navigation.navigate('Home');
  }

  render() {
    const list = [
      {
        title: 'Forgot Password',
        icon: 'mail',
        type: 'antdesign'

      },
      {
        title: 'Change Password',
        icon: 'unlock',
        type: 'antdesign'

      },
      {
        title: 'Update User Info',
        icon: 'idcard',
        type: 'antdesign'

      },
      {
        title: 'Sign Out',
        icon: 'logout',
        type: 'antdesign'
      },
      {
        title: 'Go Back',
        icon: 'home',
        type: 'antdesign'
      },

    ]




    return (

      <View style={styles.Container}>
        <Header transparent>

          <Body>
            <Image
              source={
                __DEV__
                  ? require('../assets/images/logo.png')
                  : require('../assets/images/logo.png')
              }
              style={styles.welcomeImage}
            />
          </Body>


        </Header>
        <View style={{ paddingTop: 40 }}>

          {
            list.map((item, i) => (
              <ListItem
                topDivider={true}
                bottomDivider={true}
                key={i}
                containerStyle={{ height: 55, }}
                title={item.title}
                titleStyle={styles.titleText}
                leftIcon={<Icon
                  name={item.icon}
                  type={item.type}
                  color='#414042'
                />}
                rightIcon={<Icon
                  name='chevron-right'
                  color='#414042'
                  size={30}
                />}
                onPress={item.icon === 'mail' ? this._forgotPassword :
                  item.icon === 'unlock' ? this._changePassword : item.icon === 'logout' ? this._signOut : item.icon === 'idcard' ? this._updateInfo :
                  this._goBack}
              />
            ))
          }
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 20,

    color: '#414042'
  },
  Container: {
    paddingTop: 15
  },
  welcomeImage: {
    width: 70,
    height: 70,
    resizeMode: 'contain',



  },

});
