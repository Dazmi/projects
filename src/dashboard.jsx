import React, { useState, useEffect, Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Nav from "./nav.jsx"
import { Offences, RenderTable }from "./offences.jsx"
import { GetHeadlines } from "./search.jsx"
import Dropdown from "./offdrop.jsx"
import Chart from 'chart.js';

export default function home() {
return (
<div>

	<div className="space"></div>
	<div className="box">

		<h2>Categories</h2>
		<button onClick={()=> RenderTable("offences")}>Offences</button>
		<button onClick={chart}>Chart</button><br />

		Offence: <Dropdown category={"offences"} /><br />
		Areas: <Dropdown category={"areas"} /><br />
		Ages: <Dropdown category={"ages"} /><br />
		Gender: <Dropdown category={"genders"} /><br />
		Year: <Dropdown category={"years"} /><br />
		<button onClick={GetHeadlines}>Filter</button><br />

		



	</div>
	<canvas id="myChart"></canvas>
	<div id="app"></div>

</div>
);
}

//ReactDOM.render(<Home />, document.body);

//
/*
<button onClick={() => RenderTable("areas")}>Areas</button>
<button onClick={() => RenderTable("ages")}>Ages</button>
<button onClick={() => RenderTable("genders")}>Genders</button>
<button onClick={() => RenderTable("years")}>Years</button>
*/

function chart() {
	var ctx = document.getElementById('myChart').getContext('2d');
	var myChart = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
			datasets: [{
				label: '# of Votes',
				data: [12, 19, 3, 5, 2, 3],
				backgroundColor: [
					'rgba(255, 99, 132, 0.2)',
					'rgba(54, 162, 235, 0.2)',
					'rgba(255, 206, 86, 0.2)',
					'rgba(75, 192, 192, 0.2)',
					'rgba(153, 102, 255, 0.2)',
					'rgba(255, 159, 64, 0.2)'
				],
				borderColor: [
					'rgba(255, 99, 132, 1)',
					'rgba(54, 162, 235, 1)',
					'rgba(255, 206, 86, 1)',
					'rgba(75, 192, 192, 1)',
					'rgba(153, 102, 255, 1)',
					'rgba(255, 159, 64, 1)'
				],
				borderWidth: 1
			}]
		},
		options: {
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true
					}
				}]
			}
		}
	});
}
