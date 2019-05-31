import React from "react";
import ReactDOM from "react-dom";
import Chart from 'chart.js';
import { getCookie }  from './index'
import { URL } from './index'

/**
 * Get elements from the search for the chart
 */
export function getChart(){
  // The parameters of the call
  let offence = document.getElementById("offence")
  let area = document.getElementById("area")
  let age = document.getElementById("age")
  let gender = document.getElementById("gender")
  let year = document.getElementById("year")
  // Dropdown option
  let offenceOption = offence.options[offence.selectedIndex].value
  let areaOption = area.options[area.selectedIndex].value
  let ageOption = age.options[age.selectedIndex].value
  let genderOption = gender.options[gender.selectedIndex].value
  let yearOption = year.options[year.selectedIndex].value
  // Search Params
  let getParam = { method: "GET" };
  let head = { Authorization: `Bearer ${getCookie("JWT")}` };
  getParam.headers = head;

  // The URL
  let baseUrl = `${URL}/search?`;
  let url = baseUrl
  if (offenceOption !== 'Select'){
    url = url + `offence=${offenceOption}`
  }
  if (areaOption !== 'Select'){
    url = url + `&area=${areaOption}`;
  }
  if (ageOption !== 'Select'){
    url = url + `&age=${ageOption}`;
  }
  if (genderOption !== 'Select'){
    url = url + `&gender=${genderOption}`;
  }
  if (yearOption !== 'Select'){
    url = url + `&year=${yearOption}`;
  }
  console.log(url)
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

