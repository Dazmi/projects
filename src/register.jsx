import React from 'react';
import { URL } from './index'
/**
 * Registration page
 */
export function Register() {
return (
<div>
  <div className="space"></div>
  <div className="box center">
    <div className="pod form">
      <h1>Register</h1>
      Email:<br></br>
      <input type="text" name="email" id="email"></input><br></br>
      Password:<br></br>
      <input type="password" name="password" id="pass"></input><br></br>
      <button onClick={regButton}>Register</button>
      <div id="app"></div>
    </div>
  </div>
</div>
);
}

/**
 * Request the server for registration
 */
function regButton() {
  let emailForm = document.getElementById("email").value;
  let passForm = document.getElementById("pass").value;
  let body = `email=${emailForm}&password=${passForm}`

  fetch(`${URL}/register`, {
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
      throw new Error("Network response was not ok");
    })
    .then(function (result) {
      let appDiv = document.getElementById("app");
      appDiv.innerHTML = "Registration Successful";
      regButton.disabled = true;
    })

    .then(function (result) {
      fetch(`${URL}/login`, {
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
          document.cookie = `JWT=${result.token}`
          document.cookie = `email=${emailForm}`
          document.location.href = "/dashboard"
        })
        .catch(function (error) {
          console.log("There has been a problem with your fetch operation: ", error.message);
        });
    })
    .catch(function (error) {
      console.log(body);
      let appDiv = document.getElementById("app");
      appDiv.innerHTML = "User already exists";
      regButton.disabled = true;
      console.log("There has been a problem with your fetch operation: ", error.message);
    });

}