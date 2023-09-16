import React, { useState, useEffect } from "react";

import { Logger, Utility } from "@utility";

import { fetchGeoCode } from "@api";

import { useToggle } from "@hooks";

import { WqLoadingModal } from "@components";

import StationNode from "../Home/Station";

function Index(props) {

	// #region UseEffect
	useEffect(() => {
		fetchGeoCode({
			param: {
				q: "Sungai Besi"
			},
			onSetLoading: () => { }
		})
			.then(data => {
				Logger.info({
					content: data,
					fileName: "geoCode"
				})
			})
			.catch(err => {
				console.log(`Error: ${err}`);
			})
	}, []);
	// #endregion

	const [loading, setLoading, toggleLoading] = useToggle(false);

	return (
		<>
			{/* <WqLoadingModal loading={loading} /> */}
			<div
				style={{
					backgroundColor: "#00F",
					height: 100,
					width: 100,
				}}
			></div>

			<div><input type={"time"} /></div>

			<div className="g_center">
				<StationNode />
			</div>
		</>
	);
}

export default Index;
