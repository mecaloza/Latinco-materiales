import React, { useState, useEffect } from "react";

import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Pressable,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import Header from "../components/Header";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import NfcManager, { NfcTech, Ndef } from "react-native-nfc-manager";
import NetInfo from "@react-native-community/netinfo";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import Constants from "expo-constants";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function StepsScreen({ navigation }) {
  const [token_latin, setToken] = useState("");
  const [netInfo, setNetInfo] = useState(true);
  const [name_user, setname_user] = useState(true);

  const version = Constants.manifest.version;

  const save_data = async (data) => {
    await AsyncStorage.setItem("Material_list", JSON.stringify(data));
  };
  const delete_data = async () => {
    await AsyncStorage.removeItem("Off_latinco");
    await AsyncStorage.removeItem("Inn_latinco");
  };

  const get_save = async () => {
    var jsonValue = await AsyncStorage.getItem("Material_list");
    var json_value = JSON.parse(jsonValue);
    console.log(
      "este es el toke",
      json_value.user[0].first_name + " " + json_value.user[0].last_name.user
    );
    setname_user(
      json_value.user[0].first_name + " " + json_value.user[0].last_name
    );
  };
  const get_token = async () => {
    try {
      const result = await AsyncStorage.getItem("Token_latin");
      const user = await AsyncStorage.getItem("User_latin");

      console.log("este es el toke", JSON.parse(result));
      if (result) {
        setToken(result);
        fetch(
          `${
            global.url_back
          }api/materials/source_data/?user_username=${JSON.parse(user)}`,
          {
            method: "GET",

            headers: {
              Authorization: `Token ${JSON.parse(result)}`,
            },
          }
        ).then((response) => {
          if (response.status === 200) {
            return response.json().then((json_response) => {
              console.log("sii", json_response);
              setname_user(
                json_response.user[0].first_name +
                  " " +
                  json_response.user[0].last_name
              );
              save_data(json_response);
            });
          } else {
            return response.json().then((json_response) => {
              console.log("sii", json_response);
              console.log("es aca");
              get_save();
              return false;
            });
          }
        });
      } else {
        navigation.navigate("Home");
        return false;
      }
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetInfo(state.isInternetReachable);
      // setNetInfo(false);

      console.log("ey", state.isConnected);
    });

    return () => {
      // Unsubscribe to network state updates
      unsubscribe();
    };
  }, []);

  const save_info = async () => {
    if (netInfo) {
      const inn_latin = await AsyncStorage.getItem("Inn_latinco");
      const off_latin = await AsyncStorage.getItem("Off_latinco");
      const result = await AsyncStorage.getItem("Token_latin");

      console.log("siii", off_latin);
      if (inn_latin || off_latin) {
        console.log("siii off");
        const data_off = off_latin ? JSON.parse(off_latin) : [];
        const data_inn = inn_latin ? JSON.parse(inn_latin) : [];
        console.log("salida", data_off);
        console.log("entrad", data_inn);

        fetch(`${global.url_back}api/materials/offline/`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Token ${JSON.parse(result)}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            offs: data_off,
            arrivals: data_inn,
          }),
        }).then((response) => {
          // console.log("por aca", response.status);
          if (response.status === 201) {
            delete_data();
            console.log("si", response);
            return false;
          } else {
            return response.json().then((json_response) => {
              console.log("esta es la offline", json_response);

              return false;
            });
          }
        });
      }
    }
  };
  useEffect(() => {
    NfcManager.cancelTechnologyRequest();
    get_token();
    save_info();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      NfcManager.cancelTechnologyRequest();
      save_info();
    }, [token_latin])
  );

  useFocusEffect(React.useCallback(() => {}, []));
  return (
    <View style={styles.container}>
      <Header text={name_user} screen={1}></Header>
      <View style={styles.container_title}>
        <Text style={styles.tex_rectangle_long}> ¿Que deseas hacer? </Text>
        <View style={styles.row_container}>
          <TouchableOpacity
            style={styles.option}
            onPress={() => navigation.navigate("Outs")}
          >
            <Text style={styles.tex_option}>Salida de materiales</Text>
            <Image
              style={{
                resizeMode: "contain",
                flex: 1,
                aspectRatio: 0.7,
              }}
              source={require("../assets/Salida.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.option}
            onPress={() => navigation.navigate("Ins")}
          >
            <Text style={styles.tex_option}>Llegada de materiales</Text>
            <FontAwesome5
              name="caravan"
              size={50}
              color="white"
              style={{ marginTop: 20 }}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.row_container}>
          <TouchableOpacity
            style={[styles.option, !netInfo && { backgroundColor: "#D2D2D2" }]}
            onPress={() =>
              !netInfo
                ? Alert.alert(
                    "Esta seccion no esta diponible sin señal de internet \n Intenta de nuevo mas tarde"
                  )
                : navigation.navigate("Search")
            }
          >
            <Text style={styles.tex_option}>Consulta de{"\n"} registros</Text>

            <AntDesign
              style={{ marginTop: 20 }}
              name="search1"
              size={50}
              color="white"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.option, !netInfo && { backgroundColor: "#D2D2D2" }]}
            onPress={() =>
              !netInfo
                ? Alert.alert(
                    "Esta seccion no esta diponible sin señal de internet \n Intenta de nuevo mas tarde"
                  )
                : navigation.navigate("Register")
            }
          >
            <Text style={styles.tex_option}>Carga de{"\n"} imagenes</Text>

            <MaterialIcons
              style={{ marginTop: 20 }}
              name="add-to-photos"
              size={50}
              color="white"
            />
          </TouchableOpacity>
        </View>
      </View>
      <Text
        style={{
          position: "absolute",
          bottom: 0,
          color: "#59130A",
          fontSize: 12,
        }}
      >
        Versión: {version}{" "}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    display: "flex",
    height: "100%",
    width: "100%",
    alignItems: "center",
    // backgroundColor: "red",
  },
  container_title: {
    width: "100%",
    height: 100,
    marginTop: 50,
    paddingLeft: 10,
  },
  tex_rectangle_long: {
    fontFamily: "BrandonGrotesqueRegular",
    fontSize: 22,
    color: "#000",
  },
  row_container: {
    display: "flex",
    flexDirection: "row",
    marginTop: 40,
    justifyContent: "space-around",
  },
  tex_option: {
    fontFamily: "BrandonGrotesqueRegular",
    fontSize: 22,
    color: "#fff",
    textAlign: "center",
    marginTop: 10,
  },
  option: {
    width: 120,
    height: 150,
    backgroundColor: "#59130A",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
  },
  option_no: {
    width: 120,
    height: 150,
    backgroundColor: "transparent",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
  },
});
