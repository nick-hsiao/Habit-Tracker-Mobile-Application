
import React from 'react';
import { Text, StyleSheet, ScrollView, View, Alert,TextInput} from 'react-native';
//import { sanFranciscoWeights } from 'react-native-typography'
import { Button,Input } from 'react-native-elements';
import * as firebase from 'firebase';

const INITIAL_STATE = {
  username: "",
  firstName: "",
  lastName: "",
  email: "",
  passwordOne: "",
  passwordTwo: "",
  userID: 1234,
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

   
      if(!email.includes('@') || !email.includes('.'))
      {
        Alert.alert("Email is badly formatted");
      }
      else if(passwordOne.length < 8)
      {
        Alert.alert("Password must have minimum of 8 characters");
      }
      else{
        this.props.firebase
        firebase.auth().createUserWithEmailAndPassword(email, passwordOne)
        .then(authUser => {

          uid= authUser.user.uid;

          firebase.database().ref(`UsersList/${uid}`).set({
            username,
            firstName,
            lastName,
            userID: uid
          })
          

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
          Alert.alert(error.message);
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

<Text style = {styles.titleText}> SIGN UP :D</Text>
        <ScrollView contentContainerStyle={styles.container}>

          <Input
          inputStyle = {styles.inputStyle}
          errorStyle = {styles.errorStyle}
          
          containerStyle = {styles.containerStyle}
          inputContainerStyle={styles.inputContainer}
          placeholder="Username"
          returnKeyLabel = {"next"}
          onChange={this.onChange}
          onChangeText = {(text) => this.setState({username:text})}
          />
          <Input
          inputStyle = {styles.inputStyle}
          errorStyle = {styles.errorStyle}
          
          containerStyle = {styles.containerStyle}
          inputContainerStyle={styles.inputContainer}
          placeholder="First Name"
          returnKeyLabel = {"next"}
          onChange={this.onChange}
          onChangeText = {(text) => this.setState({firstName:text})}
          />
                    <Input
          inputStyle = {styles.inputStyle}
          errorStyle = {styles.errorStyle}
          
          containerStyle = {styles.containerStyle}
          inputContainerStyle={styles.inputContainer}
          placeholder="Last Name"
          returnKeyLabel = {"next"}
          onChange={this.onChange}
          onChangeText = {(text) => this.setState({lastName:text})}
          />

          <Input
          inputStyle = {styles.inputStyle}
          errorStyle = {styles.errorStyle}
          
          containerStyle = {styles.containerStyle}
          inputContainerStyle={styles.inputContainer}
          placeholder="Email"
          returnKeyLabel = {"next"}
          onChange={this.onChange}
          onChangeText = {(text) => this.setState({email:text})}
          />
                             <Input
          inputStyle = {styles.inputStyle}
          errorStyle = {styles.errorStyle}
          
          containerStyle = {styles.containerStyle}
          inputContainerStyle={styles.inputContainer}
          secureTextEntry={true}
          placeholder="Password"
          returnKeyLabel = {"next"}
          onChange={this.onChange}
          onChangeText = {(text) => this.setState({passwordOne:text})}
          />
                           <Input
          inputStyle = {styles.inputStyle}
          errorStyle = {styles.errorStyle}
          
          containerStyle = {styles.containerStyle}
          inputContainerStyle={styles.inputContainer}
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
  titleText:{
    fontSize: 30,
    fontFamily: 'System',
    paddingTop: 30,
    paddingBottom: 10,
    marginLeft: 45,
    marginRight: 45,
    flexDirection: 'row',
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
    marginRight: 100,
    borderRadius: 5
  },
  textInput: {
    borderRadius: 5,
    textAlign: 'center',
    marginLeft: 60,
    marginRight: 60,
    marginBottom: 10,
    fontSize: 25,
    borderWidth: 0.5,
    paddingTop: 5,
    paddingBottom: 5,
    justifyContent: 'space-around',
    borderRadius: 5,
  },
  inputContainer: {
    
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
  },
});
