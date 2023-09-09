import React, { useState, useEffect } from "react";

import { Logger, Utility } from "@utility";

import { Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { Actions, Selectors } from "@redux";

function Index(props) {

	const dispatch = useDispatch();

	// const deviceId = useSelector(Selectors.deviceIdSelect);

	// #region UseEffect
	useEffect(() => {
		// console.log(deviceId);
        Logger.info({
            "Msg": "Running from Utility.js"
        })
	}, []);
	// #endregion

	return (
		<>
			<div
				style={{
					backgroundColor: "#00F",
					height: 100,
					width: 100,
				}}
			></div>
			<Link
				to={`/DebugII`}
				className={"btn btn-primary"}
				style={{
					width: 60,
					borderRadius: 0,
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				Click Me
			</Link>
		</>
	);
}

export default Index;
