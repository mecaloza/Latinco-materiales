import React, { useState, useEffect } from "react";

import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Pressable,
  TouchableOpacity,
  Image,
} from "react-native";
import Header from "../components/Header";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import NfcManager, { NfcTech, Ndef } from "react-native-nfc-manager";
import NetInfo from "@react-native-community/netinfo";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import Modaladdfile from "../components/Modaladdfile";

export default function RegisterScreen({ navigation }) {
  const [token_latin, setToken] = useState("");
  const [netInfo, setNetInfo] = useState(true);
  const [arrival, setarrival] = useState([]);
  const [offs, setoffs] = useState([]);
  const [show, setshow] = useState(false);
  const [id, setid] = useState("");
  const [type_register, settype_register] = useState("");

  const save_data = async (data) => {
    await AsyncStorage.setItem("Material_list", JSON.stringify(data));
  };
  const delete_data = async () => {
    await AsyncStorage.removeItem("Off_latinco");
    await AsyncStorage.removeItem("Inn_latinco");
  };
  const get_register = async () => {
    try {
      const result = await AsyncStorage.getItem("Token_latin");
      var jsonValue = await AsyncStorage.getItem("Material_list");
      var json_value = JSON.parse(jsonValue);
      const user_id = json_value.user[0].id;
      console.log("este es el toke", json_value.user);
      if (result) {
        setToken(result);
        fetch(
          `${global.url_back}api/materials/images_data/?user_id=${user_id}`,
          {
            method: "GET",

            headers: {
              Authorization: `Token ${JSON.parse(result)}`,
            },
          }
        ).then((response) => {
          if (response.status === 200) {
            return response.json().then((json_response) => {
              console.log("sii", json_response.model_off);
              setarrival(json_response.model_arrival);
              setoffs(json_response.model_off);
            });
          } else {
            return response.json().then((json_response) => {
              console.log("es aca");

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

  useEffect(() => {
    get_register();
  }, []);

  return (
    <View style={styles.container}>
      <Modaladdfile
        setshow={setshow}
        show={show}
        id={id}
        type_register={type_register}
        get_register={get_register}
      ></Modaladdfile>
      <ScrollView
        style={{
          flex: 1,
          height: "100%",
          width: "100%",
        }}
      >
        <Header text={"Registro fotográfico"} screen={2}></Header>

        <View style={styles.container_title}>
          <Text style={styles.tex_rectangle_long}> Elige el registro:</Text>
        </View>
        {offs.map((item, index) => (
          <TouchableOpacity
            style={styles.container_activity}
            onPress={() => {
              setid(item);
              settype_register("salida");
              setshow(true);
            }}
          >
            <Entypo name="aircraft-take-off" size={44} color="#59130A" />

            <View style={styles.container_info}>
              <Text style={styles.text_info}>
                <Text style={[styles.text_info, { fontWeight: "bold" }]}>
                  Id salida:{" "}
                </Text>
                {item.id}
              </Text>
              <Text style={styles.text_info}>
                <Text style={[styles.text_info, { fontWeight: "bold" }]}>
                  Obra:{" "}
                </Text>
                {item.construction}
              </Text>
              <Text style={styles.text_info}>
                <Text style={[styles.text_info, { fontWeight: "bold" }]}>
                  Fecha:{" "}
                </Text>
                {item.date}
              </Text>

              <Text style={styles.text_info}>
                <Text style={[styles.text_info, { fontWeight: "bold" }]}>
                  Hora:{" "}
                </Text>
                {item.off_time}
              </Text>
              <Text style={styles.text_info}>
                <Text style={[styles.text_info, { fontWeight: "bold" }]}>
                  Contratista:{" "}
                </Text>
                {item.subcontractor}
              </Text>
              <Text style={styles.text_info}>
                <Text style={[styles.text_info, { fontWeight: "bold" }]}>
                  Placa de vehiculo:{" "}
                </Text>
                {item.vehicle}
              </Text>
            </View>
            <AntDesign name="addfile" size={44} color="#59130A" />
          </TouchableOpacity>
        ))}
        {arrival.map((item, index) => (
          <TouchableOpacity
            style={styles.container_activity}
            onPress={() => {
              setid(item);
              settype_register("entrada");
              setshow(true);
            }}
          >
            <Entypo name="aircraft-landing" size={44} color="#59130A" />
            <View style={styles.container_info}>
              <Text style={styles.text_info}>
                <Text style={[styles.text_info, { fontWeight: "bold" }]}>
                  Id entrada:{" "}
                </Text>
                {item.id}
              </Text>
              <Text style={styles.text_info}>
                <Text style={[styles.text_info, { fontWeight: "bold" }]}>
                  Obra:{" "}
                </Text>
                {item.construction}
              </Text>
              <Text style={styles.text_info}>
                <Text style={[styles.text_info, { fontWeight: "bold" }]}>
                  Fecha:{" "}
                </Text>
                {item.date}
              </Text>

              <Text style={styles.text_info}>
                <Text style={[styles.text_info, { fontWeight: "bold" }]}>
                  Hora:{" "}
                </Text>
                {item.arrival_time}
              </Text>
              <Text style={styles.text_info}>
                <Text style={[styles.text_info, { fontWeight: "bold" }]}>
                  Contratista:{" "}
                </Text>
                {item.subcontractor}
              </Text>
              <Text style={styles.text_info}>
                <Text style={[styles.text_info, { fontWeight: "bold" }]}>
                  Placa de vehiculo:{" "}
                </Text>
                {item.vehicle}
              </Text>
            </View>
            <AntDesign name="addfile" size={44} color="#59130A" />
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  },
  container_title: {
    width: "100%",

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
  container_activity: {
    width: "90%",
    paddingBottom: 10,
    backgroundColor: "#fff",
    alignSelf: "center",
    borderRadius: 10,
    marginTop: 10,
    borderColor: "#59130A",
    borderWidth: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  container_info: {
    width: "60%",
    height: "100%",
    paddingTop: 10,
  },
  text_info: {
    fontFamily: "BrandonGrotesqueRegular",
    fontSize: 15,
  },
});
