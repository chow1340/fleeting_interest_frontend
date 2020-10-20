import axios from "axios";

/* Update chat last message, date
PARAMS: text to update, chatId */
export const updateChat = (text, chatId) => {
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