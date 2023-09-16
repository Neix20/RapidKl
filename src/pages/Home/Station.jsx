import React, { useState, useEffect } from "react";

import { Logger, Utility } from "@utility";

import { Images } from "@config";
import "@config/globalStyles.css";

function StationNodeSdInputSlider(props) {

    // #region Props
    const { sliderStyle = {}, txtStyle = {} } = props;
    const { min = 0, max = 30 } = props;
    const { width = 40 } = props;
    const { value, setValue } = props;
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
                value={value}
                onChange={handleValue}
                className={"g_input"}
                type={"number"}
                placeholder={"0"}
                min={min} max={max} step={1}
                style={{
                    width: width,
                    padding: "0px 5px",
                }} />
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

    const [tsDict, setTsDict] = useState({});

    const stationTs = Object.values(tsDict);

    // #region UseEffect
    useEffect(() => {
        let dict = Utility.genHourDict(startHr, endHr);
        setTsDict(dict);
    }, []);
    // #endregion

    // #region Helper
    const toggleStationSupplyDemand = (supply, demand) => {
        let obj = { ...station };
        obj["supply"] = supply;
        obj["demand"] = demand;
        setStation(obj);
    }

    const updateStation = (item, name, val) => {
        let dict = { ...tsDict };

        const { iso } = item;
        item[name] = val;
        dict[iso] = item;

        setTsDict(dict);

        const supplyArr = stationTs.map(x => x.supply);
        const demandArr = stationTs.map(x => x.demand);

        toggleStationSupplyDemand(supplyArr, demandArr);
    }
    // #endregion

    // #region Render
    const renderStationSd = (item, index) => {

        const { iso, supply, demand } = item;

        const setSupply = (val) => updateStation(item, "supply", val);
        const setDemand = (val) => updateStation(item, "demand", val);

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
            {stationTs.map(renderStationSd)}
        </div>
    )
}

function StationInput(props) {

    const { station, toggleStation = () => { } } = props;
    const { onRemoveStation = () => { }, onShowMap = () => { } } = props;

    const { is_hub, ride_zone, lat, lng, name } = station;
    const rideZoneLs = Utility.genRideZone();

    // #region Helper
    const toggleStationHub = (e) => {
        const { is_hub } = station;
        toggleStation("is_hub", !is_hub);
    }

    const toggleStationForm = (e) => {
        const { name, value } = e.target;
        toggleStation(name, value);
    }
    // #endregion

    // #region Render
    const renderOption = ({ name, value }) => (<option value={value}>{name}</option>);
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
                        maxWidth: 360,
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
                        maxWidth: 360,
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
                    maxWidth: 360,
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
                        <div onClick={toggleStationHub} className={`btn btn-primary`}>Make Hub</div>
                    ) : (
                        <></>
                    )
                }
                <div onClick={onRemoveStation} className="btn btn-danger">Remove Station</div>
                <div onClick={onShowMap} className="btn btn-success">Show in Map</div>
            </div>
        </div>
    )
}

function StationNode(props) {

    const init = {
        station: {
            name: "Station 1",
            is_hub: true,
            ride_zone: 1,
            lat: 15,
            lng: 15,
            estimated_time_to_next_station: 2,
            distance_to_next_station: 500,
            supply: [],
            demand: [],
        }
    };

    const [station, setStation] = useState(init.station);

    const color = Utility.genRideZoneColor();
    const { is_hub, ride_zone } = station;

    // #region Helper
    const toggleStation = (name, val) => {
        let obj = { ...station };
        obj[name] = val;
        setStation(obj);
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
                            borderColor: color[ride_zone]
                        }} alt={"Station"} />
                </div>
                <div style={{ width: "80%" }}>
                    {/* Input */}
                    <StationInput
                        station={station}
                        toggleStation={toggleStation}
                        onRemoveStation={() => { }}
                        onShowMap={() => { }} />
                </div>
            </div>

            {/* Station Node */}
            <StationNodeSd station={station} setStation={setStation} />
        </div>
    )
}

export default StationNode;