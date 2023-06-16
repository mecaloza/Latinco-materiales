import React, { useState, useEffect, useRef } from "react";

import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Pressable,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  PixelRatio,
  ActivityIndicator,
} from "react-native";
import Header from "../components/Header";
import { Dimensions } from "react-native";

import {
  SelectList,
  MultipleSelectList,
} from "react-native-dropdown-select-list";
import * as Location from "expo-location";
import { useFocusEffect } from "@react-navigation/native";
import * as MediaLibrary from "expo-media-library";

import { Camera, FlashMode } from "expo-camera";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import NfcManager, { NfcTech, Ndef } from "react-native-nfc-manager";
import ModalNfc from "../components/ModalNfc";
var CryptoJS = require("crypto-js");
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import ViewShot from "react-native-view-shot";
import Modalconfirmation from "../components/Modalconfirmation";
NfcManager.start();

export default function OutScreens({ navigation, route }) {
  const viewShotRef = useRef(null);

  const today = new Date();

  const [contractor, setcontractor] = useState("");
  const [obra, setobra] = useState("");
  const [type_car, settype_car] = useState("");
  const [code, setcode] = useState("");
  const [plate, setplate] = useState("");
  const [driver, setdriver] = useState("");
  const [material, setmaterial] = useState("");
  const [measure, setmeasure] = useState("");
  const [cantidad, setcantidad] = useState("");
  const [origen, setorigen] = useState("");
  const [abs_origen, setabs_origen] = useState("");
  const [destino, setdestino] = useState("");
  const [abs_destino, setabs_destino] = useState("");
  const [observations, setobsertvartions] = useState("");
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [modal_nf, setmodal_nf] = useState(false);
  const [netInfo, setNetInfo] = useState(true);
  const [id_salida, setid_salida] = useState("");
  const [epoch, setepoch] = useState("");

  const [name_desp, setname_desp] = useState("");
  const [name_conduc, setname_conduc] = useState("");
  const [id_user, setid_user] = useState("");

  const [signature, setsignature] = useState("");
  const [signature_conductor, setsignature_conductor] = useState("");

  const [section, setsection] = useState(1);
  const [contractor_list, setcontractor_list] = useState([]);
  const [obras_list, setobras_list] = useState([]);
  const vehicles_list_se = [
    { key: "1", value: "YRR1100", plate: "YRR100" },
    { key: "2", value: "YRR1200", plate: "YRR200" },
  ];
  const [vehicle_list, setvehicle_list] = useState(vehicles_list_se);
  const [vehicle_list_t, setvehicle_list_t] = useState([]);
  const [driver_list, setdriver_list] = useState([]);
  const [material_list, setmaterial_list] = useState([]);
  const [coord, setcoord] = useState(false);
  const [show, setshow] = useState(false);
  const [show_confirmation, setshow_confirmation] = useState(false);

  const [text, setText] = useState("");
  const get_plate = (code) => {
    console.log("code", vehicle_list);
    var plate = vehicle_list.filter(function (el) {
      return el.key == code;
    });

    if (plate.length !== 0) {
      return plate[0].plate;
    } else {
      return "";
    }
  };
  const data = [
    { key: "1", value: "Obra 1" },
    { key: "2", value: "Obra 2" },
    { key: "3", value: "Obra 3" },
    { key: "4", value: "Obra 4" },
    { key: "5", value: "Obra 5" },
    { key: "6", value: "Obra 6" },
    { key: "7", value: "Obra 6" },
  ];
  const data_contractor = [
    { key: "1", value: "Contractor 1" },
    { key: "2", value: "Contractor 2" },
    { key: "3", value: "Contractor 3" },
    { key: "4", value: "Contractor 4" },
    { key: "5", value: "Contractor 5" },
    { key: "6", value: "Contractor 6" },
    { key: "7", value: "Contractor 6" },
  ];
  const type = [
    { key: "1", value: "m3" },
    { key: "2", value: "Ton" },
  ];

  const type_car_list = [
    { key: "1", value: "Propio" },
    { key: "2", value: "Tercero" },
  ];

  const driver_list_se = [
    { key: "1", value: "Driver 1", cedula: "123456" },
    { key: "2", value: "Driver 2", cedula: "123456" },
  ];

  const material_list_se = [
    { key: "1", value: "Martial 1" },
    { key: "2", value: "Material 2" },
  ];

  async function getCurrentLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      // handle location permission not granted
    }

    let location = await Location.getCurrentPositionAsync({});
    console.log("esta", location.coords);
    setcoord(location.coords);
    return location.coords;
  }

  useEffect(() => {
    getCurrentLocation();
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
  const [erro_subcontractor, seterror_subcontractor] = useState(false);
  const [error_obra, seterror_obra] = useState(false);

  const [error_vehicle, seterror_vehicle] = useState(false);
  const [error_dirver, seterror_dirver] = useState(false);

  const [error_material, seterror_material] = useState(false);
  const [error_meassure, seterror_meassure] = useState(false);
  const [error_quantity, seterror_quantity] = useState(false);

  const [error_origen, seterror_origen] = useState(false);
  const [error_absorigen, seterror_absorigen] = useState(false);
  const [error_destino, seterror_destino] = useState(false);
  const [error_absdestino, seterror_absdestino] = useState(false);

  const [error_signature, seterror_signature] = useState(false);
  const [error_signature_dri, seterror_signature_dri] = useState(false);
  const [error_image, seterror_image] = useState(false);

  const get_plate_t = (code) => {
    var plate = vehicle_list_t.filter(function (el) {
      return el.key === code;
    });

    if (plate.length !== 0) {
      return plate[0].plate;
    } else {
      return "";
    }
  };
  const validate_contingency = () => {
    if (section === 1) {
      if (contractor === "") {
        seterror_subcontractor(true);
      }
      if (obra === "") {
        seterror_obra(true);
      }
      if (obra !== "" && contractor !== "") {
        setsection(2);
      }
    }
    if (section === 2) {
      if (code === "") {
        seterror_vehicle(true);
      }
      if (driver === "") {
        seterror_dirver(true);
      }
      if (code !== "" && driver !== "") {
        setsection(3);
      }
    }

    if (section === 3) {
      if (material === "") {
        seterror_material(true);
      }
      if (measure === "") {
        seterror_meassure(true);
      }
      if (cantidad === "") {
        seterror_quantity(true);
      }
      if (material !== "" && measure !== "" && cantidad !== "") {
        setsection(4);
      }
    }
    if (section === 4) {
      if (origen === "") {
        seterror_origen(true);
      }
      if (abs_origen === "") {
        seterror_absorigen(true);
      }
      if (destino === "") {
        seterror_destino(true);
      }
      if (abs_destino === "") {
        seterror_absdestino(true);
      }
      if (
        origen !== "" &&
        abs_origen !== "" &&
        destino !== "" &&
        abs_destino !== ""
      ) {
        const currentEpochTime = Date.now();
        const date_string = currentEpochTime.toString();
        const date_id = date_string.padEnd(13, "0");
        setid_salida(obra + date_id);
        setepoch(currentEpochTime);
        setsection(5);
      }
    }

    if (section === 5) {
      if (signature === "") {
        seterror_signature(true);
      }
      if (signature_conductor === "") {
        seterror_signature_dri(true);
      }
      if (imageUrls.length === 0) {
        seterror_image(true);
      }

      if (
        signature !== "" &&
        signature_conductor !== "" &&
        imageUrls.length !== 0
      ) {
        writeNdef();
      }
    }
  };

  useEffect(() => {
    if (route.params?.type === "despachador") {
      setsignature(route.params?.signature);
    }
    if (route.params?.type === "conductor") {
      console.log("que", route.params?.signature);
      setsignature_conductor(route.params?.signature);
    }
    if (route.params?.image) {
      setImageUrls([...imageUrls, route.params.image]);
    }
  }, [route.params]);

  const [categories, setCategories] = useState([]);

  const [token_latin, setToken] = useState("");

  const save_offline = async (data) => {
    var myArray = await AsyncStorage.getItem("Off_latinco");
    if (myArray !== null) {
      // We have data!!
      var array_get = JSON.parse(myArray);
      array_get.push(data);
      // console.log(JSON.parse(myArray));
      await AsyncStorage.setItem("Off_latinco", JSON.stringify(array_get));
    } else {
      var activity = [];

      activity[0] = data;
      await AsyncStorage.setItem("Off_latinco", JSON.stringify(activity));
    }
  };

  const get_info = async () => {
    try {
      const result = await AsyncStorage.getItem("Token_latin");
      const user = await AsyncStorage.getItem("User_latin");
      console.log("este es el toke", JSON.parse(result));
      if (result) {
        setToken(result);

        var json_response = await AsyncStorage.getItem("Material_list");
        var json_response = JSON.parse(json_response);
        // console.log("sii", json_response);
        const contracto_array = json_response.subcontractors;
        const contractor_tranfromed = contracto_array.map(({ id, name }) => ({
          key: id,
          value: name,
        }));
        // console.log("esta", contractor_tranfromed);
        setcontractor_list(contractor_tranfromed);
        var list_p = json_response.vehicles.filter(function (el) {
          return el.type === "PROPIO";
        });
        console.log("list_p", list_p);
        const transformed = list_p.map(({ id, plate, code }) => ({
          key: id,
          value: code,
          plate: plate,
        }));

        setname_desp(
          json_response.user[0].first_name +
            " " +
            json_response.user[0].last_name
        );

        setid_user(json_response.user[0].id);
        console.log("esta", transformed);
        var list_s = json_response.vehicles.filter(function (el) {
          return el.type === "TERCERO";
        });
        const obra_array = json_response.constructions;
        const obra_transformed = obra_array.map(({ id, name }) => ({
          key: id,
          value: name,
        }));
        const array_sub = list_s;
        const array_sub_transformed = array_sub.map(({ id, plate }) => ({
          key: id,
          value: plate,
          plate: plate,
        }));
        // console.log("esta", array_sub_transformed);
        setobras_list(obra_transformed);
        setvehicle_list_t(array_sub_transformed);
        setvehicle_list(transformed);
        const driver_array = json_response.drivers;
        const drive_transformed = driver_array.map(
          ({ id, name, person_id }) => ({
            key: id,
            value: name,
            person_id: person_id,
          })
        );
        setdriver_list(drive_transformed);
        const material_array = json_response.materials;
        const material_transformed = material_array.map(({ id, name }) => ({
          key: id,
          value: name,
        }));
        setmaterial_list(material_transformed);
      } else {
        navigation.navigate("Home");
        return false;
      }
    } catch {
      return false;
    }
  };
  useEffect(() => {
    get_info();
  }, []);

  const write_data = async (text) => {
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const bytes = Ndef.encodeMessage([Ndef.textRecord(text)]);

      if (bytes) {
        await NfcManager.ndefHandler // STEP 2
          .writeNdefMessage(bytes); // STEP 3
        result = true;
      }
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  };
  const [loading, setLoading] = useState(false);

  async function writeNdef() {
    console.log("writeNdef");

    let result = false;

    try {
      // STEP 1
      setshow(true);
      let vehicle = code;
      let vehicle_stri = vehicle.toString().padStart(3, "0");

      //unidad de medida
      let unidad_me = 0;
      if (measure === "m3") {
        unidad_me = 1;
      }
      if (measure === "toneladas") {
        unidad_me = 2;
      }

      // cantidad
      let add_quant = cantidad;
      let add_quant_str = add_quant.toString().padStart(4, "0");
      console.log("add_quant_str", add_quant_str);
      //conductor
      let conductor_id = driver;
      let conductor_id_str = conductor_id.toString().padStart(3, "0");
      //obra
      let obra_id = obra;
      let obra_id_str = obra_id.toString().padStart(4, "0");
      //codigo material
      let material_id = material;
      let material_id_str = material_id.toString().padStart(3, "0");
      //contractor
      let contactor_id = contractor;
      let contactor_id_str = contactor_id.toString().padStart(3, "0");
      // fecha

      const date_string = epoch.toString();
      const date_id = date_string.padEnd(13, "0");
      // setid_salida(obra + date_id);
      var out_info =
        vehicle_stri +
        unidad_me +
        material_id_str +
        add_quant_str +
        conductor_id_str +
        obra_id_str +
        contactor_id_str +
        date_id;
      console.log("out_info", out_info);
      // Encrypt the JSON string using AES encryption
      try {
        await NfcManager.requestTechnology(NfcTech.Ndef);

        const bytes = Ndef.encodeMessage([Ndef.textRecord(out_info)]);

        if (bytes) {
          await NfcManager.ndefHandler // STEP 2
            .writeNdefMessage(bytes); // STEP 3
          const formData = new FormData();

          formData.append("id", obra_id_str + date_string);
          formData.append("user", id_user); //revisar esto para sacarlo del enpoitn inical
          const date_send =
            today.getFullYear() +
            "-" +
            (parseInt(today.getMonth()) + 1) +
            "-" +
            today.getDate();
          formData.append("date", date_send);
          const time_send =
            today.getHours() +
            ":" +
            today.getMinutes() +
            ":" +
            today.getSeconds();
          formData.append("time", time_send);
          formData.append("construction", obra);
          formData.append("subcontractor", contractor);
          formData.append("driver", driver);

          formData.append("vehicle", code);
          formData.append("material", material);
          formData.append("material_amount", cantidad);
          if (measure === "m3") {
            formData.append("material_unit", measure);
          }
          if (measure === "toneladas") {
            formData.append("material_unit", "Ton");
          }

          formData.append("origin", origen);
          formData.append("abs_origin", abs_origen);
          formData.append("destination", destino);
          formData.append("abs_destination", abs_destino);
          formData.append("comment", observations);
          formData.append("lat", parseFloat(coord.latitude).toFixed(6));
          formData.append("lng", parseFloat(coord.longitude).toFixed(6));

          const targetPixelCount = 1080; // If you want full HD pictures
          const pixelRatio = PixelRatio.get(); // The pixel ratio of the device
          // pixels * pixelratio = targetPixelCount, so pixels = targetPixelCount / pixelRatio
          const pixels = targetPixelCount / pixelRatio;
          const uri = await viewShotRef.current.capture({
            width: pixels,
            height: pixels,
          });

          formData.append("signature", {
            name: "6.png",
            type: "image/png",
            uri: Platform.OS === "android" ? uri : uri.replace("file://", ""),
          });

          imageUrls.forEach((url, index) => {
            formData.append("photos", {
              name: index + ".png",
              type: "image/png",
              uri: Platform.OS === "android" ? url : url.replace("file://", ""),
            });
          });

          console.log("form aqui", formData);
          const { status } = await MediaLibrary.requestPermissionsAsync();

          if (status === "granted") {
            // Save image to media library
            await MediaLibrary.saveToLibraryAsync(uri);

            console.log("Image successfully saved");
          }
          if (netInfo) {
            setLoading(true);
            const url = global.url_back + "api/materials/off/";
            fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "multipart/form-data",
              },
              body: formData,
              headers: {
                Authorization: `Token ${JSON.parse(token_latin)}`,
              },
            }).then((response) => {
              setLoading(false);
              if (response.status === 201) {
                return response.json().then((json_response) => {
                  console.log("esta es la offline", json_response);
                  setshow(false);
                  setshow_confirmation(true);
                  return false;
                });

                // navigation.navigate("Steps");
              } else {
                return response.json().then((json_response) => {
                  console.log("esta es la offline", json_response);
                  console.log("algo fallo");
                  setshow(false);
                  return false;
                });
              }
            });
          } else {
            var outs_fill = {};
            outs_fill["id"] = obra_id_str + date_string;
            outs_fill["user"] = id_user;

            const date_send =
              today.getFullYear() +
              "-" +
              (parseInt(today.getMonth()) + 1) +
              "-" +
              today.getDate();
            outs_fill["date"] = date_send;
            const time_send =
              today.getHours() +
              ":" +
              today.getMinutes() +
              ":" +
              today.getSeconds();
            outs_fill["time"] = time_send;
            outs_fill["construction"] = obra;
            outs_fill["subcontractor"] = contractor;
            outs_fill["driver"] = driver;
            outs_fill["vehicle"] = code;
            outs_fill["material"] = material;
            outs_fill["material_amount"] = cantidad;
            outs_fill["material_unit"] = measure;
            outs_fill["origin"] = origen;
            outs_fill["abs_origin"] = abs_origen;
            outs_fill["destination"] = destino;
            outs_fill["abs_destination"] = abs_destino;
            outs_fill["comment"] = observations;
            outs_fill["lat"] = parseFloat(coord.latitude).toFixed(6);
            outs_fill["lng"] = parseFloat(coord.longitude).toFixed(6);
            save_offline(outs_fill);
            setshow(false);
            setshow_confirmation(true);
            // navigation.navigate("Steps");
          }

          result = true;
        }
      } finally {
        NfcManager.cancelTechnologyRequest();
      }
      //envio de datos online
    } catch (ex) {
      console.warn(ex);
    }

    return result;
  }

  const onchange_cantidad = (text) => {
    if (text.length > 4) {
      setcantidad(text.substring(0, 4));
    } else {
      setcantidad(text);
    }
  };

  const search_label = (id, list) => {
    var label = "";
    list.map((item) => {
      if (item.key === id) {
        label = item.value;
      }
    });
    return label;
  };
  const search_cedula = (id, list) => {
    console.log("id", list);
    var label = "";
    list.map((item) => {
      if (item.key === id) {
        label = item.person_id;
      }
    });
    return label;
  };

  return (
    <>
      <ModalNfc show={show} setshow={setshow} loading={loading}></ModalNfc>
      <Modalconfirmation
        show={show_confirmation}
        setshow={setshow_confirmation}
        loading={loading}
        id={id_salida}
        type={"salida"}
      ></Modalconfirmation>
      <Header text={"Salida de materiales"} screen={2} confirm={true}></Header>
      <ScrollView style={{ backgorundColor: "#fff" }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "padding"}
          style={{ backgorundColor: "#fff" }}
        >
          {section === 1 ? (
            <>
              <View style={{ marginTop: 30 }}></View>
              <Text style={styles.tex_title}>Subcontratistas</Text>
              <View style={styles.line_separator}></View>
              <Text style={styles.text_inner}>
                Seleccione el subcontratista que presta el servicio
              </Text>
              <View style={{ paddingHorizontal: 15 }}>
                <SelectList
                  setSelected={setcontractor}
                  data={contractor_list}
                  save="key"
                  placeholder="Seleccione"
                />
              </View>
              {erro_subcontractor && (
                <Text style={styles.text_error}>
                  *debes seleccionar un contratista
                </Text>
              )}

              <View style={{ marginTop: 30 }}></View>
              <Text style={styles.tex_title}>Obra</Text>
              <View style={styles.line_separator}></View>
              <Text style={styles.text_inner}>Seleccione una obra</Text>
              <View style={{ paddingHorizontal: 15 }}>
                <SelectList
                  setSelected={setobra}
                  data={obras_list}
                  save="key"
                  placeholder="Seleccione"
                />
              </View>
              {error_obra && (
                <Text style={styles.text_error}>
                  *debes seleccionar una obra
                </Text>
              )}
            </>
          ) : null}

          {section === 2 ? (
            <>
              <View style={{ marginTop: 30 }}></View>
              <Text style={styles.tex_title}>Vehículo</Text>
              <View style={styles.line_separator}></View>
              <Text style={styles.text_inner}>
                Seleccione el tipo de vehículo
              </Text>
              <View style={{ paddingHorizontal: 15 }}>
                <SelectList
                  setSelected={settype_car}
                  data={type_car_list}
                  save="value"
                  placeholder="Seleccione"
                />
              </View>
              {type_car === "Propio" ? (
                <>
                  <View style={{ marginTop: 30 }}></View>
                  <Text style={styles.tex_title}>Codigo</Text>
                  <View style={styles.line_separator}></View>
                  <Text style={styles.text_inner}>
                    Seleccione el codigo del vehículo
                  </Text>
                  <View style={{ paddingHorizontal: 15 }}>
                    <SelectList
                      setSelected={setcode}
                      data={vehicle_list}
                      save="key"
                      placeholder="Seleccione"
                    />
                  </View>
                  <View style={{ marginTop: 30 }}></View>
                  <Text style={styles.tex_title}>Placa</Text>
                  <View style={styles.line_separator}></View>

                  <Text style={styles.tex_title}>{get_plate(code)}</Text>
                </>
              ) : null}
              {type_car === "Tercero" ? (
                <>
                  <View style={{ marginTop: 30 }}></View>
                  <Text style={styles.tex_title}>Placa</Text>
                  <View style={styles.line_separator}></View>
                  <Text style={styles.text_inner}>
                    Seleccione la placa del vehículo{" "}
                  </Text>
                  <View style={{ paddingHorizontal: 15 }}>
                    <SelectList
                      setSelected={setcode}
                      data={vehicle_list_t}
                      save="key"
                      placeholder="Seleccione"
                    />
                  </View>
                </>
              ) : null}
              {error_vehicle && (
                <Text style={styles.text_error}>
                  *debes seleccionar un vehículo
                </Text>
              )}
              <View style={{ marginTop: 30 }}></View>
              <Text style={styles.tex_title}>Conductor</Text>
              <View style={styles.line_separator}></View>
              <Text style={styles.text_inner}>Seleccione el conductor</Text>
              <View style={{ paddingHorizontal: 15 }}>
                <SelectList
                  setSelected={setdriver}
                  data={driver_list}
                  save="key"
                  placeholder="Seleccione"
                />
              </View>
              {error_dirver && (
                <Text style={styles.text_error}>
                  *debes seleccionar un conductor
                </Text>
              )}
            </>
          ) : null}

          {section === 3 ? (
            <>
              <View style={{ marginTop: 30 }}></View>
              <Text style={styles.tex_title}>Material y Cantidades</Text>
              <View style={styles.line_separator}></View>
              <Text style={styles.text_inner}>Seleccione el material</Text>
              <View style={{ paddingHorizontal: 15 }}>
                <SelectList
                  setSelected={setmaterial}
                  data={material_list}
                  save="key"
                  placeholder="Seleccione"
                />
              </View>
              {error_material && (
                <Text style={styles.text_error}>
                  *debes seleccionar un material
                </Text>
              )}
              <View style={{ marginTop: 30 }}></View>

              <Text style={styles.text_inner}>Unidad de medida</Text>
              <View style={styles.radio_section}>
                <TouchableOpacity
                  style={styles.radio_inner}
                  onPress={() => setmeasure("m3")}
                >
                  <View style={styles.cirlce}>
                    {measure === "m3" && (
                      <View style={styles.acttive_cirlce}></View>
                    )}
                  </View>
                  <Text style={styles.text_inner}>m3</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.radio_inner}
                  onPress={() => setmeasure("toneladas")}
                >
                  <View style={styles.cirlce}>
                    {measure === "toneladas" && (
                      <View style={styles.acttive_cirlce}></View>
                    )}
                  </View>
                  <Text style={styles.text_inner}>Toneladas</Text>
                </TouchableOpacity>
              </View>
              {error_meassure && (
                <Text style={styles.text_error}>
                  *debes seleccionar una unidad de medida
                </Text>
              )}
              <Text style={styles.text_inner}>Cantidad</Text>
              <TextInput
                keyboardType="numeric"
                style={styles.input_form}
                onChangeText={onchange_cantidad}
                value={cantidad}
                placeholder=""
              ></TextInput>
              {error_quantity && (
                <Text style={styles.text_error}>
                  *debes introducir una cantidad
                </Text>
              )}
            </>
          ) : null}

          {section === 4 ? (
            <>
              <View style={{ marginTop: 30 }}></View>
              <Text style={styles.tex_title}>Origen y Destino</Text>
              <View style={styles.line_separator}></View>
              <Text style={styles.text_inner}>Lugar de origen</Text>
              <TextInput
                style={styles.input_form}
                onChangeText={setorigen}
                value={origen}
                placeholder=""
              ></TextInput>
              {error_origen && (
                <Text style={styles.text_error}>
                  *debes introducir un origen
                </Text>
              )}
              <View style={{ marginTop: 30 }}></View>
              <Text style={styles.text_inner}>ABS origen</Text>
              <TextInput
                style={styles.input_form}
                onChangeText={setabs_origen}
                value={abs_origen}
                placeholder=""
              ></TextInput>
              {error_absorigen && (
                <Text style={styles.text_error}>
                  *debes introducir un abs de origen
                </Text>
              )}
              <Text style={styles.text_inner}>Lugar de destino</Text>
              <TextInput
                style={styles.input_form}
                onChangeText={setdestino}
                value={destino}
                placeholder=""
              ></TextInput>
              {error_destino && (
                <Text style={styles.text_error}>
                  *debes introducir un destino
                </Text>
              )}
              <View style={{ marginTop: 30 }}></View>
              <Text style={styles.text_inner}>ABS destino</Text>
              <TextInput
                style={styles.input_form}
                onChangeText={setabs_destino}
                value={abs_destino}
                placeholder=""
              ></TextInput>
              {error_absdestino && (
                <Text style={styles.text_error}>
                  *debes introducir un abs de destino
                </Text>
              )}

              <View style={{ marginTop: 30 }}></View>
            </>
          ) : null}
          {section === 5 ? (
            <ViewShot ref={viewShotRef}>
              <View
                style={{
                  backgroundColor: "#fff",
                }}
              >
                <View style={{ marginTop: 30 }}></View>
                <Text style={styles.tex_title}>Resumen Salida</Text>
                <View style={styles.line_separator}></View>
                <View style={styles.container_result}>
                  <Text style={styles.tex_title_info}>ID:</Text>
                  <Text style={styles.tex_info}>{id_salida}</Text>
                </View>
                <View style={styles.container_result}>
                  <Text style={styles.tex_title_info}>Fecha:</Text>
                  <Text style={styles.tex_info}>
                    {today.getFullYear() +
                      "-" +
                      (parseInt(today.getMonth()) + 1) +
                      "-" +
                      today.getDate()}
                  </Text>
                </View>
                <View style={styles.container_result}>
                  <Text style={styles.tex_title_info}>Obra:</Text>
                  <Text style={styles.tex_info}>
                    {search_label(obra, obras_list)}
                  </Text>
                </View>
                <View style={styles.container_result}>
                  <Text style={styles.tex_title_info}>Subcontratista:</Text>
                  <Text style={styles.tex_info}>
                    {search_label(contractor, contractor_list)}
                  </Text>
                </View>
                <View style={styles.container_result}>
                  <Text style={styles.tex_title_info}>Placa vehículo:</Text>
                  {type_car === "Propio" ? (
                    <Text style={styles.tex_info}>{get_plate(code)}</Text>
                  ) : (
                    <Text style={styles.tex_info}>{get_plate_t(plate)}</Text>
                  )}
                </View>
                <View style={styles.container_result}>
                  <Text style={styles.tex_title_info}>Codigo vehículo:</Text>
                  <Text style={styles.tex_info}>
                    {type_car === "Propio"
                      ? search_label(code, vehicle_list)
                      : search_label(code, vehicle_list_t)}
                  </Text>
                </View>
                <View style={styles.container_result}>
                  <Text style={styles.tex_title_info}>Material:</Text>
                  <Text style={styles.tex_info}>
                    {search_label(material, material_list)}
                  </Text>
                </View>
                <View style={styles.container_result}>
                  <Text style={styles.tex_title_info}>Cantidad:</Text>
                  <Text style={styles.tex_info}>
                    {cantidad + " " + measure}
                  </Text>
                </View>
                <View style={styles.container_result}>
                  <Text style={styles.tex_title_info}>Lugar de Origen:</Text>
                  <Text style={styles.tex_info}>{origen}</Text>
                </View>
                <View style={styles.container_result}>
                  <Text style={styles.tex_title_info}>ABS origen:</Text>
                  <Text style={styles.tex_info}>{abs_origen}</Text>
                </View>
                <View style={styles.container_result}>
                  <Text style={styles.tex_title_info}>Lugar de destino:</Text>
                  <Text style={styles.tex_info}>{destino}</Text>
                </View>
                <View style={styles.container_result}>
                  <Text style={styles.tex_title_info}>ABS destino:</Text>
                  <Text style={styles.tex_info}>{abs_destino}</Text>
                </View>
                <View style={styles.container_result}>
                  <Text style={styles.tex_title_info}>ABS destino:</Text>
                  <Text style={styles.tex_info}>{abs_destino}</Text>
                </View>
                <View style={styles.container_result}>
                  <Text style={styles.tex_title_info}>Fecha Salida:</Text>
                  <Text style={styles.tex_info}>
                    {today.getFullYear() +
                      "-" +
                      (parseInt(today.getMonth()) + 1) +
                      "-" +
                      today.getDate()}
                  </Text>
                </View>
                <View style={styles.container_result}>
                  <Text style={styles.tex_title_info}>Hora Salida:</Text>
                  <Text style={styles.tex_info}>
                    {today.getHours() +
                      ":" +
                      today.getMinutes() +
                      ":" +
                      today.getSeconds()}
                  </Text>
                </View>

                <View style={styles.container_result}>
                  <Text style={styles.tex_title_info}>Latitud actual:</Text>
                  <Text style={styles.tex_info}>
                    {parseFloat(coord.latitude).toFixed(6)}
                  </Text>
                </View>
                <View style={styles.container_result}>
                  <Text style={styles.tex_title_info}>Longitud actual:</Text>
                  <Text style={styles.tex_info}>
                    {parseFloat(coord.longitude).toFixed(6)}
                  </Text>
                </View>
                <View style={styles.container_result}>
                  <Text style={styles.tex_title_info}>Observaciones:</Text>
                  <Text style={styles.tex_info}>{}</Text>
                </View>
                <TextInput
                  multiline={true}
                  numberOfLines={10}
                  style={styles.text_aerea}
                  onChangeText={setobsertvartions}
                  value={observations}
                  placeholder=""
                ></TextInput>
                <Pressable
                  style={styles.container_result}
                  onPress={() =>
                    navigation.navigate("Signature", { origin: "outs" })
                  }
                >
                  <Text style={styles.tex_title_info}>Firma Despachador:</Text>
                  <Text style={styles.tex_info}>{}</Text>
                </Pressable>
                {signature ? (
                  <Image
                    resizeMode={"contain"}
                    style={styles.image}
                    source={{ uri: signature }}
                  />
                ) : null}
                <Pressable
                  style={styles.button_add}
                  onPress={() =>
                    navigation.navigate("Signature", {
                      type: "despachador",
                      origin: "outs",
                    })
                  }
                >
                  <Text style={[styles.tex_title_info, { color: "#fff" }]}>
                    + Agregar firma
                  </Text>
                </Pressable>
                {error_signature && (
                  <Text style={styles.text_error}>
                    *debes agregar una firma
                  </Text>
                )}
                <View style={styles.container_result}>
                  <Text style={styles.tex_title_info}>Nombre despachador:</Text>
                  <Text style={styles.tex_info}>{name_desp}</Text>
                </View>
                <View style={styles.container_result}>
                  <Text style={styles.tex_title_info}>Firma Conductor:</Text>
                  <Text style={styles.tex_info}>{}</Text>
                </View>
                {signature_conductor ? (
                  <Image
                    resizeMode={"contain"}
                    style={styles.image}
                    source={{ uri: signature_conductor }}
                  />
                ) : null}
                <Pressable
                  style={styles.button_add}
                  onPress={() =>
                    navigation.navigate("Signature", {
                      type: "conductor",
                      origin: "outs",
                    })
                  }
                >
                  <Text style={[styles.tex_title_info, { color: "#fff" }]}>
                    + Agregar firma
                  </Text>
                </Pressable>
                {error_signature_dri && (
                  <Text style={styles.text_error}>
                    *debes agregar una firma del conductor
                  </Text>
                )}
                <View style={styles.container_result}>
                  <Text style={styles.tex_title_info}>Nombre conductor:</Text>
                  <Text style={styles.tex_info}>
                    {search_label(driver, driver_list)}
                  </Text>
                </View>
                <View style={styles.container_result}>
                  <Text style={styles.tex_title_info}>Nro Id:</Text>
                  <Text style={styles.tex_info}>
                    {search_cedula(driver, driver_list)}
                  </Text>
                </View>
                <View style={styles.container_result}>
                  <Text style={[styles.tex_title_info, { width: "90%" }]}>
                    Regsitro fotografico
                  </Text>
                </View>
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
                  <Pressable
                    onPress={() =>
                      navigation.navigate("test", {
                        origin: "outs",
                        id: id_salida,
                      })
                    }
                  >
                    <MaterialCommunityIcons
                      name="camera-plus-outline"
                      size={38}
                      color="black"
                    />
                  </Pressable>
                </View>
                {error_image && (
                  <Text style={styles.text_error}>
                    *debes agregar un soporte de la salida
                  </Text>
                )}
              </View>
            </ViewShot>
          ) : null}

          {section === 5 ? (
            <TouchableOpacity
              style={styles.button}
              onPress={() => validate_contingency()}
            >
              <Text style={styles.text_button}>Finalizar Salida</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.button}
              onPress={() => validate_contingency()}
            >
              <Text style={styles.text_button}>Continuar</Text>
            </TouchableOpacity>
          )}
        </KeyboardAvoidingView>
      </ScrollView>
    </>
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
  tex_title: {
    fontFamily: "BrandonGrotesqueRegular",
    fontWeight: "bold",
    fontSize: 18,
    color: "#000",
    marginLeft: 10,
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
  text_inner: {
    fontFamily: "BrandonGrotesqueRegular",

    fontSize: 18,
    color: "#000",
    marginLeft: 10,
    marginBottom: 10,
  },
  text_error: {
    fontFamily: "BrandonGrotesqueRegular",

    fontSize: 13,
    color: "red",
    marginLeft: 10,
  },
  text_button: {
    fontFamily: "BrandonGrotesqueRegular",
    fontSize: 22,
    color: "#fff",
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
  line_separator: {
    width: 60,
    height: 4,
    backgroundColor: "#59130A",
    marginTop: 3,
    marginBottom: 10,
    marginLeft: 10,
  },
  button: {
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
  radio_section: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
  },
  radio_inner: {
    display: "flex",
    flexDirection: "row",
    marginLeft: 20,
  },
  radiobutton: {
    display: "flex",
    flexDirection: "row",
  },
  cirlce: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "gray",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  acttive_cirlce: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#59130A",
  },
  input_form: {
    width: "50%",
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
  container_result: {
    width: "90%",
    alignSelf: "center",
    display: "flex",
    flexDirection: "row",
    marginTop: 10,
  },
  tex_info: {
    fontFamily: "BrandonGrotesqueRegular",
    fontSize: 18,
    fontWeight: "normal",
    color: "#000",
    marginLeft: 10,
  },
  tex_title_info: {
    fontFamily: "BrandonGrotesqueRegular",
    fontWeight: "bold",
    fontSize: 18,
    color: "#000",
    width: 160,
  },
  text_aerea: {
    width: "90%",
    alignSelf: "center",
    height: 150,
    borderWidth: 1,
    borderColor: "black",
    textAlignVertical: "top",
  },
  image: {
    width: 335,
    height: 200,
    borderWidth: 1,
    borderColor: "black",
    alignSelf: "center",
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
  fixedRatio: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  cam_fixedRatio: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    aspectRatio: 1,
  },
});
