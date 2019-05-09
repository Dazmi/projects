import React, { useState, useEffect, Component, createFactory } from "react";
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

export default function App(props) {
  const { loading, headlines, error } = useNewsArticles(props.category);
  if (loading === true) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Loading...</p>;
  }
  if (props.category == 'offences'){
    return (
      <select id='offences'>
        {headlines.offences.map(headline => (
        <option>
          {headline}
        </option>
        ))}
      </select>
        );
  }
  if (props.category == 'areas'){
    return (
      <select id='areas'>
        {headlines.areas.map(headline => (
        <option>
          {headline}
        </option>
        ))}
      </select>
        );
  }
  if (props.category == 'ages'){
    return (
      <select id='ages'>
        {headlines.ages.map(headline => (
        <option>
          {headline}
        </option>
        ))}
      </select>
        );
  }
  if (props.category == 'genders'){
    return (
      <select id='genders'>
        {headlines.genders.map(headline => (
        <option>
          {headline}
        </option>
        ))}
      </select>
        );
  }
  if (props.category == 'years'){
    return (
      <select id='years'>
        {headlines.years.map(headline => (
        <option>
          {headline}
        </option>
        ))}
      </select>
        );
  }
}

  
  

function Headline(prop) {
  return (
      <option>
          {prop.offence}
      </option>
      
  );
}


