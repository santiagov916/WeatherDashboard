// Global var
var apiRoot = 'http://api.openweathermap.org';
var apiRootWeather = 'https://api.openweathermap.org';
var apiKey = 'b0af02ce6d6578e341aee9bf7fa71ce7';


// function for when we search for a city
function grabAndSearch() {

    var cityInput = document.getElementById('city-input');
    var search = cityInput.value.trim();

    apiGeoCode(search);
    cityInput.value = '';

};

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
        console.log(city, data);
    })
    .catch(function (err) {
        console.log(err)
    });
}


function apiGeoCode(search) {


    http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}

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

// componets for saving already searchedcity for history



// function for a histoy search`