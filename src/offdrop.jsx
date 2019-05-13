import React, { useState, useEffect, Component } from "react";
import ReactDOM from "react-dom";


function getHeadlines(props) {
  let url = `https://cab230.hackhouse.sh/${props}`;
  console.log(url)
  return fetch(url)
    .then(res => res.json())
}

function useNewsArticles(props) {
  let [loading, setLoading] = useState(true);
  let [headlines, setHeadlines] = useState([]);
  let [error, setError] = useState(null);

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
  let { loading, headlines, error } = useNewsArticles(props.category);
  if (loading === true) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Loading...</p>;
  }
  if (props.category === 'offences'){
    return (
      <select id='offence'>
        {headlines.offences.map(headline => (
        <option>
          {headline}
        </option>
        ))}
      </select>
        );
  }
  if (props.category === 'areas'){
    return (
      <select id='area'>
        {headlines.areas.map(headline => (
        <option>
          {headline}
        </option>
        ))}
      </select>
        );
  }
  if (props.category === 'ages'){
    return (
      <select id='age'>
        {headlines.ages.map(headline => (
        <option>
          {headline}
        </option>
        ))}
      </select>
        );
  }
  if (props.category === 'genders'){
    return (
      <select id='gender'>
        {headlines.genders.map(headline => (
        <option>
          {headline}
        </option>
        ))}
      </select>
        );
  }
  if (props.category === 'years'){
    return (
      <select id='year'>
        {headlines.years.map(headline => (
        <option>
          {headline}
        </option>
        ))}
      </select>
        );
  }
}

  
