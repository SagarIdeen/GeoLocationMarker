import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker, Polygon, Polyline } from "react-native-maps";
import * as Location from "expo-location";

const R = 6371; //Radius of the earth in km

function GeoMap(props) {
  const [location, setLocation] = useState(null);
  const [markerList, setmarkerList] = useState([]);
  const [markerList2, setmarkerList2] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [buttonS, setButtonS] = useState(false);

  const [areaOfPolygon, setAreaofPolygon] = useState(0);
  const [latlon, setLatlon] = useState([]);
  const [sateliteView, setSatliteView] = useState(false);
  const [polylinedata, setPolylinedata] = useState([]);

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    // console.log("markerList on add:", markerList);
    setButtonS(false);
    if (markerList.length > 0) {
      let l = latlon;
      l.push([
        markerList[markerList.length - 1].latlang.latitude,
        markerList[markerList.length - 1].latlang.longitude,
      ]);
      // console.log("array to find area", l);
      setLatlon(l);

      setPolylinedata([
        ...polylinedata,
        {
          latitude: markerList[markerList.length - 1].latlang.latitude,
          longitude: markerList[markerList.length - 1].latlang.longitude,
        },
      ]);
    }
  }, [markerList]);

  useEffect(() => {
    console.log("a", polylinedata);
  }, [polylinedata]);

  //get current loaction
  const getLocation = async () => {
    try {
      let { status } = await Location.requestPermissionsAsync();
      if (status != "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      // setmarkerList([
      //   {
      //     latlang: {
      //       latitude: location.coords.latitude,
      //       longitude: location.coords.longitude,
      //     },
      //     // color: randomColor(),
      //   },
      // ]);
      // setmarkerList2([
      //   {
      //     latlang: {
      //       latitude: location.coords.latitude,
      //       longitude: location.coords.longitude,
      //     },
      //     // color: randomColor(),
      //   },
      // ]);
      setLocation(location);
    } catch (error) {
      console.log("error:", error);
    }
  };

  //add marker
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
    } catch (error) {
      console.log("error", error);
    }
  };

  const onLOngPressOnMap = (e) => {
    console.log(e.nativeEvent.coordinate);
    setmarkerList([
      ...markerList,
      {
        latlang: {
          latitude: e.nativeEvent.coordinate.latitude,
          longitude: e.nativeEvent.coordinate.longitude,
        },
        // color: randomColor(),
      },
    ]);
    setmarkerList2([
      ...markerList,
      {
        latlang: {
          latitude: e.nativeEvent.coordinate.latitude,
          longitude: e.nativeEvent.coordinate.longitude,
        },
        // color: randomColor(),
      },
    ]);
  };

  //remove marker
  const removeMarker = () => {
    setAreaofPolygon(0);
    let p = polylinedata;
    p.pop();
    setPolylinedata(p);
    console.log(p);

    let l = latlon;
    l.pop();
    setLatlon(l);
    // console.log(l);

    let data = markerList;
    data.pop();
    setmarkerList2(data);
    setToggle(!toggle);
    setmarkerList(data);
    // console.log("onREmove :", markerList);
  };

  function latlontocart(data) {
    let latAnchor = data[0][0];
    let lonAnchor = data[0][1];
    let x = 0;
    let y = 0;
    let R = 6378137; //radius of earth

    let pos = [];

    for (let i = 0; i < latlon.length; i++) {
      let xPos =
        (data[i][1] - lonAnchor) * ConvertToRadian(R) * Math.cos(latAnchor);
      let yPos = (data[i][0] - latAnchor) * ConvertToRadian(R);

      pos.push(xPos, yPos);
    }
    return pos;
  }

  function ConvertToRadian(input) {
    return (input * Math.PI) / 180;
  }

  function GetArea(polygon) {
    const length = polygon.length;

    let sum = 0;

    for (let i = 0; i < length; i += 2) {
      sum +=
        polygon[i] * polygon[(i + 3) % length] -
        polygon[i + 1] * polygon[(i + 2) % length];
    }

    console.log(Math.abs(sum) * 0.5, "square metres");
    setAreaofPolygon(Math.abs(sum) * 0.5);
  }

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          showsUserLocation={true}
          followsUserLocation={true}
          showsMyLocationButton={true}
          showsCompass={true}
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            // latitudeDelta: LATITUDE_DELTA,
            // longitudeDelta: LONGITUDE_DELTA,
            latitudeDelta: 0.0,
            longitudeDelta: 0.0,
          }}
          mapType={sateliteView ? "satellite" : "standard"}
          onLongPress={(e) => onLOngPressOnMap(e)}
        >
          {polylinedata.length > 0 ? (
            <Polygon
              coordinates={[
                ...polylinedata,
                {
                  latitude: markerList[0].latlang.latitude,
                  longitude: markerList[0].latlang.longitude,
                },
              ]}
              strokeColor="red" // fallback for when `strokeColors` is not supported by the map-provider
              strokeWidth={2}
              fillColor="rgba(255,0,0,0.2)"
            />
          ) : null}
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
          width: 60,
          height: 40,
          backgroundColor: "dodgerblue",
          position: "absolute",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 10,
          right: 30,
          top: 80,
        }}
        onPress={() => setSatliteView(!sateliteView)}
      >
        <Text>{sateliteView ? "satellite" : "standard"}</Text>
      </TouchableOpacity>
      <Text
        style={{
          position: "absolute",
          bottom: 80,
          fontSize: 30,
          left: 30,
          color: "red",
        }}
      >
        Area : {areaOfPolygon}
      </Text>
      <View
        style={{
          position: "absolute",
          flexDirection: "row-reverse",
          width: "100%",
          bottom: 25,
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <TouchableOpacity
          style={{
            width: 100,
            height: 40,
            backgroundColor: "green",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 15,
            left: 0,
          }}
          onPress={() => {
            latlon.length === 0
              ? console.log("error")
              : GetArea(latlontocart(latlon));
          }}
        >
          <Text>AREA</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            width: 100,
            height: 40,
            backgroundColor: "green",
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
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 15,
          }}
          onPress={() => removeMarker()}
        >
          <Text>REMOVE</Text>
        </TouchableOpacity>
      </View>
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
    // width: Dimensions.get("window").width,
    // height: Dimensions.get("window").height,
    ...StyleSheet.absoluteFillObject,
  },
});

export default GeoMap;
