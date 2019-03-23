import React from 'react';
import { ScrollView, View, Text, StyleSheet,TextInput, TouchableOpacity,Alert} from 'react-native';
import { Button, CheckBox, Input, ButtonGroup, ButtonToolbar} from 'react-native-elements';
import {Container} from "native-base";
import Modal from "react-native-modal";
import * as firebase from 'firebase';

const INITIAL_STATE = {
  habitName: "",
  goalPeriod: "",
  timesPerPeriod: "",
  sunP: 0,
  monP: 0,
  tueP: 0,
  wedP: 0,
  thuP: 0,
  friP: 0,
  satP: 0,
  saved: 'false',
  error: null,
};




export default class HabitScreen extends React.Component {
  constructor () {
    super()
    this.state = {
      selectedIndex: 0,
      dayIndex: 0,
      ...INITIAL_STATE,
    }
    this.updateIndex = this.updateIndex.bind(this)
 
  }

  user = firebase.auth().currentUser;
  uid = this.user.uid;

  updateIndex (selectedIndex) {
    this.setState({selectedIndex})
  }

  static navigationOptions = {
    title: '',
  };

  state = {
    habitName: '',
    isModalVisible: false,
    checked: false,
  };

  _toggleModal = () =>
    this.setState({ isModalVisible: !this.state.isModalVisible });
  
  _toggleCheck = () =>
    this.setState({ checked: !this.state.checked });

  _handleName = (text) => {
    this.setState({ habitName: text })
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
  
  _printHabit = () =>{
    console.log(this.state.sunP);
    console.log(this.state.monP);
    console.log(this.state.tueP);
    console.log(this.state.wedP);
    console.log(this.state.thuP);
    console.log(this.state.friP);
    console.log(this.state.satP);
  }       


  writeHabitData = (habitName) => {

    //var uid = authUser.user.uid;
    

    firebase.database().ref(`UsersList/${this.uid}/_habits/${this.state.habitName}`).set({
        habitName
    }).then((data)=>{
        //success callback
        console.log('data ' , data)
    }).catch((error)=>{
        //error callback
        console.log('error ' , error)
    })
    this._toggleModal();
  
}
 
    
  render() {

  const buttons = ['Daily', 'Weekly', 'Monthly']
  const days = ['SUN','MON','TUE','WED','THU','FRI','SAT']
  const isInvalid = this.state.habitName.length < 2;
  
  

    return (
      <View style = {{flex:1}}>
      <ScrollView contentContainerStyle = {StyleSheet.scrollContainer}>
        <Button style = {styles.button}
            onPress={this._toggleModal}
            title = "Create Habit"
          />
          <Modal
          contentContainerStyle = {styles.modalContent} 
          isVisible={this.state.isModalVisible}
          onSwipeComplete={() => this.setState({ isModalVisible: false })}
          swipeDirection="up">
          <View style={{height: 500, backgroundColor: 'white',borderRadius: 15}}>
            
            <Text style = {styles.titleText}> Habit Name: </Text>
            <Input style = {styles.textInput}
            
            placeholder='  EX: DRINK WATER '
            leftIcon={{ type: 'feather', name: 'edit',marginRight: 5}}
            onChangeText = {(habitName) => this.setState({habitName})}
            />  
            
            <Text style = {styles.titleText}> Goal Period: </Text>
            <ButtonGroup
            onPress={this.updateIndex}
            selectedIndex={this.state.selectedIndex}
            buttons={buttons}
            containerStyle={{height: 30}}
            />

            <Text style = {styles.titleText}> Times Per Period: </Text>
            <Input style = {styles.textInput}
            placeholder='  EX: 2 (TIMES PER DAY)'
            leftIcon={{ type: 'feather', name: 'edit', marginRight: 5}}
            onChangeText = {(timesPerPeriod) => this.setState({timesPerPeriod})}
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
            
      
            
            <Text style = {styles.titleText}> </Text>
            <Text style = {styles.titleText}> </Text>

               <Button 
            disabled = {isInvalid}
            onPress = {()=>this.writeHabitData(this.state.habitName)}
          
            style = {styles.button} 
            title = "Save"> 
            </Button>


            
    
          </View>
          </Modal>
      </ScrollView>
      </View>
    );
  }
}



const styles = StyleSheet.create({
  
  scrollContainer: {
    flexGrow: 1
  },
  
 container: {
  paddingTop: 5,
  flex: 1,
  flexDirection: 'row',
  marginLeft: 5,
},
  titleText: {
    fontFamily: 'System',
    fontSize: 18,
    paddingTop: 10,
    marginLeft: 5,
  },
  trackText: {
    fontFamily: 'System',
    fontSize: 18,
    paddingTop: 10,
    marginLeft: 5,
    paddingBottom: 5,
  },
  dayText: {
    fontSize: 10
  },
  button: {
    borderRadius: 5,
    margin: 10,
    marginLeft: 100,
    marginRight: 100
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
  modalContent: {
    fontSize: 30,
    fontFamily: 'System',
  },
  modalButton: {
    paddingTop: 350,
    marginLeft: 100,
    marginRight: 100
  },
  modalText:{
    fontSize: 30,
    paddingTop: 50,
    textAlign: 'center',
  },
  textInput: {
    textAlign: 'center',
    marginTop: 40,
    marginLeft: 60,
    marginRight: 60,
    fontSize: 20,
    borderWidth: 0.5,
    paddingTop: 5,
    paddingBottom: 5,
    justifyContent: 'space-around'
  },
});
