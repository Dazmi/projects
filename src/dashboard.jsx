import React, { useState, useEffect, Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Nav from "./nav.jsx"

export default class Home extends React.Component {
render(){
return (
  <div>
    <Nav />
  <div className="banner">
  <div className="box">
    <h2>Categories</h2>
    <button onClick={Showtable}>Offences</button>
    <input type="text" name="search" defaultValue="Homicide (Murder)" id="searchBox"></input>
    <button onClick={searchButton}>Search</button>
  </div>
  <div id="app"></div>
  </div>
</div>
);
}}

function Showtable(){
  ReactDOM.render(<Tableapp />, document.getElementById("app"));
}

export function getHeadlines() {
  const url = `https://cab230.hackhouse.sh/offences`;
  return fetch(url)
    .then(res => res.json())
    .then(res => res.offences); 
}

export function useNewsArticles() {
  const [loading, setLoading] = useState(true);
  const [headlines, setHeadlines] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getHeadlines()
      .then(headlines => {
        setHeadlines(headlines);
        setLoading(false);
      })

      .catch(e => {
        setError(e);
        setLoading(false);
      });
  }, []);

  return {
    loading,
    headlines,
    error
  };
}


function Tableapp() {
  const { loading, headlines, error } = useNewsArticles();

  if (loading === true) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Loading...</p>;
  }
  return (
    <table className="tableapp">
      <h1>Offences</h1>

      {headlines.map(headline => (
        <Headline offence={headline} />
      ))}
    </table>
  );
}

function Headline(prop) {
  return (
      <tr>
        <td>
          {prop.offence}
        </td>
      </tr>
      
  );
}



function searchButton() {
  let searchForm = document.getElementById("searchBox").value;
  //The parameters of the call
  let getParam = { method: "GET" };
  let head = { Authorization: `Bearer ${getCookie("JWT")}` };
  getParam.headers = head;

  valSearch(getCookie("JWT"));

  //The URL
  const baseUrl = "https://cab230.hackhouse.sh/search?";
  const query = 'offence=' + searchForm;
  const url = baseUrl + query;

  fetch(encodeURI(url),getParam)
      .then(function(response) {
          if (response.ok) {
              return response.json();
          }
          throw new Error("Network response was not ok.");
      })
      .then(function(result) {
          let appDiv = document.getElementById("app");
          appDiv.innerHTML = JSON.stringify(result);
      })
      .catch(function(error) {
            console.log(url)
            console.log("There has been a problem with your fetch operation: ",error.message);
          });

}


function getData() {

  fetch("https://cab230.hackhouse.sh/offences")
      .then(function(response) {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Network response was not ok.");
      })
      .then(function(result) {
          return(result.offences)
          let appDiv = document.getElementById("app");
          appDiv.innerHTML = JSON.stringify(result);
      })
      .catch(function(error) {
          console.log("There has been a problem with your fetch operation: ",error.message);
      });
}


function valSearch(param){
  if (param == null){
    let appDiv = document.getElementById("app");
    appDiv.innerHTML = "Error: Must login";
    return true;
  }

}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}