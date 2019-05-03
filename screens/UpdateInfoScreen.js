import React from 'react';
import { Text, StyleSheet, ScrollView, View, Alert, TextInput, Image } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { Container, Header, Left, Right, Body, Title } from "native-base";
import * as firebase from 'firebase';
import Modal from "react-native-modal";

const INITIAL_STATE = {
  userN : "",
  firstN:  "",
  lastN: "",
  emailN:  "",
  stateChanged: false,
  isHabitModalVisible: false,
  password: "",
  error: null
};


export default class PasswordForgetScreen extends React.Component {

  constructor(props) {
    super(props);

    userInfo = [];
    
    this.state = { ...INITIAL_STATE };
  }


  componentWillMount()
  {

    let currentUser = firebase.auth().currentUser;


    firebase.database().ref(`UsersList/${currentUser.uid}`).on('value', function (snapshot) {
        snapshot.forEach(function (child) {
            userInfo.push(child);
        })
     })

    setTimeout(()=>this.remove(),200);
  }

  remove = () =>
  {
      userInfo.splice(0,1);
      this.setState({userN: userInfo[3].val(), firstN: userInfo[0].val(), lastN: userInfo[1].val(), emailN: firebase.auth().currentUser.email  })
      //userN = userInfo[3].val();
      //firstN = userInfo[0].val();
      //lastN = userInfo[1].val();
      //emailN = firebase.auth().currentUser.email;
  }

 //Authentication, from https://www.youtube.com/watch?v=ILlHA2kIuxs
 onSubmit = event => {
    const { userN, firstN, lastN, emailN} = this.state;

    var usernameFound = false;

    firebase.database().ref(`UsersList`).on('value', function (snapshot) {
      snapshot.forEach(function (child) {
        console.log(child.val().username)
        
        if (usernameFound === false) {
          if (child.val().username.toUpperCase() === userN.toUpperCase() && child.val().userID != userInfo[2].val() ) {
            usernameFound = true;
            //Alert.alert("Username Is Already Taken", "Please Try Again");
          }
        }
        
      })
    });

    setTimeout(()=>this.authenticate(this.state.userN, this.state.firstN, this.state.lastN, this.state.emailN, usernameFound), 1000);
  }

  authenticate = (userN, firstN, lastN, emailN, usernameFound) =>{

    
    if (!emailN.includes('@') || !emailN.includes('.')) {
      Alert.alert("E-Mail Is Poorly Formatted");
    }
    else if (usernameFound === true) {

      Alert.alert("Username Is Already Taken", "Please Try Again");
      return;
    }
    else {

        /** 
        firebase.database().ref(`/UsersList/${firebase.auth().currentUser.uid}`).on('value', function (snapshot) {
           
            console.log("HHAHHHA "+ snapshot.val().username);
            console.log("HHAHHHA "+ snapshot.val().firstName);
            console.log("HHAHHHA "+ snapshot.val().lastName);
        
         })
         **/

         console.log("THE INFO IS "+ this.state.userN + " " + this.state.firstN + " " + this.state.lastN);

        
        firebase.database().ref(`/UsersList/${firebase.auth().currentUser.uid}`).update({
            username: this.state.userN,
            firstName: this.state.firstN,
            lastName: this.state.lastN
          })
          
          
          console.log("CURRENT EMAIL IS " + firebase.auth().currentUser.email);

          if(firebase.auth().currentUser.email != this.state.emailN)
          {
            this.setState({isHabitModalVisible: true});
          }
          else
          {
            this.props.navigation.navigate('Settings');
          }






          //console.log("CURRENT EMAIL IS " + firebase.auth().currentUser.password);

        /** 
      this.props.firebase
      firebase.auth().createUserWithEmailAndPassword(email, passwordOne)
        .then(authUser => {

          uid = authUser.user.uid;

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
          Alert.alert("Account created");
          this.setState({ ...INITIAL_STATE });
          this.props.history.push(ROUTES.HOME);
          

        })

        .catch(error => {
          this.setState({ error });
          console.log(error.message);
          if (error.message == 'The email address is already in use by another account.') {
            Alert.alert('E-Mail Is Already In Use', 'Please Try Again')

          }
          else {
            console.log(error.message)
          }
          //Alert.alert(error.message);
        });
        **/


    }


    
  
  };


