import { showWeatherData } from "./showWeatherData.js";

export const findWeatherResults = async (lat, lon, locationName) => {
  // Fetches weather data
   await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=0092dc60f22b7d0f2d8752fc99b3dceb`
    )
    .then(res=>res.json())
    .then(weatherData=>{
      const weatherByDay = getWeatherByDay(weatherData.list);
      showWeatherData(weatherByDay, locationName);
    })
    .catch(error=>{
      return;
    })
 
  };
  

const getWeatherByDay = (days) => {
    let weather = {};
    // Each day from the weather api has 3 seperate entries, sorting each day and adding temperature, wind and humidity
    days.forEach((day) => {
      let date = dayjs(day.dt_txt).format("dddd, MMMM Do");
  
      if (weather[date]) {
        weather[date].temp = [...weather[date].temp, day.main.temp];
        weather[date].wind = [...weather[date].wind, day.wind.speed];
        weather[date].humidity = [...weather[date].humidity, day.main.humidity];
      } else {
        weather[date] = {
          temp: [day.main.temp],
          wind: [day.wind.speed],
          humidity: [day.main.humidity],
        };
      }
  
      if (!weather[date].icon) {
        weather[date].icon = day.weather[0].icon;
      }
    });
    // Getting min, max and average of wind, temperature and humidity
    for (const day in weather) {
      const tempStats = getWeatherStats(weather[day].temp);
      const windStats = getWeatherStats(weather[day].wind);
      const humidityStats = getWeatherStats(weather[day].humidity);
  
      weather[day] = {
        temp: tempStats,
        wind: windStats,
        humidity: humidityStats,
        icon: weather[day].icon
      };
    }
    return weather;
  };
  
  const getWeatherStats = (typeOfWeather) => {
    let lowest = Math.min(...typeOfWeather.map((item) => item)).toFixed(1);
    let highest = Math.max(...typeOfWeather.map((item) => item)).toFixed(1);
    let average = (
      typeOfWeather.reduce((a, b) => a + b, 0) / typeOfWeather.length
    ).toFixed(1);
  
    return { lowest, highest, average };
  };
  