import { StatusBar } from "expo-status-bar";
import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Keyboard,
  Button,
} from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faIdCard, faKey } from "@fortawesome/free-solid-svg-icons";
import { backgroundColor } from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

// se debe conintuar con validaciones de envio
export default function HomeScreen({ navigation }) {
  const [user, onChangeText] = useState("");
  const [pass, onChangePass] = useState("");
  const [Token, setToken] = useState("");

  const save_token = async (token) => {
    await AsyncStorage.setItem("Token_latin", JSON.stringify(token));
    await AsyncStorage.setItem("User_latin", JSON.stringify(user));
  };

  const save_user = async (user) => {
    await AsyncStorage.setItem("User_latin", JSON.stringify(user));
  };

  const get_token = async () => {
    try {
      const result = await AsyncStorage.getItem("Token_latin");
      console.log("este es el toke", JSON.parse(result));
      if (result) {
        navigation.navigate("Steps");
        setToken(result);
      } else {
        return false;
      }
    } catch {
      return false;
    }
  };

  const log_in = () => {
    console.log("y siii");
    fetch(`${global.url_back}auth/token/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: user,
        password: pass,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        if (data?.auth_token) {
          setToken(data.auth_token);

          save_token(data?.auth_token);

          navigation.navigate("Steps");
        } else {
          Alert.alert("Credenciales No validas");
        }
      });
  };
  const importData = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const result = await AsyncStorage.getItem("Token_latin");

      console.log(keys);
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    get_token();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      get_token();
    }, [Token])
  );

  const clearAsyncStorage = async () => {
    AsyncStorage.clear();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardShouldPersistTaps="always"
    >
      <Pressable style={styles.container} onPress={() => Keyboard.dismiss()}>
        <View style={styles.decorative_head}>
          <Image
            style={{
              resizeMode: "contain",
              flex: 1,
              aspectRatio: 0.7,
              marginLeft: 20,
            }}
            source={require("../assets/latinco_fondo_cafe.png")}
          />
          <View style={styles.continaer_login_text}>
            <Text style={styles.text_login}>Login</Text>
          </View>
        </View>

        <View style={styles.row_login_inputs}>
          <View
            style={{
              position: "absolute",
              elevation: 40,
              zIndex: 1000,
              left: "15%",
            }}
            selectionColor={"black"}
          >
            {user !== "" ? null : (
              <FontAwesomeIcon icon={faIdCard} style={styles.icon} size={30} />
            )}
          </View>

          <TextInput
            keyboardType="numeric"
            style={styles.input}
            onChangeText={onChangeText}
            value={user}
            placeholder="                Cédula"
          />
        </View>
        <View style={styles.row_login_inputs}>
          <View
            style={{
              position: "absolute",
              elevation: 40,
              zIndex: 1000,
              left: "15%",
            }}
            selectionColor={"black"}
          >
            {pass !== "" ? null : (
              <FontAwesomeIcon icon={faKey} style={styles.icon} size={30} />
            )}
          </View>
          <TextInput
            style={styles.input}
            onChangeText={onChangePass}
            value={pass}
            secureTextEntry={true}
            placeholder="                Contraseña"
          />
        </View>

        <View style={styles.row_modal_loguin}>
          <Pressable style={styles.button_login} onPress={() => log_in()}>
            <Text style={styles.text_inside}>INGRESAR</Text>
          </Pressable>
        </View>
        {/* <Pressable onPress={() => clearAsyncStorage()}>
          <Text style={styles.text_inside}>Borrar data</Text>
        </Pressable> */}
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    display: "flex",
    height: "100%",
    width: "100%",
    alignItems: "center",
  },
  decorative_head: {
    height: "40%",
    width: "100%",
    backgroundColor: "#591309",
    display: "flex",
    borderBottomLeftRadius: 100,
    marginBottom: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
  row_login_inputs: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: 12,
  },
  icon: {
    color: "#CCCCCC",
  },
  row_modal_loguin: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  input: {
    height: 45,
    borderWidth: 1,
    padding: 10,
    width: "80%",
    borderRadius: 20,
    backgroundColor: "white",
    borderWidth: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.5,
    shadowRadius: 7.49,
    elevation: 12,
    fontFamily: "BrandonGrotesqueRegular",
    fontSize: 18,
  },
  button_login: {
    height: 40,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#591309",
    borderRadius: 20,
    width: "80%",
  },
  text_inside: {
    color: "white",
    fontSize: 25,
    fontFamily: "BrandonGrotesqueRegular",
  },
  continaer_login_text: {
    width: "90%",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    height: "90%",
    position: "absolute",
  },
  text_login: {
    color: "white",
    fontFamily: "BrandonGrotesqueRegular",
    fontSize: 18,
  },
});