  /**
   * Change email, got help from https://medium.com/@ericmorgan1/change-user-email-password-in-firebase-and-react-native-d0abc8d21618
   */
  reauthenticate = (currentPassword) => {
    var user = firebase.auth().currentUser;
    var cred = firebase.auth.EmailAuthProvider.credential(
        user.email, currentPassword);
    return user.reauthenticateWithCredential(cred);
  }

/**
   * Change email, got help from https://medium.com/@ericmorgan1/change-user-email-password-in-firebase-and-react-native-d0abc8d21618
   */
  changeEmail = (currentPassword, newEmail) => {
    this.reauthenticate(currentPassword).then(() => {
      var user = firebase.auth().currentUser;
      user.updateEmail(newEmail).then(() => {
        console.log("Email updated!");
        this.props.navigation.navigate('Settings');
      }).catch((error) => {Alert.alert("The password you entered is incorrect");});
    }).catch((error) => {Alert.alert("The password you entered is incorrect");});
  }


  emailUpdate(password)
  {
      
    this.setState({ isHabitModalVisible: false });
    this.reauthenticate(password).catch((error) => { console.log(error); });
    this.changeEmail(password, this.state.emailN);
    

    //console.log("password is " + password)

  }



  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {

    const { email, error } = this.state;

    const isInvalid = this.state.emailN === "" || this.state.stateChanged === false;

    //var user = firebase.auth().currentUser;

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
            onChangeText={(text) => this.setState({userN: text, stateChanged: true})}
          >{this.state.userN}</Input>

        <Input
            inputStyle={styles.inputStyle1}
            errorStyle={styles.errorStyle}

            containerStyle={styles.containerStyle}
            inputContainerStyle={styles.inputContainer}
            placeholder="First Name"
            returnKeyLabel={"next"}
            onChange={this.onChange}
            onChangeText={(text) => this.setState({firstN: text, stateChanged: true})}
          >{this.state.firstN}</Input>

<Input
            inputStyle={styles.inputStyle1}
            errorStyle={styles.errorStyle}

            containerStyle={styles.containerStyle}
            inputContainerStyle={styles.inputContainer}
            placeholder="Last Name"
            returnKeyLabel={"next"}
            onChange={this.onChange}
            onChangeText={(text) => this.setState({lastN: text, stateChanged: true})}
          >{this.state.lastN}</Input>

<Input
            inputStyle={styles.inputStyle1}
            errorStyle={styles.errorStyle}

            containerStyle={styles.containerStyle}
            inputContainerStyle={styles.inputContainer}
            placeholder="Email"
            returnKeyLabel={"next"}
            onChange={this.onChange}
            onChangeText={(text) => this.setState({emailN: text, stateChanged: true})}
          >{this.state.emailN}</Input>

          <Button style={styles.button}
            disabled={isInvalid}
            onPress={this.onSubmit}
            title="Update Info"
          />

                <Modal
                      contentContainerStyle={styles.modalContent}
                      isVisible={this.state.isHabitModalVisible}
                      onSwipeComplete={() => this.setState({ isHabitModalVisible: false })}
                      swipeDirection="up">
                      <View style={{ height: 500, backgroundColor: 'white', borderRadius: 15 }}>

                        <Text style={styles.titleText}> You requested to change your email. Enter your password to continue: </Text>
                        <Input inputStyle={styles.textInput}
                            secureTextEntry={true}

                          placeholder='  Password '
                          //leftIcon={{ type: 'feather', name: 'edit',marginRight: 5}}
                          onChangeText={(text) => this.setState({ password: text, stateChanged: true })}

                        ></Input>

                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>

                          
                        <Button onPress={()=> this.emailUpdate(this.state.password)} style={styles.cancelbutton} title="Save"></Button>
                          <Button onPress={() => this.setState({ isHabitModalVisible: false })} style={styles.cancelbutton} title="Cancel"></Button>
                        </View>
                      </View>
                    </Modal>


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
    marginLeft: 135,
    marginRight: 135,
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
