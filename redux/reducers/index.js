import { combineReducers } from "redux";
import profile from "./profile.js";
import message from "./message.js";
export default combineReducers({
    profile, message
});