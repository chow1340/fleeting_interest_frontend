import {SET_CURRENT_TITLE} from "../actionTypes/navigationTypes"

const initialState = {
    currentTitle:"",
}


export default function(state = initialState, action){
    switch(action.type) {

        case(SET_CURRENT_TITLE) : {
            return {
                ...state,
                currentTitle: action.payload
            }
        }


        default : {
            return state
        }
    }
}