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
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import StepsScreen from "./screens/StepsScreen";
import OutScreens from "./screens/OutScreens";
import useFonts from "./hooks/useFonts";
import SignatureScreen from "./screens/SiganatureScreen";
import ScreenPrueba from "./screens/ScreenPrueba";
import InsScreen from "./screens/InsScreen";
import RegisterScreen from "./screens/RegisterScreen";
import SearchScreen from "./screens/SearchScreen";

const Stack = createNativeStackNavigator();
// global.url_back = "https://428f-190-250-132-218.ngrok.io/";
global.url_back = "http://ec2-100-26-98-169.compute-1.amazonaws.com:8000/";

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    async function getFonts() {
      await useFonts();
      setFontLoaded(true);
    }
    getFonts();
  }, []);
  if (!fontLoaded) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={HomeScreen} />
        <Stack.Screen name="Steps" component={StepsScreen} />
        <Stack.Screen name="Outs" component={OutScreens} />
        <Stack.Screen name="Signature" component={SignatureScreen} />
        <Stack.Screen name="test" component={ScreenPrueba} />
        <Stack.Screen name="Ins" component={InsScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
