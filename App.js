import React, { useState, useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Button,
  Image,
  PixelRatio,
} from "react-native";
import NfcManager, { NfcTech, Ndef } from "react-native-nfc-manager";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import ViewShot from "react-native-view-shot";
import { Dimensions } from "react-native";
import * as Location from "expo-location";
NfcManager.start();
export default function App() {
  const viewShotRef = useRef(null);
  const [cantidad, setcantidad] = useState("");
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [prueba, setprueba] = useState(false);
  const [coord, setcoord] = useState(false);

  async function getCurrentLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      // handle location permission not granted
    }

    let location = await Location.getCurrentPositionAsync({});
    console.log("esta", location.coords);
    setcoord(location.coords);
    return location.coords;
  }
  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");
    })();
    getCurrentLocation();
  }, []);

  const handleSaveImage = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    const targetPixelCount = 1080; // If you want full HD pictures
    const pixelRatio = PixelRatio.get(); // The pixel ratio of the device
    // pixels * pixelratio = targetPixelCount, so pixels = targetPixelCount / pixelRatio
    const pixels = targetPixelCount / pixelRatio;
    const uri = await viewShotRef.current.capture({
      width: pixels,
      height: pixels,
    });

    if (status === "granted") {
      // Save image to media library
      await MediaLibrary.saveToLibraryAsync(uri);

      console.log("Image successfully saved");
      setImage(null);
    }
  };

  const takePicture = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (camera) {
      const data = await camera.takePictureAsync(null);
      setImage(data.uri);

      // if (status === "granted") {
      //   // Save image to media library
      //   await MediaLibrary.saveToLibraryAsync(data.uri);

      //   console.log("Image successfully saved");
      // }
    }
  };
  async function writeNdef({ type, value }) {
    let result = false;

    try {
      // STEP 1

      await NfcManager.requestTechnology(NfcTech.Ndef);

      const bytes = Ndef.encodeMessage([Ndef.textRecord(cantidad)]);

      if (bytes) {
        await NfcManager.ndefHandler // STEP 2
          .writeNdefMessage(bytes); // STEP 3
        result = true;
      }
    } catch (ex) {
      console.warn(ex);
    } finally {
      // STEP 4
      NfcManager.cancelTechnologyRequest();
    }

    return result;
  }
  async function readNdef() {
    try {
      // register for the NFC tag with NDEF in it
      await NfcManager.requestTechnology(NfcTech.Ndef);
      // the resolved tag object will contain `ndefMessage` property
      const tag = await NfcManager.getTag();

      let ndef = tag.ndefMessage[0];
      console.warn("Tag found", tag.ndefMessage[0]);

      let text = Ndef.text.decodePayload(ndef.payload);
      console.warn("Tag found", text);
    } catch (ex) {
      console.warn("Oops!", ex);
    } finally {
      // stop the nfc scanning
      NfcManager.cancelTechnologyRequest();
    }
  }
  const date = new Date();
  return (
    <View style={styles.container}>
      {image ? (
        <ViewShot style={styles.fixedRatio} ref={viewShotRef}>
          <Image style={styles.image} source={{ uri: image }} />
          <View style={styles.textContainer}>
            <Text style={styles.text_info}>
              Latitud:{parseFloat(coord.latitude).toFixed(6)}
            </Text>
            <Text style={styles.text_info}>
              Longitud:{parseFloat(coord.longitude).toFixed(6)}{" "}
            </Text>
            <Text style={styles.text_info}>
              Altitud:{parseFloat(coord.altitude).toFixed(2)}{" "}
            </Text>

            <Text style={styles.text_info}>
              Fecha:
              {date.getDate() +
                "/" +
                parseInt(date.getMonth()) +
                1 +
                "/" +
                date.getFullYear()}{" "}
            </Text>
            <Text style={styles.text_info}>
              Hora:
              {date.getHours() +
                ":" +
                date.getMinutes() +
                ":" +
                date.getSeconds()}{" "}
            </Text>
          </View>
        </ViewShot>
      ) : (
        <>
          <Camera
            ref={(ref) => setCamera(ref)}
            style={styles.cam_fixedRatio}
            type={type}
            ratio={"1:1"}
          />
          <View style={styles.textContainer}>
            <Text style={styles.text_info}>
              Latitud:{parseFloat(coord.latitude).toFixed(6)}
            </Text>
            <Text style={styles.text_info}>
              Longitud:{parseFloat(coord.longitude).toFixed(6)}{" "}
            </Text>
            <Text style={styles.text_info}>
              Altitud:{parseFloat(coord.altitude).toFixed(2)}{" "}
            </Text>

            <Text style={styles.text_info}>
              Fecha:
              {date.getDate() +
                "/" +
                parseInt(date.getMonth() + 1) +
                "/" +
                date.getFullYear()}{" "}
            </Text>
            <Text style={styles.text_info}>
              Hora:
              {date.getHours() +
                ":" +
                date.getMinutes() +
                ":" +
                date.getSeconds()}{" "}
            </Text>
          </View>
        </>
      )}
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-around",
        }}
      >
        <Button title="Take Picture" onPress={() => takePicture()} />
        <Button title="guardar" onPress={() => handleSaveImage()} />
      </View>

      <Text>Prueba lectura y esscritura Rfid </Text>
      {prueba ? (
        <>
          {" "}
          <TextInput
            autoFocus={true}
            keyboardType="numeric"
            style={styles.input_form}
            onChangeText={setcantidad}
            value={cantidad}
            placeholder=""
          ></TextInput>
          <View style={styles.row_container}>
            <TouchableOpacity style={styles.button} onPress={readNdef}>
              <Text style={styles.text_button}>LEER</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={writeNdef}>
              <Text style={styles.text_button}>ESCRIBIR</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : null}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  input_form: {
    width: "30%",
    height: 60,
    backgroundColor: "white",
    borderRadius: 5,
    marginTop: 20,
    fontSize: 40,
    textAlign: "center",
    borderWidth: 1,
    borderColor: "black",
    marginBottom: 20,
  },
  row_container: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    width: 150,
    backgroundColor: "blue",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 30,
    borderRadius: 10,
  },
  text_button: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#fff",
  },
  text_info: {
    fontWeight: "bold",
    fontSize: 45,
    color: "#fff",
    marginLeft: 2,
    marginTop: 2,
  },
  fixedRatio: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  cam_fixedRatio: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    aspectRatio: 1,
  },
  image: { width: "100%", height: "100%" },
  textContainer: {
    position: "absolute",
    top: 100,
    zIndex: 1,
    width: "100%",
    alignSelf: "center",
  },
});
