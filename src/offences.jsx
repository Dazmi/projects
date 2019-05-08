import React, { useState, useEffect, Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";


let category = ''
function getHeadlines() {
  const url = `https://cab230.hackhouse.sh/${category}`;
  return fetch(url)
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


export function CreateTables() {
const { loading, headlines, error } = useNewsArticles();
if (loading === true) {
return <p>Loading...</p>;
}

if (error) {
return <p>Loading...</p>;
}
if (category == "offences"){
return (
<table className="app">
  <h1>Offences</h1>
  {headlines.offences.map(headline => (
  <tr>
    <td>
      {headline}
    </td>
  </tr>
  ))}
</table>
)}
if (category == "areas"){
return (
<table className="app">
  <h1>Area</h1>
  {headlines.areas.map(headline => (
  <tr>
    <td>
      {headline}
    </td>
  </tr>
  ))}
</table>
)}
if (category == "ages") {
return (
<table className="app">
  <h1>Ages</h1>
  {headlines.ages.map(headline => (
  <tr>
    <td>
      {headline}
    </td>
  </tr>

  ))}
</table>
)}
if (category == "genders"){
return (
<table className="app">
  <h1>Genders</h1>
  {headlines.genders.map(headline => (
  <tr>
    <td>
      {headline}
    </td>
  </tr>
  ))}
</table>
)}
if (category == "years"){
return (
<table className="app">
  <h1>Years</h1>
  {headlines.years.map(headline => (
  <tr>
    <td>
      {headline}
    </td>
  </tr>
  ))}
</table>
)}}


export function RenderTable(content){
  category = content
  ReactDOM.render(<CreateTables />, document.getElementById("app"));
}

  
function Offence(prop) {
  return (
      <tr>
        <td>
          {prop.offence}
        </td>
      </tr>  
  );
}


