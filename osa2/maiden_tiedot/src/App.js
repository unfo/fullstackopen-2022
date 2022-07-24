import { useState, useEffect } from 'react'
import axios from 'axios'

const CountryDetails = ({ country }) => {
  return (
    <>
      <h1>{country.name.common}</h1>
      <div>
        <dl>
          <dt>Capital</dt>
          <dd>{country.capital[0]}</dd>
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
  
  
  // console.log(countries);
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
    console.log('country list', countries);
    return (
        <ul>
          {countries.map(country => {
            console.log('List item', country);
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
  const filterChanged = (event) => {
    setCountryFilter(event.target.value);
    setCountries(allCountries.filter((country) => {
      return (
        countryFilter === '' || 
        country.name.common.toLowerCase().includes(countryFilter)
    )}));
  }
  useEffect(() => {
    console.log('effect')
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
    console.log('countryChooser', event.target.value);
    const cca3 = event.target.value;
    setCountries(allCountries.filter((country) => country.cca3 === cca3));
    console.log(countries);
  }
  return (
    <>
      <div>
        find countries <input value={countryFilter} onChange={filterChanged} />
      </div>
      <div>
        <CountryList countries={countries} countryChooser={countryChooser} />
      </div>
    </>
  );
}

export default App;
