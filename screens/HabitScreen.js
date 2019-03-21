import React from 'react';
import { ScrollView, View, Text, StyleSheet,TextInput } from 'react-native';
import { Button, CheckBox, Input, ButtonGroup} from 'react-native-elements';
import Modal from "react-native-modal";

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
      <ScrollView contentContainerStyle = {StyleSheet.container}>
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
            <ButtonGroup
            onPress={this.updateDayIndex}
            selectedIndex={dayIndex}
            buttons={days}
            containerStyle={{height: 35}}
            />

            <Text style = {styles.titleText}> Reminders: </Text>
            <CheckBox
            left
            fontFamily = 'System'
            title='REMINDERS'
            checked={this.state.checked}
            checkedColor = 'green'
            onPress={this._toggleCheck}
            />
            
            
    
          </View>
          </Modal>
      </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1
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
