import { useState, useEffect } from 'react'
import axios from 'axios'

const apiKey = import.meta.env.VITE_SOME_KEY

const showButtonStyle = {
  marginLeft: 8,
  padding: '4px 10px',
  fontSize: 14,
  borderRadius: 6,
  border: '1px solid #999',
  cursor: 'pointer'
}

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState(null)
  const [weatherError, setWeatherError] = useState(null)

  useEffect(() => {
    axios
      .get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
          q: capital,
          appid: apiKey,
          units: 'metric'
        }
      })
      .then(response => {
        setWeather(response.data)
        setWeatherError(null)
      })
      .catch(() => {
        setWeatherError('Weather data could not be loaded')
      })
  }, [capital])

  if (weatherError) {
    return <p>{weatherError}</p>
  }

  if (!weather) {
    return <p>Loading weather...</p>
  }

  return (
    <div>
      <h2>Weather in {capital}</h2>
      <p>temperature {weather.main.temp} Celsius</p>
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt={weather.weather[0].description}
      />
      <p>wind {weather.wind.speed} m/s</p>
    </div>
  )
}
const CountryList = ({ countries, onShow }) => (
  <div>
    {countries.map(country => (
      <p key={country.cca3}>
        {country.name.common}
        <button
          style={showButtonStyle}
          onClick={() => onShow(country)}
        >
          show
        </button>
      </p>
    ))}
  </div>
)
const CountryDetails = ({ country }) => (
  <div>
    <h1>{country.name.common}</h1>
    <p>capital {country.capital[0]}</p>
    <p>area {country.area}</p>

    <h2>languages</h2>
    <ul>
      {Object.values(country.languages).map(language => (
        <li key={language}>{language}</li>
      ))}
    </ul>

    <img
      src={country.flags.png}
      alt={`Flag of ${country.name.common}`}
      width="150"
    />

    <Weather capital={country.capital[0]} />
  </div>
)

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
    setSelectedCountry(null)
  }
  const countriesToShow = countries.filter(country =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  )

  const displayedCountries = selectedCountry ? [selectedCountry] : countriesToShow

  if (filter === '') {
    return (
      <div>
        find countries <input value={filter} onChange={handleFilterChange} />
      </div>
    )
  }
  return (
    <div>
      find countries <input value={filter} onChange={handleFilterChange} />

      {displayedCountries.length > 10 && (
        <p>Too many matches, specify another filter</p>
      )}

      {displayedCountries.length <= 10 && displayedCountries.length > 1 && (
        <CountryList
          countries={displayedCountries}
          onShow={setSelectedCountry}
        />
      )}
      {displayedCountries.length === 1 && (
        <CountryDetails country={displayedCountries[0]} />
      )}
    </div>
  )
}

export default App