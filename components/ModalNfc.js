import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";

export default function ModalNfc({ show, setshow, loading }) {
  const close = () => {
    setshow(false);
  };
  return (
    <>
      {show ? (
        <Pressable style={styles.shadow_container} onPress={() => close()}>
          <View style={styles.container}>
            {loading ? (
              <ActivityIndicator
                animating={true}
                size="large"
                style={{ opacity: 1 }}
                color="#59130A"
              />
            ) : (
              <>
                <Text style={styles.text_title}>Acerca la tarjeta</Text>
                <Image
                  style={{
                    resizeMode: "contain",
                    flex: 1,
                    aspectRatio: 0.7,
                  }}
                  source={require("../assets/image_load.jpeg")}
                />
                <Text style={styles.text_sub}>
                  para realizar el registro de la salida
                </Text>
              </>
            )}
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
    height: 250,
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: 200,
  },
  shadow_container: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    display: "flex",

    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5 )",
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
    marginBottom: 30,
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
});
