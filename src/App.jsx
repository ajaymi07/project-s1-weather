import { useState } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

      // Current Weather
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );

      const weatherData = await weatherResponse.json();

      if (!weatherResponse.ok) {
        throw new Error(weatherData.message || "City not found");
      }

      setWeather(weatherData);

      // 5-Day Forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
      );

      const forecastData = await forecastResponse.json();

      if (!forecastResponse.ok) {
        throw new Error("Forecast could not be loaded");
      }

      // One forecast for each day
      const dailyForecast = [];

      forecastData.list.forEach((item) => {
        const date = item.dt_txt.split(" ")[0];

        if (
          !dailyForecast.some(
            (forecastItem) => forecastItem.date === date
          )
        ) {
          dailyForecast.push({
            date: date,
            temp: Math.round(item.main.temp),
            humidity: item.main.humidity,
            description: item.weather[0].description,
            icon: item.weather[0].icon,
          });
        }
      });

      setForecast(dailyForecast.slice(0, 5));

    } catch (err) {
      setWeather(null);
      setForecast([]);
      setError(err.message);
    }

    setLoading(false);
  };

  // Date format
  const formatDate = (date) => {
    const newDate = new Date(date);

    return newDate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="weather-app">

      {/* Galaxy Background */}
      <div className="stars"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star second"></div>

      <div className="weather-card">

        {/* Search */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Search city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                searchWeather();
              }
            }}
          />

          <button onClick={searchWeather}>
            🔍
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <p className="message">
            🌌 Finding weather...
          </p>
        )}

        {/* Error */}
        {error && !loading && (
          <p className="error">
            ❌ {error}
          </p>
        )}

        {/* Current Weather */}
        {weather && !loading && (
          <div className="weather-content">

            <div className="location">
              <h2>
                📍 {weather.name}, {weather.sys.country}
              </h2>
            </div>

            <div className="main-weather">

              <div className="weather-icon">
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt={weather.weather[0].description}
                />
              </div>

              <div>
                <h1>
                  {Math.round(weather.main.temp)}°C
                </h1>

                <p>
                  {weather.weather[0].description}
                </p>
              </div>

            </div>

            {/* Weather Details */}
            <div className="details">

              <div className="detail-box">
                <span>💧</span>
                <p>Humidity</p>
                <h3>{weather.main.humidity}%</h3>
              </div>

              <div className="detail-box">
                <span>💨</span>
                <p>Wind</p>
                <h3>{weather.wind.speed} m/s</h3>
              </div>

              <div className="detail-box">
                <span>🌡️</span>
                <p>Feels Like</p>
                <h3>
                  {Math.round(weather.main.feels_like)}°C
                </h3>
              </div>

            </div>

            {/* 5 Day Forecast */}
            <div className="forecast-section">

              <h2 className="forecast-title">
                5-Day Forecast
              </h2>

              <div className="forecast">

                {forecast.map((day, index) => (
                  <div className="forecast-card" key={index}>

                    <h3>
                      {formatDate(day.date)}
                    </h3>

                    <img
                      src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                      alt={day.description}
                    />

                    <h2>
                      {day.temp}°C
                    </h2>

                    <p>
                      {day.description}
                    </p>

                    <small>
                      💧 {day.humidity}%
                    </small>

                  </div>
                ))}

              </div>

            </div>

          </div>
        )}

        {/* Welcome */}
        {!weather && !loading && !error && (
          <div className="welcome">
            <h1>🌌 Weather Explorer</h1>
            <p>
              Search any city to see live weather
            </p>
          </div>
        )}

      </div>

    </div>
  );
}

export default App;