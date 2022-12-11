import { animateCards } from "./animations.js";



export const showWeatherData = (weatherData, locationName) => {
    const mainContainer =  $('#main')
    mainContainer.html('');

    for (const day in weatherData) {
        if (dayjs().format('dddd, MMMM Do') === day){
            mainContainer.append(createTodayDiv(weatherData[day], day, locationName))
        } else {
            mainContainer.append(createFutureWeatherDiv(weatherData[day], day));
        }
    }
    const cards = document.querySelectorAll('.animate');
    animateCards(cards);
    $('.weather-types').click(e=>{
        const dataType = e.target.dataset.type;
        const listElements = $(e.target).parent().children('li');
        const name = $(e.target).parent().parent().children('h1')[0].innerText;


        listElements.each(index=>{
            listElements[index].classList.remove('active')
        })
        const stats = $(e.target).parent().parent().children('div').children('div');
        stats.html(updateStat(dataType, weatherData[name]))


        e.target.classList.add('active');
    })
}


const createTodayDiv = (day, date, locationName) => {

    return `
    <section class="today animate">
    <div>
      <h1>${locationName.substring(0, locationName.indexOf('('))}</h1>
      <h2>${locationName.substring(locationName.indexOf('('))}</h2>
      <img src="http://openweathermap.org/img/wn/${day.icon}@2x.png" alt="">
      <p>${date}</p>
    </div>
    <div class="today-stats">
      <div>
        <h2>Temperature</h2>
        <ul>
          <li>Maxium: ${day.temp.highest} C</li>
          <li>Minimum: ${day.temp.lowest} C</li>
          <li>Average: ${day.temp.average} C</li>
        </ul>
      </div>
      <div>
        <h2>Wind</h2>
        <ul>
          <li>Maxium: ${day.wind.highest} KMPH</li>
          <li>Minimum: ${day.wind.lowest} KMPH</li>
          <li>Average: ${day.wind.average} KMPH</li>
        </ul>
      </div>
      <div>
        <h2>Humidity</h2>
        <ul>
          <li>Maxium: ${day.humidity.highest}%</li>
          <li>Minimum: ${day.humidity.lowest}%</li>
          <li>Average: ${day.humidity.average}%</li>
        </ul>
      </div>
    
    </div>

  </section>
    `
}

const createFutureWeatherDiv = (day, date) => {
    return `
    <section class="animate">
        <div class="content">
            <h1>${date}</h1>
            <img src="http://openweathermap.org/img/wn/${day.icon}@2x.png" alt="">
            <div class="temperature">
                <p class="min-temp">${day.temp.lowest}C</p>
                <p>${day.temp.highest}C</p>
            </div>
                 
            <ul class="weather-types">
                <li data-type="temp" class="active">Temperature</li>
                <li data-type="wind">Wind</li>
                <li data-type="humidity">Humidity</li>
            </ul>
            <div class="stats">
                <div class="grid-item">
                    <h2>Temperature:</h2>
                    <p>Maximum: ${day.temp.highest} C</p>
                    <p>Minimum: ${day.temp.lowest} C</p>
                    <p>Average: ${day.temp.average} C</p>
                </div>
          
            </div>
     </section>
    
    `
}

const updateStat = (type, day) => {

    switch (type) {
        case "temp":
            return `
            <h2>Temperature</h2>
            <p>Maximum: ${day.temp.highest} C</p>
            <p>Minimum: ${day.temp.lowest} C</p>
            <p>Average: ${day.temp.average} C</p>
            `
        case "wind": 
            return `
            <h2>Wind</h2>
            <p>Maximum: ${day.wind.highest} KMPH</p>
            <p>Minimum: ${day.wind.lowest} KMPH</p>
            <p>Average: ${day.wind.average} KMPH</p>
            `
        case "humidity":
            return `
            <h2>Humidity</h2>
            <p>Maximum: ${day.humidity.highest}%</p>
            <p>Minimum: ${day.humidity.lowest}%</p>
            <p>Average: ${day.humidity.average}%</p>
            `
    }
    return `
   
    `
}