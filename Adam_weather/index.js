document.addEventListener("DOMContentLoaded",() => {
    const apiKey = "ed74b2c5383e38805e1ba0233f400c66";
    const form = document.getElementById("location");
    const search = document.querySelector(".search");
    const temperature = document.querySelector(".temperature");
    const city = document.querySelector(".City-name");
    const time = document.querySelector(".time");
    const date = document.querySelector(".date");
    const condition = document.querySelector (".condition");
    const weatherIcon = document.getElementById("weather-icon");
    const weatherDeets = {
        humidity: document.querySelector(".details ul li:nth-child(2) .value"),
        wind: document.querySelector(".details ul li:nth-child(3) .value"),
        cloudy: document.querySelector(".details ul li:nth-child(1) .value"),
        rain: document.querySelector(".details ul li:nth-child(4) .value"),
    };

    
    class Weather {
        constructor(city, temperature, condition, humidity, windSpeed, clouds, rain, dt, timezone_offset) {
            this.city = city;
            this.temperature = temperature;
            this.condition = condition;
            this.humidity = humidity;
            this.windSpeed = windSpeed;
            this.clouds = clouds; 
            this.rain = rain; 
            this.dt = dt;
            this.timezone_offset = timezone_offset;
        }
    }

    class UI {
        static displayWeather(weather) {
            city.textContent = weather.city;
            temperature.textContent = `${Math.round(weather.temperature)}°`;
            condition.textContent = weather.condition;
            const adjustedTime = new Date((weather.dt + weather.timezone_offset) * 1000);
            const hours = adjustedTime.getUTCHours();
            const minutes = adjustedTime.getUTCMinutes();
            const timeString = `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
            const dateString = adjustedTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
            time.textContent = `${timeString} -`;
            date.textContent = dateString;
            weatherDeets.humidity.textContent = `${weather.humidity}%`;
            weatherDeets.wind.textContent = `${weather.windSpeed} km/h`;
            weatherDeets.cloudy.textContent = `${weather.clouds}%`;
            weatherDeets.rain.textContent = weather.rain ? `${weather.rain} mm` : "0mm";

            const iconCode = weather.weatherIcon || "default-icon";
            weatherIcon.src = `icons/${iconCode}.png`;
        }
    }

    async function getLatitudeAndLongitude(city) {
    try {
        const latLonApi = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`;
        const latLonResponse = await fetch(latLonApi);
        const latLonData = await latLonResponse.json();
       
        if (latLonData.length === 0) {
            throw new Error ("No city found dude")
        }
        return { lat: latLonData[0].lat, lon: latLonData[0].lon };

        } catch (error) {
            console.error("Error getting coordinates:", error);
                throw error;
        }

    }

    async function getWeatherData(lat, lon) {
        const defaultWeather = {
            city: "Whoops",
            temperature: "NO",
            condition: "API DATA",
            humidity: "Sorry",
            windSpeed: "About",
            clouds: "that",
            rain: "Dude",
            dt: 0,
            timezone_offset: 0,
        };
        
    try {
        const weatherApi = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        const weatherResponse = await fetch(weatherApi);
        if (!weatherResponse.ok) {
            throw new Error("Bad API data");
        }

        const weatherData = await weatherResponse.json();
        const weatherObject = new Weather(
            weatherData.name,
            weatherData.main.temp,
            weatherData.weather[0].description,
            weatherData.main.humidity,
            weatherData.wind.speed,
            weatherData.clouds.all,
            weatherData.rain ? weatherData.rain["1h"] : undefined,
            weatherData.dt,
            weatherData.timezone
        );

        UI.displayWeather(weatherObject);
        
        const iconCode = weatherData.weather[0].icon;
        weatherIcon.src = `icons/${iconCode}.png`;

        localStorage.setItem('weatherData', JSON.stringify(weatherData));

        } catch (error) {
            console.error("Cant get weather data", error);

            const backupWeatherObject = {...defaultWeather };

            const weatherObject = new Weather(
                backupWeatherObject.city,
                backupWeatherObject.temperature,
                backupWeatherObject.condition,
                backupWeatherObject.humidity,
                backupWeatherObject.windSpeed,
                backupWeatherObject.clouds,
                backupWeatherObject.rain,
                backupWeatherObject.dt,
                backupWeatherObject.timezone_offset
            );
            UI.displayWeather(weatherObject);
            
        }
    }

    form.addEventListener("submit", async (Event) => {
        Event.preventDefault();
        const city = search.value;

        try {
            const {lat, lon} = await getLatitudeAndLongitude(city);
            await getWeatherData(lat, lon);
        } catch (error) {
            alert(error.message);
        }
    });

    document.querySelector(".cities").addEventListener("click", async (Event) => {
        if (Event.target.classList.contains("city")) {
            const city = Event.target.textContent;
       
            try {
                const {lat, lon} = await getLatitudeAndLongitude(city);
                await getWeatherData(lat, lon);
            } catch (error) {
            alert(error.message);
            }
        }
    });

    getWeatherData(43.65, -79.38);

});
