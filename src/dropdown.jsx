import React, { useState, useEffect} from "react";
import { URL } from './index'
/**
 * Gets the list of categories
 * @param {offence} props 
 */
function getOffence(props) {
  let url = `${URL}/${props}`;
  return fetch(url)
    .then(res => res.json())
}
/**
 * Create the loading effect before content is loaded
 * @param {offence} props 
 */
function useNewsArticles(props) {
  let [loading, setLoading] = useState(true);
  let [headlines, setHeadlines] = useState([]);
  let [error, setError] = useState(null);

  useEffect(() => {
    getOffence(props)
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
/**
 * Returns the dropdowns
 * @param {offence} props 
 */
export function Dropdown(props) {
let { loading, headlines, error } = useNewsArticles(props.category);
if (loading === true) {
return <div>Loading...</div>;
}

if (error) {
return <div>Loading...</div>;
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
  <option>
    Select
  </option>
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
  <option>
    Select
  </option>
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
  <option>
    Select
  </option>
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
  <option>
    Select
  </option>
  {headlines.years.map(headline => (
  <option>
    {headline}
  </option>
  ))}
</select>
);
}
}

  
