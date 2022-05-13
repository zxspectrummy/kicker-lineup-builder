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
        case 'UPDATE_TEAM':
            return {
                ...state,
                [action.team]: action.payload,
            }
        case 'UPDATE_ACTIVE_PLAYERS':
            return {
                ...state,
                singles: state.singles.filter((id) => id !== action.index),
                doubles1: state.doubles1.filter((id) => id !== action.index),
                doubles2: state.doubles2.filter((id) => id !== action.index),
                doubles3: state.doubles3.filter((id) => id !== action.index),
                doubles4: state.doubles4.filter((id) => id !== action.index),
                doubles5: state.doubles5.filter((id) => id !== action.index),
            }
        default:
            return state
    }
}

export default lineup;
