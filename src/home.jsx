import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Nav from "./nav.jsx"
export default class Home extends React.Component {
render(){
return (
<div>
  <Nav />
  <div className="bluebg banner">
    <h1>Welcome</h1>
    <p>Click to register</p>
    <Link to="/register"><button>Register</button></Link>

  </div>
  <div className="space"></div>
  <div className="box">
    <div className="pod">
      <h1>Crime</h1>
      <p>Blow thing up with crime</p>

    </div>

  </div>
</div>
);
}}