import React, { useState, useEffect } from "react";

import { Logger, Utility } from "@utility";

import { fetchGeoCode } from "@api";

import { WqLoadingModal } from "@components";

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
				console.log(data);
			})
			.catch(err => {
				console.log(`Error: ${err}`);
			})
	}, []);
	// #endregion

	const [loading, setLoading] = useState(false);

	const toggleLoading = () => setLoading((val) => !val);

	return (
		<>
			{/* <WqLoadingModal loading={true} /> */}
			<div
				style={{
					backgroundColor: "#00F",
					height: 100,
					width: 100,
				}}
			></div>
			<div onClick={toggleLoading}
				className="btn btn-primary">
				<div className={"fs-2 fw-bold"}>Loading</div>
			</div>
		</>
	);
}

export default Index;
