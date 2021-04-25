import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { CameraRoll, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker'



export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>CoffeeCam, Open up App.js to start working on your app!</Text>
        <StatusBar style="auto" />
      </View>
    );
  }

  async componentDidMount() {
    //Request permission from the user
    this.requestPermissionAsync()
  }

  changeCameraOrientation = () => {
    //Functional component
    const { cameraOrientation: orientation } = this.state

    this.setState({
      cameraOrientation:
        orientation === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.Back
    })
  }

  takePicture = async () => {
    //Method of Camera
    if (this.camera) {
      let photo = await this.camera.takePictureAsync();
      console.log(photo);
      const { uri } = photo;
      console.log('uri', uri);
    }
  }


}

pickImage = async () => {

  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images
  });
}

var flashMode = Observable();

function nextFlashMode() {
  if (flashMode.value == Camera.FLASH_MODE_AUTO) return Camera.FLASH_MODE_ON;
  else if (flashMode.value == Camera.FLASH_MODE_ON) return Camera.FLASH_MODE_OFF;
  else if (flashMode.value == Camera.FLASH_MODE_OFF) return Camera.FLASH_MODE_AUTO;
  else throw "Invalid flash mode";
}

function changeFlashMode() {
  Camera.setFlashMode(nextFlashMode())
      .then(function(newFlashMode) {
          flashMode.value = newFlashMode;
          console.log("Flash mode set to: " + flashMode.value);
      })
      .catch(function(err) {
          console.log("Failed to set flash mode: " + err);
      });
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
