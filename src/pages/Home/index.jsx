import React, { useState, useEffect, useMemo, useContext, createContext } from "react";

import { Logger, Utility } from "@utility";

import { Link } from "react-router-dom";

import { googleApiKey, Images } from "@config";

import "@config/globalStyles.css";

import { fetchGeoCode } from "@api";
import { WqScrollFabBtn, WqModalBtn, WqLoading, WqLoadingModal } from "@components";

// import GoogleMapReact from "google-map-react";

const Context = createContext();
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

// #region Maps
// const Marker = ({ children }) => {
// 	return (
// 		<div
// 			className={"g_center"}
// 			style={{
// 				width: 40,
// 				height: 40,
// 				backgroundColor: "rgba(255, 0, 0, 0.25)"
// 			}}>{children}</div>
// 	)
// }

function Search(props) {

	// #region Props
	const { searchQuery = () => { } } = props;
	// #endregion

	// #region UseState
	const [query, setQuery] = useState("");
	// #endregion

	// #region Helper
	const onChangeQuery = (e) => {
		const { value } = e.target;
		setQuery(value);
	};

	const toggleSearchQuery = () => {
		if (query !== "") {
			searchQuery(query);
		} else {
			alert("Please Put in an input!")
		}
		setQuery("");
	};

	const handleKeyDown = (e) => {
		const { key } = e;
		if (key === "Enter") {
			toggleSearchQuery();
		}
	};
	// #endregion

	return (
		<div
			className={"w-100 h-100"}
			style={{
				display: "flex",
				backgroundColor: "#FFF",
				borderRadius: 8,
			}}
		>
			<input
				className={"form-control"}
				value={query}
				onChange={onChangeQuery}
				onKeyDown={handleKeyDown}
				name="query"
				type="text"
				x-webkit-speech="true"
				autoComplete="off"
				placeholder=" Search ..."
				style={{
					borderWidth: 0,
					borderRadius: 8,
					padding: "0px 10px"
				}}
			/>

			{/* Search */}
			<div
				className={"g_center"}
				onClick={toggleSearchQuery}
				style={{
					width: 40,
					backgroundColor: "#FFF",
					borderRadius: 8,
					cursor: "pointer",
				}}
			>
				<i className="fa-solid fa-magnifying-glass"></i>
			</div>
		</div>
	);
}

// function Map(props) {

// 	// #region Props
// 	const { iCoord, setICoord = () => { } } = props;
// 	// #endregion

// 	// #region UseState
// 	const [refresh, setRefresh] = useState(false);
// 	const [stationLs, setStationLs] = useState([]);
// 	// #endregion

// 	// #region Helper
// 	const addStation = ({ x, y, lat, lng, event }) => {
// 		let arr = [...stationLs];

// 		let obj = {
// 			lat: lat,
// 			lng: lng,
// 			text: `Item ${arr.length}`
// 		}

// 		console.log(obj);

// 		arr.push(obj);

// 		setStationLs(arr);
// 	}

// 	const toggleRefresh = () => setRefresh(val => !val);
// 	// #endregion

// 	// #region Render
// 	const renderMarker = ({ lat, lng, text }, ind) => {
// 		return (
// 			<Marker key={ind} lat={lat} lng={lng}>{text}</Marker>
// 		)
// 	}
// 	// #endregion

// 	return (
// 		<GoogleMapReact
// 			bootstrapURLKeys={{ key: googleApiKey }}
// 			defaultCenter={iCoord}
// 			onClick={addStation}
// 			defaultZoom={15}
// 		>
// 			{stationLs.map(renderMarker)}
// 		</GoogleMapReact>
// 	);
// }

