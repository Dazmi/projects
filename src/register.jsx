import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Nav from "./nav.jsx"

export default class Home extends React.Component {
render(){
return (
		<div>
      <Nav />
      <div className="space"></div>
			<div className="box center">
      <div className="pod form">
      <h1>Register</h1>
				Email:<br></br>
				<input type="text" name="email" id="email"></input><br></br>
				Password:<br></br>
				<input type="password" name="password" id="pass"></input><br></br>
				<button onClick={regButton} >Register</button>
			</div>
      </div>

      <div id="app"></div>
    </div>

);
}}

function regButton(){

  let emailForm = document.getElementById("email").value;
  let passForm = document.getElementById("pass").value;
  let body = "email=" + emailForm + "&password=" + passForm;

  if (validation(emailForm, passForm)){
    return;
  }

  fetch("https://cab230.hackhouse.sh/register", {
    method: "POST",
    body: body,
    headers: {
      "Content-type": "application/x-www-form-urlencoded"
    }
  })
    .then(function(response) {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Network response was not ok");
    })
    .then(function(result) {
      let appDiv = document.getElementById("app");
      appDiv.innerHTML = JSON.stringify(result);
      regButton.disabled = true;
    })
    .catch(function(error) {
      console.log(body);
      console.log("There has been a problem with your fetch operation: ",error.message);
    });

}

function validation(x, y){
  if (!/[@]/.test(x)){
    let appDiv = document.getElementById("app");
    appDiv.innerHTML = "Error: Provide an email address";
    return true;
  }
  if (!/[0-9]/.test(y)){
    let appDiv = document.getElementById("app");
    appDiv.innerHTML = "Error: Password contain a number";
    return true;
  }
}
