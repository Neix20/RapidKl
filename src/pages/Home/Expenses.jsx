import React, { useState, useEffect } from "react";

import { Logger, Utility } from "@utility";

import { WqModalBtn } from "@components";
import { useToggle } from "@hooks";

function ExpensePriceMatrix(props) {

    const { rideZoneMat = [], setRideZoneMat = () => {} } = props;

    const style = {
        inputStyle: {
            // padding: "5px 10px",
            borderWidth: 2,
            borderStyle: "solid"
        },
        txtDivStyle: {
            borderWidth: 2,
            borderStyle: "solid"
        },
        txtStyle: {

        }
    }

    const toggleRideZoneMat = (e) => {

        const { name, value } = e.target;

        let arr = [...rideZoneMat];

        let ind = +name.slice(4, 6);
        let jnd = +name.slice(6);

        arr[ind][jnd] = +value;
        setRideZoneMat(arr);
    }

    // #region Render Function
    const renderRideZoneTitle = (arr, index) => {
        return (
            <div key={index} className="g_center w-100" style={style.txtDivStyle}>
                <div style={style.txtStyle}>
                    Ride Zone {index + 1}
                </div>
            </div>
        )
    }

    const renderRideZone = (arr, index) => {
        return (
            <div key={index} style={{ display: "flex", columnGap: 10 }}>
                <div className="g_center w-100" style={style.txtDivStyle}>
                    <div style={style.txtStyle}>
                        Ride Zone {index + 1}
                    </div>
                </div>
                {arr.map((obj, jnd) => renderRideZoneItem(obj, index, jnd))}
            </div>
        )
    }

    const renderRideZoneItem = (obj, ind, jnd) => {

        const indStr = ind + "";
        const jndStr = jnd + "";

        return (
            <div key={jnd} className="g_center w-100" style={style.inputStyle}>
                <input
                    className={"g_input form-control"} type={"number"} placeholder={`Zone ${ind + 1}`}
                    min={0} max={10000} step={0.01}
                    name={`zone${indStr.padStart(2, "0")}${jndStr.padStart(2, "0")}`} 
                    value={rideZoneMat[ind][jnd]}
                    onChange={toggleRideZoneMat}
                />
            </div>
        )
    }
    // #endregion

    return (
        <div style={{ display: "flex", flexDirection: "column", rowGap: 10 }}>
            <div style={{ display: "flex", columnGap: 10 }}>
                <div className="g_center w-100" style={{ ...style.txtDivStyle, borderColor: "#FFF" }}>
                </div>
                {
                    rideZoneMat.map(renderRideZoneTitle)
                }
            </div>
            {
                rideZoneMat.map(renderRideZone)
            }
        </div>
    )
}

function ExpenseNode(props) {

    const style = {
        nodeStyle: {
            display: "flex",
            alignItems: "center",
            columnGap: 10,
            width: "30%"
        }
    };

    const { expense = {}, setExpense = () => { }, toggleModal = () => {} } = props;

    const { fuel_price, driver_daily_salary, other_fees, fare_matrix } = expense;

    const onChangeExpense = (e) => {
        const { name, value } = e.target;

        let obj = { ...expense };
        obj[name] = +value;

        setExpense(obj);
    }

    const onChangeFareMatrix = (value) => {
        let obj = { ...expense };
        obj["fare_matrix"] = value;
        setExpense(obj);
    }

    const onSubmit = () => {
        toggleModal();
    }

    return (
        <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={style.nodeStyle}>
                    <i className="fa-solid fa-gas-pump fa-xl"></i>
                    <input className={"g_input form-control"} type={"number"} placeholder="Daily Fuel Price"
                        min={0} max={10000} step={0.01}
                        name={"fuel_price"} value={fuel_price} onChange={onChangeExpense}
                    />
                </div>
                <div style={style.nodeStyle}>
                    <i className="fa-solid fa-user-tie fa-xl"></i>
                    <input className={"g_input form-control"} type={"number"} placeholder="Driver Daily Salary"
                        min={0} max={10000} step={0.01}
                        name={"driver_daily_salary"} value={driver_daily_salary} onChange={onChangeExpense}
                    />
                </div>
                <div style={style.nodeStyle}>
                    <i className="fa-solid fa-money-bill-wave fa-xl"></i>
                    <input className={"g_input form-control"} type={"number"} placeholder="Other Fees"
                        min={0} max={10000} step={0.01}
                        name={"other_fees"} value={other_fees} onChange={onChangeExpense}
                    />
                </div>
            </div>
            <div style={{ height: 20 }} />
            <ExpensePriceMatrix rideZoneMat={fare_matrix} setRideZoneMat={onChangeFareMatrix} />
            <div style={{ height: 10 }} />
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div onClick={onSubmit} className="btn btn-success">
                    Submit
                </div>
            </div>
        </>
    )
}

function Index(props) {

    const modalHook = useToggle(false);

    const modalObj = {
        showModal: modalHook[0],
        setShowModal: modalHook[1],
        toggleModal: modalHook[2]
    }

    const { flag = false } = props;

    if (!flag) {
        return (
            <div
                className="btn btn-warning w-100 h-100 g_center disabled"
                style={{ columnGap: 10 }}>
                <div className={"fs-2 fw-bold"}>Operation Detail</div>
                <i className="fa-solid fa-money-bill fa-lg"></i>
            </div>
        )
    }

    return (
        <WqModalBtn
            {...modalObj}
            btnChild={
                <div
                    className="btn btn-warning w-100 h-100 g_center"
                    style={{ columnGap: 10 }}>
                    <div className={"fs-2 fw-bold"}>
                        Operation Detail
                    </div>
                    <i className="fa-solid fa-money-bill fa-lg"></i>
                </div>
            }
            mdlChild={
                <div className={"w-100 h-100"}>
                    <div className={"g_center"} style={{ height: "10%" }}>
                        <div className={"fs-2 fw-bold"}>
                            Operation Detail
                        </div>
                    </div>
                    <div className={"w-100 g_center"} style={{ height: "90%" }}>
                        <div style={{ width: "90%", height: "100%" }}>
                            <ExpenseNode {...props} {...modalObj} />
                        </div>
                    </div>
                </div>
            }
        />
    );
}

export default Index;