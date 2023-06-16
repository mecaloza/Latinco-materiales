import React, { useState } from "react";
import { StyleSheet, View, Image, StatusBar } from "react-native";
import Signature from "react-native-signature-canvas";

const SignatureScreen = ({ navigation, route }) => {
  const [signature, setSign] = useState(null);
  const type = route.params?.type;
  const oririgin = route.params?.origin;

  const handleOK = (signature) => {
    console.log(signature);
    setSign(signature);
    if (oririgin === "outs") {
      navigation.navigate("Outs", { signature: signature, type: type });
    } else {
      navigation.navigate("Ins", { signature: signature, type: type });
    }
  };

  const handleEmpty = () => {
    console.log("Empty");
  };

  const style = `.m-signature-pad--footer
    .button {
      background-color: #59130A;
      color: #FFF;
    }
    .m-signature-pad--body
    canvas {
      background-color: red;
    }
    `;

  return (
    <View style={styles.container}>
      <View style={styles.preview}>
        {signature ? (
          <Image
            resizeMode={"contain"}
            style={styles.image}
            source={{ uri: signature }}
          />
        ) : null}
      </View>
      <Signature
        onOK={handleOK}
        onEmpty={handleEmpty}
        descriptionText="Firma"
        clearText="Borrar"
        confirmText="Guardar"
        webStyle={style}
        autoClear={true}
        backgroundColor="rgb(255,255,255)"
      />
      <StatusBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  preview: {
    backgroundColor: "#c6c3c3",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 20,
  },
  image: {
    width: 335,
    height: 200,
  },
});

export default SignatureScreen;
