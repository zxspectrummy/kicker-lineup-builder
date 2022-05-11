import {combineReducers} from "redux";
import player from "./player";

const rootReducer = combineReducers({
    players: player
});
export default rootReducer
