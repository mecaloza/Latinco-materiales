import React, { useState, useEffect } from "react";

import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Pressable,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  TextInput,
  Alert,
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
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import Modaladdfile from "../components/Modaladdfile";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  SelectList,
  MultipleSelectList,
} from "react-native-dropdown-select-list";

export default function SearchScreen({ navigation }) {
  const [token_latin, setToken] = useState("");
  const [netInfo, setNetInfo] = useState(true);
  const [is_admin, setis_admin] = useState(false);

  const [offs, setoffs] = useState([]);
  const [offs_copy, setoffs_copy] = useState([]);

  const [show, setshow] = useState(false);
  const [id, setid] = useState("");
  const [type_register, settype_register] = useState("");
  const [list_vehicles, setlist_vehicles] = useState([]);
  const [filter_plate, setfilter_plate] = useState(0);

  const [plate, setplate] = useState("");
  const [driver, setdriver] = useState("");
  const [driver_list, setdriver_list] = useState([]);
  const [item_selected, setitem_selected] = useState(null);
  const [obra, setobra] = useState("");
  const [obras_list, setobras_list] = useState([]);
  const [contractor, setcontractor] = useState("");
  const [contractor_list, setcontractor_list] = useState([]);
  const [material_list, setmaterial_list] = useState([]);
  const [cahnge, setchange] = useState(false);
  const [material, setmaterial] = useState("");
  const [measure, setmeasure] = useState("");
  const [loading, setloading] = useState(false);
  const [loading_inner, setloading_inner] = useState(true);

  const [cantidad, setcantidad] = useState(null);
  const [actividad, setactividad] = useState("");

  const [origen, setorigen] = useState("");
  const [abs_origen, setabs_origen] = useState("");
  const [destino, setdestino] = useState("");
  const [abs_destino, setabs_destino] = useState("");

  const save_data = async (data) => {
    var jsonValue = await AsyncStorage.getItem("Material_list");
    var json_value = JSON.parse(jsonValue);
    var list_vehicles = json_value.vehicles;
    var transformed = list_vehicles.map(({ id, plate, code }) => ({
      key: id,
      value: plate,
    }));
    console.log("este es el data", transformed);
    transformed = [{ key: 0, value: "Seleccione una placa" }].concat(
      transformed
    );
    setlist_vehicles(transformed);
    const obra_array = json_value.constructions;
    const obra_transformed = obra_array.map(({ id, name }) => ({
      key: id,
      value: name,
    }));
    setobras_list(obra_transformed);

    const contracto_array = json_value.subcontractors;
    const contractor_tranfromed = contracto_array.map(({ id, name }) => ({
      key: id,
      value: name,
    }));
    // console.log("esta", contractor_tranfromed);
    setcontractor_list(contractor_tranfromed);
    const driver_array = json_value.drivers;
    const drive_transformed = driver_array.map(({ id, name, person_id }) => ({
      key: id,
      value: name,
      person_id: person_id,
    }));
    setdriver_list(drive_transformed);
    const material_array = json_value.materials;
    const material_transformed = material_array.map(({ id, name }) => ({
      key: id,
      value: name,
    }));
    setmaterial_list(material_transformed);
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
      const is_admin = json_value.user[0].is_superuser;
      setis_admin(is_admin);
      console.log("este es el toke", json_value.user);
      setloading_inner(true);
      if (result) {
        setToken(result);
        fetch(`${global.url_back}api/materials/registers/?user_id=${user_id}`, {
          method: "GET",

          headers: {
            Authorization: `Token ${JSON.parse(result)}`,
          },
        }).then((response) => {
          if (response.status === 200) {
            return response.json().then((json_response) => {
              console.log("sii", json_response[0]);
              setoffs(json_response);
              setoffs_copy(json_response);
              setloading_inner(false);
            });
          } else {
            return response.json().then((json_response) => {
              console.log("es aca");
              setloading_inner(false);
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
    save_data();
    get_register();
  }, []);

  useEffect(() => {
    if (filter_plate !== 0) {
      console.log("este es el filtro", filter_plate);
      var list_p = offs_copy.filter(function (el) {
        return el.vehicle.id === filter_plate;
      });
      setoffs(list_p);
    } else {
      setoffs(offs_copy);
    }
  }, [filter_plate]);

  const save_change = async () => {
    const result = await AsyncStorage.getItem("Token_latin");
    var jsonValue = await AsyncStorage.getItem("Material_list");
    var json_value = JSON.parse(jsonValue);
    const user_id = json_value.user[0].id;
    setloading(true);
    if (item_selected.type === "arrival") {
      fetch(`${global.url_back}api/materials/edition/${item_selected.id}/`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          Authorization: `Token ${JSON.parse(result)}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: item_selected.id,
          off: item_selected.off,
          user: item_selected.user.id,
          date: item_selected.date,
          time: item_selected.time,
          construction: obra ? obra : item_selected.construction.id,
          subcontractor: contractor
            ? contractor
            : item_selected.subcontractor.id,
          vehicle: plate ? plate : item_selected.vehicle.id,
          material: material ? material : item_selected.material.id,
          material_amount: cantidad ? cantidad : item_selected.material_amount,
          material_unit: measure,
          activity: actividad ? actividad : item_selected.activity,

          destination: destino ? destino : item_selected.destination,
          abs_destination: abs_destino
            ? abs_destino
            : item_selected.abs_destination,
          commnent: item_selected.commnent,
          lat: item_selected.lat,
          lng: item_selected.lng,
          driver: driver ? driver : item_selected.driver.id,
          type: item_selected.type,
        }),
      }).then((response) => {
        // console.log("por aca", response.status);
        if (response.status === 200) {
          console.log("si", response);
          setloading(false);
          setchange(false);
          Alert.alert("Registro editado, exitosamente!");

          setfilter_plate("");
          get_register();
          return false;
        } else {
          return response.json().then((json_response) => {
            console.log("Algo salio mal", json_response);
            setloading(false);
            setfilter_plate("");
            get_register();
            return false;
          });
        }
      });
    } else {
      fetch(`${global.url_back}api/materials/edition/${item_selected.id}/`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          Authorization: `Token ${JSON.parse(result)}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: item_selected.id,
          user: item_selected.user.id,
          date: item_selected.date,
          time: item_selected.time,
          construction: obra ? obra : item_selected.construction.id,
          subcontractor: contractor
            ? contractor
            : item_selected.subcontractor.id,
          vehicle: plate ? plate : item_selected.vehicle.id,

          material: material ? material : item_selected.material.id,
          material_amount: cantidad ? cantidad : item_selected.material_amount,
          origin: origen ? origen : item_selected.origin,
          material_unit: measure,

          abs_origin: abs_origen ? abs_origen : item_selected.abs_origin,
          destination: destino ? destino : item_selected.destination,
          abs_destination: abs_destino
            ? abs_destino
            : item_selected.abs_destination,
          commnent: item_selected.commnent,
          lat: item_selected.lat,
          lng: item_selected.lng,
          driver: driver ? driver : item_selected.driver.id,
          type: item_selected.type,
        }),
      }).then((response) => {
        // console.log("por aca", response.status);
        if (response.status === 200) {
          console.log("si", response);
          setloading(false);
          setchange(false);
          Alert.alert("Registro editado, exitosamente!");

          return false;
        } else {
          return response.json().then((json_response) => {
            console.log("Algo salio mal", json_response);
            setloading(false);

            return false;
          });
        }
      });
    }
  };

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
        <Header text={"Consulta registros"} screen={2}></Header>

        {loading_inner ? (
          <ActivityIndicator
            animating={true}
            size="large"
            style={{ opacity: 1, marginTop: 40 }}
            color="#59130A"
          />
        ) : (
          <>
            {!cahnge ? (
              <>
                <View style={styles.container_title}>
                  <Text style={styles.tex_rectangle_long}>
                    {" "}
                    Filtra por placas:
                  </Text>
                </View>
                <View
                  style={{
                    paddingHorizontal: 15,
                  }}
                >
                  <SelectList
                    data={list_vehicles}
                    save="key"
                    setSelected={setfilter_plate}
                    placeholder={"Selecciona una placa"}
                    defaultOption={{ key: 0, label: "Selecciona una placa" }}
                  />
                </View>

                {offs.map((item, index) => (
                  <TouchableOpacity
                    style={styles.container_activity}
                    key={index}
                    onPress={() => {
                      if (is_admin) {
                        console.log("item", item);
                        setitem_selected(item);
                        //   setobra(item.construction);
                        setmeasure(item.material_unit);
                        //   setcontractor(item.subcontractor);
                        //   setplate(item.vehicle);
                        //   setmaterial(item.material);
                        //   setdriver(item.driver);
                        setcantidad(item.material_amount);
                        if (item.type === "arrival") {
                          setabs_destino(item.abs_destination);
                          setdestino(item.destination);
                          setactividad(item.activity);
                        } else {
                          setdestino(item.destination);
                          setorigen(item.origin);
                          setabs_destino(item.abs_destination);
                          setabs_origen(item.abs_origin);
                        }

                        setchange(true);
                      }
                    }}
                  >
                    {item.type === "arrival" ? (
                      <Entypo
                        name="aircraft-landing"
                        size={44}
                        color="#59130A"
                      />
                    ) : (
                      <Entypo
                        name="aircraft-take-off"
                        size={44}
                        color="#59130A"
                      />
                    )}

                    <View style={styles.container_info}>
                      <Text style={styles.text_info}>
                        <Text
                          style={[styles.text_info, { fontWeight: "bold" }]}
                        >
                          {item.type === "arrival" ? "Entrada" : "Salida"}
                        </Text>
                      </Text>
                      <Text style={styles.text_info}>
                        <Text
                          style={[styles.text_info, { fontWeight: "bold" }]}
                        >
                          Id:{" "}
                        </Text>
                        {item.id}
                      </Text>
                      <Text style={styles.text_info}>
                        <Text
                          style={[styles.text_info, { fontWeight: "bold" }]}
                        >
                          Obra:{" "}
                        </Text>
                        {item.construction.name}
                      </Text>
                      <Text style={styles.text_info}>
                        <Text
                          style={[styles.text_info, { fontWeight: "bold" }]}
                        >
                          Fecha:{" "}
                        </Text>
                        {item.date}
                      </Text>

                      <Text style={styles.text_info}>
                        <Text
                          style={[styles.text_info, { fontWeight: "bold" }]}
                        >
                          Hora:{" "}
                        </Text>
                        {item.time}
                      </Text>
                      <Text style={styles.text_info}>
                        <Text
                          style={[styles.text_info, { fontWeight: "bold" }]}
                        >
                          Contratista:{" "}
                        </Text>
                        {item.subcontractor.name}
                      </Text>
                      <Text style={styles.text_info}>
                        <Text
                          style={[styles.text_info, { fontWeight: "bold" }]}
                        >
                          Placa de vehiculo:{" "}
                        </Text>
                        {item.vehicle.plate}
                      </Text>
                      <Text style={styles.text_info}>
                        <Text
                          style={[styles.text_info, { fontWeight: "bold" }]}
                        >
                          Absisa destino:{" "}
                        </Text>
                        {item.abs_destination}
                      </Text>
                      <Text style={styles.text_info}>
                        <Text
                          style={[styles.text_info, { fontWeight: "bold" }]}
                        >
                          Actividad:{" "}
                        </Text>
                        {item.abs_destination}
                      </Text>
                      <Text style={styles.text_info}>
                        <Text
                          style={[styles.text_info, { fontWeight: "bold" }]}
                        >
                          Destino:{" "}
                        </Text>
                        {item.destination}
                      </Text>
                      <Text style={styles.text_info}>
                        <Text
                          style={[styles.text_info, { fontWeight: "bold" }]}
                        >
                          Conductor:{" "}
                        </Text>
                        {item.driver.name}
                      </Text>
                      <Text style={styles.text_info}>
                        <Text
                          style={[styles.text_info, { fontWeight: "bold" }]}
                        >
                          Latitud:{" "}
                        </Text>
                        {item.lat}
                      </Text>
                      <Text style={styles.text_info}>
                        <Text
                          style={[styles.text_info, { fontWeight: "bold" }]}
                        >
                          Longitud:{" "}
                        </Text>
                        {item.lng}
                      </Text>
                      <Text style={styles.text_info}>
                        <Text
                          style={[styles.text_info, { fontWeight: "bold" }]}
                        >
                          Material:{" "}
                        </Text>
                        {item.material.name}
                      </Text>
                      <Text style={styles.text_info}>
                        <Text
                          style={[styles.text_info, { fontWeight: "bold" }]}
                        >
                          Unidad material:{" "}
                        </Text>
                        {item.material_unit}
                      </Text>
                      <Text style={styles.text_info}>
                        <Text
                          style={[styles.text_info, { fontWeight: "bold" }]}
                        >
                          Cantidad de material:{" "}
                        </Text>
                        {item.material_amount}
                      </Text>

                      <Text style={styles.text_info}>
                        <Text
                          style={[styles.text_info, { fontWeight: "bold" }]}
                        >
                          Observaciones:{" "}
                        </Text>
                        {item.comment}
                      </Text>
                    </View>
                    {is_admin && (
                      <Feather name="edit" size={44} color="#59130A" />
                    )}
                  </TouchableOpacity>
                ))}
              </>
            ) : (
              <View style={styles.container_activity_update}>
                <View style={styles.container_info_update}>
                  <Text
                    style={[
                      styles.text_info,
                      {
                        fontWeight: "bold",
                        width: "100%",
                        textAlign: "center",
                        fontSize: 23,
                      },
                    ]}
                  >
                    {item_selected.type === "arrival" ? "Entrada" : "Salida"}
                  </Text>

                  <Text
                    style={[
                      styles.text_info,
                      { width: "100%", textAlign: "center" },
                    ]}
                  >
                    <Text style={[styles.text_info, { fontWeight: "bold" }]}>
                      Id:{" "}
                    </Text>
                    {item_selected.id}
                  </Text>

                  <View style={styles.container_section}>
                    <Text
                      style={[
                        styles.text_info,
                        { fontWeight: "bold", width: "30%", textAlign: "left" },
                      ]}
                    >
                      Usuario:{" "}
                    </Text>
                    <View style={{ width: "70%" }}>
                      <Text style={[styles.text_info]}>
                        {" "}
                        {item_selected.user.name}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.container_section}>
                    <Text
                      style={[
                        styles.text_info,
                        { fontWeight: "bold", width: "30%", textAlign: "left" },
                      ]}
                    >
                      Fecha:{" "}
                    </Text>
                    <View style={{ width: "70%" }}>
                      <Text style={[styles.text_info]}>
                        {item_selected.date}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.container_section}>
                    <Text
                      style={[
                        styles.text_info,
                        { fontWeight: "bold", width: "30%", textAlign: "left" },
                      ]}
                    >
                      Hora:{" "}
                    </Text>
                    <View style={{ width: "70%" }}>
                      <Text style={[styles.text_info]}>
                        {" "}
                        {item_selected.time}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.container_section}>
                    <Text
                      style={[
                        styles.text_info,
                        { fontWeight: "bold", width: "30%", textAlign: "left" },
                      ]}
                    >
                      Latitud:{" "}
                    </Text>
                    <View style={{ width: "70%" }}>
                      <Text style={[styles.text_info]}>
                        {item_selected.lat}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.container_section}>
                    <Text
                      style={[
                        styles.text_info,
                        { fontWeight: "bold", width: "30%", textAlign: "left" },
                      ]}
                    >
                      Longitud:{" "}
                    </Text>
                    <View style={{ width: "70%" }}>
                      <Text style={[styles.text_info]}>
                        {" "}
                        {item_selected.lng}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.container_section}>
                    <Text
                      style={[
                        styles.text_info,
                        { fontWeight: "bold", width: "30%", textAlign: "left" },
                      ]}
                    >
                      Obra:{" "}
                    </Text>
                    <View style={{ width: "70%" }}>
                      <SelectList
                        setSelected={setobra}
                        data={obras_list}
                        save="key"
                        placeholder={item_selected.construction.name}
                      />
                    </View>
                  </View>

                  <View style={styles.container_section}>
                    <Text
                      style={[
                        styles.text_info,
                        { fontWeight: "bold", width: "30%", textAlign: "left" },
                      ]}
                    >
                      Contratista:{" "}
                    </Text>
                    <View style={{ width: "70%" }}>
                      <SelectList
                        setSelected={setcontractor}
                        data={contractor_list}
                        save="key"
                        placeholder={item_selected.subcontractor.name}
                      />
                    </View>
                  </View>
                  <View style={styles.container_section}>
                    <Text
                      style={[
                        styles.text_info,
                        { fontWeight: "bold", width: "30%", textAlign: "left" },
                      ]}
                    >
                      Placa de{"\n"}vehiculo:{" "}
                    </Text>
                    <View style={{ width: "70%" }}>
                      <SelectList
                        setSelected={setplate}
                        data={list_vehicles}
                        save="key"
                        placeholder={item_selected.vehicle.plate}
                      />
                    </View>
                  </View>

                  <View style={styles.container_section}>
                    <Text
                      style={[
                        styles.text_info,
                        { fontWeight: "bold", width: "30%", textAlign: "left" },
                      ]}
                    >
                      Absisa {"\n"}destino:{" "}
                    </Text>

                    <TextInput
                      style={styles.input_form}
                      onChangeText={setabs_destino}
                      value={abs_destino}
                      placeholder=""
                    ></TextInput>
                  </View>

                  {item_selected.type === "off" ? (
                    <View style={styles.container_section}>
                      <Text
                        style={[
                          styles.text_info,
                          {
                            fontWeight: "bold",
                            width: "30%",
                            textAlign: "left",
                          },
                        ]}
                      >
                        Absisa {"\n"}origen:{" "}
                      </Text>

                      <TextInput
                        style={styles.input_form}
                        onChangeText={setabs_origen}
                        value={abs_origen}
                        placeholder=""
                      ></TextInput>
                    </View>
                  ) : null}

                  {item_selected.type === "arrival" ? (
                    <View style={styles.container_section}>
                      <Text
                        style={[
                          styles.text_info,
                          {
                            fontWeight: "bold",
                            width: "30%",
                            textAlign: "left",
                          },
                        ]}
                      >
                        Actividad:{" "}
                      </Text>
                      <TextInput
                        style={styles.input_form}
                        onChangeText={setactividad}
                        value={actividad}
                        placeholder=""
                      ></TextInput>
                    </View>
                  ) : null}

                  {item_selected.type === "off" ? (
                    <View style={styles.container_section}>
                      <Text
                        style={[
                          styles.text_info,
                          {
                            fontWeight: "bold",
                            width: "30%",
                            textAlign: "left",
                          },
                        ]}
                      >
                        Origen:{" "}
                      </Text>
                      <TextInput
                        style={styles.input_form}
                        onChangeText={setorigen}
                        value={origen}
                        placeholder=""
                      ></TextInput>
                    </View>
                  ) : null}

                  <View style={styles.container_section}>
                    <Text
                      style={[
                        styles.text_info,
                        { fontWeight: "bold", width: "30%", textAlign: "left" },
                      ]}
                    >
                      Destino:{" "}
                    </Text>
                    <TextInput
                      style={styles.input_form}
                      onChangeText={setdestino}
                      value={destino}
                      placeholder=""
                    ></TextInput>
                  </View>

                  <View style={styles.container_section}>
                    <Text
                      style={[
                        styles.text_info,
                        { fontWeight: "bold", width: "30%", textAlign: "left" },
                      ]}
                    >
                      Conductor:{" "}
                    </Text>
                    <View style={{ width: "70%" }}>
                      <SelectList
                        setSelected={setdriver}
                        data={driver_list}
                        save="key"
                        placeholder={item_selected.driver.name}
                      />
                    </View>
                  </View>

                  <View style={styles.container_section}>
                    <Text
                      style={[
                        styles.text_info,
                        { fontWeight: "bold", width: "30%", textAlign: "left" },
                      ]}
                    >
                      Material:{" "}
                    </Text>
                    <View style={{ width: "70%" }}>
                      <SelectList
                        setSelected={setmaterial}
                        data={material_list}
                        save="key"
                        placeholder={item_selected.material.name}
                      />
                    </View>
                  </View>
                  <View style={styles.container_section}>
                    <Text
                      style={[
                        styles.text_info,
                        { fontWeight: "bold", width: "30%", textAlign: "left" },
                      ]}
                    >
                      Unidad material:{" "}
                    </Text>
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
                  <View style={styles.container_section}>
                    <Text
                      style={[
                        styles.text_info,
                        { fontWeight: "bold", width: "30%", textAlign: "left" },
                      ]}
                    >
                      Cantidad de material:{" "}
                    </Text>
                    <TextInput
                      keyboardType="numeric"
                      style={styles.input_form}
                      onChangeText={setcantidad}
                      value={cantidad}
                      placeholder=""
                    ></TextInput>
                  </View>
                  <View style={styles.container_section}>
                    <Text
                      style={[
                        styles.text_info,
                        { fontWeight: "bold", width: "30%", textAlign: "left" },
                      ]}
                    >
                      Observaciones:{" "}
                    </Text>
                    <View style={{ width: "70%" }}>
                      <Text style={[styles.text_info]}>
                        {" "}
                        {item_selected.comment}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => (loading ? null : save_change())}
                  >
                    {loading ? (
                      <ActivityIndicator
                        animating={true}
                        size="large"
                        style={{ opacity: 1 }}
                        color="#fff"
                      />
                    ) : (
                      <Text style={styles.text_button}>Guardar Cambios</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </>
        )}
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
  text_button: {
    fontFamily: "BrandonGrotesqueRegular",
    fontSize: 22,
    color: "#fff",
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
  },
  container_title: {
    width: "100%",

    marginTop: 50,
    paddingLeft: 10,
    flexDirection: "row",
    marginBottom: 5,
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
  container_activity_update: {
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
    marginBottom: 40,
  },
  container_info: {
    width: "60%",
    height: "100%",
    paddingTop: 10,
  },
  container_info_update: {
    width: "90%",
    height: "100%",
    paddingTop: 10,
  },
  text_info: {
    fontFamily: "BrandonGrotesqueRegular",
    fontSize: 18,
    marginTop: 5,
  },
  container_section: {
    width: "100%",

    display: "flex",
    flexDirection: "row",

    justifyContent: "space-around",
    marginTop: 5,
  },
  radio_section: {
    width: "70%",
    display: "flex",
    flexDirection: "row",
    marginTop: 5,
    marginBottom: 5,
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
    width: "70%",
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
});
