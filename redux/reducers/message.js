import {SET_CURRENT_CHAT_PROFILE, SET_CURRENT_CHAT_ID} from "../actionTypes/messageTypes"

const initialState = {
    currentChatProfile:{},
    chatId: ""
}


export default function(state = initialState, action){
    switch(action.type) {

        case(SET_CURRENT_CHAT_PROFILE) : {
            return {
                ...state,
                currentChatProfile: action.payload
            }
        }

        case (SET_CURRENT_CHAT_ID) : {
            return {
                ...state,
                chatId: action.payload
            }
        }
        default : {
            return state
        }
    }
}