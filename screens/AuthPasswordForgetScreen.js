import React from 'react';
import { Text, StyleSheet, ScrollView, View, Alert, TextInput, Image } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { Container, Header, Left, Right, Body, Title } from "native-base";
import * as firebase from 'firebase';

const INITIAL_STATE = {
  email: "",
  error: null
};

/**
 * password forget screen class, navigates to this page from sign in screen when no user is logged in
 * 
 * @author nickhsiao, richardpham
 */
export default class PasswordForgetScreen extends React.Component {
  /**
   * default constructor
   * 
   * @param {*} props properties object
   */
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  /**
   * validates email then sends an email to reset password if valid
   * 
   */
  onSubmit = event => {
    const { email } = this.state;


    this.props.firebase
    firebase.auth().sendPasswordResetEmail(email)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        Alert.alert("Success","Please Check Your E-mail");
        this.props.navigation.navigate('SignIn');
      })
      .catch(error => {
        this.setState({ error });
        if (error.code == 'auth/invalid-email') {
          Alert.alert("Invalid Email", "Please Try Again");
        }
        else if (error.code == 'auth/user-not-found') {
          Alert.alert("User Not Found", "Please Try Again");
        }


        console.log(error.code);
      });

    event.preventDefault();


  };

  /**
   * listener method for change in input
   * 
   */
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  /**
   * renders the screen, defines all user interface components and listeners for this screen
   * 
   */
  render() {

    const { email, error } = this.state;

    const isInvalid = email === "";

    return (
      <View>

        <Header transparent>

          <Body>
            <Image
              source={
                __DEV__
                  ? require('../assets/images/forgot.png')
                  : require('../assets/images/forgot.png')
              }
              style={styles.welcomeImage}
            />
          </Body>


        </Header>


        <ScrollView contentContainerStyle={styles.container}>


          <Input
            inputStyle={styles.inputStyle}
            errorStyle={styles.errorStyle}

            containerStyle={styles.containerStyle}
            inputContainerStyle={styles.inputContainer}
            placeholder="Email"
            returnKeyLabel={"next"}
            onChange={this.onChange}
            onChangeText={(text) => this.setState({ email: text })}
          />

          <Button style={styles.button}
            disabled={isInvalid}
            onPress={this.onSubmit}
            title="Reset My Password"
          />


        </ScrollView>
      </View>
    )

  }
}

/**
 * styles sheet used to for styling and positioning of components and text
 * 
 */
const styles = StyleSheet.create({
  container: {
    fontFamily: 'System',
    fontWeight: '200',
    flexGrow: 1,
  },
  titleText: {
    fontSize: 25,
    fontFamily: 'System',
    paddingTop: 30,
    paddingBottom: 10,
    marginLeft: 45,
    marginRight: 45,
    flexDirection: 'row',
  },
  helloText: {
    fontFamily: 'System',
    fontSize: 30,
    fontWeight: '200',
    flexDirection: 'row',
    textAlign: 'center',
    paddingTop: 30,
    paddingBottom: 20

  },
  button: {
    margin: 10,
    marginLeft: 100,
    marginRight: 100,
    borderRadius: 5,
  },
  textInput: {
    textAlign: 'center',
    borderRadius: 5,
    marginLeft: 60,
    marginRight: 60,
    marginBottom: 10,
    fontSize: 25,
    borderWidth: 0.5,
    paddingTop: 5,
    paddingBottom: 5,
    justifyContent: 'space-around'
  },
  inputContainer: {

    marginLeft: 40,
    marginRight: 40,
  },
  inputStyle: {
    fontFamily: 'System',
    paddingLeft: 10,
    marginTop: 40
  },
  containerStyle: {
    paddingBottom: 15
  },
  errorStyle: {
    marginLeft: 40,
    marginRight: 40,
    color: 'red'
  },
  welcomeImage: {
    width: 340,
    height: 340,
    resizeMode: 'contain',
    marginTop: 45,






  },
});
