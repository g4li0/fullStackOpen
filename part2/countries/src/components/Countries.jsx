const Country = ({country}) => {
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
            <div key={i}>{country.name.common}<button onClick={()=>select(country.name.common)}>show</button><br/></div>
        )
    )
}

export default Countries;