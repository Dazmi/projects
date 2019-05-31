import React from 'react';
import { Link } from "react-router-dom";

/**
 * Home page
 */
export function Home() {
return (
<div>
  <div className="bluebg banner white">
    <h1>Welcome to crimes with CAB230</h1>
    <p>Click to register</p>
    <Link to="/register"><button>Register</button></Link>

  </div>
  <div className="space"></div>
  <div className="box">
    <div className="pod">
      <h1>Crime</h1>
      <p>Browse through a database of Queenslands offences</p>
      <p>Click to preview categories of offences</p>
      <Link to="/offences"><button>View Offences</button></Link>
    </div>

  </div>
  <footer></footer>
</div>

);
}