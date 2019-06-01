import React from "react";
import ReactDOM from "react-dom";
import { URL } from './index'
import { sortTable, sortInt } from './sort'
/**
 * View offences table
 */
export function Offences() {
  return (
  <div>
    <div className="space"></div>
	  <div className="box">
      <div className="pod">
        <h1>Categories</h1>
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
  ReactDOM.render(<h2>Loading...</h2>, document.getElementById("app"))
  const url = `${URL}/${props}`;
  console.log(url)

  fetch(url)
  .then(function(response) {
    if (response.ok) {
      return response.json();
    }
    throw new Error("Network response was not ok");
  })
  // switch for different categories
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

/**
 * Create the table
 * @param {category} props 
 */
function offences(props){
let table = null;
// Create offence table
table = 
<div>
  <h1>Offences</h1>
  <table id="table">
    <tbody>
    <tr>
        <th onClick={() => sortTable(0)}>Offences</th>
      </tr>
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
// Create areas table
function areas(props){
  let table = null;
  table = 
  <div>
    <h1>Areas</h1>
    <table id="table">
      <tbody>
      <tr>
        <th onClick={() => sortTable(0)}>Areas</th>
      </tr>
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
// Create ages table
function ages(props){
  let table = null;
  table = 
  <div>
    <h1>Ages</h1>
    <table id="table">
      <tbody>
      <tr>
        <th onClick={() => sortTable(0)}>Ages</th>
      </tr>
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
// Create gender table
function genders(props){
let table = null;
table = 
<div>
  <h1>Genders</h1>
  <table id="table">
    <tbody>
    <tr>
        <th onClick={() => sortTable(0)}>Genders</th>
      </tr>
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
// Create years table
function years(props){
  let table = null;
  table = 
  <div>
    <h1>Years</h1>
    <table id="table">
      <tbody>
      <tr>
        <th onClick={() => sortInt(0)}>Years</th>
      </tr>
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