import React, { useState, useEffect, Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Nav from "./nav.jsx"
import { Offences, useTable }from "./offences.jsx"
import { useSearch } from "./search.jsx"
import Dropdown from "./dropdown.jsx"
import { useChart } from "./chart.jsx"
import map from "./map.jsx"

export default function home() {
return (
<div>

	<div className="space"></div>
	<div className="box">

		<h3>Filters</h3>
		
		Offence: <Dropdown category={"offences"} /><br />
		Areas: <Dropdown category={"areas"} /><br />
		Ages: <Dropdown category={"ages"} /><br />
		Gender: <Dropdown category={"genders"} /><br />
		Year: <Dropdown category={"years"} /><br />
		<button onClick={useSearch}>Table</button>
		<button onClick={useChart}>Chart</button>
		<button onClick={map}>Map</button><br />
		<Slot />
	</div>

</div>


);
}


function Slot(){
	return(
		<div>
		<canvas id="myChart"></canvas>
		<div id="app"></div>

		</div>
	)
}



/*
<button onClick={()=> useTable("offences")}>Table</button>
<button onClick={() => RenderTable("areas")}>Areas</button>
<button onClick={() => RenderTable("ages")}>Ages</button>
<button onClick={() => RenderTable("genders")}>Genders</button>
<button onClick={() => RenderTable("years")}>Years</button>
*/