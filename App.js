import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker'
import React, {useState} from 'react';
import { CameraRoll, StyleSheet, Text, View,useWindowDimensions } from 'react-native';
import { Entypo, FontAwesome } from '@expo/vector-icons';



export default class App extends React.Component {

  state = {
    hasPermission: null,
    cameraType: Camera.Constants.Type.back,
  }

  async componentDidMount() {
    this.getPermissionAsync()
  }

  getPermissionAsync = async () => {
   
    const { status } = await Camera.requestPermissionsAsync();
    const { media } =  await MediaLibrary.requestPermissionsAsync();
   
    this.setState({ hasPermission: status === 'granted' });
  }

  handleCameraType = () => {
    const { cameraType } = this.state

    this.setState({
      cameraType:
        cameraType === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back
    })
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

  changeFlashMode = () => {
    const { flashMode: mode } = this.state

    this.setState({
      flashMode:
        mode === Camera.Constants.FlashMode.off
          ? Camera.Constants.FlashMode.on
          : Camera.Constants.FlashMode.off
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
 
 

  pickImage = async () => {

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images
    });
  }
  /**
   * Print the visual UI to the screen
   */
  render() {
    //Setting permissions to take pictures using state object
    const { hasPermission } = this.state

    //User doesn't have granted or denied permissions
    if (hasPermission === null) {
      return <View />;
    
    //Denied permission
    }else if(hasPermission === false){
      return(
        <View style={{
          flex: 1,
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
           <Text>No access to camera</Text>
        </View>
      );
    
    //Granted permission
    }else{
      return(
        <View style={{ flex: 1 }}>
        <Camera style={{ flex: 1 }} type={this.state.cameraOrientation} ref={ref => { this.camera = ref }}>
          <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", margin: 30 }}>
            <TouchableOpacity
              style={{
                alignSelf: 'flex-end',
                alignItems: 'center',
                backgroundColor: 'transparent'
              }}
              onPress={() => this.pickImage()}>
            <FontAwesome
              name="photo"
              style={{ color: "#fff", fontSize: 40 }}
            />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                alignSelf: 'flex-end',
                alignItems: 'center',
                backgroundColor: 'transparent',
              }}
              onPress={() => this.takePictureAndSalveOnAlbum()}
            >
            <FontAwesome 
              name="camera-retro" 
              size={24} 
              color="black" 
            />
              {/* Original Button
              <FontAwesome
                name="camera"
                style={{ color: "#fff", fontSize: 40 }}
              /> */}
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                alignSelf: 'flex-end',
                alignItems: 'center',
                backgroundColor: 'transparent',
              }}
              onPress={() => this.changeCameraOrientation()}
            >
              <MaterialCommunityIcons
                name="camera-switch"
                style={{ color: "#fff", fontSize: 40 }}
              />
            </TouchableOpacity>
          </View>
        </Camera>
      </View>
      );
    }
  }
} // Here finishes the method App with all the functions for the camera
























/**
 * Create the styles for the app
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  capture: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 5,
    borderColor: constant.COLOR_PRIMARY,
    backgroundColor: constant.COLOR_PRIMARY,
    marginBottom: 15
  },
  
  preview: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      width: '100%',
      height: '100%'
  }


});
// End of styles
