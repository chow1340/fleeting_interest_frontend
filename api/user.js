import axios from "axios";
import {resolve} from "./resolve";

export async function getCurrentUser() {
    return await resolve(
        axios.get(global.server + '/api/user/getCurrentUser')
        .then(res => res.data)
    );
  }