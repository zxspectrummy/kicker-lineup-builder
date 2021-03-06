import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';

const playerFromName = (name) => {
    return {
        name: name,
        id: uuidv4(),
        isActive: true,
    }
}
const defaultNames = ['Alfa', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf']
const initialState = defaultNames.map(name => playerFromName(name));

const player = (state = initialState, action) => {
    switch (action.type) {
        case 'NEW_PLAYER':
            return [...state, playerFromName('')]

        case 'UPDATE_PLAYER_NAME':
            return state.map((player) => player.id === action.playerId ? {...player, name: action.payload} : player)

        case 'UPDATE_PLAYER_STATE':
            return state.map((player) => player.id === action.playerId ? {...player, isActive: action.payload} : player)

        case 'DELETE_PLAYER':
            return [...state.filter((player) => player.id !== action.playerId)]
        default:
            return state
    }
}

export default player;
