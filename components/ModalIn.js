import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
  Image,
  TextInput,
  Keyboard,
  Alert,
} from "react-native";
import Header from "../components/Header";
import { Path } from "react-native-svg";

export default function ModalIn({
  show,
  setshow,
  code_out,
  setcode_out,
  setpath_code,
}) {
  const close = () => {
    setshow(false);
  };
  const [keyboardStatus, setKeyboardStatus] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardStatus(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardStatus(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  const path_code = () => {
    setpath_code(true);
    setshow(false);
  };
  return (
    <>
      {show ? (
        <Pressable style={styles.shadow_container}>
          <View style={styles.container}>
            {keyboardStatus ? null : (
              <>
                <Text style={styles.text_title}>Acerca la tarjeta</Text>
                <Image
                  style={{
                    resizeMode: "contain",
                    width: 300,
                    height: 200,
                  }}
                  source={require("../assets/image_load.jpeg")}
                />
                <Text style={styles.text_sub}>
                  para realizar el registro de entrada
                </Text>
                <Text style={styles.text_sub}>O</Text>
              </>
            )}

            <Text style={styles.text_sub}>Ingresa el codigo de salida</Text>
            <Text style={styles.text_warn}>
              Ingresa solo este codigo en caso de que la nfc no fuincione
            </Text>
            <TextInput
              keyboardType="numeric"
              style={styles.input_form}
              onChangeText={setcode_out}
              value={code_out}
              placeholder=""
            ></TextInput>
            <TouchableOpacity
              style={styles.button_in_code}
              onPress={() =>
                code_out !== ""
                  ? path_code()
                  : Alert.alert(
                      "Ingresa el codigo de salida, para continuar",
                      "Solo si la rfid no genero lectura"
                    )
              }
            >
              <Text style={styles.text_button}>Continuar</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "80%",
    position: "absolute",
    height: "80%",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: 50,
  },
  shadow_container: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    display: "flex",

    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 3,
  },
  text_title: {
    fontStyle: "normal",
    color: "#020C3B",
    fontSize: 25,
    fontWeight: "700",
    marginTop: 30,
  },
  text_sub: {
    width: "80%",
    fontStyle: "normal",
    color: "#818490",
    fontSize: 20,
    marginTop: 10,
    textAlign: "center",
  },
  text_warn: {
    width: "80%",
    fontStyle: "normal",
    color: "#818490",
    fontSize: 14,

    textAlign: "center",
  },

  butotn_create: {
    backgroundColor: "#00846B",
    width: "90%",
    height: 48,
    borderRadius: 16,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    marginVertical: 5,
  },
  text_create: {
    fontStyle: "normal",
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  button_in_code: {
    width: "95%",
    height: 50,
    backgroundColor: "#59130A",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    borderRadius: 10,
    marginBottom: 40,
  },
  text_button: {
    fontFamily: "BrandonGrotesqueRegular",
    fontSize: 22,
    color: "#fff",
  },
  input_form: {
    width: "30%",
    height: 40,
    backgroundColor: "white",
    borderRadius: 5,
    marginTop: 10,
    fontSize: 30,
    textAlign: "center",
    borderWidth: 1,
    borderColor: "black",
    marginLeft: 10,
    marginBottom: 10,
  },
});
