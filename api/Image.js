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

export const updatePictureArrayOrderApi = async (index, uri) => {
    const URL = global.server + '/api/image/updatePictureArrayOrder';
    return await resolve(
        axios(URL, {
            method: 'POST',
            data: {
                index: index,
                uri: uri
            },
            headers: {
            'Content-Type': 'application/json'
            }
        })
        .then(res => res.data)
        .catch(err =>console.log(err.data))
    );
}
// axios.post(global.server + '/api/image/updatePictureArrayOrder', 
          //   {
          //     params: {
          //       index : i,
          //       uri : picture.uri
          //     }
          //   },
          //   {
          //     headers: {
          //       'Content-Type': 'application/json'
          //     }
          //   }
          // )
          // .catch(
          //   err => console.log(err)
          // )

export const deleteImageApi = async (fileKey) => {
    const URL = global.server + '/api/image/deleteImage';
    console.log(fileKey);
    return await resolve(
        axios(URL, {
            method: 'POST',
            data: {
                fileKey: fileKey,
            },
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.data)
        .catch(err =>console.log(err.data))
    );
}

