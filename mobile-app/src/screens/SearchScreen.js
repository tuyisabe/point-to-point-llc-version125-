import React, { useState, useEffect } from "react";
import { Icon } from "react-native-elements";
import { Dropdown } from "react-native-element-dropdown";
import { colors } from "../common/theme";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
  Keyboard,
  Image,
  Modal,
  ScrollView,
  Platform,
} from "react-native";
import i18n, { currentLocale } from "i18n-js";
import { api } from "common";
import { useSelector, useDispatch } from "react-redux";
import Footer from "../components/Footer";
import { checkSearchPhrase, appConsts } from "../common/sharedFunctions";
import { MAIN_COLOR } from "../common/sharedFunctions";
var { width, height } = Dimensions.get("window");
import { StackActions } from "@react-navigation/native";
import {
  Entypo,
  MaterialIcons,
  AntDesign,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Button } from "react-native-elements";
import { Colors } from "react-native/Libraries/NewAppScreen";
const datas = [
  {
    add: "Kigali international airport",
    lat: -1.963042,
    lng: 30.135014,
  },
  {
    add: "Atlantic Aviation (SLC)",
    lat: 40.780239105225,
    lng: -111.95767974854,
  },
  {
    add: "Salt Lake City Intl Airport (SLC)",
    lat: 40.7899404,
    lng: -111.9790706,
  },
  {
    add: "Signature Aviation (SLC)",
    lat: 40.780239105225,
    lng: -111.95767974854,
  },
];
const appcat = "taxi";
const hasNotch =
  Platform.OS === "ios" &&
  !Platform.isPad &&
  !Platform.isTV &&
  (height === 780 ||
    width === 780 ||
    height === 812 ||
    width === 812 ||
    height === 844 ||
    width === 844 ||
    height === 852 ||
    width === 852 ||
    height === 896 ||
    width === 896 ||
    height === 926 ||
    width === 926 ||
    height === 932 ||
    width === 932);
