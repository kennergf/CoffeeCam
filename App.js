import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { CameraRoll, StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );

  async componentDidMount() {

    this.requestPermissionAsync()

  }

  changeCameraOrientation = () => {

    const {cameraOrientation: orientation} = this.state

    this.setState({

      cameraOrientation:

        orientation === Camera.Constants.Type.back

          ? Camera.Constants.Type.front
          : Camera.Constants.Type.Back

    })
  }


}
//
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
