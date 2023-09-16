import React, { useState, useEffect } from "react";

import { Logger, Utility } from "@utility";

import { fetchGeoCode } from "@api";

import { useToggle } from "@hooks";

import { WqLoadingModal } from "@components";

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
	const [tsDict, setTsDict] = useState({});

	// #region UseEffect
	useEffect(() => {
		let dict = Utility.genHourDict(startHr, endHr);
		setTsDict(dict);
	}, []);
	// #endregion

	// #region Helper
	const updateStation = (item, name, val) => {
		let dict = { ...tsDict };

		const { iso } = item;
		item[name] = val;
		dict[iso] = item;

		setTsDict(dict);
	}
	// #endregion

	const station = Object.values(tsDict);

	// #region Render
	const renderStation = (item, index) => {

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
			{station.map(renderStation)}
		</div>
	)
}

function StationNode(props) {

	const init = {
		"name": "Station 1",
		"estimated_time_to_next_station": 2,
		"distance_to_next_station": 500,
		"supply": [10, 10, 20, 30, 40, 30, 20, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		"demand": [5, 3, 15, 20, 30, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		"is_hub": true,
		"ride_zone": 1
	}

	const [station, setStation] = useState({})

	return (
		<div>

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
				console.log(data);
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
				<StationNodeSd />
			</div>
		</>
	);
}

export default Index;
