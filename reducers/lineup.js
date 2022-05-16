const initialState = {
    games: {
        doubles1: [],
        doubles2: [],
        singles: [],
        doubles3: [],
        doubles4: [],
        doubles5: [],
    },
    substitutions: {
        available: [],
        broughtIn: [],
        broughtOut: []
    },
}

const lineup = (state = initialState, action) => {
    const arrayToObject = (array) =>
        array.reduce((obj, item) => {
            obj[item[0]] = item[1]
            return obj
        }, {})

    switch (action.type) {
        case 'LINEUP_RESET':
            return {
                ...initialState
            }
        case 'LINEUP_UPDATE_TEAM':
            if (action.team === 'substitutions')
                return {
                    ...state,
                    substitutions: {
                        ...state.substitutions,
                        available: action.payload
                    }
                }
            return {
                ...state,
                games: {
                    ...state.games,
                    [action.team]: action.payload,
                }
            }
        case 'LINEUP_SUBSTITUTE_PLAYER': {
            const startingIndex = Object.keys(state.games).indexOf(action.currentGame);
            const gamesArray = Object.keys(state.games).map((key) => [key, state.games[key]])
            const gamesArrayReplaced = gamesArray
                .map((game, index) => {
                    if (index >= startingIndex)
                        return [game[0], game[1].map(g => g === action.currentPlayerId ? action.playerId : g)]
                    else
                        return [game[0], game[1]]
                })
            return {
                ...state,
                games: arrayToObject(gamesArrayReplaced, 0),
                substitutions: {
                    available: state.substitutions.available.filter(playerId => playerId !== action.playerId),
                    broughtIn: [...state.substitutions.broughtIn, action.playerId],
                    broughtOut: [...state.substitutions.broughtOut, action.currentPlayerId]
                },
            }
        }

        case 'UPDATE_ACTIVE_PLAYERS': {
            const gamesArray = Object.keys(state.games).map((key) => [key, state.games[key]]);
            const gamesFiltered = gamesArray.map(game => [game[0], game[1].filter(g => g !== action.playerId)])
            return {
                ...state,
                games: arrayToObject(gamesFiltered, 0)
            }
        }
        default:
            return state
    }
}

export default lineup;
