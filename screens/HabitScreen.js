import React from 'react';
import { ScrollView, View, Text, StyleSheet,TextInput, TouchableOpacity} from 'react-native';
import { Button, CheckBox, Input, ButtonGroup, ButtonToolbar} from 'react-native-elements';
import {Container} from "native-base";
import Modal from "react-native-modal";
import * as firebase from 'firebase';

const INITIAL_STATE = {
  habitName: "",
  goalPeriod: "",
  timesPerPeriod: "",
  days: [0,0,0,0,0,0,0],
  error: null
};


export default class HabitScreen extends React.Component {
  constructor () {
    super()
    this.state = {
      selectedIndex: 0,
      dayIndex: 0
    }
    this.updateIndex = this.updateIndex.bind(this)
    this.updateDayIndex = this.updateDayIndex.bind(this)
  }

  updateIndex (selectedIndex) {
    this.setState({selectedIndex})
  }
  updateDayIndex (dayIndex) {
    this.setState({dayIndex})
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

  render() {

  const buttons = ['Daily', 'Weekly', 'Monthly']
  const days = ['SUN','MON','TUE','WED','THU','FRI','SAT']
  const { selectedIndex } = this.state
  const { dayIndex } = this.state

    return (
      <View style = {{flex:1}}>
      <ScrollView contentContainerStyle = {StyleSheet.scrollContainer}>
        <Button style = {styles.button}
            onPress={this._toggleModal}
            title = "Create Habit"
          />
          <Modal style = {styles.modal}
          contentContainerStyle = {styles.modalContent} 
          isVisible={this.state.isModalVisible}
          onSwipeComplete={() => this.setState({ isModalVisible: false })}
          swipeDirection="up">
          <View style={{height: 500, backgroundColor: 'white',borderRadius: 15}}>
            
            <Text style = {styles.titleText}> Habit Name: </Text>
            <Input style = {styles.textInput}
            
            placeholder='  EX: DRINK WATER '
            leftIcon={{ type: 'feather', name: 'edit',marginRight: 5}}
            onChangeText = {(text) => this.setState({name:text})}
            />  
            
            <Text style = {styles.titleText}> Goal Period: </Text>
            <ButtonGroup
            onPress={this.updateIndex}
            selectedIndex={selectedIndex}
            buttons={buttons}
            containerStyle={{height: 30}}
            />

            <Text style = {styles.titleText}> Times Per Period: </Text>
            <Input style = {styles.textInput}
            placeholder='  EX: 2 (TIMES PER DAY)'
            leftIcon={{ type: 'feather', name: 'edit', marginRight: 5}}
            />  

            <Text style = {styles.titleText}> Track Which Days?: </Text>

    {/*
            <ButtonGroup
            onPress={this.updateDayIndex}
            selectedIndex={dayIndex}
            buttons={days}
            containerStyle={{height: 35}}
            /> 
    */}

        
              <Container style = {{flexDirection: 'row', flex: 1, height: 100, marginLeft: 7}}>
                <TouchableOpacity  value = 'sun' style = {styles.cbutton} > 
                  <Text>SUN</Text>
                </TouchableOpacity>
                <TouchableOpacity  value = 'mon' style = {styles.cbutton} > 
                  <Text>MON</Text>
                </TouchableOpacity>
                <TouchableOpacity  value = 'mon' style = {styles.cbutton} > 
                  <Text>TUE</Text>
                </TouchableOpacity>
                <TouchableOpacity  value = 'mon' style = {styles.cbutton} > 
                  <Text>WED</Text>
                </TouchableOpacity>
                <TouchableOpacity  value = 'mon' style = {styles.cbutton} > 
                  <Text>THU</Text>
                </TouchableOpacity>
                <TouchableOpacity  value = 'mon' style = {styles.cbutton} > 
                  <Text>FRI</Text>
                </TouchableOpacity>
                <TouchableOpacity  value = 'mon' style = {styles.cbutton} > 
                  <Text>SAT</Text>
                </TouchableOpacity>

                {/*
                <TouchableOpacity title = "SUN" value = 'tue' style = {styles.cbutton} > 
                  <Text>TUE</Text>
                </TouchableOpacity>
                <TouchableOpacity title = "SUN" value = 'wed' style = {styles.cbutton} > 
                  <Text>WED</Text>
                </TouchableOpacity>
                <TouchableOpacity title = "SUN" value = 'thu' style = {styles.cbutton} > 
                  <Text>THU</Text>
                </TouchableOpacity>
                <TouchableOpacity title = "SUN" value = 'fri' style = {styles.cbutton} > 
                  <Text>FRI</Text>
                </TouchableOpacity>
                <TouchableOpacity title = "SUN" value = 'sat' style = {styles.cbutton} > 
                  <Text>SAT</Text>
                </TouchableOpacity> */}
                {/*
                <Button title = "SUN" style = {styles.cbutton}></Button>
                <Button title = "MON" style = {styles.cbutton}></Button>
                <Button title = "TUE" style = {styles.cbutton}></Button>
                <Button title = "WED" style = {styles.cbutton}></Button>
                <Button title = "THU" style = {styles.cbutton}></Button>
                <Button title = "FRI" style = {styles.cbutton} ></Button>
                <Button title = "SAT" style = {styles.cbutton}></Button> */}
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

            <Button style = {styles.button} title = "Save"> </Button>

            
    
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
  button: {
    borderRadius: 5,
    margin: 10,
    marginLeft: 100,
    marginRight: 100
  },
  cbutton:{
    borderWidth : 0.5,
    borderRadius: 100,
    borderColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height : 50,
    
  },
  modalContent: {
    fontSize: 30,
    fontFamily: 'System',
  },
  modal:{
    animationType: 'slide',

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
