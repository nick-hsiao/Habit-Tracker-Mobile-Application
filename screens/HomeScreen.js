
import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Button, Header,CheckBox, Input, ButtonGroup, ButtonToolbar, Card} from 'react-native-elements';
import { WebBrowser } from 'expo';
import * as firebase from 'firebase';
//import logo from '../assets/images/logo.png';

const habit = {
    1: "habitName",
};

var habits = [];// ["SDJIDJAODDAS", "SJDAIOJDOAJD"];
var count = 0;

//The commented lines of code (the console log) in this function will work if you declare 
//habits (from previous lines) as an empty array (var habits = [];)
function addHabit(value)
{
  console.log("SUCCESS "+value);
  habits.push(value);
  //console.log("MORE SUCCESS " + habits[count].val().habitName);
  //console.log("MONDAY " + habits[count].val().monP);
  //console.log("TUESDAY " + habits[count].val().tueP);
  //console.log("WEDNESDAY " + habits[count].val().wedP);
  //console.log("THURSDAY " + habits[count].val().thuP);
  //console.log("FRIDAY " + habits[count].val().friP);
  //console.log("SATURDAY " + habits[count].val().satP);
  //console.log("SUNDAY " + habits[count].val().sunP);
  count++;
  console.log("ARRAY LENGTH IS "+habits.length);
}


export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  constructor () {
    super()
    this.state = {
      currentUser: null,
      uid: '',
      habitName: '',
      habitList: [],
      habit
    }
  }


  //Rerender when user state is loaded, helped by https://stackoverflow.com/questions/48529910/why-firebase-user-is-not-authenticated-anymore-when-refreshing
  componentDidMount() {
    this.unsubscribe = firebase.auth().onAuthStateChanged(currentUser => {

      while(habits.length == 0)
      { 

        //dummy value in array to be removed later
        addHabit(null);
         
        var user = firebase.auth().currentUser;
        uid = user.uid;
        // User is signed in.

        //Get list of entries, got help from https://stackoverflow.com/questions/49106987/how-to-retrieve-all-the-names-of-file-in-firebase-folder
        firebase.database().ref(`UsersList/${uid}/_habits`).on('value', function (snapshot) {
          snapshot.forEach(function(child) {
            //var name=child.val().habitName;
            //habit[1] = name;
            addHabit(child);
         }); 

         //Remove value from array, https://stackoverflow.com/questions/5767325/how-do-i-remove-a-particular-element-from-an-array-in-javascript
         var index = habits.indexOf(null);
          if (index > -1) {
            habits.splice(index, 1);
          }
        });
      }
      if(habits.length > 0){

        //Got help from https://www.youtube.com/watch?v=gvicrj31JOM, at 2:11
        //Value is used to run a function inside setTimeout
        const value = this;

        value.set = function()
        {
          //Set user state after a delay time
          this.setState({ currentUser });
        }

        //Wait for data to be loaded before setting user
        setTimeout(function(){value.set();}, 1000);

      }



/** 
      while(habits.length >2){
        console.log("NO");
        var user = firebase.auth().currentUser;
        uid = user.uid;
        // User is signed in.

        //Get list of entries, got help from https://stackoverflow.com/questions/49106987/how-to-retrieve-all-the-names-of-file-in-firebase-folder
        firebase.database().ref(`UsersList/${uid}/_habits`).on('value', function (snapshot) {
          snapshot.forEach(function(child) {
            //var name=child.val().habitName;
            //habit[1] = name;
            addHabit(child);
         }); 
        });
      }
      if(habits.length > 2)
      {
        this.setState({ currentUser });
      }
      **/

    })
  }
  //Rerender when user state is loaded, helped by https://stackoverflow.com/questions/48529910/why-firebase-user-is-not-authenticated-anymore-when-refreshing
  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    var user = firebase.auth().currentUser;

    console.log("TEST " + user);

      //https://firebase.google.com/docs/auth/web/manage-users

       if (this.state.currentUser) {
         uid = user.uid;
         // User is signed in.
 
         /** 
         //Get list of entries, got help from https://stackoverflow.com/questions/49106987/how-to-retrieve-all-the-names-of-file-in-firebase-folder
         firebase.database().ref(`UsersList/${uid}/_habits`).on('value', function (snapshot) {
           snapshot.forEach(function(child) {
             //var name=child.val().habitName;
             //habit[1] = name;
             addHabit(child);
          }); 
         });
         **/
 
         
         return (
           <View style={styles.container}>
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
               <Header
               backgroundColor = 'white'
               leftComponent={{ icon: 'menu', color: 'black' }}
           
               rightComponent={{ icon: 'home', color: 'black' }}
               />
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

              {//Print items, https://www.pusher.com/tutorials/build-to-do-app-react-native-expo/
              }
              <View>
                 {Object.values(habits)
                  .reverse()
                   .map(theHabit => (
                    <Card header button onPress={() => alert("This is Card Header")}>
                    <Text>{theHabit.val().habitName}</Text>
                  </Card>
                   ))}
               </View>



             </ScrollView>

           </View>
        );
        
   } 
   else {
     return (<View style={styles.container}>
    </View>);}
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







