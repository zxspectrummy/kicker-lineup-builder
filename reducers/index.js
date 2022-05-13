import {combineReducers} from "redux";
import player from "./player";
import lineup from "./lineup";

const rootReducer = combineReducers({
    players: player,
    lineup: lineup
});
export default rootReducer
