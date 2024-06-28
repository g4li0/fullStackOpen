//hooks
import { useState, useEffect } from 'react'

//import './App.css'
//components
import Find from './components/Find';
import Countries from './components/Countries';

//libraries
//import axios from 'axios'

//other
import country from './services/get'

const App = () => {

  const [allCountries, setAllCountries] = useState([])
  const [search,setSearch] = useState('')
  //const [countryData, setCountryData] = useState([])
  //const [coincidences, setCoincidences] = useState([])


  useEffect(() => {
    country.getAll().then(responseData => {
      setAllCountries(responseData);
    })
  }, []);

  
  const countryNames = allCountries.map(country => country.name.common);
  //console.log(countryNames[1]);

  // handlers and functions
  const handleSearchCountryName = (event) => {
    setSearch(event.target.value);
  }
  
  return (
    <>
      <Find text="find countries" changeHandler={handleSearchCountryName} />
      <Countries countries={allCountries} filter={search} />
    </>
  );
}

export default App