function Map(props) {

	const { iCoord, setICoord = () => { } } = props;

	const { isLoaded } = useLoadScript({ googleMapsApiKey: googleApiKey });
	const center = useMemo(() => (iCoord), []);

	const onClick = (e) => {
		const {latLng } = e;
		console.log(latLng.lat());
		console.log(latLng.lng())
	}

	if (!isLoaded) {
		return (
			<div className="w-100 h-100 g_center" style={{ backgroundColor: "#FFF" }}>
			<WqLoading />
		</div>
		)
	}

	return (
		<GoogleMap
			mapContainerClassName="w-100 h-100"
			center={center}
			zoom={15}
			onClick={onClick}
		>
			<Marker 
				visible={true}
				position={iCoord} />
		</GoogleMap>
	);
}
// #endregion

// #region Control
function Logo(props) {
	const styles = {
		textStyle: {
			fontWeight: "bold",
			fontSize: 48,
			color: "#FFF",
		},
		wordDivStyle: {
			// backgroundColor: "#F00",
		},
	};

	return (
		<div
			className={"g_center"}
			style={{
				...styles.textStyle,
				minHeight: 40,
				columnGap: 20,
			}}
		>
			<div>WMQJG</div>
			<div className={"fst-italic"}>RapidKL</div>
			<div>Simulator</div>
			{/* <div style={styles.wordDivStyle}>W</div>
			<div style={styles.wordDivStyle}>M</div>
			<div style={styles.wordDivStyle}>Q</div>
			<div style={styles.wordDivStyle}>J</div>
			<div style={styles.wordDivStyle}>G</div> */}
		</div>
	);
}

