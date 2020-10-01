import {SET_CURRENT_PROFILE, EDIT_FIRST_NAME, USER_CURRENT_LOCATION, SET_PICTURE} from "../actionTypes/profileTypes"

const initialState = {
    currentProfile:{
        _id: {},
        phone_number: "",
        password: {},
        date_created: {},
        first_name: "",
        last_name: "",
        location: {},
        geocode: null,
        picture:[],
    }
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

        case(SET_PICTURE) : {
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