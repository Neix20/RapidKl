import React, { useState, useEffect } from "react";

import { Logger, Utility } from "@utility";

import { Images } from "@config";
import "@config/globalStyles.css";

import { WqModalBtn } from "@components";
import { useToggle } from "@hooks";

function StationNodeSdInputSlider(props) {

    // #region Props
    const { sliderStyle = {}, txtStyle = {} } = props;
    const { min = 0, max = 30 } = props;
    const { value, setValue } = props;
    const { width = 40 } = props;
    // #endregion

    // #region Helper
    const handleValue = (e) => {
        let { min, max, value } = e.target;

        min = +min;
        max = +max;
        value = +value;

        value = Math.max(min, Math.min(max, value));

        setValue(value);
    }
    // #endregion

    return (
        <div style={{ width: width, rowGap: 5, display: "flex", flexDirection: "column" }}>
            <input
                value={value} onChange={handleValue}
                className={"g_input"}
                type={"number"}
                placeholder={"0"}
                min={min} max={max} step={1}
                style={{ width: width, padding: "0px 5px" }} />
            <div style={{
                position: "relative",
                width: width,
                height: 100,
            }}>
                {/* TODO: Change This To Material Ui */}
                <input
                    value={value}
                    onChange={handleValue}
                    className={"slider"}
                    type={"range"}
                    min={min} max={max} step={1}
                    style={{ width: 100, height: width, ...sliderStyle }}>
                </input>
            </div>
        </div>
    )
}

function StationNodeSdInput(props) {

    // #region Props
    const { min = 0, max = 40, time } = props;
    const { supply, setSupply } = props;
    const { demand, setDemand } = props;
    // #endregion

    return (
        <div style={{ width: 120 }}>
            <div className={"g_center"} style={{
                borderWidth: 3,
                borderColor: "#000",
                borderStyle: "solid",
                borderBottomWidth: 0,
            }}>
                <div>{time}</div>
            </div>
            <div className={"g_center"}
                style={{
                    borderWidth: 3,
                    padding: "5px 0px",
                    borderColor: "#000",
                    borderStyle: "solid",
                    columnGap: 5,
                }}>
                <StationNodeSdInputSlider
                    width={48}
                    min={min} max={max}
                    value={supply} setValue={setSupply}
                />
                <StationNodeSdInputSlider
                    width={48}
                    min={min} max={max}
                    value={demand} setValue={setDemand}
                    sliderStyle={{ accentColor: "#F00" }}
                />
            </div>
        </div>
    )
}

function StationNodeSd(props) {

    const { startHr = 6, endHr = 23 } = props;
    const { station, setStation = () => { } } = props;

    const { supply: supplyArr = [], demand: demandArr = [] } = station;
    const hrIsoArr = Utility.genHourIsoArr(startHr, endHr);

    // #region Helper
    const updateStation = (index, name, val) => {
        
        if (name === "supply") {
            supplyArr[index] = val;
        } else {
            demandArr[index] = val;
        }

        let obj = { ...station };
        obj["supply"] = supplyArr;
        obj["demand"] = demandArr;
        setStation(obj);
    }
    // #endregion

    // #region Render
    const renderStationSd = (item, index) => {

        const iso = hrIsoArr[index];
        const supply = supplyArr[index];
        const demand = demandArr[index];

        const setSupply = (val) => updateStation(index, "supply", val);
        const setDemand = (val) => updateStation(index, "demand", val);

        return (
            <StationNodeSdInput key={index} time={iso}
                supply={supply} setSupply={setSupply}
                demand={demand} setDemand={setDemand}
            />
        )
    }
    // #endregion

    return (
        <div style={{
            display: "flex",
            flexWrap: "wrap",
            maxWidth: 1080,
            rowGap: 10,
        }}>
            {hrIsoArr.map(renderStationSd)}
        </div>
    )
}

