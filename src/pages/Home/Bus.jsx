import React, { useState, useEffect } from "react";

import { Logger, Utility } from "@utility";

import { useToggle } from "@hooks";

import { WqModalBtn } from "@components";

function Index(props) {

    const modalHook = useToggle(false);

    const modalObj = {
        showModal: modalHook[0],
        setShowModal: modalHook[1],
        toggleModal: modalHook[2]
    }

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
                <div className={"g_center"}>
                    <div className={"fs-2 fw-bold"}>Buses</div>
                </div>
            }
        />
    );
}

export default Index;