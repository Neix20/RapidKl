import React, { useState, useEffect } from "react";

import { Logger, Utility } from "@utility";

import { Link } from "react-router-dom";

import {fetchGeoCode} from "@api";

function Index(props) {

	// #region UseEffect
	useEffect(() => {
		fetchGeoCode({
			param: {
				q: "Sungai Besi"
			},
			onSetLoading: () => {}
		})
		.then(data => {
			console.log(data);
		})
		.catch(err => {
			console.log(`Error: ${err}`);
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