function StationInput(props) {

    const { station, toggleStation = () => { }, toggleModal = () => {} } = props;
    const { onMakeStationHub = () => { }, onRemoveStation = () => { }, onShowMap = () => { } } = props;

    const { is_hub, ride_zone, lat, lng, name } = station;

    const rideZoneLs = Utility.genRideZone();

    // #region Helper

    const toggleStationForm = (e) => {
        const { name, value } = e.target;
        toggleStation(name, value);
    }
    // #endregion

    // #region Render
    const renderOption = ({ name, value }, index) => (<option key={index} value={value}>{name}</option>);
    // #endregion

    return (
        <div className="w-100"
            style={{
                padding: 10,
                display: "flex",
                flexDirection: "column",
                rowGap: 10,
                maxWidth: 800
            }}>
            {/* Station Name */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center"
                }}>
                <div style={{ width: "20%" }}>
                    <div
                        style={{
                            fontSize: 18,
                            fontWeight: "bold"
                        }}>Station Name: </div>
                </div>
                <div style={{ width: "80%" }}>
                    <input
                        name={"name"} value={name}
                        onChange={toggleStationForm}
                        className={"form-control"}
                        type={"text"}
                        placeholder={"Station Name..."} />
                </div>
            </div>

            {/* Coordinates */}
            <div className={"g_center"}
                style={{
                    justifyContent: "space-between"
                }}>
                {/* Latitude */}
                <div className="g_center"
                    style={{
                        justifyContent: "space-between",
                        columnGap: 10,
                        maxWidth: 300,
                        width: "50%",
                    }}>
                    <div
                        style={{
                            fontSize: 18,
                            fontWeight: "bold"
                        }}>Latitude</div>
                    <div >
                        <input
                            name={"lat"} value={lat}
                            onChange={toggleStationForm}
                            className={"form-control"}
                            type={"text"}
                            placeholder={"0.0"} />
                    </div>
                </div>

                {/* Longitude */}
                <div className="g_center"
                    style={{
                        justifyContent: "space-between",
                        columnGap: 10,
                        maxWidth: 300,
                        width: "50%",
                    }}>
                    <div
                        style={{
                            fontSize: 18,
                            fontWeight: "bold"
                        }}>Longitude</div>
                    <div>
                        <input
                            name={"lng"} value={lng}
                            onChange={toggleStationForm}
                            className={"form-control"}
                            type={"text"}
                            placeholder={"0.0"} />
                    </div>
                </div>
            </div>

            {/* Station Ride Zone */}
            <div
                className="g_center"
                style={{
                    justifyContent: "space-between",
                    columnGap: 10,
                    maxWidth: 240,
                    width: "50%"
                }}>
                <div
                    style={{
                        fontSize: 18,
                        fontWeight: "bold"
                    }}>Ride Zone</div>
                <div>
                    <select className={"form-control"}
                        name={"ride_zone"} value={ride_zone}
                        onChange={toggleStationForm}>
                        {rideZoneLs.map(renderOption)}
                    </select>
                </div>
            </div>

            {/* Station Control Panel */}
            <div className={"g_center"}
                style={{
                    justifyContent: "flex-start",
                    columnGap: 10,
                }}>
                {
                    (!is_hub) ? (
                        <div onClick={onMakeStationHub} className={`btn btn-primary`}>Make Hub</div>
                    ) : (
                        <></>
                    )
                }
                <div onClick={onRemoveStation} className="btn btn-danger">Remove Station</div>
                <div onClick={onShowMap} className="btn btn-success">Show in Map</div>
                <div onClick={toggleModal} className="btn btn-primary">Update Station</div>
            </div>
        </div>
    )
}

