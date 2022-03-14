import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import apiKey from "./api_key";

// Component containing the form where user inputs the city
// to be queried
const CityForm = (props) => {
    // Tracks the value inside the <input>
    const [city, setCity] = useState("");

    function onFormSubmit(event) {
        event.preventDefault(); // Prevent the default HTML behaviour of form submission
        props.callback(city); // Call the function in the parent component (CityForm -> WeatherDisplay)
    }

    return (
        <form onSubmit={onFormSubmit}>
            <input id="city-name" type="text" placeholder="Search city name" value={city} onChange={(e) => setCity(e.target.value)} />
            <button type="submit">Get Weather</button>
        </form>
    );
};

const WeatherDisplay = (props) => {
    return (
        <div className="weather-display-container">
            <div className="weather-display">
                <h1>{props.city}</h1>
                <h3>{props.temperature} F - {props.conditions}</h3>
            </div>
            <div className="city-form">
                {/* Passes the function call from CityForm to the parent (CityForm -> this -> App) */}
                <CityForm callback={props.onCityFormSubmit} />
            </div>
        </div>
    );
};

const App = () => {
    // Data
    const [weather, setWeather] = useState(null);

    // State
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load weather data from HTTP API
    function loadWeather(city) {
        // Reset state
        setIsLoading(true);
        setError(null);

        // Use Fetch API to make request
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city || "Iselin"}&units=imperial&appid=${apiKey}`)
            .then(async (response) => {
                if (!response.ok) {
                    // Response status != 20x
                    // Show error
                    console.error(response);
                    setError(response.statusText);
                    setIsLoading(false);
                    return;
                }

                const responseBody = await response.json();

                setWeather({
                    city: responseBody.name,
                    temperature: responseBody.main.temp,
                    conditions: responseBody.weather[0].main
                });

                setIsLoading(false);
            });
    }

    // This function will be called whenever the form component returns
    // a city to be looked up
    function onCityFormSubmit(nCity) {
        loadWeather(nCity);
    }

    // Runs the first time the component is mounted
    useEffect(() => {
        loadWeather();
    }, [])

    // Handle abnormal state
    if (isLoading) {
        return <div>Loading</div>;
    }

    if (error) {
        return <div>{error}</div>
    }

    // Show content if not loading and error-less
    return <WeatherDisplay
        city={weather.city}
        temperature={weather.temperature}
        conditions={weather.conditions}
        onCityFormSubmit={onCityFormSubmit} />
};

ReactDOM.render(<App />, document.querySelector("#app"));