function ControlPane(props) {

	// #region Init
	const init = {
		coord: {
			lat: 3.140853,
			lng: 101.693207,
		},
	};
	// #endregion

	// #region Context
	const [loading, setLoading] = useContext(Context);
	// #endregion

	// #region UseState
	const [coords, setCoords] = useState(init.coord);
	// #endregion

	// #region Helper
	const searchQuery = (val) => {
		setLoading(true);
		fetchGeoCode({
			param: {
				q: val,
			},
			onSetLoading: setLoading,
		})
			.then((data) => {
				let { lat, lon } = data;

				lat = +lat;
				lon = +lon;

				const flag = !isNaN(lat) && !isNaN(lon);

				if (flag) {
					setCoords({
						lat: lat,
						lng: lon
					})
				}
			})
			.catch((err) => {
				setLoading(false)
				console.log(`Error: ${err}`);
			});
	};
	// #endregion

	return (
		<div
			style={{
				display: "flex",
				height: "100vh",
				backgroundColor: "#000",
				flexDirection: "column",
			}}
		>
			{/* Background */}
			<div
				style={{
					flex: 1,
					// background: `url(${Images.bgKl})`,
					backgroundColor: "#000",
				}}
			>
				<div
					className={"w-100 h-100"}
					style={{ backgroundColor: "rgba(255, 255, 255, 0.25)" }}
				></div>
			</div>

			{/* Items */}
			<div
				className={"g_overlay"}
				style={{ display: "flex", flexDirection: "column" }}
			>
				{/* Logo */}
				<Logo />

				{/* Panel */}
				<div
					className={"g_center"}
					style={{ flex: 1, padding: 20, columnGap: 20 }}
				>
					{/* Control */}
					<div
						style={{
							height: "100%",
							width: "30%",
							display: "flex",
							flexDirection: "column",
							rowGap: 10,
						}}
					>
						<WqModalBtn
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
						<WqModalBtn
							btnChild={
								<div
									className="btn btn-warning w-100 h-100 g_center"
									style={{ columnGap: 10 }}
								>
									<div className={"fs-2 fw-bold"}>
										Ticket Fares
									</div>
									<i className="fa-solid fa-money-bill fa-lg"></i>
								</div>
							}
							mdlChild={
								<div className={"g_center"}>
									<div className={"fs-2 fw-bold"}>
										Ticket Fares
									</div>
								</div>
							}
						/>
						<WqModalBtn
							btnChild={
								<div
									className="btn btn-info w-100 h-100 g_center"
									style={{ columnGap: 10 }}
								>
									<div className={"fs-2 fw-bold"}>
										Station
									</div>
									<i className="fa-solid fa-gas-pump fa-lg"></i>
								</div>
							}
							mdlChild={
								<div className={"g_center"}>
									<div className={"fs-2 fw-bold"}>
										Station
									</div>
								</div>
							}
						/>
						<div
							className="btn btn-danger w-100 h-50 g_center"
							style={{ columnGap: 10 }}
						>
							<div className={"fs-2 fw-bold"}>Reset</div>
							<i className="fa-solid fa-rotate-left fa-lg"></i>
						</div>
						<div
							className="btn btn-success w-100 h-50 g_center"
							style={{ columnGap: 10 }}
						>
							<div className={"fs-2 fw-bold"}>Start</div>
							<i className="fa-solid fa-flag-checkered fa-lg"></i>
						</div>
					</div>

					{/* Map */}
					<div
						className={"w-100 h-100"}
						style={{
							display: "flex",
							flexDirection: "column",
							rowGap: 10,
						}}
					>
						<div style={{ width: "100%", height: "10%" }}>
							<Search searchQuery={searchQuery} />
						</div>
						<div className={"w-100 h-100"}>
							<Map
								key={JSON.stringify(coords)}
								iCoord={coords}
								setICoord={setCoords}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
// #endregion

// #region Result
function ResultHeader(props) {
	return (
		<div
			className={"g_center"}
			style={{
				// backgroundColor: "#F00",
				height: 100,
			}}
		>
			<div
				style={{
					fontWeight: "bold",
					fontSize: 64,
					color: "#000",
				}}
			>
				Result
			</div>
		</div>
	);
}

function ResultTabHeader(props) {
	// #region Props
	const { ind, setInd = () => { } } = props;
	// #endregion

	// #region Helper
	const togglePane = (val) => setInd(val);
	// #endregion

	const init = {
		tabLs: ["Best", "Medium", "Worst"],
	};

	// #region Render
	const renderTab = (item, jnd) => {
		const onSelect = () => togglePane(jnd);

		const className = `nav-link ${ind == jnd ? "active" : ""}`;

		return (
			<li
				className={"nav-item"}
				onClick={onSelect}
				style={{ cursor: "pointer", flex: 1 }}
			>
				<div
					className={className}
					style={{ display: "flex", justifyContent: "center" }}
				>
					{item}
				</div>
			</li>
		);
	};
	// #endregion

	return <ul className={"nav nav-tabs"}>{init.tabLs.map(renderTab)}</ul>;
}

function ResultTabPane(props) {

	// #region Props
	const { ind, setInd = () => { }, colors = [] } = props;
	// #endregion

	return (
		<div
			style={{
				backgroundColor: colors[ind],
				flex: 1,
			}}
		></div>
	);
}

function ResultPane(props) {
	// #region UseState
	const [tabPaneInd, setTabPaneInd] = useState(0);
	// #endregion

	const colors = ["#F00", "#0F0", "#00F"];

	return (
		<div
			style={{
				// backgroundColor: "#F00",
				display: "flex",
				flexDirection: "column",
				height: "100vh",
			}}
		>
			{/* Header */}
			<ResultHeader />

			{/* Tab Header */}
			<ResultTabHeader ind={tabPaneInd} setInd={setTabPaneInd} />

			<ResultTabPane
				ind={tabPaneInd}
				setInd={setTabPaneInd}
				colors={colors}
			/>
		</div>
	);
}
// #endregion

function Index(props) {

	// #region UseState
	const [loading, setLoading] = useState(false);
	const [resultFlag, setResultFlag] = useState(false);
	// #endregion

	// #region Helper
	const toggleLoading = () => setLoading((val) => !val);
	const toggleResultFlag = () => setResultFlag((val) => !val);
	// #endregion

	return (
		<Context.Provider value={[loading, setLoading]}>
			{/* Loading */}
			<WqLoadingModal loading={loading} />

			{/* Control Pane */}
			<ControlPane />

			{/* Result Pane && ScrollFabBtn */}
			{
				(resultFlag) ? (
					<>
						<WqScrollFabBtn />
						<ResultPane />
					</>
				) : (
					<></>
				)
			}
		</Context.Provider>
	);
}

export default Index;
