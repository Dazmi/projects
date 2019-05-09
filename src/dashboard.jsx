import React, { useState, useEffect, Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Nav from "./nav.jsx"
import { Offences, RenderTable }from "./offences.jsx"
import Search from "./search.jsx"
import Dropdown from "./offdrop.jsx"
import Chart from 'chart.js';

export default class Home extends React.Component {
render(){
return (
  <div>
    <Nav />
    <div className="banner"></div>
    <div className="box">
      <h2>Categories</h2>
    
      <Dropdown category={"offences"}/>
      <Dropdown category={"areas"}/>
      <Dropdown category={"ages"}/>
      <Dropdown category={"genders"}/>
      <Dropdown category={"years"}/>

      <button onClick={() => RenderTable("offences")}>Offences</button>

      <button onClick={chart}>Chart</button>
      <button onClick={Search}>Search</button>

    </div>
    <canvas id="myChart"></canvas>
    <div id="app"></div>
    
    </div>
);
}}

/*
<button onClick={() => RenderTable("areas")}>Areas</button>
<button onClick={() => RenderTable("ages")}>Ages</button>
<button onClick={() => RenderTable("genders")}>Genders</button>
<button onClick={() => RenderTable("years")}>Years</button>
*/



function chart(){
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
