import React, { useState, useEffect } from "react";

import { Logger, Utility } from "@utility";

import { useToggle } from "@hooks";

import { WqModalBtn } from "@components";

import { Images } from "@config";

function NumberInput(props) {

    const { rstyle = {} } = props;

    const { value, onChange } = props;

    const handleValue = (e) => {
        let { min, max, value } = e.target;

        min = +min;
        max = +max;
        value = +value;

        value = Math.max(min, Math.min(max, value));

        e.target.value = value;

        onChange(e);
    }

    return (
        <>
            <input className={"g_input form-control"}
                type={"number"}
                {...props}
                value={value}
                onChange={handleValue}
                style={{ width: 50 }} />
            <input
                type={"range"}
                {...props}
                style={{ width: 70, ...rstyle }} />
        </>
    )
}

function BusNodeInput(props) {

    const styles = {
        inputDiv: {
            display: "flex",
            alignItems: "center",
            columnGap: 10
        }
    }

    const init = {
        bus: {
            "name": "Bus 1",
            "driver": "John Doe",
            "max_occupants": 30,
            "starting_time": 30,
            "time_iso": "06:00",
            "fuel_consumption_per_km": 0.3,
            "major_break": 1
        }
    };

    const { bus, UpdateBus, DeleteBus } = props;
    const { toggleModal, onMarkerZoom } = props;

    const { name, driver, max_occupants, time_iso, fuel_consumption_per_km, major_break } = bus;

    const toggleBus = (e) => {
        const { name: tName, value } = e.target;
        let obj = { ...bus };
        obj[tName] = value;
        UpdateBus(obj);
    }

    const removeBus = () => {
        const { pos } = bus;
        DeleteBus(pos);
    }

    const onMapShow = () => {
        toggleModal();

        console.log(bus)
        onMarkerZoom(bus);
    }

    return (
        <div style={{
            display: "flex",
            flexWrap: "wrap",
            columnGap: 10,
            rowGap: 10,
        }}>
            {/* Name */}
            <div style={styles.inputDiv}>
                <i className="fa-solid fa-bus"></i>
                <input
                    className={"form-control"}
                    type={"text"}
                    name={"name"} value={name} onChange={toggleBus}
                    placeholder={"Bus Name"}
                    style={{ width: 90 }} />
            </div>

            {/* Occupants */}
            <div style={styles.inputDiv}>
                <i className="fa-regular fa-user"></i>
                <NumberInput
                    name={"max_occupants"} value={max_occupants} onChange={toggleBus}
                    min={0} max={30} step={1} />
            </div>

            {/* Driver Name */}
            <div style={styles.inputDiv}>
                <i className="fa-solid fa-user-tie"></i>
                <input
                    className={"form-control"}
                    type={"text"}
                    name={"driver"} value={driver} onChange={toggleBus}
                    placeholder={"Driver Name"}
                    style={{ width: 90 }} />
            </div>

            {/* Fuel Consumption */}
            <div style={styles.inputDiv}>
                <i className="fa-solid fa-gas-pump"></i>
                <NumberInput
                    name={"fuel_consumption_per_km"} value={fuel_consumption_per_km} onChange={toggleBus}
                    min={0} max={1} step={0.1} rstyle={{ accentColor: "#F00" }} />
            </div>

            {/* Starting Time */}
            <div style={styles.inputDiv}>
                <i className="fa-solid fa-clock"></i>
                <input
                    className={"form-control"}
                    type={"time"}
                    name={"time_iso"} value={time_iso} onChange={toggleBus}
                    min={"06:00"} max={"23:00"} step={60}
                    placeholder={"Driver Name"}
                    style={{ width: 90 }} />
            </div>

            {/* Break */}
            <div style={styles.inputDiv}>
                <i className="fa-solid fa-clock-rotate-left"></i>
                <NumberInput
                    name={"major_break"} value={major_break} onChange={toggleBus}
                    min={0} max={6} step={1} rstyle={{ accentColor: "#0F0" }} />
            </div>

            {/* Remove Btn */}
            <div onClick={removeBus} className="btn btn-danger">Remove Bus</div>

            {/* Show In Map */}
            <div onClick={onMapShow} className="btn btn-success">Show In Map</div>
        </div>
    )
}

function BusNode(props) {
    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            columnGap: 20,
            borderWidth: 3,
            borderRadius: 15,
            borderStyle: "solid",
            padding: 10,
        }}>
            <div>
                <img src={Images.busColor} style={{
                    width: 100,
                    height: 100
                }} alt={"RapidKl Bus"} />
            </div>
            <div style={{ width: 300 }}>
                <BusNodeInput {...props} />
            </div>
        </div>
    )
}

function Index(props) {

    const modalHook = useToggle(false);

    const modalObj = {
        showModal: modalHook[0],
        setShowModal: modalHook[1],
        toggleModal: modalHook[2]
    };

    const styles = {
        ctrlBtn: {
            width: 40,
            height: 40,
            borderRadius: 20,
        }
    }

    const { busLs, setBusLs, AddBus, UpdateBus, DeleteBus, flag = false } = props;

    // #region Helper
    const RemoveBus = () => {
        const lastPos = busLs.length - 1;
        DeleteBus(lastPos);
    }
    // #endregion

    // #region Render
    const renderBusNode = (item, index) => {
        return (
            <BusNode key={index} bus={item}
                {...modalObj}
                {...props} />
        )
    }
    // #endregion

    return (
        <WqModalBtn {...modalObj}
            btnChild={
                <div
                    className="btn btn-primary w-100 h-100 g_center"
                    style={{ columnGap: 10 }}
                >
                    <div className={"fs-2 fw-bold"}>Buses</div>
                    <i className="fa-solid fa-bus fa-lg"></i>
                </div>
            }
            mdlChild={
                <div className={"w-100 h-100"}>
                    <div className={"g_center"} style={{ height: "10%" }}>
                        <div className={"fs-2 fw-bold"}>
                            Bus
                        </div>
                    </div>
                    <div className={"w-100"} style={{ height: "90%" }}>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            columnGap: 10
                        }}>
                            {
                                (busLs.length == 0) ? (
                                    <div className={"btn btn-danger g_center disabled"} style={styles.ctrlBtn}>
                                        <i className="fa-solid fa-minus"></i>
                                    </div>
                                ) : (
                                    <div onClick={RemoveBus}
                                        className={"btn btn-danger g_center"} style={styles.ctrlBtn}>
                                        <i className="fa-solid fa-minus"></i>
                                    </div>
                                )
                            }
                            <input className={"form-control"} value={busLs.length}
                                type={"text"} readOnly style={{ width: 100 }} />
                            {
                                (!flag) ? (
                                    <div className={"btn btn-success g_center"} style={styles.ctrlBtn}>
                                        <i className="fa-solid fa-plus"></i>
                                    </div>
                                ) : (
                                    <div onClick={AddBus}
                                        className={"btn btn-success g_center"} style={styles.ctrlBtn}>
                                        <i className="fa-solid fa-plus"></i>
                                    </div>
                                )
                            }
                        </div>

                        <div style={{ height: 10 }} />

                        <div style={{ display: "flex", flexWrap: "wrap", columnGap: 10, rowGap: 10 }}>
                            {
                                busLs.map(renderBusNode)
                            }
                        </div>
                    </div>
                </div>
            }
        />
    );
}

export default Index;