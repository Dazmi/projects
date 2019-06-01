import React from "react";
import ReactDOM from "react-dom";
import { getCookie, getSearch} from './index'
import { sortTable, sortInt } from './sort'

export function getTable() {
  // Use search function to filter options
  let url = getSearch()

  // Authentication parameters
  let getParam = { method: "GET" };
  let head = { Authorization: `Bearer ${getCookie("JWT")}` };
  getParam.headers = head;

  // Fetch operation
  fetch(encodeURI(url),getParam)
    //.then(res => res.json())
    .then(function(response) {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Network response was not ok");
    })
    .then(function(result) {
      useTable(result)
    })
    .catch(function(error) {
      console.log("There has been a problem with your fetch operation: ",error.message);
    });
    
}

/**
 * Create Table
 * @param {offence} props 
 */
function useTable(props){
  let table = <div>
    <h1>{props.query.offence}</h1>
    <table id="table">
      <tbody>
        <tr>
          <th onClick={()=> sortTable(0)}>Area</th>
          <th onClick={()=> sortInt(1)}>Total</th>
        </tr>
        {props.result.map(function(props) {
          if (props.total !== 0){
          return <tr>
            <td>
              {props.LGA}
            </td>
            <td>
              {props.total}
            </td>
          </tr>
          }})
        }
      </tbody>
    </table>
  </div>
  ReactDOM.render(table, document.getElementById("app"))
}