import axios from 'axios'
import { all, byName } from './constants.js'

const getAll = () => {
    const request = axios.get(all);
    
    return request.then(response =>
        response.data
    )
    .catch(error => {
        console.log(error)
        return []
    });
}

const getByName = name => {
    const request = axios.get(`${byName}/${name}`);

    return request.then(response => 
        response.data
    )
    .catch(error => {
        console.log(error);
        return [];
    });
}

export default { getAll, getByName };