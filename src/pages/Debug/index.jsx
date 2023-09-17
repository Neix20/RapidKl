import React, { useState, useEffect } from "react";

import { Logger, Utility } from "@utility";

import { fetchGeoCode } from "@api";

import { useToggle } from "@hooks";

import { WqLoadingModal } from "@components";

import { Images } from "@config";

function NumberInput(props) {
	const { min, max, step } = props;
	const { rangeStyle = {} } = props;
	return (
		<>
			<input className={"g_input form-control"}
				type={"number"}
				min={min} max={max} step={step}
				style={{ width: 40 }} />
			<input
				type={"range"}
				min={min} max={max} step={step}
				style={{ width: 100, ...rangeStyle }} />
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
					placeholder={"Bus Name"}
					style={{ width: 120 }} />
			</div>

			{/* Occupants */}
			<div style={styles.inputDiv}>
				<i className="fa-regular fa-user"></i>
				<NumberInput min={0} max={30} step={1} />
			</div>

			{/* Driver Name */}
			<div style={styles.inputDiv}>
				<i className="fa-solid fa-user-tie"></i>
				<input
					className={"form-control"}
					type={"text"}
					placeholder={"Driver Name"}
					style={{ width: 120 }} />
			</div>

			{/* Fuel Consumption */}
			<div style={styles.inputDiv}>
				<i className="fa-solid fa-gas-pump"></i>
				<NumberInput min={0} max={1} step={0.1} rangeStyle={{ accentColor: "#F00" }} />
			</div>

			{/* Starting Time */}
			<div style={styles.inputDiv}>
				<i className="fa-solid fa-clock"></i>
				<input
					className={"form-control"}
					type={"time"}
					min={"06:00"} max={"23:00"} step={60}
					placeholder={"Driver Name"}
					style={{ width: 120 }} />
			</div>

			{/* Break */}
			<div style={styles.inputDiv}>
				<i className="fa-solid fa-clock-rotate-left"></i>
				<NumberInput min={0} max={6} step={1} rangeStyle={{ accentColor: "#0F0" }} />
			</div>

			{/* Update Btn */}
			<div className="btn btn-primary">Update Bus</div>

			{/* Remove Btn */}
			<div className="btn btn-danger">Remove Bus</div>
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
			<div style={{ width: 340 }}>
				<BusNodeInput />
			</div>
		</div>
	)
}

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
				<BusNode />
			</div>
		</>
	);
}

export default Index;
