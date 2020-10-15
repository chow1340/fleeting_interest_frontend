import {SET_CURRENT_CHAT_PROFILE, SET_CURRENT_CHAT_ID, SET_CHAT_LIST, SET_MATCH_LIST} from "../actionTypes/chatTypes"

const initialState = {
    currentChatProfile:{},
    chatList: new Map(),
    matchList: [],
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

        case(SET_CHAT_LIST) : {
            return {
                ...state, 
                chatList: action.payload
            }
        }

        case(SET_MATCH_LIST) : {
            return {
                ...state,
                matchList: action.payload
            }
        }

        default : {
            return state
        }
    }
}