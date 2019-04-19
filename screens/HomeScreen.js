
import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Alert,
  RefreshControl,
} from 'react-native';
import { Button,CheckBox, Input, ButtonGroup, Slider, ButtonToolbar, Card} from 'react-native-elements';
import Icon from "react-native-vector-icons/Ionicons";
import { WebBrowser } from 'expo';
import * as firebase from 'firebase';
import Modal from "react-native-modal";
import { NavigationEvents } from "react-navigation";
import {Container,Header,Left,Right,Body,Title} from "native-base";
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
      cardcolor: 'white',
      refreshing: false,
      timePassed: false,

    }

    this.updateIndex = this.updateIndex.bind(this);
  }

  updateIndex (goalPeriod) {
    this.setState({goalPeriod})
  }

  _toggleModal = (child) =>{
  this.setState({ isModalVisible: child.val().habitName})
  };

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.forceUpdate();
    this.setState({refreshing: false});
    
  }

  _toggleModalNull = () =>
  this.setState({ isModalVisible: null, sunP: 0, monP: 0, tueP: 0, wedP: 0, thuP: 0, friP: 0, satP: 0, reminders: false});

  _toggleHabitModal = (child) =>
  this.setState({ isHabitModalVisible: child.val().habitName, sunP: child.val().sunP, monP: child.val().monP, tueP: child.val().tueP, wedP: child.val().wedP, thuP: child.val().thuP, friP: child.val().friP, satP: child.val().satP, reminders: child.val().reminders});

  _toggleHabitModalNull = () =>
  this.setState({ isHabitModalVisible: null });

  lastTap = null;
  handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (this.lastTap && (now - this.lastTap) < DOUBLE_PRESS_DELAY) {
      this.setState({cardcolor: this.state.cardcolor === 'white' ? '#EAEAEA':'white'})
    } else {
      this.lastTap = now;
    }
  }

 //Rerender when user state is loaded, helped by https://stackoverflow.com/questions/48529910/why-firebase-user-is-not-authenticated-anymore-when-refreshing
 componentDidMount(){
 
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

          var edited = false;

          //Check if something is edited. If not, load into database. 
          var oldIndex;
        for( i = 0; i < habits.length; i++)
        {
          //If name matches, edited is true
          
          if (child.val().habitName == habits[i].val().habitName)
          {
            edited = true;
            oldIndex = i;
          }
          
        }
        if(edited == false)
        {
          addHabit(child);
        }
        else
        {
          //replace old index
           habits[oldIndex] = child;

        }
          
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

_refresh = () =>{
  this.forceUpdate();
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


  this._refresh();

}
 

  render() {

    const buttons = ['Daily', 'Weekly', 'Monthly']
    //var user = firebase.auth().currentUser;
    
   

       if(!this.state.currentUser) {
    
        return (
          <View style = {{marginTop: 280}}>
      <TouchableOpacity onPress  ={() => this.props.navigation.navigate('SignIn')}>
             <Image
          source={
           __DEV__
              ? require('../assets/images/logo.png')
              : require('../assets/images/logo.png')
         }
         style={{alignSelf: 'center',height: 90, width: 90 }}
        />
        </TouchableOpacity>
          </View>
         
         )
        }
         return (
           <View style={styles.container}>
           <NavigationEvents
          onWillFocus={() => {
            this.forceUpdate();
          }}
        />
            <ScrollView refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />}
              style={styles.container} contentContainerStyle={styles.contentContainer}>
          
               <View>
                <Header  transparent>
                  <Left>
                    <Button icon={
                      <Icon
                      name={Platform.OS === "ios" ? "ios-cog" : "md-cog"}
                      color='#414042'
                    size={30}/>}
                  
                    type = 'clear' 
                    onPress={() => this.props.navigation.navigate('Settings')} > //goes to Settings2 page
                    </Button>
                  </Left>
                  <Body>
                  <Image
                   source={
                    __DEV__
                       ? require('../assets/images/logo.png')
                       : require('../assets/images/logo.png')
                  }
                  style={styles.welcomeImage}
                 />
                  </Body>
                
                  <Right>
                  <Button icon={
                      <Icon
                      name={Platform.OS === "ios" ? "ios-add" : "md-add"}
                      color='#414042'
                    size={30}/>}
                    type = 'clear' 
                    onPress={() => this.props.navigation.navigate('HabitScreen')}> 
                    </Button>
                  </Right>
                  </Header>
                </View>
               <View style={styles.welcomeContainer}>
                 
               </View>

              {//Print items, https://www.pusher.com/tutorials/build-to-do-app-react-native-expo/
              }
              <View>
                 {Object.values(habits)
                  .reverse()
                   .map(theHabit => (
                    <TouchableWithoutFeedback onPress={this.handleDoubleTap}>
                    <Card containerStyle = {{backgroundColor: this.state.cardcolor,
                    shadowColor: '#D1D3D4',
                    shadowOffset: {width: 3, height: 3},
                    borderRadius: 5,
                  }}
                    header button onPress={() => alert("This is Card Header")}>
                    
                    
                    <View containerStyle = {{flexDirection: 'row'}}> 
                    <Text style = {styles.cardtext}> {theHabit.val().habitName}</Text>
                    <Button style = {styles.editbutton} onPress={()=>(this._toggleHabitModal(theHabit))} 
                    icon={
                      <Icon
                      name={Platform.OS === "ios" ? "ios-create" : "md-create"}
                      color='#414042'
                      size={25}
                    />
                      }
                      type = 'clear'>
                    </Button>
                    <Button style = {styles.deletebutton} onPress={()=>Alert.alert(
                      'Are You Sure?',
                      'Data Cannot Be Recovered',
                      [
                        {text: 'Confirm', onPress: () => (this.removeChild(theHabit))},
                        {
                          text: 'Cancel',
                          style: 'cancel',
                        },
                        
                      ],
                      {cancelable: false},)} 
                      icon={
                      <Icon
                      name={Platform.OS === "ios" ? "ios-trash" : "md-trash"}
                      color= '#414042'
                      size={25}
                    />
                      }
                      type = 'clear' ></Button>
                    </View>
                   
                   <Modal
                    contentContainerStyle = {styles.modalContent} 
                    isVisible={this.state.isHabitModalVisible== theHabit.val().habitName }
                    onSwipeComplete={() => this.setState({ isModalVisible: false })}
                    swipeDirection="up">
                    <View style={{height: 500, backgroundColor: 'white',borderRadius: 15}}>
            
                     <Text style = {styles.titleText}> Habit Name: </Text>
                      <Input style = {styles.textInput}
            
                      placeholder='  Ex: Drink Water '
                      //leftIcon={{ type: 'feather', name: 'edit',marginRight: 5}}
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
                     <Slider trackStyle = {styles.Slider}
                     
                      thumbStyle = {{backgroundColor: '#E9765B',
                      width: 17, 
                      height: 17,
                      marginLeft: 20,
                      marginRight: 20}}

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
                     <Text style = {this.state.sunP === 0 ? styles.dayText: styles.dayTextPressed} >S</Text>
                    </TouchableOpacity>
                   <TouchableOpacity  value = 'mon' 
                    onPress = {this._onMonPress}
                    style = {this.state.monP === 0 ? styles.cButton: styles.cButtonPressed} > 
                      <Text style = {this.state.monP === 0 ? styles.dayText: styles.dayTextPressed} >M</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  value = 'tue'
                    onPress = {this._onTuePress}
                    style = {this.state.tueP === 0 ? styles.cButton: styles.cButtonPressed} > 
                      <Text style = {this.state.tueP === 0 ? styles.dayText: styles.dayTextPressed} >T</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  value = 'wed'
                    onPress = {this._onWedPress}
                    style = {this.state.wedP === 0 ? styles.cButton: styles.cButtonPressed} > 
                      <Text style = {this.state.wedP === 0 ? styles.dayText: styles.dayTextPressed} >W</Text>
                    </TouchableOpacity>
                   <TouchableOpacity  value = 'thu'
                    onPress = {this._onThuPress}
                    style = {this.state.thuP === 0 ? styles.cButton: styles.cButtonPressed} > 
                  <Text style = {this.state.thuP === 0 ? styles.dayText: styles.dayTextPressed} >H</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  value = 'fri' 
                    onPress = {this._onFriPress}
                    style = {this.state.friP === 0 ? styles.cButton: styles.cButtonPressed} > 
                      <Text style = {this.state.friP === 0 ? styles.dayText: styles.dayTextPressed} >F</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  value = 'sat'
                    onPress = {this._onSatPress}
                    style = {this.state.satP === 0 ? styles.cButton: styles.cButtonPressed} > 
                     <Text style = {this.state.satP === 0 ? styles.dayText: styles.dayTextPressed} >A</Text>
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
                  </TouchableWithoutFeedback>
                  
                   ))}
               </View>
             </ScrollView>
           </View>
        );
        
   } 


  
}

