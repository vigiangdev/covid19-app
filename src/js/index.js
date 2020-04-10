require("@babel/polyfill");

const state = {};

const getData = async function () {
    await fetch("https://covid-193.p.rapidapi.com/statistics", {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "covid-193.p.rapidapi.com",
            "x-rapidapi-key": "fa2431ca2fmshfde80ab5f3da76fp11c601jsn3126398e0928"
        }
    })
        .then(response => {
            return response.json();
        })
        .then(result => {
            state.results = result.response;
        })
        .catch(err => {
            console.log('fetchAPI', err);
        });
}

