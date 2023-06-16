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
  ActivityIndicator,
} from "react-native";
import Header from "../components/Header";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as ImagePicker from "expo-image-picker";
export default function Modaladdfile({
  show,
  setshow,
  id,
  type_register,
  get_register,
}) {
  const close = () => {
    setshow(false);
  };
  const [image, setImage] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setloading] = useState(false);

  const pickImage_support = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const pickImage_add = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
    });

    if (!result.canceled) {
      setImageUrls([...imageUrls, result.assets[0].uri]);
    }
  };

  const save_register = async () => {
    if (imageUrls.length > 0 && image) {
      const formData = new FormData();
      setloading(true);
      formData.append("signature", {
        name: "6.png",
        type: "image/png",
        uri: Platform.OS === "android" ? image : image.replace("file://", ""),
      });
      imageUrls.forEach((url, index) => {
        formData.append("photos", {
          name: index + ".png",
          type: "image/png",
          uri: Platform.OS === "android" ? url : url.replace("file://", ""),
        });
      });
      var url = "";
      if (type_register === "salida") {
        url = global.url_back + "api/materials/off_files/";
        formData.append("off_id", id.id);
      } else {
        url = global.url_back + "api/materials/arrival_files/";
        formData.append("arrival_id", id.id);
      }
      const result = await AsyncStorage.getItem("Token_latin");
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
        headers: {
          Authorization: `Token ${JSON.parse(result)}`,
        },
      }).then((response) => {
        console.log("response", response);
        if (response.status === 201) {
          setloading(false);
          setshow(false);
          setImage(null);
          setImageUrls([]);
          get_register();
        } else {
          console.log("algo fallo");
          setloading(false);

          return false;
        }
      });
    }
  };
  return (
    <>
      {show ? (
        <Pressable style={styles.shadow_container} onPress={() => close()}>
          <View style={styles.container}>
            <Text style={styles.text_sub}>
              Realiza el registro de evidencias
            </Text>
            <Text style={styles.tex_title_add}>
              {type_register} id: {id.id}
            </Text>

            <Text style={styles.text_warn}>
              Igresa los registros forograficos de la {type_register}
            </Text>
            <Text style={styles.tex_title_info}>Evidencia :</Text>

            {image ? (
              <Image
                resizeMode={"contain"}
                style={styles.image}
                source={{ uri: image }}
              />
            ) : (
              <Pressable
                style={styles.button_add}
                onPress={() => pickImage_support()}
              >
                <Text style={[styles.tex_title_info, { color: "#fff" }]}>
                  + Agregar pantallazo
                </Text>
              </Pressable>
            )}

            <Text style={styles.tex_title_info}> Regsitro fotografico :</Text>

            <View style={styles.container_photos}>
              <View style={styles.container_added}>
                {imageUrls.map((url, index) => (
                  <Image
                    key={index}
                    source={{ uri: url }}
                    style={styles.image_mosaic}
                  />
                ))}
              </View>
              <Pressable onPress={() => pickImage_add()}>
                <MaterialCommunityIcons
                  name="camera-plus-outline"
                  size={38}
                  color="black"
                />
              </Pressable>
            </View>

            <TouchableOpacity
              style={styles.button_in_code}
              onPress={() => (loading ? null : save_register())}
            >
              {loading ? (
                <ActivityIndicator
                  animating={true}
                  size="large"
                  style={{ opacity: 1 }}
                  color="#fff"
                />
              ) : (
                <Text style={styles.text_button}>Continuar</Text>
              )}
            </TouchableOpacity>
          </View>
        </Pressable>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: "black",
    alignSelf: "center",
  },
  container: {
    width: "80%",
    position: "absolute",
    height: 350,
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: 80,
  },
  button_add: {
    width: "90%",
    alignSelf: "center",
    backgroundColor: "#59130A",
    borderRadius: 10,
    height: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  tex_title_info: {
    fontFamily: "BrandonGrotesqueRegular",
    fontWeight: "bold",
    fontSize: 18,
    color: "#000",
    width: "90%",
  },
  tex_title_add: {
    fontFamily: "BrandonGrotesqueRegular",
    fontWeight: "bold",
    fontSize: 22,
    color: "#000",
    width: "100%",
    textAlign: "center",
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
  container_photos: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  container_added: {
    width: "80%",
    display: "flex",
    flexDirection: "row",
  },
  image_mosaic: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
});
