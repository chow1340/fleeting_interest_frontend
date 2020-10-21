import axios from "axios";
import {resolve} from "./resolve";
/* Update chat last message, date
PARAMS: text to update, chatId */
export const updateChatApi = (text, chatId) => {
    axios.post(global.server + '/api/chat/updateChatStatus', 
    {
    params: {
        message : text,
        chatId: chatId
    }
    },
    {
    headers: {
        'Content-Type': 'application/json'
    }
    }).then(res=>{
        // console.log(res);
    })
    .catch(err => {
        console.log(err);
    })
}

export const setIsReadApi = async (chatId, isRead) => {
    const URL = global.server + '/api/chat/setIsRead';
    return await resolve(
        axios(URL, {
            method: 'POST',
            data: {
                chatId: chatId,
                isRead: isRead
            },
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.data)
        .catch(err =>console.log(err.data))
    );
}

// axios.post(global.server + '/api/chat/setIsRead', 
// {
//   params: {
//     chatId : chatId,
//     isRead : true
//   }
// },
// {
//   headers: {
//     'Content-Type': 'application/json'
//   }
// })