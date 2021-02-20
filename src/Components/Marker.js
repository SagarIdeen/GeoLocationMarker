import React, { useState } from "react";
import { Marker } from "react-native-maps";

const R = 6371; //Radius of the earth in km

function MarkerComponent({ data, calculatedDist }) {
  console.log("***********marker data:", data);

  let markerLength = data.length - 1;
  let markerLength2 = data.length - 2;
  let counter = 0;
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
    let dm = d * 1000; // Distance in km
    console.log("**********************distance**********", d, dm);
    calculatedDist(d);
    // return calculatedDist;
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  return data.map((marker, index) => (
    <Marker
      key={index.toString()}
      coordinate={marker.latlang}
      title={(index + 1).toString()}
    />
  ));
}

export default MarkerComponent;
