import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
// import Marker from "../Components/Marker";

const R = 6371; //Radius of the earth in km
// const { width, height } = Dimensions.get("window");
// const ASPECT_RATIO = width / height;
// const LATITUDE_DELTA = 0.0922;
// const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

function GeoMap(props) {
  const [location, setLocation] = useState(null);
  const [markerList, setmarkerList] = useState([]);
  const [markerList2, setmarkerList2] = useState([]);
  const [sideDistance, setSideDistance] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [buttonS, setButtonS] = useState(false);

  // function randomColor() {
  //   return `#${Math.floor(Math.random() * 16777215)
  //     .toString(16)
  //     .padStart(6, 0)}`;
  // }

  const getLocation = async () => {
    try {
      let { status } = await Location.requestPermissionsAsync();
      if (status != "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setmarkerList([
        {
          latlang: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
          // color: randomColor(),
        },
      ]);
      setmarkerList2([
        {
          latlang: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
          // color: randomColor(),
        },
      ]);
      setLocation(location);
    } catch (error) {
      console.log("error:", error);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    console.log("***", sideDistance);
  }, [sideDistance]);

  useEffect(() => {
    console.log("markerList on add:", markerList);
    setButtonS(false);
    calculateDistance(markerList);
  }, [markerList]);

  const addMarker = async () => {
    setButtonS(true);
    try {
      let location = await Location.getCurrentPositionAsync({});
      setmarkerList([
        ...markerList,
        {
          latlang: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
          // color: randomColor(),
        },
      ]);
      setmarkerList2([
        ...markerList,
        {
          latlang: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
          // color: randomColor(),
        },
      ]);
      // console.log("markerList on add:", markerList);
      // calculateDistance(markerList);
    } catch (error) {
      console.log("error", error);
    }
  };

  const removeMarker = () => {
    if (markerList.length >= 1) {
      let dist = sideDistance;
      dist.pop();
      setSideDistance(dist);
      console.log("--", sideDistance);
    }
    let data = markerList;
    data.pop();
    setmarkerList2(data);
    setToggle(!toggle);
    setmarkerList(data);
    console.log("onREmove :", markerList);
  };

  const calculateDistance = (data) => {
    let markerLength = data.length - 1;
    let markerLength2 = data.length - 2;
    if (data.length >= 2) {
      let lat1 = data[markerLength2].latlang.latitude;
      let lon1 = data[markerLength2].latlang.longitude;
      let lat2 = data[markerLength].latlang.latitude;
      let lon2 = data[markerLength].latlang.longitude;
      console.log("latlan1:", lat1, lon1);
      console.log("latlan2:", lat2, lon2);

      let dLat = deg2rad(lat2 - lat1); // deg2rad below
      let dLon = deg2rad(lon2 - lon1);

      let a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
          Math.cos(deg2rad(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      let d = R * c; // Distance in km
      let dm = d * 1000; // Distance in m
      console.log("**********************distance**********", d, dm);
      setSideDistance([...sideDistance, { d }]);
    }
  };
  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            // latitudeDelta: LATITUDE_DELTA,
            // longitudeDelta: LONGITUDE_DELTA,
            latitudeDelta: 0.0,
            longitudeDelta: 0.0,
          }}
          showsUserLocation={true}
          followsUserLocation={true}
          showsMyLocationButton={true}
          showsCompass={true}

          // onPress={(e) => console.log(e.nativeEvent.coordinate)}
          // onRegionChange={(data) => console.log(data)}
        >
          {toggle
            ? markerList2.map((marker, index) => (
                <>
                  <Marker
                    key={index.toString()}
                    coordinate={marker.latlang}
                    title={(index + 1).toString()}
                    // pinColor={marker.color}
                  />
                </>
              ))
            : markerList.map((marker, index) => (
                <>
                  <Marker
                    key={(index + 1).toString()}
                    coordinate={marker.latlang}
                    title={(index + 1).toString()}
                    // pinColor={marker.color}
                  />
                </>
              ))}
        </MapView>
      ) : null}

      <TouchableOpacity
        style={{
          width: 100,
          height: 40,
          backgroundColor: "green",
          position: "absolute",
          bottom: 25,
          right: "20%",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 15,
        }}
        onPress={() => addMarker()}
        disabled={buttonS}
      >
        <Text>ADD</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          width: 100,
          height: 40,
          backgroundColor: "green",
          position: "absolute",
          bottom: 25,
          left: "20%",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 15,
        }}
        onPress={() => removeMarker()}
      >
        <Text>REMOVE</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

export default GeoMap;
