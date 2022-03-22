// Global var
var historyStorage = [];
var apiRoot = 'https://api.openweathermap.org';
var apiRootWeather = 'https://api.openweathermap.org';
var apiKey = 'b0af02ce6d6578e341aee9bf7fa71ce7';

var fiveDayContainter = document.querySelector('#display-each-card');
var todaysForecastContainer = document.querySelector('#todays-forecast');
var cityTitle = document.querySelector('#city-title');
var historyContainer = document.querySelector('#recents');
var firstSearch = document.querySelector('#search-city');
var cityInput = document.querySelector('#city-input')

dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);


// function for when we search for a city
function searchButtonClicker() {
    console.log(localStorage)
    historyContainer.innerHTML = '';

    for (var i = historyStorage.length - 1; i >= 0; i--) {
        var historyPlacer = document.createElement('div');
        historyPlacer.setAttribute('class', 'card m-3 bg-dark');

        var historyBody = document.createElement('div');
        historyBody.setAttribute('class', 'card-body text-center');

        var btn = document.createElement('button');
        btn.setAttribute('class', 'card-text text-light bg-dark history-btn');
        btn.setAttribute('data-search', historyStorage[i]);
        btn.textContent = historyStorage[i];


        historyBody.append(btn);
        historyPlacer.append(historyBody);
        historyContainer.append(historyPlacer);
    }
}

function startHistorySearch() {
    var checkHistory = localStorage.getItem('history');

    if (checkHistory) {
        historyStorage = JSON.parse(checkHistory);
    }

    searchButtonClicker();
}

// componets for saving already searchedcity for history
function addToHistory(search) {

        if (historyStorage.indexOf(search) !== -1) {
            return;
        }
        historyStorage.push(search);
    
        localStorage.setItem('history', JSON.stringify(historyStorage));
        searchButtonClicker();

}

function dispalyTodaysWeather(city, weather, timezone) {

    var date = dayjs().tz(timezone).format('M/D/YYYY');
    var temp = weather.temp;
    var wind = weather.wind_speed;
    var humidity = weather.humidity;

    var todaysDate = document.querySelector('#todays-date');
    todaysDate.setAttribute('class', 'ml-5 font-weight-bold');
    todaysDate.textContent = `${date}`;

    var listToday = document.createElement('ul');
    listToday.setAttribute('class', 'todays-list');

    var tempList = document.createElement('li');
    tempList.textContent = `Temp: ${temp}`;

    var windList = document.createElement('li');
    windList.textContent = `Wind Speed: ${wind}mph`;

    var humidityList = document.createElement('li');
    humidityList.textContent = `Humidity: ${humidity}%`;

    listToday.append(tempList, windList, humidityList);
    todaysForecastContainer.innerHTML = '';
    todaysForecastContainer.append(listToday);
}

function forCreatingForecastCard(forecast, timezone) {

    var unixTs = forecast.dt;

    var tempMin = forecast.temp.min;
    var tempMax = forecast.temp.max;
    var wind = forecast.wind_speed;
    var humidity = forecast.humidity;

    var iconUrl = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;

    var iconDescription = forecast.weather[0].description;

    var cardPlacer = document.createElement('div');
    cardPlacer.setAttribute('class', 'col-4 p-1');

    var actualCard = document.createElement('div');
    actualCard.setAttribute('class', 'card m-2 w-100');

    var cardImg = document.createElement('img');
    cardImg.setAttribute('src', iconUrl);
    cardImg.setAttribute('alt', iconDescription);
    cardImg.classList.add('icon');

    var cardBody = document.createElement('div');
    cardBody.setAttribute('class', 'card-body p-1');

    var cardHeader = document.createElement('h3');
    cardHeader.setAttribute('class', 'card-title text-center border-bottom');

    var temperatureMin = document.createElement('p');
    temperatureMin.setAttribute('class', 'card-text p-2 text-left');
    temperatureMin.textContent = `Minimum Temp: ${tempMin}`;

    var temperatureMax = document.createElement('p');
    temperatureMax.setAttribute('class', 'card-text p-2 text-left');
    temperatureMax.textContent = `Maximum Temp: ${tempMax}`;

    var windSpace = document.createElement('p');
    windSpace.setAttribute('class', 'card-text p-2 text-left');
    windSpace.textContent = `Wind speed: ${wind} mph`;

    var humiditySpace = document.createElement('p');
    humiditySpace.setAttribute('class', 'card-text p-2 text-left');
    humiditySpace.textContent = `Humidity: ${humidity} %`;
    console.log(tempMin)
    
    var dateOf = document.createElement('h5');
    dateOf.setAttribute('class', 'card-title text-primary');
    dateOf.textContent =dayjs.unix(unixTs).tz(timezone).format('M/D/YYYY');

    cardBody.append(dateOf, temperatureMin, temperatureMax, windSpace, humiditySpace);
    actualCard.append(cardImg, cardBody);
    cardPlacer.append(actualCard);
    fiveDayContainter.append(cardPlacer);



}

function displayFiveDayForecast(dailyForecast, timezone) {

    var startDt = dayjs().tz(timezone).add(1, 'day').startOf('day').unix();
    var endDt = dayjs().tz(timezone).add(6, 'day').startOf('day').unix();

    var cityEl = document.createElement('h3');
    cityEl.textContent = `5-day forecast:`;
    var headerDiv = document.createElement('div');
    headerDiv.setAttribute('class', 'col-12 mr-auto show-city-name border-bottom');

    headerDiv.append(cityEl);
    fiveDayContainter.innerHTML = '';
    fiveDayContainter.append(headerDiv);


    for (var int = 0; int < dailyForecast.length; int++) {

        if (dailyForecast[int].dt >= startDt && dailyForecast[int].dt < endDt) {

            forCreatingForecastCard(dailyForecast[int], timezone);
        }
    }

}

function displayItems(city, data) {
    dispalyTodaysWeather(city, data.current, data.timezone);
    displayFiveDayForecast(data.daily, data.timezone);
}

// function for api request
function getApiInfo(location) {

    var { lat } = location;
    var { lon } = location;
    var city = location.name;

    var apiForWeather = `${apiRootWeather}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly,alerts&appid=${apiKey}`;

    fetch(apiForWeather)
    .then(function(response) {

        if (response.ok) {
            response.json().then(function(data) {
                cityTitle.textContent = `${city}`;
                displayItems(city, data);
            })
        }
    })
}

function apiGeoCode(search) {

    var apiUrl = `${apiRoot}/geo/1.0/direct?q=${search}&limit=1&appid=${apiKey}`;

   fetch(apiUrl)
   .then(function(response) {
    // request was successful
    if (response.ok) {
      response.json().then(function(data) {
        addToHistory(search);
        getApiInfo(data[0]);
      });
    } else {
      alert('Error: Location doesn`t exist!');
    }
  })

}

function grabAndSearch(e) {

    if (!cityInput.value) {
        return;
    }
    e.preventDefault();
    var search = cityInput.value.trim();
    apiGeoCode(search);
    cityInput.value = '';

};

function initSearch(e) {
    if(!e.target.matches('.history-btn')) {
        return;
    }

    var btn = e.target;
    var search= btn.getAttribute('data-search');
    apiGeoCode(search);
}

startHistorySearch();
firstSearch.addEventListener('click', grabAndSearch);
historyContainer.addEventListener('click', initSearch);