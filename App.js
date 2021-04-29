import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Linking } from 'react-native';
import { Camera } from 'expo-camera';
import { Audio } from 'expo-av';
import { StatusBar } from 'expo-status-bar';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

export default class App extends React.Component {

  state = {
    albumName: 'CoffeeCam',
    hasPermission: null,
    cameraOrientation: Camera.Constants.Type.back,
    flashMode: Camera.Constants.FlashMode.off,
    takingPicture: false,
  }

  async componentDidMount() {
    //Request permission from the user
    this.requestPermissionAsync();

    // REF https://blog.risingstack.com/react-native-tutorial-animation-and-sound/
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

  /**
   * Request the user for the required permissions
   */
  requestPermissionAsync = async () => {
    // REF https://stackoverflow.com/questions/59980039/permissions-askasync-not-working-as-expected
    const cameraPermission = await Camera.requestPermissionsAsync();
    const storagePermission = await MediaLibrary.requestPermissionsAsync();
    const permissionGranted = (cameraPermission.status === 'granted' && storagePermission.status === 'granted');

    this.setState({ hasPermission: permissionGranted });
  }

  /**
  * Change the camera orientation from back to front ans vice versa
  */
  changeCameraOrientation = () => {
    const { cameraOrientation: orientation } = this.state;

    this.setState({ cameraOrientation: this.nextCameraOrientation() });
  }

  /**
   * Change the camera orientation based on a list of possible values
   * @returns Return next camera orientation
   */
  nextCameraOrientation = () => {
    const { cameraOrientation: orientation } = this.state;

    if (orientation == Camera.Constants.Type.back) return Camera.Constants.Type.front;
    else if (orientation == Camera.Constants.Type.front) return Camera.Constants.Type.back;
    else return Camera.Constants.Type.back;
  }

  /**
   * Change the Flash Mode for the camera
   */
  changeFlashMode = () => {
    const { flashMode: mode } = this.state

    this.setState({ flashMode: this.nextFlashMode() });
  }

  /**
   * Change the flash mode based on a list of possible values
   * @returns Return next flash mode
   */
  nextFlashMode = () => {
    const { flashMode: mode } = this.state

    if (mode == Camera.Constants.FlashMode.auto) return Camera.Constants.FlashMode.on;
    else if (mode == Camera.Constants.FlashMode.on) return Camera.Constants.FlashMode.off;
    else if (mode == Camera.Constants.FlashMode.off) return Camera.Constants.FlashMode.torch;
    else if (mode == Camera.Constants.FlashMode.torch) return Camera.Constants.FlashMode.auto;
    else return Camera.Constants.FlashMode.off;
  }

  // REF https://stackoverflow.com/questions/45478621/react-native-styling-with-conditional
  /**
   * Get the icon related with the actual flash mode
   * @returns Icon related with the actual flash mode
   */
  getFlashModeIcon = () => {
    const { flashMode: mode } = this.state

    if (mode == Camera.Constants.FlashMode.auto) return "flash-auto";
    else if (mode == Camera.Constants.FlashMode.on) return "flash-on";
    else if (mode == Camera.Constants.FlashMode.off) return "flash-off";
    else if (mode == Camera.Constants.FlashMode.torch) return "highlight";
  }

  /**
   * Take a picture and save on the album
   * If the album doesn't exist, create one
   */
  takePictureAndSalveOnAlbum = async () => {
    // REF https://reactnativemaster.com/react-native-camera-expo-example/
    const { albumName, takingPicture } = this.state;
    // Take the picture
    this.setState({ takingPicture: true });
    this.cameraShutter.replayAsync();
    const { uri } = await this.camera.takePictureAsync();
    // Save it to the DCIM folder
    const asset = await MediaLibrary.createAssetAsync(uri);

    // REF https://blog.expo.io/using-expos-medialibrary-api-to-create-an-album-and-save-a-photo-9000931c267b
    // REF https://stackoverflow.com/questions/63532277/unhandled-promise-rejection-typeerror-undefined-is-not-an-object-evaluating/67184343#67184343
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
      });

    this.setState({ takingPicture: false });
  }

  pickImage = async () => {

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images
    });

    console.log(result);
  }

  /**
   * Open the Settings of the phone
   */
  openSettings = () => {
    // REF https://reactnative.dev/docs/linking
    Linking.openSettings();
  }

  // REF https://docs.expo.io/versions/latest/sdk/status-bar/
  /**
   * Print the visual UI to the screen
   */
  render() {
    //Setting permissions to take pictures using state object
    const { hasPermission, flashMode, cameraOrientation, takingPicture } = this.state

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
          <Text>This APP needs Camera and Storage access to work</Text>
          <Text>Change the settings on the gear below</Text>
          <View>
            <TouchableOpacity
              style={styles.buttonTop}
              onPress={() => this.openSettings()}>
              <FontAwesome
                name="gear"
                style={{ color: "black", fontSize: 40, }}
              />
            </TouchableOpacity>
          </View>
        </View>
      );

      //Granted permission
    } else {
      return (
        <View style={styles.container}>
          <StatusBar style="light" backgroundColor={takingPicture ? "cornflowerblue" : "darkseagreen"} />
          <View style={styles.viewTop}>
            <TouchableOpacity
              style={styles.buttonTop}
              onPress={() => this.changeFlashMode()}>
              <MaterialIcons
                name={this.getFlashModeIcon()}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
          <Camera style={styles.capture} type={cameraOrientation} flashMode={flashMode} ref={ref => { this.camera = ref }}>
          </Camera>
          <View style={styles.viewBottom}>
            <TouchableOpacity
              style={styles.buttonBottom}
              onPress={() => this.pickImage()}>
              <MaterialIcons
                name="photo-library"
                style={styles.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonBottom}
              onPress={() => this.takePictureAndSalveOnAlbum()}
            >
              <FontAwesome
                name="camera-retro"
                style={styles.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonBottom}
              onPress={() => this.changeCameraOrientation()}
            >
              <MaterialIcons
                name={cameraOrientation === Camera.Constants.Type.back ? "camera-rear" : "camera-front"}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }
} // Here finishes the method App with all the functions for the camera

// REF https://www.codementor.io/@foysalit/building-a-camera-app-with-react-native-r8up5685v
/**
 * Create the styles for the app
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  viewTop: {
    flex: 1,
    top: '3%',
    //flexDirection: "row",
    justifyContent: "space-between",
    margin: 0,
    backgroundColor: "black",
  },
  capture: {
    flex: 4,
  },
  viewBottom: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 0,
    backgroundColor: "black",
  },
  buttonTop: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    margin: 30,
    backgroundColor: 'transparent',
  },
  buttonBottom: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    margin: 30,
    backgroundColor: 'transparent',
  },
  icon: {
    color: "#fff",
    fontSize: 40,
  },
});
// End of styles
