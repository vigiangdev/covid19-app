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
}

const state = {};

// // CONTROLLER
async function controller() {

    // get data from API and store it in state.countryResults
    try {
        await getResult();

        displayAllTotal();

        // displayCountryResults();

    } catch (err) {
        console.log('controller', err);
    }
}


// // MODEL
async function getResult() {
    // await fetch("https://api.covid19api.com/summary"
    // )
    //     .then(response => {
    //         return response.json();
    //     })
    //     .then(result => {
    //         console.log(result);
    //         state.globalResults = result.Global;
    //         state.countryResults = result.Countries;
    //     })
    //     .catch(err => {
    //         console.log('fetchAPI', err);
    //     });
};



// VIEW
// ALL
function displayAllTotal() {
    console.log(state);
    console.log(state.globalResults);

    // elements.sumCasesTotal.innerHTML = `${state.globalResults.TotalConfirmed}`;
    // state.countryResults.forEach(country => {
    //     elements.sumCasesList.insertAdjacentHTML('beforeend', `
    //     <tr>
    //         <td>${country.Country}</td>
    //         <td>${country.TotalConfirmed}</td>
    //     </tr>
    // `)
    // })
}









// function displayCountryResults() {
//     state.countryResults.forEach(country => {
//         elements.resData.insertAdjacentHTML('beforeend', `
//             <tr>
//                 <td>${country.Country}</td>
//                 <td>${country.NewConfirmed}</td>
//                 <td>${country.TotalConfirmed}</td>
//                 <td>${country.NewDeaths}</td>
//                 <td>${country.TotalDeaths}</td>
//                 <td>${country.NewRecovered}</td>
//                 <td>${country.TotalRecovered}</td>
//             </tr>
//             `
//         )
//     });
// }

// function displayTotalResults() {
//     elements.resTotal.innerHTML = 
//     elements.resToday.innerHTML = 

// }


controller();