function StationNode(props) {

    // #region Props
    const { station, UpdateStation = () => { }, DeleteStation = () => { }, MakeStationHub = () => { } } = props;
    const {  mapRef, setMapRef, onMapLoad, onMarkerZoom } = props;
    const { toggleModal = () => {} } = props;
    const { selPos, setSelPos } = props;
    // #endregion

    const { is_hub, ride_zone, color } = station;

    // #region Helper
    const setStation = (obj) => {
        UpdateStation(obj);
    }

    const toggleStation = (name, val) => {
        let obj = { ...station };
        obj[name] = val;
        setStation(obj);
    }

    const RemoveStation = () => {
        DeleteStation(selPos);
        setSelPos(0);
    }

    const onMakeStationHub = () => {
        MakeStationHub(station);
    }

    const onShowMap = () => {
        toggleModal();
        onMarkerZoom(station);
    }
    // #endregion

    return (
        <div>
            <div style={{ display: "flex", }}>
                <div className={"g_center"}
                    style={{ width: "20%" }}>
                    <img
                        src={is_hub ? Images.hub : Images.station}
                        style={{
                            height: 100,
                            width: 100,
                            borderWidth: 3,
                            borderStyle: "solid",
                            borderRadius: 15,
                            padding: 10,
                            borderColor: color
                        }} alt={"Station"} />
                </div>
                <div style={{ width: "80%" }}>
                    {/* Input */}
                    <StationInput {...props}
                        station={station}
                        toggleStation={toggleStation}
                        onMakeStationHub={onMakeStationHub}
                        onRemoveStation={RemoveStation}
                        onShowMap={onShowMap} />
                </div>
            </div>

            {/* Station Node */}
            <StationNodeSd station={station} setStation={setStation} />
        </div>
    )
}

function StationTitle(props) {
    const { color, is_hub, name } = props;
    const { onSelect = () => { } } = props;
    return (
        <div onClick={onSelect}
            className={"btn btn-light w-90"}
            style={{
                // maxWidth: 120,
                fontSize: 18,
                borderWidth: 3,
                borderStyle: "solid",
                borderColor: color,
                color: is_hub ? "#F00" : "#00F"
            }}>
            {name}
        </div>
    )
}

function Index(props) {

    const { stationLs } = props;

    const [selPos, setSelPos] = useState(0);
    const modalHook = useToggle(false);

    const modalObj = {
        showModal: modalHook[0], 
        setShowModal: modalHook[1], 
        toggleModal: modalHook[2]
    }

    const renderStationItem = (item, index) => {
        const onSelect = () => setSelPos(index);
        return (<StationTitle key={index}
            onSelect={onSelect}
            {...item} />)
    }

    if (stationLs.length == 0) {
        return (
            <div
                className="btn btn-info w-100 h-100 g_center disabled"
                style={{ columnGap: 10 }}
            >
                <div className={"fs-2 fw-bold"}>
                    Station
                </div>
                <i className="fa-solid fa-gas-pump fa-lg"></i>
            </div>
        )
    }

    return (
        <WqModalBtn {...modalObj}
            btnChild={
                <div
                    className="btn btn-info w-100 h-100 g_center"
                    style={{ columnGap: 10 }}
                >
                    <div className={"fs-2 fw-bold"}>
                        Station
                    </div>
                    <i className="fa-solid fa-gas-pump fa-lg"></i>
                </div>
            }
            mdlChild={
                <div className="w-100 h-100">
                    <div className={"g_center"} style={{ height: "10%" }}>
                        <div className={"fs-2 fw-bold"}>
                            Station
                        </div>
                    </div>
                    <div className={"w-100"}
                        style={{
                            display: "flex",
                            height: "90%"
                        }}>
                        <div style={{
                            flex: .2,
                            display: "flex",
                            flexDirection: "column",
                            rowGap: 10,
                            alignItems: "center",
                            overflowY: "auto",
                        }}>
                            {stationLs.map(renderStationItem)}
                        </div>
                        <div style={{
                            flex: .8,
                            padding: 10,
                            overflowY: "auto",
                        }}>
                            <StationNode
                                selPos={selPos} setSelPos={setSelPos}
                                station={stationLs[selPos]} 
                                {...modalObj}
                                {...props} />
                        </div>
                    </div>
                </div>
            }
        />
    )
}

export default Index;