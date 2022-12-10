import { findWeatherResults } from "./getWeatherData.js";




export const updatePrevSearches = () => {
    const getPrevSearches = () => {
        const prevSearchLS = JSON.parse(localStorage.getItem('search'));
        if (prevSearchLS) {
             
            return `
                ${prevSearchLS.map(search=>{
                    const locationName = search.locationName.substring(0, search.locationName.indexOf('('))
                    return `<li data-lat="${search.lat}" data-long="${search.long}" data-fullname="${search.locationName}">${locationName}</li>`
                }).join('')}
            `
        } else {
            return ""
        }
    }
    $('#prev-search').html(getPrevSearches())
    const searches = $('#prev-search').children();

    searches.on('click', e => {
        const {lat, long, fullname} = e.target.dataset;
        findWeatherResults(parseInt(lat), parseInt(long), fullname);
    })
}

