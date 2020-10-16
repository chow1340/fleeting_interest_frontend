import { combineReducers } from "redux";
import profile from "./profile.js";
import chat from "./chat.js";
import navigation from "./navigation.js";
export default combineReducers({
    profile, chat, navigation
});