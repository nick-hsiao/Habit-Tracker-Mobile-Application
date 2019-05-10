import React from 'react';
import { StyleSheet, ScrollView, View, Image } from 'react-native';
import { Header, Body } from "native-base";
import { Button, Input } from 'react-native-elements';
import * as firebase from 'firebase';

const INITIAL_STATE = {
  passwordOne: "",
  passwordTwo: "",
  error: null
};



/**
 * password change class, allows user to change password
 * 
 * @author nickhsiao, richardpham
 */
export default class PasswordChangeScreen extends React.Component {

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
   * updates password
   */
  onSubmit = event => {
    const { passwordOne } = this.state;

    firebase.auth().currentUser.updatePassword(passwordOne)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.navigation.navigate('Home');
      })
      .catch(error => {
        this.setState({ error });
      });

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
    const { passwordOne, passwordTwo, error } = this.state;

    const isInvalid = passwordOne !== passwordTwo || passwordOne.length < 8;

    return (
      <View>

        <Header transparent>

          <Body>
            <Image
              source={
                __DEV__
                  ? require('../assets/images/reset.png')
                  : require('../assets/images/reset.png')
              }
              style={styles.welcomeImage}
            />
          </Body>

        </Header>

        <ScrollView contentContainerStyle={styles.container}>

          <Input
            inputStyle={styles.inputStyle1}
            errorStyle={styles.errorStyle}

            containerStyle={styles.containerStyle}
            inputContainerStyle={styles.inputContainer}
            secureTextEntry={true}
            placeholder="New Password"
            returnKeyLabel={"next"}
            onChange={this.onChange}
            onChangeText={(text) => this.setState({ passwordOne: text })}
          />
          <Input
            inputStyle={styles.inputStyle}
            errorStyle={styles.errorStyle}
            errorMessage={isInvalid ? "Passwords Don't Match" : ""}

            containerStyle={styles.containerStyle}
            inputContainerStyle={styles.inputContainer}
            secureTextEntry={true}
            placeholder="Confirm New Password"
            returnKeyLabel={"next"}
            onChange={this.onChange}
            onChangeText={(text) => this.setState({ passwordTwo: text })}
          />
          <Button style={styles.button}
            disabled={isInvalid}
            onPress={this.onSubmit}
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
  },
  inputContainer: {

    marginLeft: 40,
    marginRight: 40,
  },
  inputStyle: {
    fontFamily: 'System',
    paddingLeft: 10,
  },
  inputStyle1: {
    fontFamily: 'System',
    paddingLeft: 10,
    marginTop: 50
  },
  containerStyle: {
    paddingBottom: 15
  },
  errorStyle: {
    marginLeft: 45,
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
