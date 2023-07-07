// // Define global variables
// const API_KEY = '2969e907435e4b1a3e5fe5f96ff45d10';
// const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';
// const searchFormEl = document.querySelector('#search-form');
// const searchInputEl = document.querySelector('#search-input');
// const searchHistoryEl = document.querySelector('#search-history');
// const currentWeatherEl = document.querySelector('#current-weather');
// const forecastEl = document.querySelector('#forecast');

// // Load search history from local storage
// let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

// // Function to save search history to local storage
// function saveSearchHistory() {
//   localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
// }

// // Function to render search history
// function renderSearchHistory() {
//   searchHistoryEl.innerHTML = '';

//   searchHistory.forEach(city => {
//     const cityEl = document.createElement('li');
//     cityEl.textContent = city;
//     searchHistoryEl.appendChild(cityEl);
//   });
// }

// // Function to get current weather data for a city
// function getCurrentWeather(city) {
//   fetch(`${API_BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`)
//     .then(response => {
//       if (!response.ok) {
//         throw new Error('Failed to retrieve current weather data');
//       }
//       return response.json();
//     })
//     .then(data => {
//       renderCurrentWeather(data);
//     })
//     .catch(error => {
//       console.error(error);
//       currentWeatherEl.innerHTML = '<p class="error-message">Failed to retrieve current weather data</p>';
//     });
// }

// // Function to render current weather data
// function renderCurrentWeather(data) {
//   const { name, weather, main, wind } = data;

//   // Create elements for city name, weather icon, temperature, humidity, and wind speed
//   const cityEl = document.createElement('h2');
//   cityEl.textContent = name;

//   const weatherIconEl = document.createElement('img');
//   weatherIconEl.setAttribute('src', `http://openweathermap.org/img/wn/${weather[0].icon}.png`);
//   weatherIconEl.setAttribute('alt', weather[0].description);

//   const temperatureEl = document.createElement('p');
//   temperatureEl.innerHTML = `Temperature: ${main.temp}&deg;C`;

//   const humidityEl = document.createElement('p');
//   humidityEl.textContent = `Humidity: ${main.humidity}%`;

//   const windSpeedEl = document.createElement('p');
//   windSpeedEl.textContent = `Wind Speed: ${wind.speed} m/s`;

//   // Clear current weather container and append new elements
//   currentWeatherEl.innerHTML = '';
//   currentWeatherEl.appendChild(cityEl);
//   currentWeatherEl.appendChild(weatherIconEl);
//   currentWeatherEl.appendChild(temperatureEl);
//   currentWeatherEl.appendChild(humidityEl);
//   currentWeatherEl.appendChild(windSpeedEl);
// }

// // Function to get 5-day forecast data for a city
// function getForecast(city) {
//   fetch(`${API_BASE_URL}/forecast?q=${city}&units=metric&appid=${API_KEY}`)
//     .then(response => {
//       if (!response.ok) {
//         throw new Error('Failed to retrieve forecast data');
//       }
//       return response.json();
//     })
//     .then(data => {
//       renderForecast(data);
//     })
//     .catch(error => {
//       console.error(error);
//       forecastEl.innerHTML = '<p class="error-message">Failed to retrieve forecast data</p>';
//     });
// }

// // Function to render 5-day forecast data
// function renderForecast(data) {
//   const forecastData = data.list.filter((item, index) => index % 8 === 0); // Filter




// Declaring necessary variables
var API_KEY = "2969e907435e4b1a3e5fe5f96ff45d10";
var searchFormEl = document.querySelector("#search-form");
var searchInputEl = document.querySelector("#search-input");
var searchHistoryEl = document.querySelector("#search-history");
var currentWeatherEl = document.querySelector("#current-weather");
var forecastEls = document.querySelectorAll("#forecast");
var searchBtnEl = document.querySelector("#search-btn");
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Variables
var searchHistory = [];

// Function search 
function searchHandler(event) {
    event.preventDefault();
    const searchInputEl = document.querySelector("#search-input");
    const city = searchInputEl.value.trim();

    if (!city) {
        return;
    }

    getWeather(city);
    searchInputEl.value = "";
}

