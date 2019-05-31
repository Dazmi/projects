import React from 'react';

export default function login(){
return (

<div>
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
}


function logButton() {

  let emailForm = document.getElementById("email").value;
  let passForm = document.getElementById("pass").value;
  let body = `email=${emailForm}&password=${passForm}`

  fetch("http://localhost:3000/login", {
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
