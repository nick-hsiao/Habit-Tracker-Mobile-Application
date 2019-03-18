
import React from 'react';
import { Text, StyleSheet, ScrollView, View, Alert,TextInput} from 'react-native';
import { sanFranciscoWeights } from 'react-native-typography'
import { Button } from 'react-native-elements';
import * as firebase from 'firebase';

const INITIAL_STATE = {
  username: "",
  firstName: "",
  lastName: "",
  email: "",
  passwordOne: "",
  passwordTwo: "",
  error: null
};



export default class SignUpScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  //Authentication, from https://www.youtube.com/watch?v=ILlHA2kIuxs
  onSubmit = event => {
    const { username, firstName, lastName, email, passwordOne } = this.state;

   //this.props.firebase
      if(!email.includes('@') || !email.includes('.'))
      {
        Alert.alert("Email is badly formatted");
      }
      else if(passwordOne.length < 8)
      {
        Alert.alert("Password must have minimum of 8 characters");
      }
      else{
        firebase.auth().createUserWithEmailAndPassword(email, passwordOne)
        .then(authUser => {
          // Create a user in your Firebase realtime database
          return this.props.firebase.user(authUser.user.uid).set({
            username,
            email
          });
        })
        .then(authUser => {
          this.setState({ ...INITIAL_STATE });
          this.props.history.push(ROUTES.HOME);
        })
        .catch(error => {
          this.setState({ error });
        });
        Alert.alert("Account created");
      }
  
  };

  _onPressButton() {
    Alert.alert('Hello!')
  }

  handleName = (text) => {
    this.setState({ username: text })
  }

  hello = (name) => {
    Alert.alert(this.state.email + " test " + this.state.passwordOne);
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };


  render() {

    const {
      username,
      firstName,
      lastName,
      email,
      passwordOne,
      passwordTwo,
      error
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === "" ||
      email === "" ||
      username === "" ||
      firstName === "" ||
      lastName === "";

    return (
      <View style={{ flex: 1 }}>

<Text style = {styles.helloText}> SIGN UP </Text>
        <ScrollView contentContainerStyle={styles.container}>

          <TextInput
          style={styles.textInput}
          placeholder="Username"
          returnKeyLabel = {"next"}
          onChange={this.onChange}
          onChangeText = {(text) => this.setState({username:text})}
          />
                    <TextInput
          style={styles.textInput}
          placeholder="First Name"
          returnKeyLabel = {"next"}
          onChange={this.onChange}
          onChangeText = {(text) => this.setState({firstName:text})}
          />
                    <TextInput
          style={styles.textInput}
          placeholder="Last Name"
          returnKeyLabel = {"next"}
          onChange={this.onChange}
          onChangeText = {(text) => this.setState({lastName:text})}
          />

<TextInput
          style={styles.textInput}
          placeholder="Email"
          returnKeyLabel = {"next"}
          onChange={this.onChange}
          onChangeText = {(text) => this.setState({email:text})}
          />
                              <TextInput
          style={styles.textInput}
          secureTextEntry={true}
          placeholder="Password"
          returnKeyLabel = {"next"}
          onChange={this.onChange}
          onChangeText = {(text) => this.setState({passwordOne:text})}
          />
                              <TextInput
          style={styles.textInput}
          secureTextEntry={true}
          placeholder="Confirm Password"
          returnKeyLabel = {"next"}
          onChange={this.onChange}
          onChangeText = {(text) => this.setState({passwordTwo:text})}
          />


          <Button style = {styles.button}
          disabled = {isInvalid}
            onPress = {this.onSubmit}
            title="Submit"
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
    fontSize: 60,
    fontWeight: '200',
    flexDirection: 'row',
    textAlign: 'center',
    paddingTop: 30,
    paddingBottom: 20

  },
  button: {
    margin: 10,
    marginLeft: 100,
    marginRight: 100
  },
  textInput: {
    textAlign: 'center',
    marginLeft: 60,
    marginRight: 60,
    marginBottom: 10,
    fontSize: 25,
    borderWidth: 0.5,
    paddingTop: 5,
    paddingBottom: 5,
    justifyContent: 'space-around'
  }
});
