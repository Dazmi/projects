import React, { useState, useEffect, Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";


function getHeadlines(props) {
  const url = `https://cab230.hackhouse.sh/${props}`;
  console.log(url)
  return fetch(url)
    .then(res => res.json())
}

function useNewsArticles(props) {
  const [loading, setLoading] = useState(true);
  const [headlines, setHeadlines] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getHeadlines(props)
      .then(headlines => {
        setHeadlines(headlines);
        setLoading(false);
      })

      .catch(e => {
        setError(e);
        setLoading(false);
      });
  }, [props]);

  return {
    loading,
    headlines,
    error
  };
}


export function CreateTables(props) {
const { loading, headlines, error } = useNewsArticles(props.content);
if (loading === true) {
return <p>Loading...</p>;
}

if (error) {
return <p>Loading...</p>;
}
console.log(props.content)
if (props.content == "offences"){
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
if (props.content == "areas"){
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
if (props.content == "ages") {
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
if (props.content == "genders"){
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
if (props.content == "years"){
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
  ReactDOM.render(<CreateTables content={content}/>, document.getElementById("app"));
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


