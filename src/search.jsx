import React, { useState, useEffect, Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";


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

  console.log(url)
  return fetch(encodeURI(url),getParam)
    .then(res => res.json())
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


function App(props) {
  const { loading, headlines, error } = useNewsArticles();

  if (loading === true) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Loading...</p>;
  }
  console.log(headlines.result)
  if (props.content == 'offences')
  return (
    <table className="app">

    <h1>Search</h1>

      {headlines.result.map(headline => (
            <tr>
            <td>
              {headline.LGA}
            </td>
            <td>
              {headline.total}
            </td>
          </tr>
      ))}
    </table> 
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

export default function SearchTable(props){
  ReactDOM.render(<App content={props}/>, document.getElementById("app"));
}


function valSearch(param){
  if (param == null){
    let appDiv = document.getElementById("app");
    appDiv.innerHTML = "Error: Must login";
    return true;
  }

}
