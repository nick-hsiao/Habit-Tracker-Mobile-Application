
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
import { Button, Header,CheckBox, Input, ButtonGroup, Slider, ButtonToolbar, Card} from 'react-native-elements';
import Icon from "react-native-vector-icons/Ionicons";
import { WebBrowser } from 'expo';
import * as firebase from 'firebase';
import Modal from "react-native-modal";
import {Container} from "native-base";
//import logo from '../assets/images/logo.png';

const habit = {
    1: "habitName",
};

var habits = [];
var count = 0;

//The commented lines of code (the console log) in this function will work if you declare 
//habits (from previous lines) as an empty array (var habits = [];)
function addHabit(value)
{
  habits.push(value);
  count++;
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
      habitList: [],
      habit,
      isModalVisible: false ,
      isHabitModalVisible: null,
      habitName: "",
      goalPeriod: 0,
      timesPerPeriod: 1,
      sunP: 0,
      monP: 0,
      tueP: 0,
      wedP: 0,
      thuP: 0,
      friP: 0,
      satP: 0,
      saved: 'false',
      reminders: false,
      dayIndex: 0,
      checked: false,
      error: null,
    }

    this.updateIndex = this.updateIndex.bind(this);
  }

  updateIndex (goalPeriod) {
    this.setState({goalPeriod})
  }

  _toggleModal = (child) =>
  this.setState({ isModalVisible: child.val().habitName});

  _toggleModalNull = () =>
  this.setState({ isModalVisible: null, sunP: 0, monP: 0, tueP: 0, wedP: 0, thuP: 0, friP: 0, satP: 0, reminders: false});

  _toggleHabitModal = (child) =>
  this.setState({ isHabitModalVisible: child.val().habitName, sunP: child.val().sunP, monP: child.val().monP, tueP: child.val().tueP, wedP: child.val().wedP, thuP: child.val().thuP, friP: child.val().friP, satP: child.val().satP, reminders: child.val().reminders});

  _toggleHabitModalNull = () =>
  this.setState({ isHabitModalVisible: null });


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
            addHabit(child);
         }); 
        });
      }

      if(habits.length > 0){
        //Remove dummy value from array, https://stackoverflow.com/questions/5767325/how-do-i-remove-a-particular-element-from-an-array-in-javascript
        var index = habits.indexOf(null);
        if (index > -1) {
          habits.splice(index, 1);
         }

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
    })
  }
  //Rerender when user state is loaded, helped by https://stackoverflow.com/questions/48529910/why-firebase-user-is-not-authenticated-anymore-when-refreshing
  componentWillUnmount() {
    this.unsubscribe()
  }


  writeHabitData = (habitName,sunP,monP,tueP,wedP,thuP,friP,satP,timesPerPeriod,reminders,goalPeriod) => {
    
    /** 
    //Remove old habit from array and replace it, https://stackoverflow.com/questions/5767325/how-do-i-remove-a-particular-element-from-an-array-in-javascript
     var index = habits.indexOf(habitName);
     if (index > -1) {
      habits.splice(index, 1);
     }
     **/
     

    firebase.database().ref(`UsersList/${firebase.auth().currentUser.uid}/_habits/${habitName}`).set({
      habitName,
      sunP,
      monP,
      tueP,
      wedP,
      thuP,
      friP,
      satP,
      timesPerPeriod,
      reminders,
      goalPeriod

    }).then((data)=>{
        //reset
       this.setState({timesPerPeriod: 1});
       this.setState({sunP: 0});
       this.setState({monP: 0});
       this.setState({tueP: 0});
       this.setState({wedP: 0});
       this.setState({thuP: 0});
       this.setState({friP: 0});
       this.setState({satP: 0});
       this.setState({timesPerPeriod: 1});
       this.setState({reminders: false});
       this.setState({checked: false});
       this.setState({goalPeriod: 0});
    }).catch((error)=>{
        //error callback
        console.log('error ' , error)
    })
    this._toggleHabitModalNull();
  }

_toggleCheck = () =>{
    this.setState({ checked: !this.state.checked });
    this.setState({reminders: !this.state.reminders});
}

_onSunPress = () =>{
  this.setState({ sunP: this.state.sunP === 0 ? 1:0});
}
_onMonPress = () =>
  this.setState({ monP: this.state.monP === 0 ? 1:0});

_onTuePress = () =>
  this.setState({ tueP: this.state.tueP === 0 ? 1:0});

