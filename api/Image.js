import axios from 'axios'
import {resolve} from "./resolve"
export const uploadUpdateOrderApi = async (formdata) => {
    const URL = global.server + '/api/image/uploadFileAndUpdatePictureArrayOrder';
    return await resolve(
        axios(URL, {
            method: 'POST',
            data: formdata,
            headers: {
              'content-type' : 'multipart/form-data'
            }
        })
        .then(res => res.data)
        .catch(err =>console.log(err.data))
    );
}
