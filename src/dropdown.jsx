import React, { useState, useEffect} from "react";


function getHeadlines(props) {
  let url = `http://localhost:3000/${props}`;
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

  
