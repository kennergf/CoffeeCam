import { StatusBar } from 'expo-status-bar';
<<<<<<< Updated upstream
import React from 'react';
import { CameraRoll, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker'


=======
import React, {useState} from 'react';
import { CameraRoll, StyleSheet, Text, View,useWindowDimensions } from 'react-native';
>>>>>>> Stashed changes

export default class App extends React.Component {

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

  render() {
    return (
      <View style={styles.container}>
        <Camera style={} type={} ref={ref => {this.camera = ref}}>
          <View style={}>
            
          </View>
        </Camera>
      </View>
    );
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

  state = {
    hasPermission: null,
    type: Camera.Constants.Type.back,
 

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasPermission: status === 'granted' });
  },
  getPermissionAsync = async () => {
    const { status } = await Camera.requestPermissionsAsync();
    const { media } =  await MediaLibrary.requestPermissionsAsync();
    
    this.setState({ hasPermission: status === 'granted' });
  },

async componentDidMount() {
  this.requestPermissionAsync()
}, 
requestPermissionAsync = async () => {

    if (Platform.OS === 'ios') {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Unauthorized permission!');
      }
    }
  
    const { status } = await Camera.requestPermissionsAsync();
    const { media } =  await MediaLibrary.requestPermissionsAsync();
    this.setState({ hasPermission: status === 'granted' });
  },
  <View>
            <Text>Hello</Text>
            <Button
                onPress={() => {
                    navigation.navigate('Two')
                }}
                title="Go to Screen Two"
            />
        </View>
}
  



});
