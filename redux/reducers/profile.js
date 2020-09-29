import {SET_CURRENT_PROFILE, EDIT_FIRST_NAME, USER_CURRENT_LOCATION} from "../actionTypes/profileTypes"

const initialState = {
    currentProfile:{}
}


export default function(state = initialState, action){
    switch(action.type) {

        case(SET_CURRENT_PROFILE) : {
            return {
                ...state,
                currentProfile: action.payload
            }
        }

        case(EDIT_FIRST_NAME) : {
            return {
                ...state,
                currentProfile: action.payload
            }
        }

        case(USER_CURRENT_LOCATION) :{
            return {
                ...state,
                currentProfile: action.payload
            }
        }

        default : {
            return state
        }
    }
}