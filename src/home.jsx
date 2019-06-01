import React from 'react';
import { Link } from "react-router-dom";

/**
 * Home page
 */
export function Home() {
return (
<div>
  <div className="bluebg banner white">
    <h1>Crimes with CAB230</h1>
    <p>Take on the journey to export crimes with the Queensland Governmnet open data initiative<br />
    Use filters to search your way through all the information<br />
    Make no mistake with the modern interactive graphs and map</p>
    <Link to="/register"><button>Register</button></Link>

  </div>
  <div className="space"></div>
  <div className="box">
    <div className="pod">
      <h1>Crime</h1>
      <p>Browse through a database of avalible headings</p>
      <Link to="/offences"><button>View Offences</button></Link>
    </div>

  </div>
  <footer>
    <div className="aboutflex">
    <div>
    Jayden Dao - n10003665
    </div>
    <div>
    CAB230 - Web Development
    </div>
    </div>
    
  </footer>
</div>

);
}