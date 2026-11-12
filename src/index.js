// Temp control variables
const increaseTempControl = document.getElementById('increaseTempControl');
const decreaseTempControl = document.getElementById('decreaseTempControl');
const currentTempButton = document.getElementById('currentTempButton');
const cityNameInput = document.getElementById('cityNameInput');
const tempValue = document.getElementById('tempValue');
const landscape = document.getElementById('landscape');
const headerCityName = document.getElementById('headerCityName');
const skyDropdown = document.getElementById('skySelect');
const cityNameReset = document.getElementById('cityNameReset');

let temperature = 0;
const defaultCity = 'Seattle';

// Update temperature display color and landscape
const updateTempGraphics = (temperature) => {
    if (temperature >= 90) {
        tempValue.style.color = 'red';
        changeImage('landscape_photos/desert.jpg', landscape);
    } else if (temperature < 90 && temperature >= 80) {
        tempValue.style.color = 'pink';
        changeImage('landscape_photos/beach.jpg', landscape);
    } else if (temperature < 80 && temperature >= 70) {
        tempValue.style.color = 'orange'
        changeImage('landscape_photos/meadow.jpg', landscape);
    } else if (temperature < 70 && temperature >= 60) {
        tempValue.style.color = 'yellow'
        changeImage('landscape_photos/springs.jpg', landscape);
    } else if (temperature < 60 && temperature >= 50) {
        tempValue.style.color = 'green'
        changeImage('landscape_photos/forest.jpg', landscape);
    } else if (temperature < 50 && temperature >= 40) {
        tempValue.style.color = 'teal'
        changeImage('landscape_photos/mist.jpg', landscape);
    } else {
        tempValue.style.color = 'blue'
        changeImage('landscape_photos/snow.jpg', landscape);
    }
};

// Change landscape
const changeImage = (imageName, container) => {
    const image = document.createElement('img');

    image.src = `./assets/${imageName}`;
    container.replaceChildren(image);
};

// Temperature controls
const updateTemp = () => {
    tempValue.textContent = `${temperature}°F`;
    updateTempGraphics(temperature);
};

// Increase temperature
const increaseTemperature = () => {
    temperature += 1;
    updateTemp();
};

// Decrease temperature
const decreaseTemperature = () => {
    temperature -= 1;
    updateTemp();
};


// Update the sky
const updateSky = (skySelect) => {
    if (skySelect === 'Sunny') {
        document.body.style.backgroundImage = "url('./assets/sky_photos/sunny.jpg')";
    } else if (skySelect === 'Cloudy') {
        document.body.style.backgroundImage = "url('./assets/sky_photos/cloudy.jpg')";
    } else if (skySelect === 'Stormy') {
        document.body.style.backgroundImage = "url('./assets/sky_photos/stormy.jpg')";
    } else if (skySelect === 'Rainy') {
        document.body.style.backgroundImage = "url('./assets/sky_photos/rainy.jpg')";
    } else if (skySelect === 'Snowy') {
        document.body.style.backgroundImage = "url('./assets/sky_photos/snowy.jpg')";
    } else if (skySelect === 'Dusk') {
        document.body.style.backgroundImage = "url('./assets/sky_photos/dusk.jpg')";
    } else if (skySelect === 'Dawn') {
        document.body.style.backgroundImage = "url('./assets/sky_photos/dawn.jpg')";
    } else if (skySelect === 'Rainbow') {
        document.body.style.backgroundImage = "url('./assets/sky_photos/rainbow.jpg')";
    }
};


// Location and weather API

const findLatitudeAndLongitude = (query) => {
    return axios
        .get('https://ada-weather-report-proxy-server.onrender.com/location', {
            params: {
                q: query,
            },
        })
        .then((response) => {
            if (!response.data || response.data.length === 0) {
                throw new Error('City not found');
            }

            const lat = response.data[0].lat;
            const lon = response.data[0].lon;

            return findWeather(lat, lon);
        })
        .catch((error) => {
            console.log('error!', error);
            throw error;
        });
};


const findWeather = (lat, lon) => {
    return axios
        .get('https://ada-weather-report-proxy-server.onrender.com/weather', {
            params: {
                lat: lat,
                lon: lon,
            },
        })
        .then((response) => {
            const tempKelvin = response.data.main.temp;
            const tempFahrenheit = Math.round(
                (tempKelvin - 273.15) * (9 / 5) + 32
            );

            return tempFahrenheit;
        })
        .catch((error) => {
            console.log('error!', error);
            throw error;
        });
};


// Change temperature with city

const changeTempWithCity = (city) => {
    return findLatitudeAndLongitude(city)
        .then((newTemp) => {
            temperature = newTemp;
            updateTemp();

            return newTemp;
        })
        .catch((error) => {
            console.log('Error updating temp:', error);
        });
};

// Update city name

const updateCityName = () => {
    headerCityName.textContent = cityNameInput.value;
};

// Reset city name

const resetCityName = () => {
    cityNameInput.value = defaultCity;
    updateCityName();
};

// Event logic

const registerEventHandlers = () => {
    decreaseTempControl.addEventListener('click', decreaseTemperature);
    increaseTempControl.addEventListener('click', increaseTemperature);
    cityNameInput.addEventListener('input', updateCityName);
    cityNameReset.addEventListener('click', resetCityName);
    currentTempButton.addEventListener('click', () => {
        const city = cityNameInput.value.trim();
        changeTempWithCity(city);
    });

    skyDropdown.addEventListener('change', (event) => {
        const selectedSky = event.target.value;
        updateSky(selectedSky);
    });
};


// Application initialization

document.addEventListener('DOMContentLoaded', () => {
    // Initialize temperature display
    updateTemp();
    // Initialize city name display
    updateCityName();
    // Register event handlers
    registerEventHandlers();

    // Initialize sky baackground 
    updateSky(skyDropdown.value);

});
