import { findWeatherResults } from "./getWeatherData.js";

export const updatePrevSearches = () => {
  const getPrevSearches = () => {
    const prevSearchLS = JSON.parse(localStorage.getItem("search"));
    if (prevSearchLS) {
      // Sorts each search by time created, id is Date.now()
      let sorteByTime = [...prevSearchLS];
      sorteByTime.sort((a, b) => {
        return b.id - a.id;
      });
      // Created a list element for each previous search with lat, long and location name datasets
      return `
                ${sorteByTime
                  .map((search) => {
                    const locationName = search.locationName.substring(
                      0,
                      search.locationName.indexOf("(")
                    );
                    return `<li data-lat="${search.lat}" data-long="${search.long}" data-fullname="${search.locationName}">${locationName}</li>`;
                  })
                  .join("")}
            `;
    } else {
      return "";
    }
  };
  $("#prev-search").html(getPrevSearches());


  const searches = $("#prev-search").children();
  // Creates on click listener to each previously searched city that finds weather 
  searches.on("click", (e) => {
    const { lat, long, fullname } = e.target.dataset;
    findWeatherResults(parseInt(lat), parseInt(long), fullname);
  });
};
