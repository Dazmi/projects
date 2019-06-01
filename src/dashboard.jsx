import React from "react";
import { Dropdown } from "./dropdown"
import { getTable } from "./search"
import { getChart } from "./chart"
import { getMap } from "./map"
import { getCookie } from "./index"

/**
 * Dashboard for loged in users
 */
export function Dashboard() {
return (
<div>
	<div className="space"></div>
	<div className="box">
		<div className="pod">
		<h1>Welcome, {getCookie("email")}</h1>
		<div>
			<div>
				<h3>Filters</h3>
				Offence: <Dropdown category="offences" /><br />
				Areas: <Dropdown category="areas" /><br />
				Ages: <Dropdown category="ages" /><br />
				Gender: <Dropdown category="genders" /><br />
				Year: <Dropdown category="years" /><br />
				Month: <Dropdown category="months" /><br />
			</div>
			<div>
				<button onClick={getTable}>Table</button>
				<button onClick={getChart}>Chart</button>
				<button onClick={getMap}>Map</button><br />
			</div>
			</div>
		<div id='app'></div>
		</div>
	</div>
</div>
);
}