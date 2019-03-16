import React from 'react';
import { Text, StyleSheet, ScrollView, View, Alert,TextInput} from 'react-native';
import { Button } from 'react-native-elements';


export default class SettingsScreen extends React.Component {
  state = {
    name: ''
  }
  _onPressButton() {
    Alert.alert('Hello!')
  }

  handleName = (text) => {
    this.setState({ name: text })
  }

  hello = (name) => {
    Alert.alert('Hello ' + this.state.name)
  }

  render() {

    return (
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <Button style = {styles.button}
            onPress = {this._onPressButton}
            title="Solid Button"
          />

          <Button style = {styles.button}
            onPress = {this._onPressButton}
            title="Outline button"
            type="outline"
          />

          <Button style = {styles.button}
            onPress = {this._onPressButton}
            title="Clear button"
            type="clear"
          />

          <Button style = {styles.button}
            onPress = {this._onPressButton}
            title="Loading button"
            loading
          />

          <TextInput
          style={styles.textInput}
          placeholder="Enter Your Name!"
          returnKeyLabel = {"next"}
          onChangeText = {(text) => this.setState({name:text})}
          />

          <Button style = {styles.button}
            onPress = {this.hello}
            title="Hello"
          />



      <Text style = {styles.helloText}> h </Text>
      <Text style = {styles.helloText}> h </Text>
      <Text style = {styles.helloText}> e </Text>
      <Text style = {styles.helloText}> l </Text>
      <Text style = {styles.helloText}> l </Text>
      <Text style = {styles.helloText}> o </Text>
      <Text style = {styles.helloText}> o </Text>
      <Text style = {styles.helloText}> o </Text>
      <Text style = {styles.helloText}> o </Text>
      <Text style = {styles.helloText}> o </Text>
      <Text style = {styles.helloText}> o </Text>

        </ScrollView>
      </View>
    )

  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  helloText: {
    fontSize: 200,
    flexDirection: 'row',
    textAlign: 'left',
    justifyContent: 'space-between',

  },
  button: {
    margin: 10,
    marginLeft: 100,
    marginRight: 100
  },
  textInput: {
    textAlign: 'center',
    marginLeft: 60,
    marginRight: 60,
    fontSize: 30,
    borderWidth: 0.5,
    paddingTop: 5,
    paddingBottom: 5,
    justifyContent: 'space-around'
  }
});