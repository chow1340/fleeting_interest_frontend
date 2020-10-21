import axios from 'axios';
import {resolve} from "./resolve"

export const getCurrentUserApi = async () => {
    const URL = global.server + '/api/user/getCurrentUser';
    return await resolve(
        axios(URL, {
            method: 'GET',
        })
        .then(res => res.data)
    );
}

export const logOutApi = () => {
    const URL = global.server + '/api/user/logout';
    return axios(URL, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    })
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
};


export const editProfileApi = (currentProfile) => {
  const URL = global.server + '/api/user/editProfile';
  return axios(URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    data: {
      currentProfile : currentProfile
    }
  })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};






