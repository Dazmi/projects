import React from "react";
import ReactDOM from "react-dom";


export function getOffences(props) {
  const url = `https://cab230.hackhouse.sh/${props}`;
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
    getTable(result)
  })
  .catch(function(error) {
    console.log("There has been a problem with your fetch operation: ",error.message);
  });
}

function getTable(props){
console.log(props)
let table = null;
if (props.name === "offences"){
table = 
<div>
  <h1>Offences</h1>
  <table className="app">
    <tbody>
      {props.offences.map(headline => (
      <tr>
        <td>
          {headline}
        </td>
      </tr>
      ))}
    </tbody>
  </table>
</div>
}
if (props.name === "areas"){
table = 
<div>
  <h1>Area</h1>
  <table className="app">
    <tbody>

      {props.areas.map(headline => (
      <tr>
        <td>
          {headline}
        </td>
      </tr>
      ))}
    </tbody>
  </table>
</div>
}
if (props.name === "ages") {
table = 
<div>
  <h1>Ages</h1>
  <table className="app">
    <tbody>

      {props.ages.map(headline => (
      <tr>
        <td>
          {headline}
        </td>
      </tr>

      ))}
    </tbody>
  </table>
</div>
}
if (props.name === "genders"){
table = 
<div>
  <h1>Genders</h1>
  <table className="app">
    <tbody>
      {props.genders.map(headline => (
      <tr>
        <td>
          {headline}
        </td>
      </tr>
      ))}
    </tbody>
  </table>
</div>
}
if (props.name === "years"){
table = 
<div>
  <h1>Years</h1>
  <table className="app">
    <tbody>
      {props.years.map(headline => (
      <tr>
        <td>
          {headline}
        </td>
      </tr>
      ))}
    </tbody>
  </table>
</div>
}
ReactDOM.render(table, document.getElementById("app"))
}
