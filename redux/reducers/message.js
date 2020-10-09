import {SET_CURRENT_CHAT_PROFILE} from "../actionTypes/messageTypes"

const initialState = {
    currentChatProfile:{}
}


export default function(state = initialState, action){
    switch(action.type) {

        case(SET_CURRENT_CHAT_PROFILE) : {
            return {
                ...state,
                currentChatProfile: action.payload
            }
        }

        default : {
            return state
        }
    }
}