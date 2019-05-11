
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
import { Button, CheckBox, Input, ButtonGroup, Slider, ButtonToolbar, Card, Icon } from 'react-native-elements';
import * as firebase from 'firebase';
import Modal from "react-native-modal";
import { NavigationEvents } from "react-navigation";
import { Container, Header, Left, Right, Body, Title } from "native-base";

const habit = {
  1: "habitName",
};

var count = 0;

function addHabit(value) {
  habits.push(value);
  count++;
}

/**
 * homes screen class, displays habits for current user, navigates to all other pages
 * initial route of user already logged in
 * 
 * @author nickhsiao, richardpham
 */
export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  /**
   * 
   * constructor initializes variables and states
   */
  constructor() {
    super()
    habits = [];
    this.state = {
      currentUser: null,
      uid: '',
      habitList: [],
      habit,
      isModalVisible: false,
      isHabitModalVisible: null,
      habitName: "",
      habits: [],
      goalPeriod: 0,
      prevGoalPeriod: 0,
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
      count: 0,
      cardcolor: 'white',
      refreshing: false,
      timePassed: false,
      habitid: "",
      periodChanged: false,
      stateChanged: false,
      index: 0
    }
    this.updateIndex = this.updateIndex.bind(this);
  }

  /**
   * stores variable from goal period button bar
   * 
   * @param {*} goalPeriod 
   */
  updateIndex(goalPeriod) {
    this.setState({ goalPeriod });
    this.setState({ stateChanged: true });
  }


  /**
   * refreshes the page, updates components upon navigation
   * 
   */
  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.forceUpdate();
    this.setState({ refreshing: false });

  }

  /**
   * check if goal period was changed
   * 
   */
  _checkChange = (goalPeriod1) => {
    if (this.state.prevGoalPeriod != goalPeriod1) {
      this.setState({ periodChanged: true });
    }
  }

  /**
   * user attempts to edit habit, load the habit settings into the state
   * 
   */
  _toggleHabitModal = (child) =>
    this.setState({
      index: habits.indexOf(child), stateChanged: false, count: child.val().count, habitid: child.val().habitid, isHabitModalVisible: true,
      habitName: child.val().habitName, sunP: child.val().sunP,
      monP: child.val().monP, tueP: child.val().tueP, wedP: child.val().wedP, thuP: child.val().thuP,
      friP: child.val().friP, satP: child.val().satP, reminders: child.val().reminders,
      goalPeriod: child.val().goalPeriod, prevGoalPeriod: child.val().goalPeriod, timesPerPeriod: child.val().timesPerPeriod
    });

  /**
   * user cancels or hidse the modal, reset the state
   * 
   */
  _toggleHabitModalNull = () => {
    this.setState({ isHabitModalVisible: null });
    this.setState({ timesPerPeriod: 1 });
    this.setState({ sunP: 0 });
    this.setState({ monP: 0 });
    this.setState({ tueP: 0 });
    this.setState({ wedP: 0 });
    this.setState({ thuP: 0 });
    this.setState({ friP: 0 });
    this.setState({ satP: 0 });
    this.setState({ timesPerPeriod: 1 });
    this.setState({ reminders: false });
    this.setState({ checked: false });
    this.setState({ goalPeriod: 0 });
    this.setState({ habitid: "" });
    this.setState({ count: 0 });
    this.setState({ stateChanged: false });
    //this.forceUpdate();
  }


  lastTap = null;
  /**
   * handles double tap function for each habit component, increments the count and updates databsase
   * 
   * @param counter current counter
   * @param habitid the habitid of the habit that was double clicked
   */
  handleDoubleTap = (counter, habitid) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (this.lastTap && (now - this.lastTap) < DOUBLE_PRESS_DELAY) {
      var count1 = counter + 1;
      firebase.database().ref(`UsersList/${firebase.auth().currentUser.uid}/z_habits/${habitid}`).update({
        count: count1
      })
      this.forceUpdate();
    } else {
      this.lastTap = now;
    }
  }

  /**
   * check if there is a current user using a promise
   * 
   */
  checkUserState() {
    return new Promise((resolve, reject) => {
      var user = firebase.auth().currentUser;
      if (user) {
        resolve('good')
      }
      else {
        reject('bad')
      }

    })
  }
  /**
   * componentwillmount will be called when this screen reaches this stage of react native lifecycle
   * waits for user authentication to load then grabs all the habits and places them into habit object array
   * habit array is used to map out components in the render function
   * 
   */
  componentWillMount() {

    this.unsubscribe = firebase.auth().onAuthStateChanged(currentUser => {
      var promise = new Promise((resolve, reject) => {

        let user = currentUser;
        let current = firebase.auth().currentUser;
        if (user === current) {
          resolve("Promise resolved successfully");
        }
        else {
          reject(Error("Promise rejected"));
        }
      });

      promise.then(result => {
        console.log(currentUser)
        console.log(result)

        while (habits.length === 0) {

          addHabit(null);

          firebase.database().ref(`UsersList/${currentUser.uid}/z_habits`).on('value', function (snapshot) {
            snapshot.forEach(function (child) {

              var edited = false;
              var oldIndex;

              for (i = 0; i < habits.length; i++) {
      
                if (habits[i] != null) {
                  if (child.val().habitid === habits[i].val().habitid) {
                    edited = true;
                    oldIndex = i;
                  }
                }
              }
              if (edited == false) {
                addHabit(child);
              }
              else {
                habits[oldIndex] = child;
              }
            });
          });
        }

        if (habits.length > 0) {
          var index = habits.indexOf(null);
          if (index > -1) {
            habits.splice(index, 1);
          }
          const value = this;

          value.set = function () {
            this.setState({ currentUser });
          }

          setTimeout(function () { value.set(); }, 1000);
          console.log(currentUser)
        }
      }, function (error) {
        console.log(error);
      });



    })
    this.forceUpdate();
  }

  /**
   * function is called upon reaching the componentwillunmount state of react native lifecycle
   * 
   */
  componentWillUnmount() {
    this.unsubscribe()
  }

  /**
   * updates the habit settings after user presses save and writes to database, resets all states after
   * 
   * @param child the habit object
   * @param habitName1 updated habit name
   * @param sunP1 updated sunP
   * @param monP1 updated monP
   * @param tueP1 updated tueP
   * @param wedP1 updated wedP
   * @param thuP1 updated thuP
   * @param friP1 updated friP
   * @param satP1 updated satP
   * @param timesPerPeriod1 updated times per period
   * @param reminders1 updated reminders
   * @param goalPeriod1 updated goal period
   * 
   */
  updateHabitData = (child, habitName1, sunP1, monP1, tueP1, wedP1, thuP1, friP1, satP1, timesPerPeriod1, reminders1, goalPeriod1, count1, id) => {

    var user = firebase.auth().currentUser

    firebase.database().ref(`/UsersList/${user.uid}/z_habits/${this.state.habitid}`).update({
      habitName: habitName1,
      sunP: sunP1,
      monP: monP1,
      tueP: tueP1,
      wedP: wedP1,
      thuP: thuP1,
      friP: friP1,
      satP: satP1,
      timesPerPeriod: timesPerPeriod1,
      reminders: reminders1,
      goalPeriod: goalPeriod1,
      count: 0


    }).then((data) => {

      var index = this.state.index;

    }).catch((error) => {
      console.log('error ', error)
    })
    this.forceUpdate();
    this._toggleHabitModalNull();
  }

  /**
   * refresh components
   * 
   */
  _refresh = () => {
    this.forceUpdate();
  }
  
  /**
   * reminders state change
   * 
   */
  _toggleCheck = () => {
    this.setState({ reminders: !this.state.reminders, stateChanged: true });
  }

  /**
   * update states as settings are changed
   * 
   */
  _onSunPress = () => {
    this.setState({ sunP: this.state.sunP === 0 ? 1 : 0, stateChanged: true });
  }
  _onMonPress = () =>
    this.setState({ monP: this.state.monP === 0 ? 1 : 0, stateChanged: true });

  _onTuePress = () =>
    this.setState({ tueP: this.state.tueP === 0 ? 1 : 0, stateChanged: true });

  _onWedPress = () =>
    this.setState({ wedP: this.state.wedP === 0 ? 1 : 0, stateChanged: true });

  _onThuPress = () =>
    this.setState({ thuP: this.state.thuP === 0 ? 1 : 0, stateChanged: true });

  _onFriPress = () =>
    this.setState({ friP: this.state.friP === 0 ? 1 : 0, stateChanged: true });

  _onSatPress = () =>
    this.setState({ satP: this.state.satP === 0 ? 1 : 0, stateChanged: true });

  /**
   * update habit name, state changed
   * 
   * @param {*} text 
   */
  _changedName(text) {
    this.setState({ habitName: text });
    this.setState({ stateChanged: true });

  }

  /**
   * used to reset counter for a habit
   * 
   * @param {*} habitid specified habit object
   */
  _resetCounter(habitid) {
    firebase.database().ref(`UsersList/${firebase.auth().currentUser.uid}/z_habits/${habitid}`).update({
      count: 0
    })
    this.forceUpdate();
  }

  /**
   * delete a habit from the array and refresh the components
   * 
   * @param {*} child habit object to be deleted
   */
  removeChild(child) {
    var index = habits.indexOf(child);
    if (index > -1) {
      habits.splice(index, 1);
    }
    console.log("DELETING " + child.val().habitName);

    firebase.database().ref(`UsersList/${firebase.auth().currentUser.uid}/z_habits/${child.val().habitid}`).set(null);
    this._refresh();

  }


  render() {

    const buttons = ['Daily', 'Weekly', 'Monthly']
    const isInvalid = this.state.stateChanged === false;

    return (
      <View style={styles.container}>
        <NavigationEvents
          onDidFocus={() => {
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
            <Header transparent>
              <Left>
                <Button icon={
                  <Icon
                    name='settings'
                    type='feather'
                    color='#414042'
                    size={25} />}

                  type='clear'
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
                    name='plus'
                    type='feather'
                    color='#414042'
                    size={25} />}
                  type='clear'
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
                <TouchableWithoutFeedback onPress={() => this.handleDoubleTap(theHabit.val().count, theHabit.val().habitid)}
                  onLongPress={() => Alert.alert(
                    'Reset Tracker?',
                    'Data Cannot Be Recovered',
                    [
                      { text: 'Confirm', onPress: () => (this._resetCounter(theHabit.val().habitid)) },
                      {
                        text: 'Cancel',
                        style: 'cancel',
                      },

                    ],
                    { cancelable: false })}
                >
                  <Card containerStyle={{
                    backgroundColor: this.state.cardcolor,
                    shadowColor: '#D1D3D4',
                    shadowOffset: { width: 2, height: 2 },
                    shadowRadius: 7,
                    shadowOpacity: 25,
                    borderRadius: 7,
                    height: 75
                  }}
                  >


                    <View containerStyle={{ flexDirection: 'row' }}>
                      <Text style={styles.cardtext}> {theHabit.val().habitName}</Text>
                      <Button style={styles.editbutton} onPress={() => (this._toggleHabitModal(theHabit))}
                        icon={
                          <Icon
                            name='edit'
                            type='feather'
                            color='#414042'
                            size={23}
                          />
                        }
                        type='clear'>
                      </Button>
                      <Button style={styles.deletebutton} onPress={() => Alert.alert(
                        'Are You Sure?',
                        'Data Cannot Be Recovered',
                        [
                          { text: 'Confirm', onPress: () => (this.removeChild(theHabit)) },
                          {
                            text: 'Cancel',
                            style: 'cancel',
                          },

                        ],
                        { cancelable: false })}
                        icon={
                          <Icon
                            name="trash-2"
                            color='#414042'
                            type='feather'
                            size={23}
                          />
                        }
                        type='clear' ></Button>
                    </View>
                    <Text style={styles.todayText}>{theHabit.val().goalPeriod === 0 ? 'Today:' :
                      theHabit.val().goalPeriod === 1 ? 'This Week:' : 'This Month:'} {theHabit.val().count}/{theHabit.val().timesPerPeriod}
                    </Text>
                    <Modal
                      contentContainerStyle={styles.modalContent}
                      isVisible={this.state.isHabitModalVisible}
                      onSwipeComplete={() => this.setState({ isHabitModalVisible: false })}
                      swipeDirection="up">
                      <View style={{ height: 500, backgroundColor: 'white', borderRadius: 15 }}>

                        <Text style={styles.titleText}> Habit Name: </Text>
                        <Input inputStyle={styles.textInput}

                          placeholder='  Ex: Drink Water '
                          onChangeText={(text) => this.setState({ habitName: text, stateChanged: true })}

                        >{this.state.habitName}</Input>

                        <Text style={styles.titleText}> Goal Period: </Text>
                        <ButtonGroup
                          onPress={this.updateIndex}
                          selectedIndex={this.state.goalPeriod}
                          buttons={buttons}
                          containerStyle={{ height: 30 }}
                        />

                        <Text style={styles.titleText}>
                          Times Per {this.state.goalPeriod === 0 ? 'Day' : this.state.goalPeriod === 1 ? 'Week' : 'Month'}:
                      {this.state.timesPerPeriod} </Text>
                        <View style={styles.Slider}>
                          <Slider

                            thumbStyle={{
                              backgroundColor: '#E9765B',
                              width: 17,
                              height: 17,

                            }}
                            minimumTrackTintColor='#E9765B'
                            thumbTouchSize={{ width: 70, height: 70 }}
                            value={this.state.timesPerPeriod}
                            maximumValue={10}
                            minimumValue={1}
                            step={1}
                            timesPerPeriod={this.state.timesPerPeriod}
                            onValueChange={timesPerPeriod => this.setState({ timesPerPeriod, stateChanged: true })}
                          />
                        </View>
                        <Text style={styles.trackText}> Track Which Days?: </Text>

                        <Container style={{ flexDirection: 'row', flex: 1, height: 50 }}>
                          <TouchableOpacity value='sun'
                            onPress={this._onSunPress}
                            style={this.state.sunP === 0 ? styles.cButton : styles.cButtonPressed} >
                            <Text style={this.state.sunP === 0 ? styles.dayText : styles.dayTextPressed} >S</Text>
                          </TouchableOpacity>
                          <TouchableOpacity value='mon'
                            onPress={this._onMonPress}
                            style={this.state.monP === 0 ? styles.cButton : styles.cButtonPressed} >
                            <Text style={this.state.monP === 0 ? styles.dayText : styles.dayTextPressed} >M</Text>
                          </TouchableOpacity>
                          <TouchableOpacity value='tue'
                            onPress={this._onTuePress}
                            style={this.state.tueP === 0 ? styles.cButton : styles.cButtonPressed} >
                            <Text style={this.state.tueP === 0 ? styles.dayText : styles.dayTextPressed} >T</Text>
                          </TouchableOpacity>
                          <TouchableOpacity value='wed'
                            onPress={this._onWedPress}
                            style={this.state.wedP === 0 ? styles.cButton : styles.cButtonPressed} >
                            <Text style={this.state.wedP === 0 ? styles.dayText : styles.dayTextPressed} >W</Text>
                          </TouchableOpacity>
                          <TouchableOpacity value='thu'
                            onPress={this._onThuPress}
                            style={this.state.thuP === 0 ? styles.cButton : styles.cButtonPressed} >
                            <Text style={this.state.thuP === 0 ? styles.dayText : styles.dayTextPressed} >H</Text>
                          </TouchableOpacity>
                          <TouchableOpacity value='fri'
                            onPress={this._onFriPress}
                            style={this.state.friP === 0 ? styles.cButton : styles.cButtonPressed} >
                            <Text style={this.state.friP === 0 ? styles.dayText : styles.dayTextPressed} >F</Text>
                          </TouchableOpacity>
                          <TouchableOpacity value='sat'
                            onPress={this._onSatPress}
                            style={this.state.satP === 0 ? styles.cButton : styles.cButtonPressed} >
                            <Text style={this.state.satP === 0 ? styles.dayText : styles.dayTextPressed} >A</Text>
                          </TouchableOpacity>

                        </Container>

                        <Text style={styles.titleText}> Reminders: </Text>
                        <CheckBox

                          left
                          fontFamily='System'
                          title='REMINDERS'
                          checked={this.state.reminders}
                          checkedColor='green'
                          onPress={this._toggleCheck}
                        />
                        <Text style={{ height: 70 }}> </Text>




                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>

                          <Button
                            onPress={() => Alert.alert(
                              'Save Changes?',
                              'Tracker Will Be Reset',
                              [
                                {
                                  text: 'Confirm', onPress: () => this.updateHabitData(theHabit, this.state.habitName, this.state.sunP, this.state.monP,
                                    this.state.tueP, this.state.wedP, this.state.thuP, this.state.friP,
                                    this.state.satP, this.state.timesPerPeriod, this.state.reminders, this.state.goalPeriod, theHabit.val().count,
                                    theHabit.val().habitid)
                                },
                                {
                                  text: 'Cancel',
                                  style: 'cancel',
                                },

                              ],
                              { cancelable: false })}
                     
                            style={styles.savebutton}
                            disabled={isInvalid}
                            title="Save">
                          </Button>
                          <Button onPress={this._toggleHabitModalNull} style={styles.cancelbutton} title="Cancel"></Button>
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

/**
 * styles sheet used to for styling and positioning of components and text
 * 
 */
const styles = StyleSheet.create({
  todayText: {
    fontSize: 13,
    color: '#414042',
    marginLeft: 5
  },
  titleText: {
    fontFamily: 'System',
    fontSize: 18,
    fontWeight: 'bold',
    paddingTop: 10,
    marginLeft: 5,
    color: '#414042'
  },
  textInput: {
    paddingLeft: 5
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
  cardtext: {
    fontFamily: 'System',
    fontWeight: 'bold',
    fontSize: 25,
    color: '#414042',
    paddingRight: 65
  },
  savebutton: {
    paddingRight: 7,
    borderRadius: 5,
    paddingBottom: 15,
    width: 100
  },
  cancelbutton: {
    paddingLeft: 7,
    borderRadius: 5,
    paddingBottom: 15,
    width: 100


  },
  deletebutton: {
    position: 'absolute',
    borderRadius: 5,

    bottom: -7,
    left: 280,
    paddingLeft: 5
  },
  editbutton: {
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
    paddingTop: 15,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 70,
    height: 70,
    resizeMode: 'contain',



  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  cButton: {
    borderWidth: 0.5,
    borderRadius: 100,
    borderColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    marginRight: 4,
    marginLeft: 4,

  },

  cButtonPressed: {

    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
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
  Slider: {
    marginLeft: 15,
    marginRight: 15,

  },
  dayText: {
    fontSize: 17,

  },
  dayTextPressed: {
    fontSize: 17,

    color: 'white',
  }


});








