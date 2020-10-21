import axios from 'axios';
import {resolve} from "./resolve"

//Returns user
export const getMatchesApi = async () => {
    const URL = global.server + '/api/match/getMatches';
    return await resolve(
        axios(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(res => res.data)
    );
}
