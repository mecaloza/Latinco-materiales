import * as Font from "expo-font";

export default useFonts = async () =>
  await Font.loadAsync({
    Haettenschweiler: require("../assets/fonts/HaettenschweilerRegular.ttf"),
    BrandonGrotesqueRegular: require("../assets/fonts/BrandonGrotesque-Regular.ttf"),
    BrandonGrotesqueRegular_bold: require("../assets/fonts/BrandonGrotesque-Bold.ttf"),
  });
