import React, { useState, useEffect, Component } from "react";
import ReactDOM from "react-dom";


export function getHeadlines(props) {
  const url = `https://cab230.hackhouse.sh/${props}`;
  console.log(url)
  return fetch(url)
    .then(res => res.json())
}

export function useNewsArticles(props) {
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
console.log(headlines)
if (props.content === "offences"){
return (
<div>
  <h1>Offences</h1>
  <table className="app">
    <tbody>
      {headlines.offences.map(headline => (

      <tr>
        <td>
          {headline}
        </td>
      </tr>
      ))}
    </tbody>
  </table>
</div>
)}
if (props.content === "areas"){
return (
<div>
  <h1>Area</h1>
  <table className="app">
    <tbody>

      {headlines.areas.map(headline => (
      <tr>
        <td>
          {headline}
        </td>
      </tr>
      ))}
    </tbody>
  </table>
</div>
)}
if (props.content === "ages") {
return (
<div>
  <h1>Ages</h1>
  <table className="app">
    <tbody>

      {headlines.ages.map(headline => (
      <tr>
        <td>
          {headline}
        </td>
      </tr>

      ))}
    </tbody>
  </table>
</div>
)}
if (props.content === "genders"){
return (
<div>
  <h1>Genders</h1>
  <table className="app">
    <tbody>
      {headlines.genders.map(headline => (
      <tr>
        <td>
          {headline}
        </td>
      </tr>
      ))}
    </tbody>
  </table>
</div>
)}
if (props.content === "years"){
return (
<div>
  <h1>Years</h1>
  <table className="app">
    <tbody>
      {headlines.years.map(headline => (
      <tr>
        <td>
          {headline}
        </td>
      </tr>
      ))}
    </tbody>
  </table>
</div>
)}

}


export function RenderTable(content){
  ReactDOM.render(<CreateTables content={content}/>, document.getElementById("app"));
}
