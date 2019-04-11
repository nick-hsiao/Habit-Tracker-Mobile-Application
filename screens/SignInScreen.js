
import React from 'react';
import { Text, StyleSheet, ScrollView, View, Alert,TextInput} from 'react-native';
//import { sanFranciscoWeights } from 'react-native-typography'
import { Button,Input } from 'react-native-elements';
import * as firebase from 'firebase';

const INITIAL_STATE = {
  email: "",
  password: "",
  error: null
};

export default class SignInScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  //Authentication, from https://www.youtube.com/watch?v=ILlHA2kIuxs
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
          if (error.code == 'auth/invalid-email'){
            Alert.alert("Invalid Email","Please Try Again");
          }
          else if(error.code == 'auth/wrong-password') {
            Alert.alert("Invalid Password","Please Try Again");
          }
          //Alert.alert(error.code);
          //Alert.alert(error.message);
          
        });

        
        event.preventDefault();

        var user = firebase.auth().currentUser;

if (user) {
  // User is signed in.
  //Alert.alert("You are signed in!");
} else {
  // No user is signed in.
  //Alert.alert("Sign In Error");
}
      
  };

  onSubmit2 = event => {
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        Alert.alert("You have signed out.");
      }).catch(function(error) {
        // An error happened.
        Alert.alert("Sign Out Error");
      });

      event.preventDefault();
      
  };

  _onPressButton() {
    Alert.alert('Hello!')
  }

  handleName = (text) => {
    this.setState({ username: text })
  }

  hello = (name) => {
    Alert.alert(this.state.email + " test " + this.state.password);
  }

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

      if(firebase.auth().currentUser)
      {
          return (
            <View style={{ flex: 1 }}>
            <Text style = {styles.helloText}> You are already signed in </Text>
            <Button style = {styles.button}
  onPress = {this.onSubmit2}
  title="Sign Out"
/>
            </View>
          );
      }
    else return (
      <View style={{ flex: 1 }}>

<Text style = {styles.helloText}> SIGN IN </Text>
        <ScrollView contentContainerStyle={styles.container}>

          <Input
          inputStyle = {styles.inputStyle}
          errorStyle = {styles.errorStyle}
          //errorMessage = {isInvalid ? "Invalid Email" : ""}
          containerStyle = {styles.containerStyle}
          inputContainerStyle={styles.inputContainer}
          placeholder="Email"
          returnKeyLabel = {"next"}
          onChange={this.onChange}
          onChangeText = {(text) => this.setState({email:text})}
          />
          <Input
          inputStyle = {styles.inputStyle}
          
          containerStyle = {styles.containerStyle}
          inputContainerStyle={styles.inputContainer}
          secureTextEntry={true}
          placeholder="Password"
          returnKeyLabel = {"next"}
          onChange={this.onChange}
          onChangeText = {(text) => this.setState({password:text})}
          />



          <Button style = {styles.button}
          disabled = {isInvalid}
            onPress = {this.onSubmit}
            title="Log In"
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
    textAlign: 'center',
    marginLeft: 40,
    marginRight: 40,
    
    
  },
  inputStyle:{
    fontFamily: 'System',
    paddingLeft: 10,
    

  },
  containerStyle:{
    paddingBottom: 15
  },
  errorStyle:{
    marginLeft: 40,
    marginRight: 40,
    color: 'red'
  }

});



