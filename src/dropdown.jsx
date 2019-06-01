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
function useOffences(props) {
  let [loading, setLoading] = useState(true);
  let [offence, setOffences] = useState([]);
  let [error, setError] = useState(null);

  useEffect(() => {
    getOffence(props)
      .then(offence => {
        setOffences(offence);
        setLoading(false);
      })
      .catch(e => {
        setError(e);
        setLoading(false);
      });
  }, [props]);

  return {
    loading,
    offence,
    error
  };
}
/**
 * Returns the dropdowns
 * @param {offence} props 
 */
export function Dropdown(props) {
if (props.category === 'months'){
  let months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  return (
  <select id='month'>
    <option>
      Select
    </option>
    {months.map(props => (
    <option>
      {props}
    </option>
    ))}
  </select>
  );
}
// Use effects to display loading dropdowns
let { loading, offence, error } = useOffences(props.category);
if (loading === true) {
return <div>Loading...</div>;
}

if (error) {
return <div>Loading...</div>;
}
// Display offence dropdown
if (props.category === 'offences'){
  return (
    <select id='offence'>
      {offence.offences.map(props => (
      <option>
        {props}
      </option>
      ))}
    </select>
  );
}
// Display areas dropdown
if (props.category === 'areas'){
  return (
    <select id='area'>
      <option>
        Select
      </option>
      {offence.areas.map(props => (
      <option>
        {props}
      </option>
      ))}
    </select>
  );
}
// Display ages dropdown
if (props.category === 'ages'){
  return (
    <select id='age'>
      <option>
        Select
      </option>
      {offence.ages.map(props => (
      <option>
        {props}
      </option>
      ))}
    </select>
  );
}
// Display genders dropdown
if (props.category === 'genders'){
  return (
    <select id='gender'>
      <option>
        Select
      </option>
      {offence.genders.map(props => (
      <option>
        {props}
      </option>
      ))}
    </select>
  );
}
// Display years dropdown
if (props.category === 'years'){
  return (
    <select id='year'>
      <option>
        Select
      </option>
      {offence.years.map(props => (
      <option>
        {props}
      </option>
      ))}
    </select>
  );
}}


  
