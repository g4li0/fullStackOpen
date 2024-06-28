import axios from 'axios'
import { api_key } from './constants.js'
const getWeather = (lat,lon,unit) => {
    const request = axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=${unit}`);
    return request.then(response => response.data)
}
export default getWeather;