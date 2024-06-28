import getWeather from '../services/getWeather';
import { useState,useEffect } from 'react';

const Country = ({country}) => {
    const [weather,setWeather] = useState(null);
    const [icon,setIcon] = useState('');
    
    useEffect(() => {
    getWeather(country.latlng[0],country.latlng[1],'metric')
    .then(response => {
        //console.log(response)
        //console.log(response.main.temp)
        setWeather(response)
        //console.log(`https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`)
        setIcon(`https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`)
    })},[])
    return (
        <div>
            <h1>{country.name.common}</h1>
            <p>
                capital {country.capital}<br/>
                area {country.area}
            </p>
            <h3>languages</h3>
            <ul>
                {Object.values(country.languages).map(value => <li key={value}>{value}</li>)}
            </ul>
            <img src={country.flags.png}></img>
            <h2>Wheather in {country.name.common}</h2>
            <p>{weather?`temperature ${weather.main.temp} Celcius`:''}</p>
            <img src={icon ? icon : ''}></img>
            <p>{weather?`wind ${weather.wind.speed} m/s`:''}</p>
        </div>
    )
}

const Countries = ({countries,filter,select}) => {
    const results = filter==='' ? countries : countries.filter(country => country.name.common.toLowerCase().includes(filter.toLowerCase()));
    if(results.length > 10){
        return <div>Too many matches, specify another filter</div>
    }
    else if(results.length === 1){
        return <Country country={results[0]} />
    }
    else if(results.length === 0){
        return <div>No matches found, specify another filter</div>
    }
    
    return (
        results.map((country,i) => 
            <div key={i}>
                {country.name.common}<button onClick={()=>select(country.name.common)}>show</button><br/>
            </div>
        )
    )
}

export default Countries;