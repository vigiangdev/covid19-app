require("@babel/polyfill");
import { apiData } from './apiData'

// DOM SELECTORS
const elements = {

    // summary
    sumCasesTotal: document.querySelector('.cases-total'),
    sumRecoveredTotal: document.querySelector('.recovered-total'),
    sumDeathsTotal: document.querySelector('.deaths-total'),

    sumCasesList: document.querySelector('.cases-list-body'),
    sumRecoveredList: document.querySelector('.recovered-list-body'),
    sumDeathsList: document.querySelector('.deaths-list-body'),

    // all region
    allTotal: document.querySelector('.all-region-body'),
    afTotal: document.querySelector('.af-body'),
    asTotal: document.querySelector('.as-body'),
    euTotal: document.querySelector('.eu-body'),
    naTotal: document.querySelector('.na-body'),
    saTotal: document.querySelector('.sa-body'),
    ocTotal: document.querySelector('.oc-body')
};

const state = {};


// // CONTROLLER
async function controller() {
    try {
        // get data from API and store it in state
        await getResult();

        // create array for each case
        createAllArrays();

        // render data to summary tables
        displayAllTotal();
        
        // get country code from API to organize country into continents
        await getCountryCode();

        // add continent code to each country
        separateByContinent();

        // render data to continent tables
        displayAllRegion();

    } catch (err) {
        console.log('controller', err);
    }
};



// // MODEL
async function getResult() {
    await fetch("https://api.covid19api.com/summary"
    )
        .then(response => {
            return response.json();
        })
        .then(result => {
            state.globalResults = result.Global;
            state.countryResults = result.Countries;
        })
        .catch(err => {
            alert('Cannot fetch data from server. Data from April 12, 2020 rendered on page.', err);
            // TESTING WITH apiData.js DATA AS ALTERNATIVE TO FETCHING DATA FROM SERVER
            state.globalResults = apiData.Global;
            state.countryResults = apiData.Countries;
        });

    
};

async function getCountryCode() {
    await fetch("https://cors-anywhere.herokuapp.com/http://country.io/continent.json"
    )
        .then(response => {
            return response.json()
        })
        .then(result => {
            state.countryCode = result;
        }) 
};


function createAllArrays() {
    // create new array for each case (active, recovered, deaths). remove cases with 0. sort by descending
    state.allCasesSorted = [...state.countryResults]
        .filter(el => el.TotalConfirmed > 0)
        .sort((a, b) => b.TotalConfirmed - a.TotalConfirmed);

    let rank = 1;
    state.allCasesSorted[0]["casesRank"] = rank;
    for (let i = 1; i < state.allCasesSorted.length; i++) {
        if (state.allCasesSorted[i]["TotalConfirmed"] < state.allCasesSorted[i - 1]["TotalConfirmed"]) {
            rank += 1;
            state.allCasesSorted[i]["casesRank"] = rank;
        } else {
            state.allCasesSorted[i]["casesRank"] = rank;
        }
    }


    state.allRecoveredSorted = [...state.countryResults]
        .filter(el => el.TotalRecovered > 0)
        .sort((a, b) => b.TotalRecovered - a.TotalRecovered);

    rank = 1;
    state.allRecoveredSorted[0]["recoveredRank"] = rank;
    for (let i = 1; i < state.allRecoveredSorted.length; i++) {
        if (state.allRecoveredSorted[i]["TotalRecovered"] < state.allRecoveredSorted[i - 1]["TotalRecovered"]) {
            rank += 1;
            state.allRecoveredSorted[i]["recoveredRank"] = rank;
        } else {
            state.allRecoveredSorted[i]["recoveredRank"] = rank;
        }
    }


    state.allDeathsSorted = [...state.countryResults]
        .filter(el => el.TotalDeaths > 0)
        .sort((a, b) => b.TotalDeaths - a.TotalDeaths);

    rank = 1;
    state.allDeathsSorted[0]["deathsRank"] = rank;
    for (let i = 1; i < state.allDeathsSorted.length; i++) {
        if (state.allDeathsSorted[i]["TotalDeaths"] < state.allDeathsSorted[i - 1]["TotalDeaths"]) {
            rank += 1;
            state.allDeathsSorted[i]["deathsRank"] = rank;
        } else {
            state.allDeathsSorted[i]["deathsRank"] = rank;
        }
    }
};


