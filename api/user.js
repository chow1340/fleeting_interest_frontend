import axios from "axios";
import {resolve} from "./resolve";

import {SET_CURRENT_PROFILE} from '../redux/actionTypes/profileTypes'
import {useSelector} from "react-redux";

export function getCurrentUser() {
    axios.get(global.server + '/api/user/getCurrentUser')
    .then(res => {
        return res.data;
    })
    .catch(err => {
        console.log(err)
    })
  }