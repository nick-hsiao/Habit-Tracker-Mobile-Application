import React from 'react';
import { Button, Text, View } from 'react-native';


export default class SettingsScreen2 extends React.Component {
  
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

        <Button
          title="Go to Sign-In Screen"
          onPress={() => this.props.navigation.navigate('SignIn')}
        />

        <Button
          title="Go to Password-Change Screen"
          onPress={() => this.props.navigation.navigate('PasswordChange')}
        />

        <Button
          title="Go to Password-Forget Screen"
          onPress={() => this.props.navigation.navigate('PasswordForget')}
        />

      </View>
    );
  }
}
