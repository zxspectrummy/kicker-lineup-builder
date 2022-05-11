const initialState = []

const player = (state = initialState, action) => {
    switch (action.type) {
        case 'NEW_PLAYER':
            return [...state, action.payload]
        case 'UPDATE_PLAYER':
            return [
                ...state.slice(0, action.index),
                action.payload,
                ...state.slice(action.index + 1)
            ]
        case 'DELETE_PLAYER':
            return [...state.filter((_player, index) => index !== action.index)]
        default:
            return state
    }
}

export default player;
