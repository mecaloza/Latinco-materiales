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
import * as MediaLibrary from "expo-media-library";
import NetInfo from "@react-native-community/netinfo";

import {
  SelectList,
  MultipleSelectList,
} from "react-native-dropdown-select-list";
import * as Location from "expo-location";
import { useFocusEffect } from "@react-navigation/native";

import { Camera, FlashMode } from "expo-camera";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import NfcManager, { NfcTech, Ndef } from "react-native-nfc-manager";
import ModalIn from "../components/ModalIn";
import ViewShot from "react-native-view-shot";
import { FontAwesome } from "@expo/vector-icons";
var CryptoJS = require("crypto-js");
import AsyncStorage from "@react-native-async-storage/async-storage";
import Modalconfirmation from "../components/Modalconfirmation";

export default function InsScreen({ navigation, route }) {
  const [token_latin, setToken] = useState("");
  const viewShotRef = useRef(null);
  const [netInfo, setNetInfo] = useState(true);
  const [edit, setedit] = useState(false);

  const [contractor, setcontractor] = useState("");
  const [obra, setobra] = useState("");
  const [type_car, settype_car] = useState("");
  const [code, setcode] = useState("");
  const [plate, setplate] = useState("");
  const [driver, setdriver] = useState("");
  const [material, setmaterial] = useState("");
  const [measure, setmeasure] = useState("");
  const [cantidad, setcantidad] = useState(null);
  const [origen, setorigen] = useState("");
  const [abs_origen, setabs_origen] = useState("");
  const [destino, setdestino] = useState("");
  const [abs_destino, setabs_destino] = useState("");
  const [observations, setobsertvartions] = useState("");
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [modal_nf, setmodal_nf] = useState(false);
  const [show_confirmation, setshow_confirmation] = useState(false);

  const [name_desp, setname_desp] = useState("");
  const [name_conduc, setname_conduc] = useState("Carolina L");
  const [id_user, setid_user] = useState("");

  const [actividad, setactividad] = useState("");

  const [signature, setsignature] = useState("");
  const [signature_conductor, setsignature_conductor] = useState("");

  const [section, setsection] = useState(5);
  const [contractor_list, setcontractor_list] = useState([]);
  const [obras_list, setobras_list] = useState([]);
  const vehicles_list_se = [
    { key: 1, value: "YRR1100", plate: "YRR100" },
    { key: 2, value: "YRR1200", plate: "YRR200" },
  ];
  const [vehicle_list, setvehicle_list] = useState([]);
  const [vehicle_list_t, setvehicle_list_t] = useState([]);
  const [driver_list, setdriver_list] = useState([]);
  const [material_list, setmaterial_list] = useState([]);
  const [coord, setcoord] = useState(false);
  const [show, setshow] = useState(true);
  const [code_out, setcode_out] = useState("");

  const [error_destino, seterror_destino] = useState(false);
  const [error_absdestino, seterror_absdestino] = useState(false);
  const [error_actividad, seterror_actividad] = useState(false);

  const [error_signature, seterror_signature] = useState(false);
  const [error_signature_dri, seterror_signature_dri] = useState(false);
  const [error_image, seterror_image] = useState(false);
  const [loading, setloading] = useState(false);

  // variables editables

  const validate_contingency = () => {
    if (destino === "") {
      seterror_destino(true);
    }
    if (abs_destino === "") {
      seterror_absdestino(true);
    }

    if (signature === "") {
      seterror_signature(true);
    }
    if (actividad === "") {
      seterror_actividad(true);
    }
    if (signature_conductor === "") {
      seterror_signature_dri(true);
    }
    if (imageUrls.length === 0) {
      seterror_image(true);
    }

    if (
      destino !== "" &&
      abs_destino !== "" &&
      signature !== "" &&
      signature_conductor !== "" &&
      imageUrls.length !== 0
    ) {
      save_arrival();
    }
  };

  const [text, setText] = useState("");
  const get_plate = (code) => {
    var plate = vehicle_list.filter(function (el) {
      return el.key === code;
    });
    console.log("sii", plate);
    console.log("codigooooss", code);

    if (plate.length !== 0) {
      return plate[0].plate;
    } else {
      return "";
    }
  };
  const get_plate_t = (code) => {
    var plate = vehicle_list_t.filter(function (el) {
      return el.key === code;
    });
    console.log("sii", plate);
    console.log("codigooooss", code);
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
    // console.log("esta", location.coords);
    setcoord(location.coords);
    return location.coords;
  }
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
    get_info();
    getCurrentLocation();
    readNdef();
  }, []);

  useEffect(() => {
    if (route.params?.type === "despachador") {
      setsignature(route.params?.signature);
    }
    if (route.params?.type === "conductor") {
      // console.log("que", route.params?.signature);
      setsignature_conductor(route.params?.signature);
    }
    console.log("que", route.params?.signature);
    if (route.params?.image) {
      console.log("que", route.params?.image);
      setImageUrls([...imageUrls, route.params.image]);
    }
  }, [route.params]);

  const [categories, setCategories] = useState([]);
  const today = new Date();
  const [date_out, setdate_out] = useState(today);
  const [id_salid, setid_salid] = useState("");

  const save_offline = async (data) => {
    var myArray = await AsyncStorage.getItem("Inn_latinco");
    if (myArray !== null) {
      // We have data!!
      var array_get = JSON.parse(myArray);
      array_get.push(data);
      // console.log(JSON.parse(myArray));
      await AsyncStorage.setItem("Inn_latinco", JSON.stringify(array_get));
    } else {
      var activity = [];

      activity[0] = data;
      await AsyncStorage.setItem("Inn_latinco", JSON.stringify(activity));
    }
  };

  const get_info = async () => {
    try {
      const result = await AsyncStorage.getItem("Token_latin");
      // console.log("este es el toke", JSON.parse(result));
      if (result) {
        setToken(result);

        var jsonValue = await AsyncStorage.getItem("Material_list");
        var json_value = JSON.parse(jsonValue);

        setname_desp(
          json_value.user[0].first_name + " " + json_value.user[0].last_name
        );

        setid_user(json_value.user[0].id);
        // console.log("sii", json_value);
        const contracto_array = json_value.subcontractors;
        const contractor_tranfromed = contracto_array.map(({ id, name }) => ({
          key: id,
          value: name,
        }));
        // console.log("esta", contractor_tranfromed);
        setcontractor_list(contractor_tranfromed);
        var list_p = json_value.vehicles.filter(function (el) {
          return el.type === "PROPIO";
        });
        // console.log("list_p", list_p);
        const transformed = list_p.map(({ id, plate, code }) => ({
          key: id,
          value: code,
          plate: plate,
        }));

        // console.log("esta", transformed);
        var list_s = json_value.vehicles.filter(function (el) {
          return el.type === "TERCERO";
        });
        const obra_array = json_value.constructions;
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
        // console.log("esta orba", obra_transformed);
        setobras_list(obra_transformed);
        setvehicle_list_t(array_sub_transformed);
        setvehicle_list(transformed);
        const driver_array = json_value.drivers;
        const drive_transformed = driver_array.map(
          ({ id, name, person_id }) => ({
            key: id,
            value: name,
            person_id: person_id,
          })
        );
        setdriver_list(drive_transformed);
        const material_array = json_value.materials;
        const material_transformed = material_array.map(({ id, name }) => ({
          key: id,
          value: name,
        }));
        setmaterial_list(material_transformed);
      } else {
        navigation.navigate("Home");
        return false;
      }
    } catch (ex) {
      console.log("error", ex);
      return false;
    }
  };

  async function readNdef() {
    try {
      // register for the NFC tag with NDEF in it
      await NfcManager.requestTechnology(NfcTech.Ndef);
      // the resolved tag object will contain `ndefMessage` property
      const tag = await NfcManager.getTag();

      let ndef = tag.ndefMessage[0];

      let text = Ndef.text.decodePayload(ndef.payload);
      console.log("text", text);
      //   codigo vehiculo
      var code_vehicle = text.substring(0, 3);
      setcode(parseInt(code_vehicle));
      console.log("code", parseInt(code_vehicle));
      //unidad de medidad
      var measure = text.substring(3, 4);
      console.log("measure", measure);
      if (measure == 1) {
        setmeasure("m3");
      }
      if (measure == 2) {
        setmeasure("toneladas");
      }
      //   codigo material
      var code_material = text.substring(4, 7);
      setmaterial(parseInt(code_material));
      console.log("material", code_material);
      //cantidad
      var quantity = text.substring(7, 11);
      setcantidad(parseInt(quantity));
      console.log("cantidad", quantity);

      //   codigo conductor
      var code_driver = text.substring(11, 14);
      setdriver(parseInt(code_driver));
      console.log("driver", code_driver);
      // codigo obra
      var obra_id = text.substring(14, 18);
      console.log("obra", obra_id);
      setobra(parseInt(obra_id));
      // contractor
      var contractor_id = text.substring(18, 21);
      console.log("obra", contractor_id);
      setcontractor(parseInt(contractor_id));
      //fecha
      var date_string = text.substring(21);
      setid_salid(parseInt(obra_id) + date_string);
      const date_convert = new Date(parseInt(date_string));
      setdate_out(date_convert);
      setshow(false);
    } catch (ex) {
      NfcManager.cancelTechnologyRequest();
    } finally {
      // stop the nfc scanning
      NfcManager.cancelTechnologyRequest();
    }
    return true;
  }

  const search_label = (id, list) => {
    try {
      var label = "";
      list.map((item) => {
        if (item.key == id) {
          label = item.value;
        }
      });
      return label;
    } catch {
      return "";
    }
  };
  const search_cedula = (id, list) => {
    var label = "";
    list.map((item) => {
      if (item.key == id) {
        label = item.person_id;
      }
    });
    return label;
  };

  const save_arrival = async () => {
    setloading(true);
    const formData = new FormData();
    const currentEpochTime = Date.now();
    const date_string = currentEpochTime.toString();
    formData.append("id", obra + date_string);
    formData.append("off", id_salid);
    formData.append("user", id_user);

    const date_send =
      today.getFullYear() +
      "-" +
      (parseInt(today.getMonth()) + 1) +
      "-" +
      today.getDate();
    formData.append("date", date_send);
    const time_send =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
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

    formData.append("destination", destino);
    formData.append("abs_destination", abs_destino);
    formData.append("comment", observations);
    formData.append("activity", actividad);
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
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === "granted") {
      // Save image to media library
      await MediaLibrary.saveToLibraryAsync(uri);

      console.log("Image successfully saved");
    }
    if (netInfo) {
      const url = global.url_back + "api/materials/arrival/";
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
        console.log("response", response);
        if (response.status === 201) {
          setshow(false);
          setloading(false);
          setshow_confirmation(true);
          // navigation.navigate("Steps");
        } else {
          console.log("algo fallo");

          return false;
        }
      });
    } else {
      var in_fill = {};
      in_fill["id"] = obra + date_string;
      in_fill["off"] = id_salid;
      in_fill["user"] = id_user;

      const date_send =
        today.getFullYear() +
        "-" +
        (parseInt(today.getMonth()) + 1) +
        "-" +
        today.getDate();
      in_fill["date"] = date_send;
      const time_send =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      in_fill["time"] = time_send;
      in_fill["construction"] = obra;
      in_fill["subcontractor"] = contractor;
      in_fill["driver"] = driver;
      in_fill["vehicle"] = code;
      in_fill["material"] = material;
      in_fill["material_amount"] = cantidad;
      in_fill["material_unit"] = measure;
      in_fill["destination"] = destino;
      in_fill["abs_destination"] = abs_destino;
      in_fill["comment"] = observations;
      in_fill["activity"] = actividad;
      in_fill["lat"] = parseFloat(coord.latitude).toFixed(6);
      in_fill["lng"] = parseFloat(coord.longitude).toFixed(6);
      save_offline(in_fill);
      setshow(false);
      setloading(false);

      setshow_confirmation(true);

      // navigation.navigate("Steps");
    }
  };

  return (
    <>
      <ModalIn
        show={show}
        setshow={setshow}
        code_out={id_salid}
        setcode_out={setid_salid}
        setpath_code={setedit}
      ></ModalIn>
      <Modalconfirmation
        show={show_confirmation}
        setshow={setshow_confirmation}
        loading={loading}
        id={id_salid}
        type={"entrada"}
      ></Modalconfirmation>
      <ScrollView>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "padding"}
        >
          <Header text={"Entrada de materiales"} screen={2}></Header>
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
                  data={type}
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
                      setSelected={setplate}
                      data={vehicle_list_t}
                      save="key"
                      placeholder="Seleccione"
                    />
                  </View>
                </>
              ) : null}
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
              <Text style={styles.text_inner}>Cantidad</Text>
              <TextInput
                keyboardType="numeric"
                autoFocus={true}
                style={styles.input_form}
                onChangeText={setcantidad}
                value={cantidad}
                placeholder=""
              ></TextInput>
            </>
          ) : null}

          {section === 4 ? (
            <>
              <View style={{ marginTop: 30 }}></View>
              <Text style={styles.tex_title}>Origen y Destino</Text>
              <View style={styles.line_separator}></View>
              <Text style={styles.text_inner}>Lugar de origen</Text>
              <TextInput
                autoFocus={true}
                style={styles.input_form}
                onChangeText={setorigen}
                value={origen}
                placeholder=""
              ></TextInput>
              <View style={{ marginTop: 30 }}></View>
              <Text style={styles.text_inner}>ABS origen</Text>
              <TextInput
                autoFocus={true}
                style={styles.input_form}
                onChangeText={setabs_origen}
                value={abs_origen}
                placeholder=""
              ></TextInput>

              <Text style={styles.text_inner}>Lugar de destino</Text>
              <TextInput
                autoFocus={true}
                style={styles.input_form}
                onChangeText={setdestino}
                value={destino}
                placeholder=""
              ></TextInput>
              <View style={{ marginTop: 30 }}></View>
              <Text style={styles.text_inner}>ABS destino</Text>
              <TextInput
                autoFocus={true}
                style={styles.input_form}
                onChangeText={setabs_destino}
                value={abs_destino}
                placeholder=""
              ></TextInput>

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
                <Text style={styles.tex_title}>Resumen Entrada</Text>
                <View style={styles.line_separator}></View>
                <View style={styles.edit_container}>
                  <TouchableOpacity
                    style={styles.edit_button}
                    onPress={() => setedit(!edit)}
                  >
                    {!edit ? (
                      <>
                        <Text style={styles.text_edit}>editar</Text>
                        <FontAwesome name="edit" size={30} color="#59130A" />
                      </>
                    ) : (
                      <>
                        <Text style={styles.text_edit}>guardar</Text>
                        <FontAwesome name="save" size={24} color="black" />
                      </>
                    )}
                  </TouchableOpacity>
                </View>
                <View style={styles.container_result}>
                  <Text style={styles.tex_title_info}>ID salida:</Text>
                  <Text style={styles.tex_info}>{id_salid}</Text>
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
                {edit && (
                  <View
                    style={{
                      marginTop: 10,
                      paddingHorizontal: 15,
                      width: "90%",
                      alignSelf: "center",
                    }}
                  >
                    <SelectList
                      setSelected={setobra}
                      data={obras_list}
                      save="key"
                      placeholder="Seleccione"
                    />
                  </View>
                )}
                <View style={styles.container_result}>
                  <Text style={styles.tex_title_info}>Subcontratista:</Text>
                  <Text style={styles.tex_info}>
                    {search_label(contractor, contractor_list)}
                  </Text>
                </View>
                {edit && (
                  <View
                    style={{
                      marginTop: 10,
                      paddingHorizontal: 15,
                      width: "90%",
                      alignSelf: "center",
                    }}
                  >
                    <SelectList
                      setSelected={setcontractor}
                      data={contractor_list}
                      save="key"
                      placeholder="Seleccione"
                    />
                  </View>
                )}

                <View style={styles.container_result}>
                  <Text style={styles.tex_title_info}>Placa vehículo:</Text>
                  <Text style={styles.tex_info}>{get_plate(code)}</Text>
                </View>
                <View style={styles.container_result}>
                  <Text style={styles.tex_title_info}>Codigo vehículo:</Text>
                  <Text style={styles.tex_info}>
                    {search_label(code, vehicle_list)}
                  </Text>
                </View>
                {edit && (
                  <View
                    style={{
                      marginTop: 10,
                      paddingHorizontal: 15,
                      width: "90%",
                      alignSelf: "center",
                    }}
                  >
                    <Text style={styles.tex_info}>Tipo de vehiculo</Text>
                    <SelectList
                      setSelected={settype_car}
                      data={type_car_list}
                      save="value"
                      placeholder="Seleccione"
                    />
                  </View>
                )}

                {type_car === "Propio" && edit ? (
                  <>
                    <View
                      style={{
                        marginTop: 10,
                        paddingHorizontal: 15,
                        width: "90%",
                        alignSelf: "center",
                      }}
                    >
                      <Text style={styles.tex_info}>Seleccione el codigo</Text>
                      <SelectList
                        setSelected={setcode}
                        data={vehicle_list}
                        save="key"
                        placeholder="Seleccione"
                      />
                    </View>
                  </>
                ) : null}
                {type_car === "Tercero" && edit ? (
                  <>
                    <View
                      style={{
                        marginTop: 10,
                        paddingHorizontal: 15,
                        width: "90%",
                        alignSelf: "center",
                      }}
                    >
                      <Text style={styles.tex_info}>Seleccione la placa</Text>

                      <SelectList
                        setSelected={setplate}
                        data={vehicle_list_t}
                        save="key"
                        placeholder="Seleccione"
                      />
                    </View>
                  </>
                ) : null}

                <View style={styles.container_result}>
                  <Text style={styles.tex_title_info}>Material:</Text>
                  <Text style={styles.tex_info}>
                    {search_label(material, material_list)}
                  </Text>
                </View>
                {edit && (
                  <View
                    style={{
                      marginTop: 10,
                      paddingHorizontal: 15,
                      width: "90%",
                      alignSelf: "center",
                    }}
                  >
                    <SelectList
                      setSelected={setmaterial}
                      data={material_list}
                      save="key"
                      placeholder="Seleccione"
                    />
                  </View>
                )}
                <View style={styles.container_result}>
                  <Text style={styles.tex_title_info}>Cantidad:</Text>
                  <Text style={styles.tex_info}>
                    {cantidad + " " + measure}
                  </Text>
                </View>
                {edit && (
                  <View
                    style={{
                      marginTop: 10,
                      paddingHorizontal: 15,
                      width: "90%",
                      alignSelf: "center",
                    }}
                  >
                    <TextInput
                      keyboardType="numeric"
                      style={styles.input_form}
                      onChangeText={setcantidad}
                      value={cantidad}
                      placeholder="cantidad"
                    ></TextInput>
                  </View>
                )}
                {edit && (
                  <View
                    style={{
                      marginTop: 10,
                      paddingHorizontal: 15,
                      width: "90%",
                      alignSelf: "center",
                    }}
                  >
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
                  </View>
                )}

                {edit && (
                  <>
                    <View style={styles.container_result}>
                      <Text style={styles.tex_title_info}>Conductor:</Text>
                      <Text style={styles.tex_info}>
                        {search_label(driver, driver_list)}
                      </Text>
                    </View>
                    <View
                      style={{
                        marginTop: 10,
                        paddingHorizontal: 15,
                        width: "90%",
                        alignSelf: "center",
                      }}
                    >
                      <SelectList
                        setSelected={setdriver}
                        data={driver_list}
                        save="key"
                        placeholder="Seleccione"
                      />
                    </View>
                  </>
                )}

                <View style={styles.container_result}>
                  <Text style={styles.tex_title_info}>Lugar de destino:</Text>
                  <TextInput
                    style={styles.input_form}
                    onChangeText={setdestino}
                    value={destino}
                    placeholder=""
                  ></TextInput>
                </View>
                {error_destino && (
                  <Text style={styles.text_error}>
                    *debes introducir un destino
                  </Text>
                )}
                <View style={styles.container_result}>
                  <Text style={styles.tex_title_info}>ABS destino:</Text>
                  <TextInput
                    style={styles.input_form}
                    onChangeText={setabs_destino}
                    value={abs_destino}
                    placeholder=""
                  ></TextInput>
                </View>
                {error_absdestino && (
                  <Text style={styles.text_error}>
                    *debes introducir un abs de destino
                  </Text>
                )}
                <View style={styles.container_result}>
                  <Text style={styles.tex_title_info}>Actividad:</Text>
                  <TextInput
                    style={styles.input_form}
                    onChangeText={setactividad}
                    value={actividad}
                    placeholder=""
                  ></TextInput>
                </View>
                {error_actividad && (
                  <Text style={styles.text_error}>
                    *debes introducir una actividad
                  </Text>
                )}

                <View style={styles.container_result}>
                  <Text style={styles.tex_title_info}>Fecha Salida:</Text>
                  <Text style={styles.tex_info}>
                    {date_out.getFullYear() +
                      "-" +
                      (parseInt(date_out.getMonth()) + 1) +
                      "-" +
                      date_out.getDate()}
                  </Text>
                </View>
                <View style={styles.container_result}>
                  <Text style={styles.tex_title_info}>Hora Salida:</Text>
                  <Text style={styles.tex_info}>
                    {date_out.getHours() +
                      ":" +
                      date_out.getMinutes() +
                      ":" +
                      date_out.getSeconds()}
                  </Text>
                </View>

                <View style={styles.container_result}>
                  <Text style={styles.tex_title_info}>Hora Lllegada:</Text>
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
                <View style={styles.container_result}>
                  <Text style={styles.tex_title_info}>Firma Recibidor:</Text>
                  <Text style={styles.tex_info}>{}</Text>
                </View>
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
                      origin: "ins",
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
                  <Text style={styles.tex_title_info}>Nombre Recibidor:</Text>
                  <Text style={styles.tex_info}>{name_desp}</Text>
                </View>
                <Pressable
                  style={styles.container_result}
                  onPress={() => navigation.navigate("Signature")}
                >
                  <Text style={styles.tex_title_info}>Firma Conductor:</Text>
                  <Text style={styles.tex_info}>{}</Text>
                </Pressable>
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
                      origin: "ins",
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
                    {
                      <Text style={styles.tex_info}>
                        {search_label(driver, driver_list)}
                      </Text>
                    }
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
                        origin: "ins",
                        id: id_salid,
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
                    *debes agregar un soporte de la entrada
                  </Text>
                )}
              </View>
            </ViewShot>
          ) : null}

          {section === 5 ? (
            <TouchableOpacity
              style={styles.button}
              onPress={() => (loading ? null : validate_contingency())}
            >
              {loading ? (
                <ActivityIndicator
                  animating={true}
                  size="large"
                  style={{ opacity: 1 }}
                  color="#fff"
                />
              ) : (
                <Text style={styles.text_button}>Finalizar Llegada</Text>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.button}
              onPress={() => setsection(section + 1)}
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
    alignItems: "center",
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
  text_error: {
    fontFamily: "BrandonGrotesqueRegular",
    fontSize: 13,
    color: "red",
    marginLeft: 10,
  },
  edit_container: {
    width: "100%",
    display: "flex",
    alignItems: "flex-end",
  },
  edit_button: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "20%",
    justifyContent: "space-around",
    marginRight: 10,
  },
  text_edit: {
    fontFamily: "BrandonGrotesqueRegular",
    fontSize: 17,
    color: "#59130A",
  },
});
