import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Camera } from 'expo-camera';
import { Audio } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import { Entypo, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

import { StatusBar } from 'expo-status-bar';

export default class App extends React.Component {

  state = {
    albumName: 'CoffeeCam',
    hasPermission: null,
    cameraOrientation: Camera.Constants.Type.back,
  }

  async componentDidMount() {
    //Request permission from the user
    this.requestPermissionAsync();

    //Adding sound when taking picture
    this.cameraShutter = new Audio.Sound();
    try {
      await this.cameraShutter.loadAsync(
        require('./assets/CameraShutter.mp3'),
      );
    } catch (err) {
      console.log(err);
    }
  }

  requestPermissionAsync = async () => {
    const cameraPermission = await Camera.requestPermissionsAsync();
    const storagePermission = await MediaLibrary.requestPermissionsAsync();
    const permissionGranted = (cameraPermission.status === 'granted' && storagePermission.status === 'granted');

    this.setState({ hasPermission: permissionGranted });
  }

  /**
  * Change the camera orientation from back to front ans vice versa
  */
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

  /**
   * Take a picture and save on the album
   * If the album doesn't exist, create one
   */
  takePictureAndSalveOnAlbum = async () => {
    const { albumName } = this.state;
    // Take the picture
    this.cameraShutter.replayAsync();
    const { uri } = await this.camera.takePictureAsync();
    // Save it to the DCIM folder
    const asset = await MediaLibrary.createAssetAsync(uri);

    // Check if the album exists
    MediaLibrary.getAlbumAsync(albumName)
      .then(album => {
        if (album == null) {
          // Create a new album and move the picture to it
          MediaLibrary.createAlbumAsync('CoffeeCam', asset, false)
            .then(() => {
              console.log('Album created!')
            })
            .catch(error => {
              console.log('Error: ' + error)
            });
        } else {
          // Add the picture to the existing album
          MediaLibrary.addAssetsToAlbumAsync(asset, album.id, false)
            .then(() => {
              console.log('Photo added!')
            })
            .catch(error => {
              console.log('Error: ' + error)
            });
        }
      })
  };

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
    } else if (hasPermission === false) {
      return (
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
    } else {
      return (
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
    //borderColor: constant.COLOR_PRIMARY,
    //backgroundColor: constant.COLOR_PRIMARY,
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
