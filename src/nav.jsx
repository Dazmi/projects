import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import logo from './img/jdotw.png';
import global from "./global.jsx"

export default class Home extends React.Component {
render(){
if (!document.cookie) {
return (
<nav>
  <Link to="/"><img id="logo" src={logo} alt="logo"></img></Link>
  <ul>
    <li className="gap"></li>

    <li>
      <Link to="/register">Register</Link>
    </li> 
    <li>
      <Link to="/login">Login</Link>
    </li>
  </ul>
</nav>
);
}
 
else {
  return (
  <nav>
  <Link to="/"><img id="logo" src={logo} alt="logo"></img></Link>
  <ul>
    <li className="gap"></li>
    <li>
      <Link to="/logout">Logout</Link>
    </li>
    <li>
      <a>Welcome, {getCookie("email")}</a>
    </li>
    <li>
      <Link to="/dashboard">Dashboard</Link>
    </li>


  </ul>
</nav>
  );  
}
}}


function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}