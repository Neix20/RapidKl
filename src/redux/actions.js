const onChangeDeviceId = (deviceId) => {
    return {
        type: "SET_DEVICE_ID",
        deviceId: deviceId,
    }
};

export {
    onChangeDeviceId,
}