import React from "react";
import ReactDOM from "react-dom";
import Chart from 'chart.js';
import { getCookie, getSearch }  from './index'

/**
 * Get elements from the search for the chart
 */
export function getChart(){
  // Use search function to filter options
  let url = getSearch()

  // Authentication parameters
  let getParam = { method: "GET" };
  let head = { Authorization: `Bearer ${getCookie("JWT")}` };
  getParam.headers = head;

  // Fetch operation
  fetch(encodeURI(url),getParam)
    .then(function(response) {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Network response was not ok");
    })
    .then(function(result) {
        barChart(result)
      })  
    .catch(function(error) {
      console.log("There has been a problem with your fetch operation: ",error.message);
    });
}
/**
 * Creates a bar chart
 * X axis: LGA
 * Y axis: total of offences
 * @param {results} props 
 */
export async function barChart(props) {

  ReactDOM.render(<canvas id="myChart"></canvas>,document.getElementById('app'));

  let lgaData = []
  let totalData = []
  {props.result.map(function(props) {
    if (props.total !== 0){
      lgaData.push(props.LGA)
      totalData.push(props.total)
    }})}
    
	var ctx = document.getElementById('myChart').getContext('2d');
	var myChart = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: lgaData,
			datasets: [{
				label: '# Crimes',
        data: totalData,
        backgroundColor: 'rgba(54, 162, 235, 0.4)', 
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

