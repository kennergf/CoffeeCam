import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { CameraRoll, StyleSheet, Text, View } from 'react-native';

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
//
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
