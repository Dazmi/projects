import React, { useState, useEffect, Component } from "react";
import ReactDOM from "react-dom";
import {
    withGoogleMap,
    GoogleMap,
    Marker,
  } from "react-google-maps";
  
  // Emply list with objects location lats, lng
  

export function createMap(){
    const MapWithAMarker = withGoogleMap(props =>
        <GoogleMap
          defaultZoom={8}
          defaultCenter={{ lat: -34.397, lng: 150.644 }}
        >
            <Marker
            position={{ lat: -34.397, lng: 150.644 }}// marker position={} title={}
            />
        </GoogleMap>
      );
      
      let map = <MapWithAMarker
        containerElement={<div style={{ height: `400px` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
        console.log(map)
      ReactDOM.render(map, document.getElementById("app"))
    
}
