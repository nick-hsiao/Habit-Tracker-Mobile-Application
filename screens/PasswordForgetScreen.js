
import React from 'react';
import { Text, StyleSheet, ScrollView, View, Alert,TextInput} from 'react-native';
//import { sanFranciscoWeights } from 'react-native-typography'
import { Button,Input } from 'react-native-elements';
import * as firebase from 'firebase';

const INITIAL_STATE = {
    email: "",
    error: null
  };
  



export default class PasswordForgetScreen extends React.Component {

    constructor(props) {
        super(props);
    
        this.state = { ...INITIAL_STATE };
      }
    
      onSubmit = event => {
        const { email } = this.state;

        
    
        
        this.props.firebase
          firebase.auth().sendPasswordResetEmail(email)
          .then(() => {
            this.setState({ ...INITIAL_STATE });
          })
          .catch(error => {
            this.setState({ error });
            Alert.alert(error);
          });
    
        event.preventDefault();
        
      };
    
      onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
      };

  render() {

    const { email, error } = this.state;

    const isInvalid = email === "";

    return (
      <View style={{ flex: 1 , marginTop: 50}}>

<Text style = {styles.titleText}> FORGOT PASSWORD </Text>
        <ScrollView contentContainerStyle={styles.container}>


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
                             


          <Button style = {styles.button}
          disabled = {isInvalid}
            onPress = {this.onSubmit}
            title="Reset My Password"
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