export default function SearchScreen(props) {
  const { t } = i18n;
  const isRTL =
    i18n.locale.indexOf("he") === 0 || i18n.locale.indexOf("ar") === 0;
  const {
    fetchCoordsfromPlace,
    fetchPlacesAutocomplete,
    updateTripPickup,
    updateTripDrop,
    editAddress,
  } = api;
  const dispatch = useDispatch();
  const [searchKeywordPickup, setSearchKeywordPickup] = useState("");
  const [searchKeywordDrop, setSearchKeywordDrop] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isShowingResults, setIsShowingResults] = useState(false);
  const tripdata = useSelector((state) => state.tripdata);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [savedAddresses, setSavedAddresses] = useState([]);
  const { locationType, addParam } = props.route.params;
  const [loading, setLoading] = useState();
  const settingsdata = useSelector((state) => state.settingsdata.settings);
  const [settings, setSettings] = useState({});
  const [selLocations, setSelLocations] = useState([]);
  const [selLocationsPickup, setSelLocationsPickup] = useState([]);
  const [selLocationsDrop, setSelLocationsDrop] = useState([]);
  const auth = useSelector((state) => state.auth);
  const [profile, setProfile] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [isShowingResults2, setIsShowingResults2] = useState(false);
  const [searchResults2, setSearchResults2] = useState([]);
  const [searchKeyword2, setSearchKeyword2] = useState("");
  const [addressName, setAddressName] = useState("");
  const [address, setAddress] = useState("");
  const { fromairportSelected } = props.route.params;
  const { toairportSelected } = props.route.params;
  const { currentLoc } = props.route.params;
  const addressdata = useSelector((state) => state.addressdata);
  const [saveNameValue, setSaveNameValue] = useState("");
  let [locationTypes, setLocationTypes] = useState(locationType);
  const [fromairportSelect, setFromairportSelect] =
    useState(fromairportSelected);
  const [toairportSelect, setToairportSelect] = useState(toairportSelected);
  const currentLocation = currentLoc;
  const [hideDrop, setHideDrop] = useState(false);
  const [hidePic, setHidePic] = useState(false);
  const [add, setAdd] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const saveName = [
    {
      value: t("home"),
      lable: t("home"),
      icon: "house",
      type: "materialIcons",
    },
    {
      value: t("work"),
      lable: t("work"),
      icon: "business-center",
      type: "materialIcons",
    },
    {
      value: "school",
      lable: "School",
      icon: "school",
      type: "materialIcons",
    },
    {
      value: "restaurant",
      lable: "Restaurant",
      icon: "restaurant",
      type: "materialIcons",
    },
    {
      value: t("other"),
      lable: t("other"),
      icon: "location-pin",
      type: "materialIcons",
    },
  ];

  useEffect(() => {
    if (addressdata.addresses) {
      setSavedAddresses(addressdata.addresses);
    } else {
      setSavedAddresses([]);
    }
  }, [addressdata, addressdata.addresses]);

  useEffect(() => {
    if (settingsdata) {
      setSettings(settingsdata);
    }
  }, [settingsdata]);

  useEffect(() => {
    if (auth.profile && auth.profile.uid) {
      setProfile(auth.profile);
    } else {
      setProfile(null);
    }
  }, [auth && auth.profile]);

  useEffect(() => {
    if (settingsdata) {
      setSettings(settingsdata);
    }
  }, [settingsdata]);

  useEffect(() => {
    if (
      (tripdata.drop && locationTypes == "drop") ||
      (tripdata.drop && locationTypes == "pickup")
    ) {
      let arr = [];
      if (tripdata.drop && tripdata.drop.waypoints) {
        const waypoints = tripdata.drop.waypoints;
        for (let i = 0; i < waypoints.length; i++) {
          arr.push(waypoints[i]);
        }
      }
      if (tripdata.drop.add) {
        arr.push({
          lat: tripdata.drop.lat,
          lng: tripdata.drop.lng,
          add: tripdata.drop.add,
          source: tripdata.drop.source,
        });
      }
      setSelLocationsDrop(arr);
    }
  }, [locationTypes, tripdata.drop]);

  useEffect(() => {
    if (
      (tripdata.pickup && locationTypes == "pickup") ||
      (tripdata.drop && locationTypes == "drop")
    ) {
      let arr1 = [];
      if (tripdata.pickup && tripdata.pickup.waypoints) {
        const waypoints1 = tripdata.pickup.waypoints;
        for (let i = 0; i < waypoints1.length; i++) {
          arr1.push(waypoints1[i]);
        }
      }
      if (tripdata.pickup.add) {
        arr1.push({
          lat: tripdata.pickup.lat,
          lng: tripdata.pickup.lng,
          add: tripdata.pickup.add,
          source: tripdata.pickup.source,
        });
      }
      setSelLocationsPickup(arr1);
    }
  }, [locationTypes, tripdata.pickup]);

  useEffect(() => {
    if (selLocationsDrop && selLocationsDrop.add == null && currentLocation) {
      dispatch(
        updateTripDrop({
          lat: currentLocation.lat,
          lng: currentLocation.lng,
          add: currentLocation.add,
          source: "init",
        })
      );
    }
  }, [selLocationsDrop.add]);

  const searchLocationDrop = async (text) => {
    setSearchKeywordDrop(text);

    if (text.length > (settings.AllowCriticalEditsAdmin ? 3 : 2)) {
      const res = await fetchPlacesAutocomplete(text);
      if (res) {
        setSearchResults(res);
        setIsShowingResults(true);
      }
    }
  };

  const searchLocationPickup = async (text) => {
    setSearchKeywordPickup(text);

    if (text.length > (settings.AllowCriticalEditsAdmin ? 3 : 5)) {
      const res = await fetchPlacesAutocomplete(text);
      if (res) {
        setSearchResults(res);
        setIsShowingResults(true);
      }
    }
  };

  const changepickup = () => {
    setLocationTypes("pickup");
  };

  const changedrop = () => {
    setLocationTypes("drop");
  };

  const searchLocation = async (text) => {
    setSearchKeyword(text);
    if (text.length > (settings.AllowCriticalEditsAdmin ? 3 : 5)) {
      const res = await fetchPlacesAutocomplete(text);
      if (res) {
        setSearchResults(res);
        setIsShowingResults(true);
      }
    }
  };

  const updateSelectLocation = (data) => {
    if (data.lat && data.lng) {
      if (locationTypes == "pickup") {
        dispatch(
          updateTripPickup({
            lat: data.lat,
            lng: data.lng,
            add: data.add,
            source: "search",
          })
        );
        if (appcat == "taxi") {
          setSelLocationsPickup(searchKeywordPickup);
        }
      } else {
        dispatch(
          updateTripDrop({
            lat: data.lat,
            lng: data.lng,
            add: data.add,
            source: "default",
          })
        );
        props.navigation.pop();
      }
    }
  };

  const updateLocation = (data, data1) => {
    setLoading(true);
    appcat == "taxi"
      ? setSearchKeywordDrop("") && setSearchKeywordPickup("")
      : setSearchKeywordDrop(data.description) &&
        setSearchKeywordPickup(data1.description);
    setIsShowingResults(false);

    if (data.place_id) {
      fetchCoordsfromPlace(data.place_id).then((res) => {
        if (res && res.lat) {
          if (locationTypes == "pickup") {
            dispatch(
              updateTripPickup({
                lat: res.lat,
                lng: res.lng,
                add: data.description,
                source: "search",
              })
            );
            if (appcat == "taxi") {
              //props.navigation.pop();
              setSelLocationsPickup(searchKeywordPickup);
              setHideDrop(false);
            }
          } else {
            dispatch(
              updateTripDrop({
                lat: res.lat,
                lng: res.lng,
                add: data.description,
                source: "default",
              })
            );
            if (appcat == "taxi") {
              props.navigation.pop();
            }
          }
          setLoading(false);
          if (appcat == "delivery") {
            props.navigation.pop();
          }
        } else {
          Alert.alert(t("alert"), t("place_to_coords_error"));
        }
      });
    } else {
      if (data.description) {
        if (locationTypes == "pickup") {
          dispatch(
            updateTripPickup({
              lat: data.lat,
              lng: data.lng,
              add: data.description,
              source: "search",
            })
          );
          if (appcat == "taxi") {
            //props.navigation.pop();
            setSelLocationsPickup(searchKeywordPickup);
            setHideDrop(false);
          }
        } else {
          if (appcat == "taxi") {
            dispatch(
              updateTripDrop({
                lat: data.lat,
                lng: data.lng,
                add: data.description,
                source: "default",
              })
            );
            if (appcat == "taxi") {
              props.navigation.pop();
            }
          } else {
            dispatch(
              updateTripDrop({
                lat: data.lat,
                lng: data.lng,
                add: data.description,
                source: "default",
              })
            );
          }
        }
        setLoading(false);
        if (appcat == "delivery") {
          props.navigation.pop();
        }
      }
    }
  };
  const searchSaveLocation = async (text) => {
    setSearchKeyword2(text);
    if (text.length > (settings.AllowCriticalEditsAdmin ? 3 : 5)) {
      const res = await fetchPlacesAutocomplete(text);
      if (res) {
        setSearchResults2(res);
        setIsShowingResults2(true);
      }
    }
  };
  const okClicked = () => {
    let waypoints = [...selLocations];
    waypoints.splice(selLocations.length - 1, 1);
    let dropObj = {
      ...selLocations[selLocations.length - 1],
      waypoints: waypoints,
    };
    dispatch(updateTripDrop(dropObj));
    props.navigation.dispatch(StackActions.pop(1));
  };

  const reloadLocation = () => {
    if (
      (selLocationsDrop && selLocationsDrop.length > 0) ||
      searchKeywordDrop == []
    ) {
      dispatch(
        updateTripDrop({
          lat: currentLocation.lat,
          lng: currentLocation.lng,
          add: currentLocation.add,
          source: "default",
        })
      );
    }
    if (selLocationsPickup && selLocationsPickup.length > 0) {
      dispatch(
        updateTripPickup({
          lat: currentLocation.lat,
          lng: currentLocation.lng,
          add: currentLocation.add,
          source: "search",
        })
      );
    }
  };
  const saveLocation = (item) => {
    setLoading(true);
    if (
      item &&
      saveNameValue &&
      ((saveNameValue == t("other") && addressName) ||
        saveNameValue != t("other"))
    ) {
      let name = saveNameValue == t("other") ? addressName : saveNameValue;
      fetchCoordsfromPlace(item.place_id).then((res) => {
        if (res && res.lat) {
          let dropObj = {
            lat: res.lat,
            lng: res.lng,
            description: item.description,
            name: name.toLowerCase(),
          };
          dispatch(editAddress(profile.uid, dropObj, "Add"));
        }
      });
      setTimeout(() => {
        setAddress("");
        setAddressName("");
        setLoading(false);
        setSearchKeyword2("");
        setSaveNameValue("");
      }, 3000);
    } else {
      Alert.alert(t("alert"), t("no_details_error"), [
        {
          text: t("ok"),
          onPress: () => {
            setLoading(false);
          },
        },
      ]);
    }
  };

  const removeItem = (index) => {
    let arr = [...selLocations];
    arr.splice(index, 1);
    setSelLocations(arr);
  };

  const onPressDelete = (item) => {
    dispatch(editAddress(profile.uid, item, "Delete"));
  };

  const closeModel = () => {
    setSearchKeyword2("");
    setAddressName("");
    setAddress("");
    setModalVisible(!modalVisible);
    setSaveNameValue("");
  };

  const cancelAddress = () => {
    setSearchKeyword2("");
    setAddressName("");
    setAddress("");
    setSaveNameValue("");
  };
  const removePickupItem = (index) => {
    let arr = [...selLocationsPickup];
    arr.splice(index, 1);
    setSelLocationsPickup(arr);
  };

  const removeDropItem = (index) => {
    let arr1 = [...selLocationsDrop];
    arr1.splice(index, 1);
    setSelLocationsDrop(arr1);
  };
  // console.log("drop: ", selLocationsDrop);
  console.log(locationTypes);

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.TRANSPARENT,
          height: "100%",
          width: "100%",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: width - 20,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 10,
            //marginLeft: "2%",
          }}
        >
          <Button
            title={"To Airport"}
            titleStyle={{
              color: toairportSelect ? colors.WHITE : colors.BLUE,
              fontSize: 20,
            }}
            onPress={() => {
              setToairportSelect(true),
                setFromairportSelect(false),
                reloadLocation();
            }}
            icon={{
              name: "airplane-takeoff",
              type: "material-community",
              size: 30,
              color: toairportSelect ? colors.WHITE : colors.BLUE,
            }}
            buttonStyle={[
              {
                backgroundColor: toairportSelect ? colors.BLUE : colors.WHITE,
                width: 160,
                borderWidth: 2,
                borderColor: colors.BLUE,
                elevation: 20,
              },
            ]}
          />
          <Button
            title={"From Airport"}
            titleStyle={{
              color: fromairportSelect ? colors.WHITE : colors.BLUE,
              fontSize: 20,
              marginRight: 7,
            }}
            onPress={() => {
              setFromairportSelect(true),
                setToairportSelect(false),
                reloadLocation();
            }}
            icon={{
              name: "car",
              type: "material-community",
              size: 30,
              color: fromairportSelect ? colors.WHITE : colors.BLUE,
            }}
            buttonStyle={[
              {
                backgroundColor: fromairportSelect ? colors.BLUE : colors.WHITE,
                width: 160,
                borderWidth: 2,
                borderColor: colors.BLUE,
                elevation: 20,
              },
            ]}
          />
        </View>
        <View>
          <Text
            style={{
              color: colors.BLUE,
              fontWeight: "bold",
              fontSize: 24,
              alignSelf: "center",
              marginTop:
                Platform.OS == "android"
                  ? __DEV__
                    ? 20
                    : 20
                  : hasNotch
                  ? 48
                  : 20,
            }}
          >
            {toairportSelect
              ? "To Salt Lake City Airport"
              : "From Salt Lake City Airport"}
          </Text>
        </View>

        {fromairportSelect ? (
          <>
            {hidePic ? null : (
              <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={datas}
                returnKeyType="search"
                maxHeight={300}
                labelField="add"
                valueField="add"
                placeholder={!isFocus ? "Select an airport" : "..."}
                searchPlaceholder="Search..."
                value={add}
                onFocus={() => {
                  setIsFocus(true), changepickup();
                }}
                onBlur={() => setIsFocus(false)}
                onChange={(text) => {
                  updateSelectLocation(text), changepickup();
                }}
                renderRightIcon={() => (
                  <Icon
                    name="chevron-down"
                    type="material-community"
                    color={colors.BLUE}
                    size={35}
                    style={[
                      { marginEnd: 0 },
                      isRTL ? { left: 0, right: 5 } : { left: 5, right: 0 },
                    ]}
                  />
                )}
                renderLeftIcon={() => (
                  <Icon
                    name="airplane-takeoff"
                    type="material-community"
                    color={colors.BLUE}
                    size={35}
                    style={[
                      { marginEnd: 15 },
                      isRTL ? { left: 0, right: 5 } : { left: 5, right: 0 },
                    ]}
                  />
                )}
              />
            )}
          </>
        ) : (
          <View
            style={[
              styles.autocompleteMain,
              { flexDirection: isRTL ? "row-reverse" : "row" },
            ]}
          >
            <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <Icon
                name={
                  fromairportSelect ? "airplane-takeoff" : "map-marker-outline"
                }
                type="material-community"
                color={colors.BALANCE_GREEN}
                size={35}
                style={[isRTL ? { left: 0, right: 5 } : { left: 5, right: 0 }]}
              />
            </TouchableOpacity>

            {selLocationsPickup && selLocationsPickup.length > 0 ? (
              <View
                style={{
                  flexDirection: "row",
                  width: "90%",
                  alignItems: "center",
                  height: 70,
                }}
              >
                <Text
                  style={{
                    paddingLeft: 10,
                    width: width - 100,
                    color: colors.BLACK,
                    fontFamily: "Uber Move",
                    fontStyle: "normal",
                    fontWeight: "500",
                    lineHeight: 24,
                    fontSize: 20,
                  }}
                  numberOfLines={1}
                >
                  {selLocationsPickup[0].add}
                </Text>
                <TouchableOpacity
                  style={{ paddingLeft: 0 }}
                  onPress={() => removePickupItem(selLocationsPickup[0])}
                >
                  <Icon
                    name="close-sharp"
                    type="ionicon"
                    color="#1d74e7"
                    size={30}
                    style={[
                      isRTL ? { left: 0, right: 5 } : { left: 5, right: 0 },
                    ]}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    width: "90%",
                    alignItems: "center",
                    height: 70,
                  }}
                >
                  <TextInput
                    placeholder={"Enter pickup Address"}
                    returnKeyType="search"
                    style={[
                      styles.searchBox,
                      isRTL
                        ? { paddingRight: 15, textAlign: "right" }
                        : { paddingLeft: 15, textAlign: "left" },
                    ]}
                    placeholderTextColor="#000"
                    onChangeText={(text) => {
                      {
                        searchLocation(text), changepickup(), setHideDrop(true);
                      }
                    }}
                    // value={searchKeywordPickup}
                  />
                </View>
              </>
            )}
          </View>
        )}

        {toairportSelect ? (
          <>
            {hideDrop ? null : (
              <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={datas}
                returnKeyType="default"
                maxHeight={300}
                labelField="add"
                valueField="add"
                placeholder={!isFocus ? "Select an airport" : "..."}
                searchPlaceholder="Search..."
                value={add}
                onFocus={() => {
                  setIsFocus(true), changedrop();
                }}
                onBlur={() => setIsFocus(false)}
                onChange={(text) => {
                  updateSelectLocation(text), changedrop();
                }}
                renderRightIcon={() => (
                  <Icon
                    name="chevron-down"
                    type="material-community"
                    color={colors.BLUE}
                    size={35}
                    style={[
                      { marginEnd: 15 },
                      isRTL ? { left: 0, right: 5 } : { left: 5, right: 0 },
                    ]}
                  />
                )}
                renderLeftIcon={() => (
                  <Icon
                    name="airplane-takeoff"
                    type="material-community"
                    color={colors.BLUE}
                    size={35}
                    style={[
                      { marginEnd: 15 },
                      isRTL ? { left: 0, right: 5 } : { left: 5, right: 0 },
                    ]}
                  />
                )}
              />
            )}
          </>
        ) : (
          <View
            style={[
              styles.autocompleteMain,
              { flexDirection: isRTL ? "row-reverse" : "row" },
            ]}
          >
            <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <Icon
                name={toairportSelect ? "airplane-takeoff" : "magnify"}
                type="material-community"
                color={colors.BLUE}
                size={35}
                style={[isRTL ? { left: 0, right: 5 } : { left: 5, right: 0 }]}
              />
            </TouchableOpacity>

            {selLocationsDrop && selLocationsDrop.length > 0 ? (
              <View
                style={{
                  flexDirection: "row",
                  width: "90%",
                  alignItems: "center",
                  height: 70,
                }}
              >
                <Text
                  style={{
                    paddingLeft: 10,
                    width: width - 100,
                    color: colors.BLACK,
                    fontFamily: "Uber Move",
                    fontStyle: "normal",
                    fontWeight: "500",
                    lineHeight: 24,
                    fontSize: 20,
                  }}
                  numberOfLines={1}
                >
                  {selLocationsDrop[0].add}
                </Text>
                <TouchableOpacity
                  style={{ paddingLeft: 0, marginEnd: 5 }}
                  onPress={() => removeDropItem(selLocationsDrop[0])}
                >
                  <Icon
                    name="close-sharp"
                    type="ionicon"
                    color="#1d74e7"
                    size={30}
                    style={[
                      isRTL ? { left: 0, right: 5 } : { left: 5, right: 0 },
                    ]}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    width: "90%",
                    alignItems: "center",
                    height: 70,
                  }}
                >
                  <TextInput
                    placeholder={"Enter Drop Off Address"}
                    returnKeyType="default"
                    style={[
                      styles.searchBox,
                      isRTL
                        ? { paddingRight: 15, textAlign: "right" }
                        : { paddingLeft: 15, textAlign: "left" },
                    ]}
                    placeholderTextColor="#000"
                    onChangeText={(text) => {
                      searchLocation(text), changedrop(), setHidePic(true);
                    }}
                    // value={searchKeywordDrop}
                  />
                </View>
              </>
            )}
          </View>
        )}

        {!searchKeyword ? (
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={[
              styles.saveBox,
              { flexDirection: isRTL ? "row-reverse" : "row" },
            ]}
          >
            <View style={{ height: 45, justifyContent: "center" }}>
              <Text
                style={{ textAlign: isRTL ? "right" : "left", fontSize: 20 }}
              >
                {t("saved_address")}
              </Text>
            </View>
            <MaterialIcons
              name={isRTL ? "keyboard-arrow-left" : "keyboard-arrow-right"}
              size={34}
              color={colors.BLUE}
            />
          </TouchableOpacity>
        ) : null}

        {searchKeyword && isShowingResults ? (
          <FlatList
            keyboardShouldPersistTaps="always"
            data={searchResults}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  key={item.description}
                  style={styles.resultItem}
                  onPress={() => updateLocation(item)}
                >
                  <Icon
                    name={"location-sharp"}
                    type={"ionicon"}
                    size={25}
                    color="#1d74e7"
                  />
                  <View style={{ display: "flex", flexDirection: "column" }}>
                    <Text
                      numberOfLines={3}
                      style={[
                        styles.lat,
                        {
                          fontSize: 16,
                          textAlign: isRTL ? "right" : "left",
                          width: width - 60,
                          color: colors.BLUE,
                        },
                      ]}
                    >
                      {item.description.split(",", 1)}
                    </Text>
                    <Text
                      numberOfLines={3}
                      style={[
                        styles.lat,
                        {
                          fontSize: 16,
                          textAlign: isRTL ? "right" : "left",
                          width: width - 60,
                          color: colors.BLUE,
                        },
                      ]}
                    >
                      {item.description.substring(
                        item.description.indexOf(",") + 1
                      )}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
            style={styles.searchResultsContainer}
          />
        ) : null}

        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator color={colors.BLUE} size="large" />
          </View>
        ) : null}
        {(selLocationsDrop.length > 0 && locationType == "drop") ||
        (selLocationsPickup.length > 0 && locationType == "pickup") ? (
          <TouchableOpacity
            onPress={() => props.navigation.goBack()}
            style={styles.floting}
          >
            <Text style={styles.headerTitleStyle}>{t("ok")}</Text>
          </TouchableOpacity>
        ) : null}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <View
            style={[styles.centeredView, { marginTop: hasNotch ? 35 : null }]}
          >
            <View style={styles.modalView}>
              <View
                style={{
                  flexDirection: isRTL ? "row-reverse" : "row",
                  alignItems: "center",
                  backgroundColor: MAIN_COLOR,
                }}
              >
                <View style={{ width: 40, height: 45 }}>
                  {(searchKeyword2 && isShowingResults2) ||
                  address ||
                  addressName ? (
                    !address ? (
                      <Entypo
                        name="cross"
                        size={35}
                        color={colors.WHITE}
                        onPress={() => searchSaveLocation()}
                        style={{ marginTop: 4 }}
                      />
                    ) : null
                  ) : (
                    <MaterialIcons
                      name={
                        isRTL ? "keyboard-arrow-right" : "keyboard-arrow-left"
                      }
                      size={40}
                      color={colors.WHITE}
                      onPress={() => closeModel()}
                    />
                  )}
                </View>
                <View style={styles.savedbox}>
                  <Text style={styles.savesadd}>{t("saved_address")}</Text>
                </View>
              </View>
            </View>

            <View style={{ height: 65, alignItems: "center" }}>
              {(searchKeyword2 && isShowingResults2) ||
              address ||
              addressName ? (
                <View
                  style={{
                    height: 10,
                    width: width,
                    backgroundColor: MAIN_COLOR,
                  }}
                >
                  <View
                    style={{
                      height: 10,
                      width: width,
                      backgroundColor: colors.WHITE,
                      borderTopRightRadius: 10,
                      borderTopLeftRadius: 10,
                    }}
                  ></View>
                </View>
              ) : null}

              <View
                style={[
                  styles.addressStyle2,
                  {
                    borderRadius: 15,
                    marginTop:
                      (searchKeyword2 && isShowingResults2) ||
                      address ||
                      addressName
                        ? 0
                        : 10,
                  },
                ]}
              >
                <View
                  style={[
                    styles.autocompleteMain,
                    { flexDirection: isRTL ? "row-reverse" : "row" },
                  ]}
                >
                  <FontAwesome
                    name="search"
                    size={20}
                    color={colors.BLUE}
                    style={{ marginHorizontal: 5 }}
                  />
                  <TextInput
                    placeholder={t("search_for_an_address")}
                    returnKeyType="search"
                    style={[
                      styles.searchBox,
                      isRTL
                        ? { textAlign: "right" }
                        : { textAlign: "left", width: width - 75 },
                    ]}
                    placeholderTextColor={colors.BLACK}
                    onChangeText={(text) => searchSaveLocation(text)}
                    value={address ? address.description : searchKeyword2}
                  />
                  {address ? (
                    <TouchableOpacity
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        height: 48,
                      }}
                      onPress={() => setAddress("")}
                    >
                      <Entypo
                        name="cross"
                        size={24}
                        color={colors.BLUE}
                        style={{}}
                      />
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>

              {address ? (
                <View
                  style={[
                    styles.categoryBox,
                    { display: "flex", flexDirection: "column" },
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => cancelAddress()}
                    loading={false}
                  >
                    <Text
                      style={[
                        styles.buttonTitle,
                        {
                          fontSize: 20,
                          fontWeight: "700",
                          margin: 10,
                          color: "gray",
                        },
                      ]}
                    >
                      {t("cancel")}
                    </Text>
                  </TouchableOpacity>
                  <View
                    style={[
                      {
                        flexDirection: isRTL ? "row-reverse" : "row",
                        paddingTop: 10,
                        marginLeft: 20,
                      },
                    ]}
                  >
                    {saveName.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.categoryItem,
                          {
                            backgroundColor:
                              item.value == saveNameValue
                                ? MAIN_COLOR
                                : colors.WHITE,
                            marginHorizontal: 8,
                          },
                        ]}
                        onPress={() => {
                          setSaveNameValue(item.value);
                        }}
                      >
                        <Icon
                          name={item.icon}
                          type={item.type}
                          color={
                            item.value == saveNameValue
                              ? colors.WHITE
                              : colors.BLUE
                          }
                          size={40}
                          containerStyle={{ margin: 1 }}
                        />
                        {/* <Text style={styles.categoryLabel}>{item.lable}</Text> */}
                      </TouchableOpacity>
                    ))}
                  </View>
                  {address && saveNameValue == t("other") ? (
                    <View
                      style={{
                        width: width - 40,
                        marginLeft: 20,
                        marginTop: 40,
                      }}
                    >
                      <TextInput
                        style={{
                          borderBottomColor: colors.BLUE,
                          borderBottomWidth: 1,
                          height: 40,
                        }}
                        placeholder={t("name")}
                        placeholderTextColor={colors.SECONDARY}
                        value={addressName ? addressName : ""}
                        keyboardType={"email-address"}
                        onChangeText={(text) => {
                          setAddressName(text);
                        }}
                        secureTextEntry={false}
                        blurOnSubmit={true}
                        errorStyle={styles.errorMessageStyle}
                        inputContainerStyle={[
                          styles.inputContainerStyle,
                          { height: 50 },
                        ]}
                        autoCapitalize="none"
                      />
                    </View>
                  ) : null}

                  <View
                    style={{
                      flexDirection: isRTL ? "row-reverse" : "row",
                      width: width,
                      justifyContent: "space-evenly",
                    }}
                  >
                    <Button
                      onPress={() => saveLocation(address)}
                      title={"Save Location"}
                      loading={loading}
                      titleStyle={styles.buttonTitle}
                      buttonStyle={[styles.registerButton, { marginTop: 20 }]}
                    />
                  </View>
                </View>
              ) : null}
            </View>

            {searchKeyword2 && isShowingResults2 && !address ? (
              <FlatList
                keyboardShouldPersistTaps="always"
                data={searchResults2}
                renderItem={({ item, index }) => {
                  return (
                    <TouchableOpacity
                      key={item.description}
                      style={styles.resultItem}
                      onPress={() => setAddress(item)}
                    >
                      <Icon
                        name={"location-sharp"}
                        type={"ionicon"}
                        size={25}
                        color="#1d74e7"
                      />
                      <View
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <Text
                          numberOfLines={3}
                          style={[
                            styles.lat,
                            {
                              fontSize: 16,
                              textAlign: isRTL ? "right" : "left",
                              width: width - 60,
                              color: colors.BLUE,
                            },
                          ]}
                        >
                          {item.description.split(",", 1)}
                        </Text>
                        <Text
                          numberOfLines={3}
                          style={[
                            styles.lat,
                            {
                              fontSize: 16,
                              textAlign: isRTL ? "right" : "left",
                              width: width - 60,
                              color: colors.BLUE,
                            },
                          ]}
                        >
                          {item.description.substring(
                            item.description.indexOf(",") + 1
                          )}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
                style={[styles.searchResultsContainer, { marginTop: 10 }]}
              />
            ) : null}

            {(searchKeyword2 && isShowingResults2) ||
            address ||
            addressName ? null : (
              <View style={styles.savedaddlist}>
                <ScrollView
                  style={{ flex: 1, width: width - 15, height: "auto" }}
                  showsVerticalScrollIndicator={false}
                >
                  {savedAddresses && savedAddresses.length > 0 ? (
                    savedAddresses.map((address, index) => {
                      return (
                        <View
                          key={index}
                          style={{
                            flexDirection: isRTL ? "row-reverse" : "row",
                            borderBottomWidth: 1,
                            width: width - 15,
                            minHeight: 60,
                            paddingVertical: 5,
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => {
                              updateLocation(address), closeModel();
                            }}
                            style={{
                              flexDirection: isRTL ? "row-reverse" : "row",
                              alignItems: "center",
                              width: width - 50,
                            }}
                          >
                            <View style={styles.vew1}>
                              {address.name == "home" ? (
                                <MaterialIcons
                                  name="house"
                                  size={22}
                                  color={colors.BLUE}
                                />
                              ) : address.name == "work" ? (
                                <MaterialIcons
                                  name="business-center"
                                  size={22}
                                  color={colors.BLUE}
                                />
                              ) : address.name == "restaurant" ? (
                                <MaterialIcons
                                  name="restaurant"
                                  size={22}
                                  color={colors.BLUE}
                                />
                              ) : address.name == "school" ? (
                                <MaterialIcons
                                  name="school"
                                  size={22}
                                  color={colors.BLUE}
                                />
                              ) : (
                                <MaterialIcons
                                  name="location-pin"
                                  size={22}
                                  color={colors.BLUE}
                                />
                              )}
                            </View>
                            <View
                              style={{
                                justifyContent: "center",
                                width: width - 95,
                                marginHorizontal: 5,
                              }}
                            >
                              <Text
                                style={[
                                  styles.savedAddressesBox,
                                  { textAlign: isRTL ? "right" : "left" },
                                ]}
                              >
                                {address.name.toUpperCase()}
                              </Text>
                              <Text
                                style={[
                                  styles.savedAddressesBox,
                                  {
                                    textAlign: isRTL ? "right" : "left",
                                    fontSize: 13,
                                  },
                                ]}
                              >
                                {address.description}
                              </Text>
                            </View>
                          </TouchableOpacity>
                          <View style={{ width: 30 }}>
                            <MaterialCommunityIcons
                              name="delete-circle-outline"
                              size={28}
                              color={colors.RED}
                              onPress={() => onPressDelete(address)}
                            />
                          </View>
                        </View>
                      );
                    })
                  ) : (
                    <View style={styles.nosavedadd}>
                      <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                        {t("no_saved_address")}
                      </Text>
                    </View>
                  )}
                </ScrollView>
              </View>
            )}
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  floting: {
    width: "70%",
    height: 45,
    position: "absolute",
    bottom: 40,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 10,
    backgroundColor: colors.BLUE,
    shadowColor: colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  loading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 40,
  },
  autocompleteMain: {
    backgroundColor: colors.WHITE,
    alignItems: "center",
    marginHorizontal: 15,
    borderRadius: 10,
    height: 50,
  },
  searchBox: {
    width: "90%",
    fontSize: 20,
    borderColor: "#ccc",
    color: "#000",
    backgroundColor: colors.WHITE,
    borderRadius: 10,
  },
  description: {
    color: colors.BLUE,
    textAlign: "left",
    fontSize: 18,
  },
  resultItem: {
    width: "95%",
    paddingVertical: 10,
    borderBottomColor: colors.BLUE,
    borderBottomWidth: 0.8,
    backgroundColor: colors.WHITE,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
    marginLeft: 10,
    paddingLeft: 10,
    paddingRight: 15,
  },
  searchResultsContainer: {
    width: width,
    paddingHorizontal: 5,
  },
  headerTitleStyle: {
    color: colors.WHITE,
    fontFamily: "Roboto-Bold",
    fontSize: 20,
  },
  multiLocation: {
    width: width - 50,
  },
  addressBar: {
    marginVertical: 5,
    width: width - 10,
    flexDirection: "row",
    backgroundColor: colors.WHITE,
    shadowColor: colors.BLACK,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    borderRadius: 8,
    elevation: 3,
  },
  contentStyle: {
    justifyContent: "center",
    width: width,
    alignItems: "center",
  },
  addressBox: {
    height: 48,
    width: width - 20,
    alignItems: "center",
    paddingTop: 2,
  },
  addressStyle1: {
    borderBottomColor: colors.BLACK,
    borderBottomWidth: 1,
    height: 48,
    width: width - 55,
    alignItems: "center",
  },
  addressStyle2: {
    height: 45,
    width: width - 15,
    justifyContent: "center",
    marginTop: 2,
    elevation: 20,
  },
  hbox1: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: colors.GREEN_DOT,
    marginHorizontal: 3,
  },
  hbox3: {
    height: 12,
    width: 12,
    backgroundColor: colors.RED,
    marginHorizontal: 5,
  },
  textStyle: {
    fontFamily: "Roboto-Regular",
    fontSize: 14,
    color: colors.BLACK,
    width: width - 36,
  },
  saveBox: {
    height: 50,
    width: width - 30,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: colors.WHITE,
    shadowColor: colors.BLACK,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    borderRadius: 10,
    elevation: 3,
    marginTop: 20,
  },
  centeredView: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  modalView: {
    backgroundColor: colors.WHITE,
    shadowColor: colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  vew1: {
    backgroundColor: colors.WHITE,
    borderRadius: 30,
    marginHorizontal: 5,
    padding: 5,
    shadowColor: colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 3,
    shadowRadius: 2,
    elevation: 2,
  },
  savedAddressesBox: {
    fontFamily: "Roboto-Regular",
    color: colors.BLACK,
    fontSize: 16,
  },
  buttonTitle: {
    fontSize: 20,
  },
  registerButton: {
    backgroundColor: colors.GREEN_DOT,
    width: width - 40,
    height: 50,
    borderWidth: 0,
    marginTop: 30,
    borderRadius: 15,
  },
  registerButton1: {
    width: 120,
    height: 45,
    borderWidth: 0,
    marginTop: 30,
    borderRadius: 15,
  },

  floatButton: {
    borderWidth: 1,
    borderColor: colors.BLACK,
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    position: "absolute",
    right: 10,
    height: 60,
    backgroundColor: colors.BLACK,
    borderRadius: 30,
  },
  savedbox: {
    height: 45,
    width: width - 80,
    justifyContent: "center",
  },
  savesadd: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: colors.WHITE,
  },
  savedaddlist: {
    flex: 1,
    backgroundColor: colors.WHITE,
    shadowColor: colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    width: width,
  },
  nosavedadd: {
    flex: 1,
    width: width - 15,
    alignItems: "center",
    backgroundColor: colors.WHITE,
    marginTop: 50,
  },
  dropremove: {
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: colors.BLACK,
    borderBottomWidth: 1,
    height: 48,
  },
  categoryBox: {
    height: height - 40,
    width: width,
    marginTop: 15,
    backgroundColor: colors.WHITE,
    shadowColor: colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  categoryItem: {
    height: 50,
    width: 50,
    marginVertical: 5,
    paddingVertical: 5,
    backgroundColor: colors.WHITE,
    justifyContent: "center",
    alignItems: "center",
    justifyContent: "space-evenly",
    borderRadius: 20,
  },
  categoryLabel: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
  },
  multiAddressStyle: {
    borderBottomColor: colors.BLACK,
    borderBottomWidth: 1,
    height: 48,
    width: width - 55,
    alignItems: "center",
    width: width - 80,
  },
  multiAddressChar: {
    height: 20,
    width: 20,
    marginHorizontal: 3,
    borderWidth: 1,
    backgroundColor: colors.SECONDARY,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  dropdown: {
    height: 70,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginTop: 20,
    marginBottom: 5,
    width: width - 30,
    marginLeft: 5,
    elevation: 20,
    backgroundColor: colors.WHITE,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 20,
  },
  placeholderStyle: {
    fontSize: 21,
  },
  selectedTextStyle: {
    fontSize: 18,
  },
  iconStyle: {
    width: 0,
    height: 0,
    Color: colors.BLUE,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 18,
  },
});
