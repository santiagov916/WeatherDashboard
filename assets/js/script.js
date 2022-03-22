// Global var
var apiRoot = 'http://api.openweathermap.org';
var apiRootWeather = 'https://api.openweathermap.org';
var apiKey = 'b0af02ce6d6578e341aee9bf7fa71ce7';

var fiveDayForecast = document.querySelector('#five-day-forecast');
var forecastCardContainer = document.querySelector('#display-each-card');
var todaysForecastContainer = document.querySelector('#todays-forecast');


// function for when we search for a city


// componets for saving already searchedcity for history



// function for a histoy search`

function dispalyTodaysWeather() {

}

function forCreatingForecastCard(city, weather) {
    // response data
    var tempF = weather.temp;
    var wind = weather.wind_speed;
    var humidity = weather.humidity;

    console.log(tempF);
    console.log(wind);
    console.log(humidity);

    console.log(city);

    var cardContainer = document.createElement('div');
    cardContainer.setAttribute('class', 'col-4 p-1');

    var actualCard = document.createElement('div');
    actualCard.setAttribute('class', 'm-2 w-100');

    var cardImg = document.createElement('span');
    cardImg.setAttribute('class', 'card-img-rainy');

    var cardBody = document.createElement('div');
    cardBody.setAttribute('class', 'card-body p-1');

    var cardHeader = document.createElement('h3');
    cardHeader.setAttribute('class', 'card-title text-center border-bottom');

    var temperature = document.createElement('p');
    temperature.setAttribute('class', 'p-2 text-left');
    temperature.textContent = `Temp: ${tempF}`;

    var windSpace = document.createElement('p');
    windSpace.setAttribute('class', 'p-2 text-left');
    windSpace.textContent = `Wind speed: ${wind} mph`;

    var humiditySpace = document.createElement('p');
    humiditySpace.setAttribute('class', 'p-2 text-left');
    humiditySpace.textContent = `Humidity: ${humidity} %`;

    cardBody.append(cardHeader, temperature, windSpace, humiditySpace);
    actualCard.append(cardImg, cardBody);
    cardContainer.append(actualCard);
    forecastCardContainer.append(cardContainer);
}

function displayFiveDayForecast(city, dailyForecast) {

    var cityEl = document.createElement('h3');
    cityEl.textContent = `5-day forecast for: ${city}`;
    var headerDiv = document.createElement('div');
    headerDiv.setAttribute('class', 'col-12 mr-auto show-city-name border-bottom');

    headerDiv.append(cityEl);
    fiveDayForecast.append(headerDiv);

    forCreatingForecastCard(dailyForecast);
}

function displayItems(city, data) {
    dispalyTodaysWeather(city, data.current, data);
    displayFiveDayForecast(city, data.daily, data);
}

// function for api request
function getApiInfo(location) {

    var { lat } = location;
    var { lon } = location;
    var city = location.name;

    var apiForWeather = `${apiRootWeather}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly,alerts&appid=${apiKey}`;

    fetch(apiForWeather)
    .then(function (res) {
        return res.json();
    })
    .then(function (data) {
        displayItems(city, data)
    })
    .catch(function (err) {
        console.log(err)
    });
}

function apiGeoCode(search) {

    var apiUrl = `${apiRoot}/geo/1.0/direct?q=${search}&limit=5&appid=${apiKey}`;

    fetch(apiUrl)
    .then( function(res) {
        console.log(res)
        return res.json();
    })
    .then(function (data) {
        if (!data[0]) {
            alert("Location doesn't exist!");
        } else {
            getApiInfo(data[0]);
        }
    })
    .catch(function (err) {
        console.log(err);
    });

}

function grabAndSearch() {

    var cityInput = document.getElementById('city-input');
    var search = cityInput.value.trim();

    apiGeoCode(search);
    cityInput.value = '';

};