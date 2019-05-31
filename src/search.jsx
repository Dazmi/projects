import React from "react";
import ReactDOM from "react-dom";
import { getCookie, URL} from './index'

export function getSearch(){
  //The parameters of the call
  let offence = document.getElementById("offence")
  let area = document.getElementById("area")
  let age = document.getElementById("age")
  let gender = document.getElementById("gender")
  let year = document.getElementById("year")

  let offenceOption = offence.options[offence.selectedIndex].value
  let areaOption = area.options[area.selectedIndex].value
  let ageOption = age.options[age.selectedIndex].value
  let genderOption = gender.options[gender.selectedIndex].value
  let yearOption = year.options[year.selectedIndex].value
  
  let getParam = { method: "GET" };
  let head = { Authorization: `Bearer ${getCookie("JWT")}` };
  getParam.headers = head;

  //The URL
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
    //.then(res => res.json())
    .then(function(response) {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Network response was not ok");
    })
    .then(function(result) {
      console.log(result)
      GetTable(result)
    })
    .catch(function(error) {
      console.log("There has been a problem with your fetch operation: ",error.message);
    });
    
}

/**
 * Create Table
 * @param {offence} props 
 */
function GetTable(props){
    let table = <div>
    <h1>{props.query.offence}</h1>
    <table className="table">
    <tbody>
      <tr>
        <th>
          Area
        </th>
        <th>
          Total
        </th>
      </tr>
    {props.result.map(function(props) {
      if (props.total !== 0){
        return <tr>
        <td>
          {props.LGA}
        </td>
        <td>
          {props.total}
        </td>
      </tr>
      }})}

      </tbody>
    </table>
  </div>
  ReactDOM.render(table, document.getElementById("app"))
}