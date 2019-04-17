import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import logo from './img/jdot white.png';
import { Chart } from "react-google-charts";

import "./styles.css";
/**
 * Main function which shows navigation
 */
function Main() {
  return (
    <Router>
      <nav>
      <Link to="/"><img id="logo" src={logo} alt="logo"></img></Link>
        <ul>
          <li className="gap"></li>
          
          <li>
            <Link to="/register">Register</Link>
          </li>
          <li>
            <Link to="/search">Search</Link>
          </li>
        </ul>
      </nav>

      <Route exact path="/" component={Home} />
      <Route path="/register" component={Register} />
      <Route path="/search" component={Search} />
    </Router>
  );
}

// global variables
let JWT = null;
let jData = [];


/**
 * Displaying page
 */
ReactDOM.render(
  <Main />, 
  document.getElementById("root")
);

/**
 * REST POST for registration form
 */
function regButton(){

  let emailForm = document.getElementById("email").value;
  let passForm = document.getElementById("pass").value;
  let body = "email=" + emailForm + "&password=" + passForm

  if (validation(emailForm, passForm)){
    return;
  }

  fetch("http://cab230.hackhouse.sh:3000/register", {
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

/**
 * REST POST for login form
 */
function logButton() {
  
  let emailForm = document.getElementById("email").value;
  let passForm = document.getElementById("pass").value;
  let body = "email=" + emailForm + "&password=" + passForm

  if (validation(emailForm, passForm)){
    return;
  }
  
  fetch("http://cab230.hackhouse.sh:3000/login", {
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
          throw new Error("Network response was not ok.");
      })
      .then(function(result) {
          let appDiv = document.getElementById("app");
          appDiv.innerHTML = JSON.stringify(result);
          JWT = result.token;
          console.log(JWT)
      })
      .catch(function(error) {
          console.log("There has been a problem with your fetch operation: ",error.message);
      });

  
}


/**
 * Get categories with REST 
 * @param {*} category 
 */
function dataButton(category) {

  fetch("http://cab230.hackhouse.sh:3000/" + category)
      .then(function(response) {
          if (response.ok) {
              return response.json();
          }
          throw new Error("Network response was not ok.");
      })
      .then(function(result) {
          let appDiv = document.getElementById("app");
          appDiv.innerHTML = JSON.stringify(result);
      })
      .then(function() {
        ReactDOM.render(
          <Table />, 
          document.getElementById("table")
        );
      })
      .catch(function(error) {
          console.log("There has been a problem with your fetch operation: ",error.message);
      });
}

/**
 * REST GET for search query
 */
function searchButton() {
  let searchForm = document.getElementById("searchBox").value;
  //The parameters of the call
  let getParam = { method: "GET" };
  let head = { Authorization: `Bearer ${JWT}` };
  getParam.headers = head;

  valSearch(JWT);

  //The URL
  const baseUrl = "http://cab230.hackhouse.sh:3000/search?";
  const query = 'offence=' + searchForm;
  const url = baseUrl + query;

  fetch(encodeURI(url),getParam)
      .then(function(response) {
          if (response.ok) {
              return response.json();
          }
          throw new Error("Network response was not ok.");
      })
      .then(function(result) {
          let appDiv = document.getElementById("app");
          appDiv.innerHTML = JSON.stringify(result);
      })
      .catch(function(error) {
            console.log(url)
            console.log("There has been a problem with your fetch operation: ",error.message);
          });

}

/**
 * Home page JSX
 */
function Home() {
  return (
      <div className="blurbg banner">
			  <div className="pillar">  
				  <h1 className="white">Welcome</h1>
			  </div>
      </div>
  );
}

/**
 * Registration / Login page JSX
 */
function Register() {
  return (

		<div className="bluebg letter">
			<div className="pillar">
				<h1>Register / Login</h1>
				Email:<br></br>
				<input type="text" name="email" id="email"></input><br></br>
				Password:<br></br>
				<input className="form" type="password" name="password" id="pass"></input><br></br>
				<button onClick={regButton} >Register</button>
				<button onClick={logButton} >Login</button>
			</div>
      <div id="app"></div>
    </div>

  );
}




/**
 * Offence / Search page JSX
 */
function Search() {
  return (

		<div className="letter">
			<div className="pillar">
        <h2>Categories</h2>
        <button onClick={() => {dataButton("offences")}}>Offences</button>
        <button onClick={() => {dataButton("areas")}}>Areas</button>
        <button onClick={() => {dataButton("ages")}}>Ages</button>
        <button onClick={() => {dataButton("genders")}}>Genders</button>
        <button onClick={() => {dataButton("years")}}>Years</button>
				<input type="text" name="search" defaultValue="Homicide (Murder)" id="searchBox"></input>
				<button onClick={searchButton}>Search</button>
			</div>
      <div id="app"></div>
		</div>
    

  );
}



/**
 * Test for validation before sending REST query
 * @param {emailForm} x 
 * @param {passForm} y 
 */
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
function valSearch(param){
  if (param == null){
    let appDiv = document.getElementById("app");
    appDiv.innerHTML = "Error: Must login";
    return true;
  }

}


function Table(){
  return(
  <Chart
    width={'500px'}
    height={'300px'}
    chartType="Table"
    loader={<div>Loading Chart</div>}
    data={jData}
  />
  )
}