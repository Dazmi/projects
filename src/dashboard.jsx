import React from "react";
import { Dropdown } from "./dropdown.jsx"
import { getSearch } from "./search.jsx"
import { getChart } from "./chart.jsx"
import { getArea } from "./map.jsx"
import { getCookie } from "./nav.jsx"

export default function home() {
return (
<div>
	<div className="space"></div>
	<div className="box">
		<div className="pod">
		<div className="homeflex">
			<div>
				{console.log(getCookie("email"))}
				<h3>Filters</h3>
				Offence: <Dropdown category={"offences"} /><br />
				Areas: <Dropdown category={"areas"} /><br />
				Ages: <Dropdown category={"ages"} /><br />
				Gender: <Dropdown category={"genders"} /><br />
				Year: <Dropdown category={"years"} /><br />
			</div>
			<div>
				<button onClick={getSearch}>Table</button><br />
				<button onClick={getChart}>Chart</button><br />
				<button onClick={getArea}>Map</button><br />
			</div>
			</div>
		</div>
		<div id='app'></div>
	</div>
</div>
);
}