import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Home from "./home.jsx";
import "./styles.css";
import Scroll from "./ScrollToTopRoute.js";
import { Nav } from "./nav.jsx"
import Register from "./register.jsx"
import Login from "./login"
import Dashboard from "./dashboard.jsx"
import { getOffences } from "./offences"

/**
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
      <Scroll path="/offences" component={getOffences} />
      <Scroll path="/logout" component={Logout} />
    </Router>
  );
}
ReactDOM.render(<Main />, document.getElementById('root'));



function Logout(){
  document.cookie = "JWT=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "undefined=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.location.href = "/"
}