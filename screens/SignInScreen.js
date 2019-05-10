
import React from 'react';
import { StyleSheet, ScrollView, View, Alert, Image } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { Header, Body } from "native-base";
import * as firebase from 'firebase';

const INITIAL_STATE = {
  email: "",
  password: "",
  error: null
};

/**
 * 
 * @author nickhsiao, richardpham
 * 
 */
export default class SignInScreen extends React.Component {

  /**
   * 
   * constructor initializes variables and states
   * 
   * @param props properties object
   */
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  /**
   * 
   * uses the email and password entered to sign in. 
   * 
   * allows user to sign in, modified from https://www.youtube.com/watch?v=ILlHA2kIuxs at 10:55 via onLoginPress()
   */
  onSubmit = event => {
    const { email, password } = this.state;


    this.props.firebase
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })

      .catch(error => {
        this.setState({ error });
        if (error.code == 'auth/invalid-email') {
          Alert.alert("Invalid Email", "Please Try Again");
        }
        else if (error.code == 'auth/wrong-password') {
          Alert.alert("Invalid Password", "Please Try Again");
        }
        else if (error.code == 'auth/user-not-found') {
          Alert.alert("User Not Found", "Please Try Again");
        }
      });


    event.preventDefault();

    var user = firebase.auth().currentUser;

    if (user != null) { this.props.navigation.navigate('Home'); }


  };


  /**
   * 
   * Signs out of the account. Referenced from firebase API https://firebase.google.com/docs/auth/web/password-auth
   */
  onSubmit2 = event => {
    firebase.auth().signOut().then(function () {
      // Sign-out successful.

      Alert.alert("You have signed out.");
    }).catch(function (error) {
      // An error happened.
      Alert.alert("Sign Out Error");
    });

    this.props.navigation.navigate('Auth');

    event.preventDefault();

  };

  /**
   * 
   * used to set state of a value when value is changed
   */
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };


  render() {

    const {
      email,
      password,
      error
    } = this.state;

    const isInvalid =
      password === "" ||
      email === "";

    return (
      <View>
        <Header transparent>

          <Body>
            <Image
              source={
                __DEV__
                  ? require('../assets/images/signin.png')
                  : require('../assets/images/signin.png')
              }
              style={styles.welcomeImage}
            />
          </Body>


        </Header>



        <ScrollView contentContainerStyle={styles.container}>
          <Input
            inputStyle={styles.inputStyle}
            errorStyle={styles.errorStyle}
            containerStyle={styles.containerStyle1}
            inputContainerStyle={styles.inputContainer}
            placeholder="Email"
            returnKeyLabel={"next"}
            onChange={this.onChange}
            onChangeText={(text) => this.setState({ email: text })}
          />
          <Input
            inputStyle={styles.inputStyle}

            containerStyle={styles.containerStyle}
            inputContainerStyle={styles.inputContainer}
            secureTextEntry={true}
            placeholder="Password"
            returnKeyLabel={"next"}
            onChange={this.onChange}
            onChangeText={(text) => this.setState({ password: text })}
          />



          <Button style={styles.button}
            disabled={isInvalid}
            onPress={this.onSubmit}
            title="Log In"
          />

          <Button

            type='clear'
            onPress={() => this.props.navigation.navigate('SignUpScreen')}
            title="Don't Have An Account? Sign Up!"
            titleStyle={{ fontSize: 15 }}
          />


          <Button

            type='clear'
            onPress={() => this.props.navigation.navigate('AuthPasswordForgetScreen')}
            title="Forgot Password?"
            titleStyle={{ fontSize: 15 }}
          />



        </ScrollView>
      </View>
    )

  }
}


const styles = StyleSheet.create({
  container: {
    fontFamily: 'System',
    fontWeight: '200',
    flexGrow: 1,
  },
  otherText: {
    fontSize: 30,
    fontFamily: 'System',
    paddingTop: 30,
    paddingBottom: 10,
    textAlign: 'center',
  },
  titleText: {

    fontSize: 30,
    fontFamily: 'System',
    marginTop: 60,
    paddingBottom: 10,
    marginLeft: 45,
    marginRight: 45,
    color: '#414042'
  },
  helloText: {
    fontFamily: 'System',
    fontSize: 40,
    fontWeight: '200',
    flexDirection: 'row',
    textAlign: 'center',
    paddingTop: 30,
    paddingBottom: 20

  },
  button: {
    margin: 10,
    marginLeft: 130,
    marginRight: 130,
    borderRadius: 5,
  },
  inputContainer: {

    marginLeft: 40,
    marginRight: 40,


  },
  inputStyle: {
    fontFamily: 'System',
    paddingLeft: 10,


  },
  containerStyle: {
    paddingBottom: 15
  },
  containerStyle1: {
    paddingBottom: 15,
    marginTop: 90
  },
  errorStyle: {
    marginLeft: 40,
    marginRight: 40,
    color: 'red'
  },
  welcomeImage: {
    width: 230,
    height: 230,
    resizeMode: 'contain',
    marginTop: 85,





  },

});



