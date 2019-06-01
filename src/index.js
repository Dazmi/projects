import "./styles.css";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import Scroll from "./ScrollToTopRoute.js";
import { Home } from "./home";
import { Nav } from "./nav"
import { Register } from "./register"
import { Login } from "./login"
import { Dashboard } from "./dashboard"
import { Offences } from "./offences"

export const URL = 'https://cab230.hackhouse.sh'

/**
 * Created by Jayden Dao - n10003665
 * 
 * Main function which shows navigation
 */
function Main() {
  return (
    <Router>
      <Nav />
      <Scroll exact path="/" component={Home} />
      <Scroll path="/register" component={Register} />
      <Scroll path="/login" component={Login} />
      <Scroll path="/dashboard" component={Dashboard} />
      <Scroll path="/offences" component={Offences} />
      <Scroll path="/logout" component={Logout} />
    </Router>
  );
}
ReactDOM.render(<Main />, document.getElementById('root'));

/**
 * Gets contents of cookies
 * Source: https://www.w3schools.com/js/js_cookies.asp
 * @param {objectName} cname 
 */
export function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

/**
 * Validation for login and registration
 * @param {email} x 
 * @param {password} y 
 */
export function validation(x, y) {
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

/**
 * Delete all cookies when loged out
 */
function Logout(){
  document.cookie = "JWT=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "undefined=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.location.href = "/" // redirects to homepage
}

export function getSearch(){
  // Loading effect
  ReactDOM.render(<h2>Loading...</h2>, document.getElementById("app"))

  //The parameters of the call
  let offence = document.getElementById("offence")
  let area = document.getElementById("area")
  let age = document.getElementById("age")
  let gender = document.getElementById("gender")
  let year = document.getElementById("year")
  let month = document.getElementById("month")

  // Select options from dropdown
  let offenceOption = offence.options[offence.selectedIndex].value
  offenceOption = offenceOption.replace("&", "");
  let areaOption = area.options[area.selectedIndex].value
  let ageOption = age.options[age.selectedIndex].value
  let genderOption = gender.options[gender.selectedIndex].value
  let yearOption = year.options[year.selectedIndex].value
  let monthOption = month.options[month.selectedIndex].value

  //The query
  let url = `${URL}/search?`;
  if (offenceOption !== 'Select'){ // Add offence filter
    url = url + `offence=${offenceOption}`
  }
  if (areaOption !== 'Select'){ // Add area filter
    url = url + `&area=${areaOption}`;
  }
  if (ageOption !== 'Select'){ // Add age filter
    url = url + `&age=${ageOption}`;
  }
  if (genderOption !== 'Select'){ // Add gender filter
    url = url + `&gender=${genderOption}`;
  }
  if (yearOption !== 'Select'){ // Add year filter
    url = url + `&year=${yearOption}`;
  }
  if (monthOption !== 'Select'){ // Add month filter
    url = url + `&month=${monthOption}`;
  }
  console.log(url)
  return url
}