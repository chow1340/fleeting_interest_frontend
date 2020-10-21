import axios from 'axios';
import {resolve} from "./resolve"

//Returns user
export const updateLocationApi = async (location, geocode) => {
    const URL = global.server + '/api/location/updateLocation';
    return await resolve(
        axios(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            data:{
                location : location,
                geocode : geocode
            }
        })
        .then(res => res.data)
    );
}
