import React from "react";
import ReactDOM from "react-dom";
import { getCookie, getSearch } from "./index"
import {
    withGoogleMap,
    GoogleMap,
    Marker,
  } from "react-google-maps";

/**
 * Create a map with filters
 */
export function getMap(){
  // Use search function to filter options
  let url = getSearch()

  // Authentication parameters
  let getParam = { method: "GET" };
  let head = { Authorization: `Bearer ${getCookie("JWT")}` };
  getParam.headers = head;

  // Fetch operation
  fetch(encodeURI(url),getParam)
    .then(function(response) {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Network response was not ok");
    })
    .then(function(result) {
      createMap(result)
    })
    .catch(function(error) {
      console.log("There has been a problem with your fetch operation: ",error.message);
    });
    
}
/**
 * Create map with markers
 * @param {results} props 
 */
export function createMap(props){
  let marker = [];

  {props.result.map(function(props) {
  if (props.total !== 0){
  marker.push(
  <Marker position={{ lat: props.lat, lng: props.lng }} title={props.LGA + ' : ' + props.total} />)
  }})}

  const MapWithAMarker = withGoogleMap(props =>
  <GoogleMap defaultZoom={5} defaultCenter={{ lat: -20.9176, lng: 142.7028 }}>
    {marker}
  </GoogleMap>
  );

  let map =
  <MapWithAMarker containerElement={<div style={{ height: `700px` }} />}
  mapElement={
  <div style={{ height: `100%` }} />}
  />
  ReactDOM.render(map, document.getElementById("app"))
}
