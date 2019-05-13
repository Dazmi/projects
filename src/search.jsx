import React, { useState, useEffect, Component } from "react";
import ReactDOM from "react-dom";



export function GetHeadlines(){
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
  let baseUrl = "http://hackhouse.sh:3000/search?";
  let query1 = `offence=${offenceOption}`;
  let query2 = `&area=${areaOption}`;
  let query3 = `&age=${ageOption}`;
  let query4 = `&gender=${genderOption}`;
  let query5 = `&year=${yearOption}`;
  let url = baseUrl + query1;

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
      ReactDOM.render(<GetTable context={result} />, document.getElementById("app"));
    })
    .catch(function(error) {
      console.log("There has been a problem with your fetch operation: ",error.message);
    });
    
}

function GetTable(props){
  console.log(props.context)
  return(
    <div>
    <h1>{props.context.query.offence}</h1>
    <table className="table">
    <tbody>
    {props.context.result.map(context => (
      <tr>
        <td>
          {context.LGA}
        </td>
        <td>
          {context.total}
        </td>
      </tr>
      ))}
      </tbody>
    </table>
  </div>
  )
}


function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function valSearch(param){
  if (param == null){
    let appDiv = document.getElementById("app");
    appDiv.innerHTML = "Error: Must login";
    return true;
  }
}