searchBtnEl.addEventListener('click', searchHandler);

// Function getWeather
async function getWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("City not found");
        }

        const weatherData = await response.json();
        const coords = {
            lat: weatherData.coord.lat,
            lon: weatherData.coord.lon,
        };
        saveCity(city);
        displayWeather(weatherData, city);
        getForecast(coords);
    } catch (error) {
        alert("Could not load city.\nTry Another City");
    }
}

// Function getCurrentDate 
function getCurrentDate() {
    const currentDate = new Date();
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    return currentDate.toLocaleDateString("en-US", options);
}

// Displays the current weather data for a city 
function displayWeather(data, city) {
    // Update the HTML elements with the weather data
    const cityNameEl = document.getElementById("city-name");
    const currentIconEl = document.getElementById("weather-icon");
    const currentTempEl = document.getElementById("temperature");
    const currentHumidityEl = document.getElementById("humidity");
    const currentWindEl = document.getElementById("wind-speed");
    cityNameEl.textContent = `${city} (${getCurrentDate()})`;
    currentIconEl.setAttribute("src", `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`);
    currentTempEl.textContent = `Temperature: ${data.main.temp} °F`;
    currentHumidityEl.textContent = `Humidity: ${data.main.humidity}%`;
    currentWindEl.textContent = `Wind Speed: ${data.wind.speed} MPH`;

    // Get the 5-day forecast for the city
    getForecast({ lat: data.coord.lat, lon: data.coord.lon });
}

// Retrieves the 5-day forecast data for a city
function getForecast(coords) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${API_KEY}`;

    fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
            // Select the forecast element and clear its contents
            const forecastEl = document.querySelector('#forecast');
            forecastEl.innerHTML = '';

            // Get the date for today and the next four days
            const today = new Date();
            let currentDay = today.getDay();

            // Loop through the forecast data for the next 5 days and create an element for each day
            for (let i = 0; i < 5; i++) {
                const forecastData = data.list[i * 8]; // Data for each day is every 8th item in the list
                const forecastDay = daysOfWeek[currentDay];
                const forecastIcon = forecastData.weather[0].icon;
                const forecastTemp = Math.round(forecastData.main.temp);
                const forecastWind = Math.round(forecastData.wind.speed);
                const forecastHumidity = Math.round(forecastData.main.humidity);

                // Create the HTML for the forecast element
                const forecastElement = `
                    <div class="forecast-single">
                        <h5 class="day">${forecastDay}</h5>
                        <p class="temp">
                            <img src="http://openweathermap.org/img/wn/${forecastIcon}.png" alt="${forecastData.weather[0].description}" />
                        </p>
                        <p class="temp">Temp: ${forecastTemp}&deg;C</p>
                        <p class="temp">Wind: ${forecastWind} km/h</p>
                        <p class="temp">Humidity: ${forecastHumidity}%</p>
                    </div>
                `;

                // Add the forecast element to the forecast element container
                forecastEl.insertAdjacentHTML('beforeend', forecastElement);

                // Increment the day counter
                currentDay = (currentDay + 1) % 7;
            }
        })
        .catch((error) => {
            console.error('Error fetching forecast data:', error);
        });
}

// Saves a city to local storage
function saveCity(city) {
    let cities = JSON.parse(localStorage.getItem("cities")) || [];
    if (!cities.includes(city.toLowerCase())) {
        cities.unshift(city.toLowerCase());
        localStorage.setItem("cities", JSON.stringify(cities));
        displaySearchHistory();
    }
}

// Display search history
function displaySearchHistory() {
    var history = document.querySelector("#history-list");
    history.innerHTML = "";

    var cities = JSON.parse(localStorage.getItem("cities")) || [];

    for (var i = 0; i < cities.length; i++) {
        var city = cities[i];

        var liEl = document.createElement("li");
        liEl.classList.add("list-group-item", "history-item");
        liEl.textContent = city;
        liEl.setAttribute("data-city", city);
        liEl.addEventListener("click", function () {
            getWeather(this.getAttribute("data-city"));
        });

        history.appendChild(liEl);
    }
}

displaySearchHistory();
