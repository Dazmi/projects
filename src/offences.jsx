import React from "react";
import ReactDOM from "react-dom";
import { URL } from './index'
/**
 * View offences table
 */
export function Offences() {
  getOffences('offences')
  return (
  <div>
    <div className="space"></div>
	  <div className="box">
      <div className="pod">
        <button onClick={() => getOffences('offences')}>Offences</button>
        <button onClick={() => getOffences('areas')}>Areas</button>
        <button onClick={() => getOffences('ages')}>Ages</button>
        <button onClick={() => getOffences('genders')}>Genders</button>
        <button onClick={() => getOffences('years')}>Years</button>
        <div id='app'></div>
      </div>
    </div>
  </div>
  );
}

/**
 * Creates tables
 * @param {category} props 
 */
function getOffences(props) {
  const url = `${URL}/${props}`;
  console.log(url)

  fetch(url)
  //.then(res => res.json())
  .then(function(response) {
    if (response.ok) {
      return response.json();
    }
    throw new Error("Network response was not ok");
  })
  .then(function(result) {
    if (props === 'offences'){
      offences(result)
    }
    if (props === 'areas'){
      areas(result)
    }
    if (props === 'ages'){
      ages(result)
    }
    if (props === 'genders'){
      genders(result)
    }
    if (props === 'years'){
      years(result)
    }
  })
  .catch(function(error) {
    console.log("There has been a problem with your fetch operation: ",error.message);
  });
}

function offences(props){
console.log(props)
let table = null;
table = 
<div>
  <h1>Offences</h1>
  <table className="app">
    <tbody>
      {props.offences.map(props => (
      <tr>
        <td>
          {props}
        </td>
      </tr>
      ))}
    </tbody>
  </table>
</div>
ReactDOM.render(table, document.getElementById("app"))
}

function areas(props){
  console.log(props)
  let table = null;
  table = 
  <div>
    <h1>Areas</h1>
    <table className="app">
      <tbody>
        {props.areas.map(props => (
        <tr>
          <td>
            {props}
          </td>
        </tr>
        ))}
      </tbody>
    </table>
  </div>
  ReactDOM.render(table, document.getElementById("app"))
}

function ages(props){
  console.log(props)
  let table = null;
  table = 
  <div>
    <h1>Ages</h1>
    <table className="app">
      <tbody>
        {props.ages.map(props => (
        <tr>
          <td>
            {props}
          </td>
        </tr>
        ))}
      </tbody>
    </table>
  </div>
  ReactDOM.render(table, document.getElementById("app"))
}

function genders(props){
console.log(props)
let table = null;
table = 
<div>
  <h1>Genders</h1>
  <table className="app">
    <tbody>
      {props.genders.map(props => (
      <tr>
        <td>
          {props}
        </td>
      </tr>
      ))}
    </tbody>
  </table>
</div>
ReactDOM.render(table, document.getElementById("app"))
}

function years(props){
  console.log(props)
  let table = null;
  table = 
  <div>
    <h1>Years</h1>
    <table className="app">
      <tbody>
        {props.years.map(props => (
        <tr>
          <td>
            {props}
          </td>
        </tr>
        ))}
      </tbody>
    </table>
  </div>
  ReactDOM.render(table, document.getElementById("app"))
}