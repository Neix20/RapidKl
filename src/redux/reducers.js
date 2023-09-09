const initialState = {
    deviceId: "",
    historyLs: []
};

function setReducer(state = initialState, action = {}) {
    switch (action.type) {
        case "SET_DEVICE_ID":
            return {
                ...state,
                deviceId: action.deviceId,
            };
        default:
            return state;
    }
}

export default setReducer;