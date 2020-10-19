import axios from "axios";
import {resolve} from "./resolve";

import {SET_CURRENT_PROFILE} from '../redux/actionTypes/profileTypes'

export async function getCurrentUser(dispatch) {
    return await resolve(
        axios.get(global.server + '/api/user/getCurrentUser')
        .then(res => {
          dispatch({type: SET_CURRENT_PROFILE, payload: res.data});
          console.log(res.data, "ran export");
        })
        .catch(err => {
          console.log(err)
        })
        .then(res => res.data)
    )
  }