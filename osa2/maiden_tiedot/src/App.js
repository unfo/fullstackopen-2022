import { useState, useEffect } from 'react'
import axios from 'axios'


const CountryFinder = ({ filter, handler }) => {
  return (
    <div>
      find countries <input value={filter} onChange={handler} />
    </div>
  );
}

const CountryWeather = ({ weather }) => {
  if ('weather' in weather) {
    const weather_icon = `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;
    const weather_desc = weather.weather[0].description;
    const temp = weather.main.temp;
    const feels = weather.main.feels_like;
    const wind = weather.wind.speed;
    const place = weather.name;

    return (
      <>
        <h2>Weather in {place}</h2>
        <p>temperature: <strong>{temp} &deg;C</strong> feels like <strong>{feels} &deg;C</strong></p>
        <p><img alt={weather_desc} src={weather_icon} /></p>
        <p>wind: <strong>{wind} m/s</strong></p>
      </>
    )
  } 
}

const CountryDetails = ({ country }) => {
  return (
    <>
      <h1>{country.name.common}</h1>
      <div>
        <dl>
          <dt>Capital</dt>
          <dd>{country.capital[0]} ({country.latlng.join(',')})</dd>
          <dt>Area</dt>
          <dd>{country.area}</dd>
          <dt>Languages</dt>
          <dd>
            <ul>
              {Object.values(country.languages).map(lang => {
                return (
                  <li key={lang}>{lang}</li>
                );
              })}
            </ul>
          </dd>
          <dt>Flag</dt>
          <dd><img alt={country.flag} src={country.flags.png} /></dd>
        </dl>
      </div>
    </>
  )
}
const CountryList = ({ countries, countryChooser }) => {
  const len = countries.length;
  if (len === 0) {
    return (<strong>No countries found </strong>);
  } else if (len === 1) {
    return (
      <CountryDetails country={countries[0]} />
    );
  } else if (len > 10) {
    return (
      <strong>Too many countries, filter more ({len})</strong>
    );
  } else if (len > 0 && len < 10) {
    return (
        <ul>
          {countries.map(country => {
            return (
              <li key={country.cca3}>
                {country.name.common}
                <button value={country.cca3} onClick={countryChooser}>show</button>
                </li>
            );
          })}
        </ul>
      );
  } else {
    return (
      <h1>Something went wrong, len = {len}</h1>
    )
  }
}

function App() {
  const [allCountries, setAllCountries] = useState([]);
  const [countries, setCountries] = useState([]);
  const [countryFilter, setCountryFilter] = useState('');
  const [weatherData, setWeatherData] = useState({});
  const filterChanged = (event) => {
    setCountryFilter(event.target.value);
    setCountries(allCountries.filter((country) => {
      return (
        countryFilter === '' || 
        country.name.common.toLowerCase().includes(countryFilter)
    )}));
  }
  
  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setAllCountries(response.data);
      })
  }, []);

  useEffect(() => {
    setCountries(allCountries.filter((country) => {
      return (
        countryFilter === '' || 
        country.name.common.toLowerCase().includes(countryFilter)
    )}));
  }, [allCountries, countryFilter])
  
  const countryChooser = (event) => {
    const cca3 = event.target.value;
    setCountries(allCountries.filter((country) => country.cca3 === cca3));
  }

  useEffect(() => {
    const api_key = process.env.REACT_APP_OPENWEATHER_KEY;
    if (countries.length === 1) {
      const country = countries[0];
      const capital = country.capital[0];
      const cc = country.cca2;
        axios
        .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital},${cc}&appid=${api_key}&units=metric`)
        .then(response => {
          setWeatherData(response.data);
        })
    } else {
      setWeatherData({});
    }
  }, [countries]);
  return (
    <>
      <CountryFinder filter={countryFilter} handler={filterChanged } />
      <CountryList countries={countries} countryChooser={countryChooser} />
      <CountryWeather weather={weatherData} />
    </>
  );
}

export default App;
