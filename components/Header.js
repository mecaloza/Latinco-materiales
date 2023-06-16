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
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
// TextInput.defaultProps.selectionColor = "black";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  NavigationContainer,
  NavigationContext,
} from "@react-navigation/native";

import { Entypo, AntDesign } from "@expo/vector-icons";
import Modal_out from "./Modalout";

// se debe contianuar con ajustest

export default function Header({ text, screen, confirm }) {
  const navigation = React.useContext(NavigationContext);
  const log_out = async () => {
    try {
      await AsyncStorage.removeItem("Token_latin");
      await AsyncStorage.clear();
      navigation.navigate("Login");
    } catch (e) {
      console.log(e);
    }
  };
  const [show_out, setshow_out] = useState(false);

  const on_back = () => {
    if (confirm) {
      setshow_out(true);
    } else {
      navigation.goBack();
    }
  };
  return (
    <>
      <Modal_out show={show_out} setshow={setshow_out}></Modal_out>
      <View style={styles.container}>
        {screen === 1 ? (
          <>
            <View style={styles.row_header}>
              <Pressable style={{ widht: 100 }} onPress={() => log_out()}>
                <Entypo name="log-out" size={24} color="white" />
              </Pressable>
            </View>
            <Text style={styles.text_inside}>{text}</Text>
          </>
        ) : (
          <>
            <View style={styles.row_header_2}>
              <Pressable
                style={{ widht: "100%", marginLeft: -20 }}
                onPress={() => {
                  on_back();
                }}
              >
                <AntDesign name="arrowleft" size={35} color="white" />
              </Pressable>
              <Text style={styles.text_inside_2}>{text}</Text>
            </View>
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    display: "flex",
    height: 130,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#59130A",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },

  row_header: {
    width: "90%",
    display: "flex",
    alignItems: "flex-end",
    height: 30,
    marginTop: 30,
  },
  row_header_2: {
    width: "90%",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    height: 100,
    marginTop: 10,
    flexDirection: "row",
  },
  back_icon: {
    right: 30,
    top: -12,
  },
  text_inside: {
    color: "white",
    fontSize: 32,
    fontFamily: "BrandonGrotesqueRegular",
  },
  text_inside_2: {
    color: "white",
    fontSize: 24,
    fontFamily: "BrandonGrotesqueRegular",
    marginLeft: 15,
    textAlign: "center",
  },
});
