import React from 'react';
import { Image, Button, Text, View , StyleSheet, Alert} from 'react-native';
import { ListItem,Icon} from 'react-native-elements';
import {Header,Body} from "native-base";
import * as firebase from 'firebase';


export default class SettingsScreen2 extends React.Component {
  
  _forgotPassword = () => {
    this.props.navigation.navigate('PasswordForget');
  }
  _changePassword = () => {
    this.props.navigation.navigate('PasswordChange')
  }
  _signOut = () => {
      firebase.auth().signOut();
      Alert.alert("You Have Signed Out.");
      this.props.navigation.navigate('SignIn');
    
    }
  _goBack = () => {
    this.props.navigation.navigate('Home');
  }
  
  render() {
    const list = [
      {
        title: 'Forgot Password',
        icon: 'email',
        type: 'material'
        
      },
      {
        title: 'Change Password',
        icon: 'key',
        type: 'font-awesome'
     
      },
      {
        title: 'Sign Out',
        icon: 'person',
        type: 'material'
      },
      {
        title: 'Go Back',
        icon: 'share-square-o',
        type: 'font-awesome'
      },
    
    ]


      
    
    return (
    
      <View style = {styles.Container}>
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
              <View style = {{paddingTop: 40}}>

        {
        list.map((item, i) => (
          <ListItem
            topDivider = {true}
            bottomDivider = {true}
            key={i}
            containerStyle = {{height: 55,}}
            title={item.title}
            titleStyle = {styles.titleText}
            leftIcon= {<Icon
            name={item.icon}
            type = {item.type}
            color='#414042'
          />}
            rightIcon = {<Icon
              name='chevron-right'
              color='#414042'
              size = {30}
            />}
            onPress = {item.icon === 'email' ? this._forgotPassword: 
            item.icon === 'key' ? this._changePassword: item.icon === 'person' ? this._signOut : this._goBack}
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
  Container:{
    paddingTop: 20
  },
  welcomeImage: {
    width: 65,
    height: 65,
    resizeMode: 'contain',
    
   
  
  },
  
});
