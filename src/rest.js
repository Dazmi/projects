import React from "react";
import ReactDOM from "react-dom";


/**
 * REST POST for registration form
 */
function regButton(){

  let emailForm = document.getElementById("email").value;
  let passForm = document.getElementById("pass").value;
  let body = "email=" + emailForm + "&password=" + passForm

  if (validation(emailForm, passForm)){
    return;
  }

  fetch("http://cab230.hackhouse.sh:3000/register", {
    method: "POST",
    body: body,
    headers: {
      "Content-type": "application/x-www-form-urlencoded"
    }
  })
    .then(function(response) {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Network response was not ok");
    })
    .then(function(result) {
      let appDiv = document.getElementById("app");
      appDiv.innerHTML = JSON.stringify(result);
      regButton.disabled = true;
    })
    .catch(function(error) {
      console.log(body);
      console.log("There has been a problem with your fetch operation: ",error.message);
    });

}

/**
 * REST POST for login form
 */
function logButton() {
  
  let emailForm = document.getElementById("email").value;
  let passForm = document.getElementById("pass").value;
  let body = "email=" + emailForm + "&password=" + passForm

  if (validation(emailForm, passForm)){
    return;
  }
  
  fetch("http://cab230.hackhouse.sh:3000/login", {
      method: "POST",
      body: body,
      headers: {
          "Content-type": "application/x-www-form-urlencoded"
      }
  })
      .then(function(response) {
          if (response.ok) {
              return response.json();
          }
          throw new Error("Network response was not ok.");
      })
      .then(function(result) {
          let appDiv = document.getElementById("app");
          appDiv.innerHTML = JSON.stringify(result);
          JWT = result.token;
          console.log(JWT)
      })
      .catch(function(error) {
          console.log("There has been a problem with your fetch operation: ",error.message);
      });

  
}


/**
 * Get categories with REST 
 * @param {*} category 
 */
function dataButton(category) {

  fetch("http://cab230.hackhouse.sh:3000/" + category)
      .then(function(response) {
          if (response.ok) {
              return response.json();
          }
          throw new Error("Network response was not ok.");
      })
      .then(function(result) {
          let appDiv = document.getElementById("app");
          appDiv.innerHTML = JSON.stringify(result);
      })
      .then(function() {
        ReactDOM.render(
          <Table />, 
          document.getElementById("table")
        );
      })
      .catch(function(error) {
          console.log("There has been a problem with your fetch operation: ",error.message);
      });
}

/**
 * REST GET for search query
 */
function searchButton() {
  let searchForm = document.getElementById("searchBox").value;
  //The parameters of the call
  let getParam = { method: "GET" };
  let head = { Authorization: `Bearer ${JWT}` };
  getParam.headers = head;

  valSearch(JWT);

  //The URL
  const baseUrl = "http://cab230.hackhouse.sh:3000/search?";
  const query = 'offence=' + searchForm;
  const url = baseUrl + query;

  fetch(encodeURI(url),getParam)
      .then(function(response) {
          if (response.ok) {
              return response.json();
          }
          throw new Error("Network response was not ok.");
      })
      .then(function(result) {
          let appDiv = document.getElementById("app");
          appDiv.innerHTML = JSON.stringify(result);
      })
      .catch(function(error) {
            console.log(url)
            console.log("There has been a problem with your fetch operation: ",error.message);
          });

}