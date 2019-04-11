
import React from 'react';
import { Text, StyleSheet, ScrollView, View, Alert,TextInput} from 'react-native';
//import { sanFranciscoWeights } from 'react-native-typography'
import { Button } from 'react-native-elements';
import * as firebase from 'firebase';

const INITIAL_STATE = {
    passwordOne: "",
    passwordTwo: "",
    error: null
  };
  



export default class PasswordChangeScreen extends React.Component {

    constructor(props) {
        super(props);
    
        this.state = { ...INITIAL_STATE };
      }
    
      onSubmit = event => {
        const { passwordOne } = this.state;
    
        this.props.firebase
          firebase.auth().currentUser.updatePassword(passwordOne)
          .then(() => {
            this.setState({ ...INITIAL_STATE });
          })
          .catch(error => {
            this.setState({ error });
          });
    
        event.preventDefault();
      };
    
      onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
      };
    
      render() {
        const { passwordOne, passwordTwo, error } = this.state;
    
        const isInvalid = passwordOne !== passwordTwo || passwordOne === "";

    return (
      <View style={{ flex: 1 }}>

<Text style = {styles.helloText}> CHANGE PASSWORD </Text>
        <ScrollView contentContainerStyle={styles.container}>

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
            title="Confirm Change"
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
    fontSize: 30,
    fontWeight: '200',
    flexDirection: 'row',
    textAlign: 'center',
    paddingTop: 30,
    paddingBottom: 20

  },
  button: {
    borderRadius: 5,
    margin: 10,
    marginLeft: 100,
    marginRight: 100
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
  }
});
