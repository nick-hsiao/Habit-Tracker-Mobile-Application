import React from 'react';
import { StyleSheet, ScrollView, View, Alert, Image, AlertIOS } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { Header, Body} from "native-base";
import * as firebase from 'firebase';

const INITIAL_STATE = {
  userN: "",
  firstN: "",
  lastN: "",
  emailN: "",
  stateChanged: false,
  isHabitModalVisible: false,
  password: "",
  error: null
};

/**
 * update info screen class, allows user to change info after revalidating credentials against firebase
 * 
 * @author nickhsiao, richardpham
 */
export default class UpdateInfoScreen extends React.Component {

  /**
   * 
   * constructor initializes variables and states
   * 
   * @param props properties object
   */
  constructor(props) {
    super(props);

    userInfo = [];

    this.state = { ...INITIAL_STATE };
  }

  /**
   * 
   * load user info
   */
  componentWillMount() {

    let currentUser = firebase.auth().currentUser;

    firebase.database().ref(`UsersList/${currentUser.uid}`).on('value', function (snapshot) {
      snapshot.forEach(function (child) {
        userInfo.push(child);
      })
    })

    setTimeout(() => this.remove(), 200);
  }

  /**
   * 
   * retrieve userInfo array, remove unnecessary user info, and set state
   */
  remove = () => {
    userInfo.splice(0, 1);
    this.setState({ userN: userInfo[3].val(), firstN: userInfo[0].val(), lastN: userInfo[1].val(), emailN: firebase.auth().currentUser.email })
  }

  /**
   * 
   * check if username is taken. 
   */
  onSubmit = event => {
    const { userN, firstN, lastN, emailN } = this.state;

    var usernameFound = false;

    firebase.database().ref(`UsersList`).on('value', function (snapshot) {
      snapshot.forEach(function (child) {

        if (usernameFound === false) {
          if (child.val().username.toUpperCase() === userN.toUpperCase() && child.val().userID != userInfo[2].val()) {
            usernameFound = true;
          }
        }

      })
    });

    setTimeout(() => this.authenticate(this.state.userN, this.state.firstN, this.state.lastN, this.state.emailN, usernameFound), 1000);
  }

  
  /**
   * 
   * checks if user info is valid.
   * 
   * @param userN the entered username
   * @param firstN the entered first name
   * @param lastN the entered last name
   * @param email the entered email
   * @param usernameFound boolean to check if a username exists
   */
  authenticate = (userN, firstN, lastN, emailN, usernameFound) => {


    if (!emailN.includes('@') || !emailN.includes('.')) {
      Alert.alert("E-Mail Is Poorly Formatted");
    }
    else if (usernameFound === true) {

      Alert.alert("Username Is Already Taken", "Please Try Again");
      return;
    }
    else {
      AlertIOS.prompt(
        'Enter Password',
        'To Confirm Changes',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Confirm',
            onPress: (password) => this.changeEmail(password, this.state.emailN),
            style: 'default'
          },
        ],
        'secure-text',
      );

    }

  };

  /**
   * 
   * authenticate with inputted password, got help from https://medium.com/@ericmorgan1/change-user-email-password-in-firebase-and-react-native-d0abc8d21618
   * 
   * @return user credentials
   */
  reauthenticate = (currentPassword) => {
    var user = firebase.auth().currentUser;
    var cred = firebase.auth.EmailAuthProvider.credential(
      user.email, currentPassword);
    return user.reauthenticateWithCredential(cred);
  }

  /**
   * 
   * Change email, got help from https://medium.com/@ericmorgan1/change-user-email-password-in-firebase-and-react-native-d0abc8d21618
   * 
   * @param currentPassword the inputted password
   * @param newEmail the inputted email
   */
  changeEmail = (currentPassword, newEmail) => {
    this.reauthenticate(currentPassword).then(() => {
      var user = firebase.auth().currentUser;
      user.updateEmail(newEmail).then(() => {


        firebase.database().ref(`/UsersList/${firebase.auth().currentUser.uid}`).update({
          username: this.state.userN,
          firstName: this.state.firstN,
          lastName: this.state.lastN
        })

        Alert.alert("Account Info Updated!");
        this.props.navigation.navigate('Settings');
      }).catch((error) => { Alert.alert("E-Mail Already In Use", "Please Try Again"); });
    }).catch((error) => { Alert.alert("Incorrect Password", "Please Try Again"); });
  }

  /**
   * 
   * used to set state of a value when value is changed
   */
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {

    const { email, error } = this.state;

    const isInvalid = this.state.emailN === "" || this.state.stateChanged === false;

    return (
      <View>

        <Header transparent>

          <Body>
            <Image
              source={
                __DEV__
                  ? require('../assets/images/update.png')
                  : require('../assets/images/update.png')
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
            placeholder="Username"
            returnKeyLabel={"next"}
            onChange={this.onChange}
            onChangeText={(text) => this.setState({ userN: text, stateChanged: true })}
          >{this.state.userN}</Input>

          <Input
            inputStyle={styles.inputStyle1}
            errorStyle={styles.errorStyle}

            containerStyle={styles.containerStyle}
            inputContainerStyle={styles.inputContainer}
            placeholder="First Name"
            returnKeyLabel={"next"}
            onChange={this.onChange}
            onChangeText={(text) => this.setState({ firstN: text, stateChanged: true })}
          >{this.state.firstN}</Input>

          <Input
            inputStyle={styles.inputStyle1}
            errorStyle={styles.errorStyle}

            containerStyle={styles.containerStyle}
            inputContainerStyle={styles.inputContainer}
            placeholder="Last Name"
            returnKeyLabel={"next"}
            onChange={this.onChange}
            onChangeText={(text) => this.setState({ lastN: text, stateChanged: true })}
          >{this.state.lastN}</Input>

          <Input
            inputStyle={styles.inputStyle1}
            errorStyle={styles.errorStyle}

            containerStyle={styles.containerStyle}
            inputContainerStyle={styles.inputContainer}
            placeholder="Email"
            returnKeyLabel={"next"}
            onChange={this.onChange}
            onChangeText={(text) => this.setState({ emailN: text, stateChanged: true })}
          >{this.state.emailN}</Input>

          <Button style={styles.button}
            disabled={isInvalid}
            onPress={this.onSubmit}
            title="Update Info"
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
    margin: 10,
    marginLeft: 120,
    marginRight: 120,
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
    marginTop: 60
  },
  inputStyle1: {
    fontFamily: 'System',
    paddingLeft: 10,
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
    marginTop: 65,
  },
});
