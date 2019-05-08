import React, { useState, useEffect, Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Chart } from "react-google-charts";
import Home from "./home.jsx";
import "./styles.css";
import Scroll from "./ScrollToTopRoute.js";

import Register from "./register.jsx"
import Login from "./login"
import Dashboard from "./dashboard.jsx"

/**
 * Main function which shows navigation
 */

function Main() {
  return (
    <Router>
      <Scroll exact path="/" component={Home} />
      <Scroll path="/register" component={Register} />
      <Scroll path="/login" component={Login} />
      <Scroll path="/dashboard" component={Dashboard} />
      <Scroll path="/logout" component={Logout} />
    </Router>
  );
}
ReactDOM.render(<Main />, document.body);



function Logout(){
  document.cookie = "JWT=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "undefined=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.location.href = "/"
}