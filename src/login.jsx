import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Nav from "./nav.jsx"



export default class App extends React.Component {
render(){
return (

<div>
  <Nav />
  <div className="space"></div>
  <div className="box center">
    <div className="pod form">
      <h1>Login</h1>
      Email:<br></br>
      <input type="text" name="email" id="email"></input><br></br>
      Password:<br></br>
      <input type="password" name="password" id="pass"></input><br></br>
      <button onClick={logButton}>Login</button>
    </div>
  </div>
  <div id="app"></div>
</div>
);
}}


function logButton() {

  let emailForm = document.getElementById("email").value;
  let passForm = document.getElementById("pass").value;
  let body = "email=" + emailForm + "&password=" + passForm

  if (validation(emailForm, passForm)) {
    return;
  }

  fetch("https://cab230.hackhouse.sh/login", {
      method: "POST",
      body: body,
      headers: {
        "Content-type": "application/x-www-form-urlencoded"
      }
    })
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Network response was not ok.");
    })
    .then(function (result) {
      let appDiv = document.getElementById("app");
      appDiv.innerHTML = JSON.stringify(result);
      document.cookie = `JWT=${result.token}`
      document.cookie = `email=${emailForm}`

      document.location.href = "/dashboard"

    })
    .catch(function (error) {
      console.log("There has been a problem with your fetch operation: ", error.message);
    });


}


function validation(x, y) {
  if (!/[@]/.test(x)) {
    let appDiv = document.getElementById("app");
    appDiv.innerHTML = "Error: Provide an email address";
    return true;
  }
  if (!/[0-9]/.test(y)) {
    let appDiv = document.getElementById("app");
    appDiv.innerHTML = "Error: Password contain a number";
    return true;
  }
}