function separateByContinent() {
    state.countryResults.forEach(country => {
        country.continent = state.countryCode[country.CountryCode];
    })
};



// VIEW
function displayAllTotal() {

    // display total cases
    elements.sumCasesTotal.innerHTML = `${state.globalResults.TotalConfirmed.toLocaleString()}`;
    state.allCasesSorted.forEach(country => {

        elements.sumCasesList.insertAdjacentHTML('beforeend', `
        <tr>
            <td>${country.casesRank}</td>
            <td>${country.Country}</td>
            <td class="text-warning">${country.TotalConfirmed.toLocaleString()}</td>
        </tr>
    `)
    });

    // display recovered cases
    elements.sumRecoveredTotal.innerHTML = `${state.globalResults.TotalRecovered.toLocaleString()}`;
    state.allRecoveredSorted.forEach(country => {
        elements.sumRecoveredList.insertAdjacentHTML('beforeend', `
        <tr>
            <td>${country.recoveredRank}</td>
            <td>${country.Country}</td>
            <td class="text-success">${country.TotalRecovered.toLocaleString()}</td>
        </tr>
    `)
    });

    // display deaths cases
    elements.sumDeathsTotal.innerHTML = `${state.globalResults.TotalDeaths.toLocaleString()}`;
    state.allDeathsSorted.forEach(country => {
        elements.sumDeathsList.insertAdjacentHTML('beforeend', `
        <tr>
            <td>${country.deathsRank}</td>
            <td>${country.Country}</td>
            <td class="text-danger">${country.TotalDeaths.toLocaleString()}</td>
        </tr>
    `)
    });
};


function displayAllRegion() {
    state.countryResults.forEach(country => {
        let listItem = `<td>${country.Country}</td>`;

        if (country.NewConfirmed === 0) {
            listItem = listItem.concat(`<td>${country.NewConfirmed}</td>`)
        } else {
            listItem = listItem.concat(`<td class="text-warning">${country.NewConfirmed}</td>`)
        }

        if (country.TotalConfirmed === 0) {
            listItem = listItem.concat(`<td>${country.TotalConfirmed}</td>`)
        } else {
            listItem = listItem.concat(`<td class="text-warning">${country.TotalConfirmed}</td>`)
        }

        if (country.NewDeaths === 0) {
            listItem = listItem.concat(`<td>${country.NewDeaths}</td>`)
        } else {
            listItem = listItem.concat(`<td class="text-danger">${country.NewDeaths}</td>`)
        }

        if (country.TotalDeaths === 0) {
            listItem = listItem.concat(`<td>${country.TotalDeaths}</td>`)
        } else {
            listItem = listItem.concat(`<td class="text-danger">${country.TotalDeaths}</td>`)
        }

        if (country.NewRecovered === 0) {
            listItem = listItem.concat(`<td>${country.NewRecovered}</td>`)
        } else {
            listItem = listItem.concat(`<td class="text-success">${country.NewRecovered}</td>`)
        }

        if (country.TotalRecovered === 0) {
            listItem = listItem.concat(`<td>${country.TotalRecovered}</td>`)
        } else {
            listItem = listItem.concat(`<td class="text-success">${country.TotalRecovered}</td>`)
        }


        elements.allTotal.insertAdjacentHTML('beforeend', listItem);

        if (country.continent === 'AF') {
            elements.afTotal.insertAdjacentHTML('beforeend', listItem);
        } else if (country.continent === 'AS') {
            elements.asTotal.insertAdjacentHTML('beforeend', listItem);
        } else if (country.continent === 'EU') {
            elements.euTotal.insertAdjacentHTML('beforeend', listItem);
        } else if (country.continent === 'NA') {
            elements.naTotal.insertAdjacentHTML('beforeend', listItem);
        } else if (country.continent === 'SA') {
            elements.saTotal.insertAdjacentHTML('beforeend', listItem);
        } else if (country.continent === 'OC') {
            elements.ocTotal.insertAdjacentHTML('beforeend', listItem);
        }
    });
}


controller();





