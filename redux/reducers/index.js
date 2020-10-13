import { combineReducers } from "redux";
import profile from "./profile.js";
import chat from "./chat.js";
export default combineReducers({
    profile, chat
});