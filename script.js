const regionNames = new Intl.DisplayNames(
  ['en'], {type: 'region'}
);
const showCityResults = () => {
  $('#found-cities').html('');
  $('#found-cities-container').css({visibility: "visible"})
}
const hideCityResults = () => {
  $('#found-cities').html('');
  $('#found-cities-container').css({visibility: "hidden"})
}

$('#search-city').on('click', (e) => {
  $('#search-city').val('');
})

let searchTimer;
let time = 0;

const searchTimerFunctions = {
  statTime: (searchQuery) => {
    searchTimer = setInterval(()=>{
      time += 100;
      if (time === 400){
        showSearchResults(searchQuery)
        clearInterval(searchTimer);
        time = 0;
        return;
      }
    }, 100);
  }, 
  stopTime: () => {
    if (searchTimer){
      time = 0;
      clearInterval(searchTimer);
    }
  }
}


$("#search-city").on("input", (e) => {
  if (e.target.value === "") {
    hideCityResults();
    return;
  }
  searchTimerFunctions.stopTime();
  searchTimerFunctions.statTime(e.target.value);
});

const showSearchResults = async (searchQuery) => {

  const response = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${searchQuery}&limit=10&appid=0092dc60f22b7d0f2d8752fc99b3dceb`
  );
  const citiesFound = await response.json();
  if (!citiesFound) return;
  showCityResults();
  const shownData = citiesFound.map((city) => {
    return {
      country: city.country,
      state: city.state ? city.state : null,
      name: city.name,
      lat: city.lat,
      long: city.lon,
    };
  });
  $('#found-cities').html('');
  shownData.forEach(city=>{
    const cityData = `${city.name}, ${city.state ? city.state : ''} (${regionNames.of(city.country)})`;
   
    $('#found-cities').append(`
        <li data-long="${city.long}" data-lat="${city.lat}">${cityData}</li>
    `)
  })
  $('#found-cities').children().on('click', (e)=>{
    const {lat, long} = e.target.dataset;
    findWeatherResults(parseInt(lat), parseInt(long));
    $('#search-city').val($(e.target).text());
    hideCityResults();
  })
};
//, wind: day.wind.speed, humidity: day.main.humidity})

const findWeatherResults = async (lat, lon) => {

  let weather = {};

  const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=0092dc60f22b7d0f2d8752fc99b3dceb`);
  const weatherData = await response.json()
  weatherData.list.forEach(day=>{
    let date = dayjs(day.dt_txt).format('dddd, MMMM Do');

    if (weather[date]){
      weather[date].temp = [...weather[date].temp, day.main.temp]
      weather[date].wind = [...weather[date].wind, day.wind.speed]
      weather[date].humidity = [...weather[date].humidity, day.main.humidity]
    } else {
      weather[date] = {temp:[day.main.temp], wind:[day.wind.speed], humidity: [day.main.humidity]}
    }


    if (!weather[date].icon) {
        weather[date].icon = day.weather[0].icon
    }
  })

  for (const day in weather){
    const tempStats = getWeatherStats(weather[day].temp);
    const windStats = getWeatherStats(weather[day].wind);
    const humidityStats = getWeatherStats(weather[day].humidity);

    weather[day] = {temp: tempStats, wind: windStats, humidity: humidityStats};
  }

  

}

const getWeatherStats = (typeOfWeather) => {
  let lowest = Math.min(...typeOfWeather.map(item=>item)).toFixed(1);
  let highest = Math.max(...typeOfWeather.map(item=>item)).toFixed(1);
  let average = (typeOfWeather.reduce((a, b)=> a + b, 0) / typeOfWeather.length).toFixed(1);

  return {lowest, highest, average};
}