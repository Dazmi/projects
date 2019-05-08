import React, { useState, useEffect, Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";


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


