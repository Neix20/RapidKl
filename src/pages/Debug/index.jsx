import React, { useState, useEffect } from "react";

import { Logger, Utility } from "@utility";

import { fetchGeoCode } from "@api";

import { useToggle } from "@hooks";

import { WqLoadingModal, WqModalBtn } from "@components";

import Bus from "./../Home/Bus";



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
	const [showModal, setShowModal, toggleModal] = useToggle(false);

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
		</>
	);
}

export default Index;
