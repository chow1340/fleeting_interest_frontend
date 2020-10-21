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

export const registerApi = async (phone_number, password) => {
  const URL = global.server + '/api/user/register';
  return await resolve(
      axios(URL, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        data:{
          phone_number: phone_number, //take out the +
          password: password
        }
      })
  );
}

export const loginApi = async (phone_number, password) => {
  const URL = global.server + '/api/user/login';
  return await resolve(
      axios(URL, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        data:{
          phone_number: phone_number, //take out the +
          password: password
        }
      })
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







