import React, { useState, useEffect, Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Offdrop from "./offdrop.jsx"


let search = ''

function getHeadlines(){
  //The parameters of the call
  let searchForm = document.getElementById("offences")
  search = searchForm.options[searchForm.selectedIndex].value
  let getParam = { method: "GET" };
  let head = { Authorization: `Bearer ${getCookie("JWT")}` };
  getParam.headers = head;

  //The URL
  const baseUrl = "http://hackhouse.sh:3000/search?";
  const query = `offence=${search}`;
  const url = baseUrl + query;

  
  return fetch(encodeURI(url),getParam)
    .then(res => res.json())
    .then(res => res.result)
    .then((result) =>
    result.map((result) => ({
      LGA: result.LGA,
      total: result.total,
      lat: result.lat,
      lng: result.lng,
      })),
      );
}

function useNewsArticles() {
  const [loading, setLoading] = useState(true);
  const [headlines, setHeadlines] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getHeadlines()
      .then(headlines => {
        setHeadlines(headlines);
        setLoading(false);
        console.log(headlines)
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


export default function App() {
  const { loading, headlines, error } = useNewsArticles();

  if (loading === true) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Loading...</p>;
  }
  return (
    <table className="app">
    <h1>Search</h1>

      {headlines.map(headline => (
        <Headline LGA={headline.LGA} total={headline.total}/>
      ))}
    </table> 
  );
}

function Headline(prop) {
  return (
    <tr>
    <td>
      {prop.LGA}
    </td>
    <td>
      {prop.total}
    </td>
  </tr>
      
  );
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


function valSearch(param){
  if (param == null){
    let appDiv = document.getElementById("app");
    appDiv.innerHTML = "Error: Must login";
    return true;
  }

}
