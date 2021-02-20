import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import Marker from "../Components/Marker";

function GeoMap(props) {
  const [location, setLocation] = useState(null);
  const [markerList, setmarkerList] = useState([]);
  const [markerList2, setmarkerList2] = useState([]);
  const [distance, setDistance] = useState([]);
  const [toggle, setToggle] = useState(false);

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
        },
      ]);
      // setmarkerList2([
      //   {
      //     latlang: {
      //       latitude: location.coords.latitude,
      //       longitude: location.coords.longitude,
      //     },
      //   },
      // ]);
      setLocation(location);
    } catch (error) {
      console.log("error:", error);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  const addMarker = async () => {
    try {
      let location = await Location.getCurrentPositionAsync({});
      setmarkerList([
        ...markerList,
        {
          latlang: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
        },
      ]);
      // setmarkerList2([
      //   ...markerList2,
      //   {
      //     latlang: {
      //       latitude: location.coords.latitude,
      //       longitude: location.coords.longitude,
      //     },
      //   },
      // ]);
    } catch (error) {
      console.log("error", error);
    }
    // console.log("markerList: ", markerList);
    // setStatus(!status);
  };

  const removeMarker = () => {
    let data = markerList;
    data.pop();
    setmarkerList2(data);
    setToggle(!toggle);
    setmarkerList(data);
  };
  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
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
          {/* {markerList.map((marker, index) => (
            <Marker
              key={index.toString()}
              coordinate={marker.latlang}
              title={(index + 1).toString()}
            />
          ))} */}
          <Marker
            data={markerList}
            data={toggle ? markerList2 : markerList}
            calculatedDist={(dist) => {
              // setDistance([...distance, { dist }]);
              console.log("**", distance);
            }}
          />
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
