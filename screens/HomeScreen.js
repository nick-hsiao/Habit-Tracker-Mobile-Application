import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button, CheckBox, Input, ButtonGroup, ButtonToolbar} from 'react-native-elements';
import { WebBrowser } from 'expo';
import * as firebase from 'firebase';


export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  constructor () {
    super()
    this.state = {
      currentUser: '',
      uid: '',
      habitName: ''

    }
  }

  setUser(){
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log(firebase.auth().currentUser);
      this.setState({currentUser: firebase.auth().currentUser});
      this.setState({uid: this.state.currentUser.uid});
      console.log(" hello " + this.state.currentUser);
    } else {
      console.log("no user found");
    }
  });
}
  //user = firebase.auth().currentUser;

  readUserData() {
    this.setUser()
    /** 
    firebase.database().ref(`UsersList/${this.state.uid}/`).on('value', function (snapshot) {
        console.log(snapshot.val());
    });
    **/

        //Get list of entries, got help from https://stackoverflow.com/questions/49106987/how-to-retrieve-all-the-names-of-file-in-firebase-folder
        firebase.database().ref(`UsersList/${this.state.uid}/_habits`).on('value', function (snapshot) {
          snapshot.forEach(function(child) {
            var files=child.val().habitName;
            console.log(files);
    
          });
      });
}

storeData(){
  user = firebase.auth().currentUser;
  uid = user.uid;

  if (user!= null){
/**     
      firebase.database().ref(`UsersList/${uid}/_habits`).on('value', function (snapshot) {
      console.log(snapshot.val());
  });
  **/

     //Get list of entries, got help from https://stackoverflow.com/questions/49106987/how-to-retrieve-all-the-names-of-file-in-firebase-folder
     firebase.database().ref(`UsersList/${uid}/_habits`).on('value', function (snapshot) {
      snapshot.forEach(function(child) {
        var files=child.val().habitName;
        console.log(files);
      });
  });

  user.providerData.forEach(function (profile) {
    console.log("user email" + profile.email);

  });

  
  }
}


  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <Image
              source={
                __DEV__
                  ? require('../assets/images/logo.png')
                  : require('../assets/images/logo.png')
              }
              style={styles.welcomeImage}
            />
          </View>
        </ScrollView>
        <Button
          onPress = {()=> this.storeData()}
          style = {styles.button}
          title = "Read">
        </Button>
        

    
    
      </View>
    );
  }


  _handleGooglePress = () => {
    WebBrowser.openBrowserAsync(
      'https://google.com'
    );
  };
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 5,
    margin: 10,
    marginLeft: 100,
    marginRight: 100
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
