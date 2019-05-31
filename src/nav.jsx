import React from 'react';
import { Link } from "react-router-dom";
import logo from './img/jdotw.png';

/**
 * Navigation bar
 */
export function Nav() {
// when user has cookies the navigation bar changes
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
      <Link to="/dashboard">Search</Link>
    </li>
    <li>
      <Link to="/offences">Offences</Link>
    </li>
    <li className="gap"></li>
  </ul>
</nav>

  );  
}
}

