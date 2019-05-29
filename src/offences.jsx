import React, { useState, useEffect, Component } from "react";
import ReactDOM from "react-dom";


export function useTable(props) {
  const url = `https://cab230.hackhouse.sh/${props}`;
  console.log(url)

  fetch(url)
  //.then(res => res.json())
  .then(function(response) {
    if (response.ok) {
      return response.json();
    }
    throw new Error("Network response was not ok");
  })
  .then(function(result) {
    ReactDOM.render(<GetTable context={result} name={props} />, document.getElementById("app"));
  })
  .catch(function(error) {
    console.log("There has been a problem with your fetch operation: ",error.message);
  });
}


function GetTable(props){
console.log(props.context.offences)
if (props.name === "offences"){
return (
<div>
  <h1>Offences</h1>
  <table className="app">
    <tbody>
      {props.context.offences.map(headline => (
      <tr>
        <td>
          {headline}
        </td>
      </tr>
      ))}
    </tbody>
  </table>
</div>
)}
if (props.name === "areas"){
return (
<div>
  <h1>Area</h1>
  <table className="app">
    <tbody>

      {props.context.areas.map(headline => (
      <tr>
        <td>
          {headline}
        </td>
      </tr>
      ))}
    </tbody>
  </table>
</div>
)}
if (props.name === "ages") {
return (
<div>
  <h1>Ages</h1>
  <table className="app">
    <tbody>

      {props.context.ages.map(headline => (
      <tr>
        <td>
          {headline}
        </td>
      </tr>

      ))}
    </tbody>
  </table>
</div>
)}
if (props.name === "genders"){
return (
<div>
  <h1>Genders</h1>
  <table className="app">
    <tbody>
      {props.context.genders.map(headline => (
      <tr>
        <td>
          {headline}
        </td>
      </tr>
      ))}
    </tbody>
  </table>
</div>
)}
if (props.name === "years"){
return (
<div>
  <h1>Years</h1>
  <table className="app">
    <tbody>
      {props.context.years.map(headline => (
      <tr>
        <td>
          {headline}
        </td>
      </tr>
      ))}
    </tbody>
  </table>
</div>
)}

}
