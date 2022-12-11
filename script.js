import { animateHomeTitle } from './animations.js';
import {findWeatherResults} from './getWeatherData.js'
import { updatePrevSearches } from './previouslySearched.js';
updatePrevSearches(); // Gets and shows previously searched cities
animateHomeTitle()

// Region name converter, openweather api returns abbreviated country names e.g US or AU, changes it to full name
const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

// Shows found cities
const showCityResults = () => {
  $("#found-cities").html("");
  $("#found-cities-container").css({ visibility: "visible" });
};
// Hides found cities
const hideCityResults = () => {
  $("#found-cities").html("");
  $("#found-cities-container").css({ visibility: "hidden" });
};

// Removes value to make searching easier on click
$("#search-city").on("click", (e) => {
  $("#search-city").val("");
});

let searchTimer;
let time = 0;

// This timer is to stop over calling the api. 
const searchTimerFunctions = {
  statTime: (searchQuery) => {
    // Creates timer, if 400ms has elapsed since last input then the api is called
    searchTimer = setInterval(() => {
      time += 100;
      if (time === 400) {
        showSearchResults(searchQuery);
        clearInterval(searchTimer);
        time = 0;
        return;
      }
    }, 100);
  },
  stopTime: () => {
    if (searchTimer) {
      time = 0;
      clearInterval(searchTimer);
    }
  },
};

$("#search-city").on("input", (e) => {
  if (e.target.value === "") {
    // Checks if empty input box, hides results and doesnt call timer
    hideCityResults();
    return;
  }
  // Stops time then starts, waiting for last input
  searchTimerFunctions.stopTime();
  searchTimerFunctions.statTime(e.target.value);
});

const showSearchResults = async (searchQuery) => {
  // Calling api
  const response = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${searchQuery}&limit=10&appid=0092dc60f22b7d0f2d8752fc99b3dceb`
  );
  const citiesFound = await response.json();
  if (!citiesFound) return; // Returns if nothing found
  showCityResults(); // Shows list of city div
  const shownData = citiesFound.map((city) => {
    return {
      country: city.country,
      state: city.state ? city.state : null, // Some cities do not have a state attatched to them
      name: city.name,
      lat: city.lat,
      long: city.lon,
    };
  });
  $("#found-cities").html("");
  shownData.forEach((city) => {
    // Appends each found city to the found cities div
    const cityName = `${city.name}, ${
      city.state ? city.state : ""
    } (${regionNames.of(city.country)})`;

    $("#found-cities").append(`
        <li data-long="${city.long}" data-lat="${city.lat}">${cityName}</li>
    `);
  });
  // Creates onclick handlers for each city found
  $("#found-cities")
    .children()
    .on("click", (e) => {
      const locationName = $(e.target).text();
      const { lat, long } = e.target.dataset;
      // Saves search to localstorage on click and updates previously searched
      saveSearchToLS({lat, long, locationName, id: Date.now()});
      updatePrevSearches();
      // Shows weather results from lat and long, location name is used for the weather today
      findWeatherResults(parseInt(lat), parseInt(long), locationName);
      $("#search-city").val(locationName);
      hideCityResults();
    });
};


const saveSearchToLS = (search) => {
  const searchLS = JSON.parse(localStorage.getItem('search'));
  if (searchLS) {
    // Checks if city has already been searched and updates time
    const searchContains = searchLS.filter(s=>{
      if (s.locationName === search.locationName) {
        return s;
      }
    })
    if (searchContains.length > 0) {
      const newSearch = searchLS.map(s=>{
        if (s.locationName === search.locationName){
          return {...s, id: Date.now()}
        }
        return s;
      })
      localStorage.setItem('search', JSON.stringify(newSearch));
      return;
    }
    // Adds search to end of local storage
      localStorage.setItem('search', JSON.stringify([...searchLS, search]));
    
  } else {
    // Adds first search to local storage
    localStorage.setItem('search', JSON.stringify([search]));
  }
}