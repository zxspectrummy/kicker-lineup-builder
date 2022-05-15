const initialState = {
    singles: [],
    doubles1: [],
    doubles2: [],
    doubles3: [],
    doubles4: [],
    doubles5: [],
}
const lineup = (state = initialState, action) => {
    switch (action.type) {
        case 'LINEUP_RESET':
            return {
                ...initialState
            }
        case 'LINEUP_UPDATE_TEAM':
            return {
                ...state,
                [action.team]: action.payload,
            }
        case 'UPDATE_ACTIVE_PLAYERS':
            return {
                ...state,
                singles: state.singles.filter((id) => id !== action.playerId),
                doubles1: state.doubles1.filter((id) => id !== action.playerId),
                doubles2: state.doubles2.filter((id) => id !== action.playerId),
                doubles3: state.doubles3.filter((id) => id !== action.playerId),
                doubles4: state.doubles4.filter((id) => id !== action.playerId),
                doubles5: state.doubles5.filter((id) => id !== action.playerId),
            }
        default:
            return state
    }
}

export default lineup;
