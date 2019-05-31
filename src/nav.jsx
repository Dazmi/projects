import React from 'react';
import { Link } from "react-router-dom";
import logo from './img/jdotw.png';

export function Nav() {
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
    <li>
      <Link to="/offences">Offences</Link>
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
      <Link to="/dashboard">Dashboard</Link>
    </li>
    <li className="gap"></li>
  </ul>
</nav>

  );  
}
}


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
