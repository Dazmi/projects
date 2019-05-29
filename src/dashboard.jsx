import React from "react";
import { Dropdown } from "./dropdown.jsx"
import { getSearch } from "./search.jsx"
import { getChart } from "./chart.jsx"
import { getArea } from "./map.jsx"

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
		<button onClick={getSearch}>Table</button>
		<button onClick={getChart}>Chart</button>
		<button onClick={getArea}>Map</button><br />
		<div id='app'></div>
	</div>
</div>
);
}