_onWedPress = () =>
  this.setState({ wedP: this.state.wedP === 0 ? 1:0});

_onThuPress = () =>
  this.setState({ thuP: this.state.thuP === 0 ? 1:0});

_onFriPress = () =>
  this.setState({ friP: this.state.friP === 0 ? 1:0});

_onSatPress = () =>
  this.setState({ satP: this.state.satP === 0 ? 1:0});

removeChild(child)
{
  //Delete child from array, https://stackoverflow.com/questions/5767325/how-do-i-remove-a-particular-element-from-an-array-in-javascript
  var index = habits.indexOf(child);
  if (index > -1) {
    habits.splice(index, 1);
   }

   console.log("DELETING "+child.val().habitName);
  
   //Remove??
  //firebase.database().ref(`UsersList/${this.uid}/_habits/${child.val().habitName}/friP`).remove();
 
  firebase.database().ref(`UsersList/${firebase.auth().currentUser.uid}/_habits/${child.val().habitName}`).set(null);


  //Close modal
  this._toggleModalNull();

}
 

  render() {

    const buttons = ['Daily', 'Weekly', 'Monthly']
    var user = firebase.auth().currentUser;

      //https://firebase.google.com/docs/auth/web/manage-users

       if (this.state.currentUser) {
         uid = user.uid;
         
         return (
           <View style={styles.container}>
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
             {/*   <Header
               backgroundColor = 'white'
               leftComponent={{ icon: 'menu', color: 'black' }}
           
               rightComponent={{ icon: 'home', color: 'black' }}
               /> */}
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
                  
                    <Card 
                    header button onPress={() => alert("This is Card Header")}>
                    
                    
                    <View containerStyle = {{flexDirection: 'row'}}> 
                    <Text style = {styles.cardtext}> {theHabit.val().habitName}</Text>
                    <Button style = {styles.editbutton} onPress={()=>(this._toggleHabitModal(theHabit))} 
                    icon={
                      <Icon
                      name={Platform.OS === "ios" ? "ios-create" : "md-create"}
                      color='black'
                      size={25}
                    />
                      }
                      type = 'clear'>
                    </Button>
                    <Button style = {styles.deletebutton} onPress={()=>(this._toggleModal(theHabit))} icon={
                      <Icon
                      name={Platform.OS === "ios" ? "ios-trash" : "md-trash"}
                      color='black'
                      size={25}
                    />
                      }
                      type = 'clear' ></Button>
                    </View>
                    <Modal
                    contentContainerStyle = {styles.modalContent} 
                    isVisible={this.state.isModalVisible == theHabit.val().habitName }
                    onSwipeComplete={() => this.setState({ isModalVisible: false })}
                    swipeDirection="up">

                      <View style={{height: 500, backgroundColor: 'white',borderRadius: 15}}>
                        <Text style = {styles.titleText}> Do you wish to delete {theHabit.val().habitName}? Warning: once a habit is removed, its data can not be recovered or restored.</Text>
                        
                        <Button style = {styles.button} onPress={()=>(this.removeChild(theHabit))} title="Delete"></Button>

                        <Button style = {styles.button} onPress={this._toggleModalNull} title="Cancel"></Button>
                        
                      </View>
                   </Modal>

                   <Modal
                    contentContainerStyle = {styles.modalContent} 
                    isVisible={this.state.isHabitModalVisible== theHabit.val().habitName }
                    onSwipeComplete={() => this.setState({ isModalVisible: false })}
                    swipeDirection="up">
                    <View style={{height: 500, backgroundColor: 'white',borderRadius: 15}}>
            
                     <Text style = {styles.titleText}> Habit Name: </Text>
                      <Input style = {styles.textInput}
            
                      placeholder='  EX: DRINK WATER '
                      leftIcon={{ type: 'feather', name: 'edit',marginRight: 5}}
                      onChangeText = {(habitName) => this.setState({habitName})}
                     >{theHabit.val().habitName}</Input>  
            
                      <Text style = {styles.titleText}> Goal Period: </Text>
                     <ButtonGroup
                      onPress={this.updateIndex}
                      selectedIndex={this.state.goalPeriod}
                      buttons={buttons}
                      containerStyle={{height: 30}}
                      />

                      <Text style = {styles.titleText}> Times Per Period: {this.state.timesPerPeriod} </Text>
                     <Slider style = {styles.Slider}
                      thumbStyle = {{backgroundColor: 'black', width: 15, height: 15}}
                      value = {1}
                      maximumValue = {10}
                      minimumValue = {1}
                      step = {1}
                      timesPerPeriod={this.state.timesPerPeriod}
                      onValueChange={timesPerPeriod => this.setState({ timesPerPeriod})}
                      />
          
                    <Text style = {styles.trackText}> Track Which Days?: </Text>
        
                    <Container style = {{flexDirection: 'row', flex: 1, height: 50}}>
                    <TouchableOpacity  value = 'sun' 
                    onPress = {this._onSunPress}
                    style = {this.state.sunP === 0 ? styles.cButton: styles.cButtonPressed} > 
                     <Text style = {styles.dayText} >SUN</Text>
                    </TouchableOpacity>
                   <TouchableOpacity  value = 'mon' 
                    onPress = {this._onMonPress}
                    style = {this.state.monP === 0 ? styles.cButton: styles.cButtonPressed} > 
                      <Text style = {styles.dayText} >MON</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  value = 'tue'
                    onPress = {this._onTuePress}
                    style = {this.state.tueP === 0 ? styles.cButton: styles.cButtonPressed} > 
                      <Text style = {styles.dayText} >TUE</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  value = 'wed'
                    onPress = {this._onWedPress}
                    style = {this.state.wedP === 0 ? styles.cButton: styles.cButtonPressed} > 
                      <Text style = {styles.dayText} >WED</Text>
                    </TouchableOpacity>
                   <TouchableOpacity  value = 'thu'
                    onPress = {this._onThuPress}
                    style = {this.state.thuP === 0 ? styles.cButton: styles.cButtonPressed} > 
                  <Text style = {styles.dayText} >THU</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  value = 'fri' 
                    onPress = {this._onFriPress}
                    style = {this.state.friP === 0 ? styles.cButton: styles.cButtonPressed} > 
                      <Text style = {styles.dayText} >FRI</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  value = 'sat'
                    onPress = {this._onSatPress}
                    style = {this.state.satP === 0 ? styles.cButton: styles.cButtonPressed} > 
                     <Text style = {styles.dayText} >SAT</Text>
                    </TouchableOpacity>

                 </Container>
                
                <Text style = {styles.titleText}> Reminders: </Text>
                <CheckBox
              
                left
                fontFamily = 'System'
                title='REMINDERS'
                checked={this.state.checked}
                checkedColor = 'green'
                onPress={this._toggleCheck}
                />
                <Text style = {{height: 70}}> </Text>
            
      
            
                
                  <View style = {{flexDirection: 'row',justifyContent: 'center'}}>
                  
                  <Button 
                onPress = {()=>this.writeHabitData(theHabit.val().habitName,this.state.sunP,this.state.monP,
                                              this.state.tueP, this.state.wedP, this.state.thuP, this.state.friP,
                                            this.state.satP, this.state.timesPerPeriod, this.state.reminders,this.state.goalPeriod)}
          
               style = {styles.savebutton} 
                title = "Save"> 
                </Button>
                <Button onPress={this._toggleHabitModalNull} style = {styles.cancelbutton}  title="Cancel"></Button>
                </View>
              </View>
             </Modal>


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
  titleText: {
    fontFamily: 'System',
    fontSize: 18,
    paddingTop: 10,
    marginLeft: 5,
  },
  button: {
    borderRadius: 5,
    margin: 10,
    marginLeft: 100,
    marginRight: 100
  },
  cardtext:{
    fontFamily: 'System',
    fontWeight: '100',
    fontSize: 25
  },
  savebutton:{
    paddingRight: 7,
    borderRadius: 5,
    paddingBottom: 15,
   
  },
  cancelbutton:{
    paddingLeft: 7,
    borderRadius: 5,
    paddingBottom: 15,
    
    
  },
  deletebutton:{
    position: 'absolute',
    borderRadius: 5,

    bottom: -7,
    left: 280,
    paddingLeft: 5
  },
  editbutton:{
    position: 'absolute',
    
    borderRadius: 5,
   
    bottom: -7,
    left: 250,
    paddingLeft: 5
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
  cButton:{
    borderWidth : 0.5,
    borderRadius: 100,
    borderColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height : 40,
    marginRight: 4,
    marginLeft: 4,
    
  },

  cButtonPressed:{
    borderWidth : 0.5,
    borderRadius: 100,
    borderColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height : 40,
    marginRight: 4,
    marginLeft: 4,
    backgroundColor: '#E3E3E3'
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
  Slider:{
    marginLeft: 10,
    marginRight: 10
  },
  
});








