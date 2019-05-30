import React from "react";
import ReactDOM from "react-dom";
import { getCookie } from "./nav.jsx"
import {
    withGoogleMap,
    GoogleMap,
    Marker,
  } from "react-google-maps";
  
  // Emply list with objects location lats, lng

export function getArea(){
  //The parameters of the call
  let offence = document.getElementById("offence")
  let area = document.getElementById("area")
  let age = document.getElementById("age")
  let gender = document.getElementById("gender")
  let year = document.getElementById("year")
  let offenceOption = offence.options[offence.selectedIndex].value
  let areaOption = area.options[area.selectedIndex].value
  let ageOption = age.options[age.selectedIndex].value
  let genderOption = gender.options[gender.selectedIndex].value
  let yearOption = year.options[year.selectedIndex].value
  let getParam = { method: "GET" };
  let head = { Authorization: `Bearer ${getCookie("JWT")}` };
  getParam.headers = head;

  //The URL
  let baseUrl = "https://cab230.hackhouse.sh/search?";
  let url = baseUrl
  if (offenceOption !== 'Select'){
    url = url + `offence=${offenceOption}`
  }
  if (areaOption !== 'Select'){
    url = url + `&area=${areaOption}`;
  }
  if (ageOption !== 'Select'){
    url = url + `&age=${ageOption}`;
  }
  if (genderOption !== 'Select'){
    url = url + `&gender=${genderOption}`;
  }
  if (yearOption !== 'Select'){
    url = url + `&year=${yearOption}`;
  }
  console.log(url)
  fetch(encodeURI(url),getParam)
    //.then(res => res.json())
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

export function getAreas() {
  const url = `https://cab230.hackhouse.sh/search?offence=Assault`;
  console.log(url)
  let getParam = { method: "GET" };
  let head = { Authorization: `Bearer ${getCookie("JWT")}` };
  getParam.headers = head;

  fetch(encodeURI(url),getParam)
  //.then(res => res.json())
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

export function createMap(props){
  let marker = [];
  
  {props.result.map(function(props) {
    if (props.total !== 0){
    marker.push(<Marker
    position={{ lat: props.lat, lng: props.lng }}
    title={props.LGA + ' : ' + props.total}
    />)
    }})}

    const MapWithAMarker = withGoogleMap(props =>
        <GoogleMap
          defaultZoom={5}
          defaultCenter={{ lat: -20.9176, lng: 142.7028 }}
        >
            {marker}
        </GoogleMap>
      );
      
      let map = <MapWithAMarker
        containerElement={<div style={{ height: `700px` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
      ReactDOM.render(map, document.getElementById("app"))
    
}
