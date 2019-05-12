import React, { useState, useEffect, Component } from "react";
import ReactDOM from "react-dom";



function getHeadlines(props){
  //The parameters of the call
  console.log(props)
  let offence = document.getElementById("offence")
  let area = document.getElementById("area")
  let age = document.getElementById("age")
  let gender = document.getElementById("gender")
  let year = document.getElementById("year")
  let offenceOption = offence.options[offence.selectedIndex].value
  let areaOption = area.options[area.selectedIndex].value
  let ageOption = age.options[age.selectedIndex].value
  let genderOption = gender.options[gender.selectedIndex].value
  let yearOption = year.options[year.selectedIndex].value
  let getParam = { method: "GET" };
  let head = { Authorization: `Bearer ${getCookie("JWT")}` };
  getParam.headers = head;

  //The URL
  const baseUrl = "http://hackhouse.sh:3000/search?";
  const query1 = `offence=${offenceOption}`;
  const query2 = `&area=${areaOption}`;
  const query3 = `&age=${ageOption}`;
  const query4 = `&gender=${genderOption}`;
  const query5 = `&year=${yearOption}`;
  const url = baseUrl + query1 + query2 + query3 + query4 + query5;

  console.log(url)
  return fetch(encodeURI(url),getParam)
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


export function App(props) {
  const { loading, headlines, error } = useNewsArticles(props.content);

  if (loading === true) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Loading...</p>;
  }
  console.log(headlines)
  console.log(headlines.query.offence)
  return (
    <div>
      <h1>{headlines.query.offence}</h1>
      <table className="table">
      {headlines.result.map(headline => (
        <tbody>
        <tr>
          <th>
            Area
          </th>
          <th>
            Total
          </th>
        </tr>
        <tr>
          <td>
            {headline.LGA}
          </td>
          <td>
            {headline.total}
          </td>
        </tr>
      </tbody>
        ))}
      </table>
    </div>
  );
  
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export function SearchTable(props){
  ReactDOM.render(<App content={props}/>, document.getElementById("app"));
}


function valSearch(param){
  if (param == null){
    let appDiv = document.getElementById("app");
    appDiv.innerHTML = "Error: Must login";
    return true;
  }
}