const styles = StyleSheet.create({
  titleText: {
    fontFamily: 'System',
    fontSize: 18,
    fontWeight: 'bold',
    paddingTop: 10,
    marginLeft: 5,
    color: '#414042'
  },
  trackText: {
    fontFamily: 'System',
    fontWeight: 'bold',
    fontSize: 18,
    paddingTop: 5,
    marginLeft: 5,
    paddingBottom: 8,
    color: '#414042'
  },
  button: {
    borderRadius: 5,
    margin: 10,
    marginLeft: 100,
    marginRight: 100
  },
  cardtext:{
    fontFamily: 'System',
    fontWeight: 'bold',
    fontSize: 25,
    color: '#414042'
  },
  savebutton:{
    paddingRight: 7,
    borderRadius: 5,
    paddingBottom: 15,
    width: 100
  },
  cancelbutton:{
    paddingLeft: 7,
    borderRadius: 5,
    paddingBottom: 15,
    width: 100
    
    
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
    width: 65,
    height: 65,
    resizeMode: 'contain',
    marginTop: 3,
  
  
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
    
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height : 40,
    marginRight: 4,
    marginLeft: 4,
    backgroundColor: '#4283CF',
    textDecorationColor: 'white'
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
    marginLeft: 20,
    marginRight: 20,
    
  },
  dayText: {
    fontSize: 17,
    
  },
  dayTextPressed:{
    fontSize: 17,
    
    color: 'white',
  }
  
  
});








