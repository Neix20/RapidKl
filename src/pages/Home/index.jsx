import React, { useState, useEffect, useMemo } from "react";

import { Logger, Utility } from "@utility";

import { Link } from "react-router-dom";

import { googleApiKey, Images } from "@config";

import "./index.css";

import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { fetchGeoCode } from "@api";
import { ScrollFabBtn } from "@components";

// #region Maps
function Search(props) {
	// #region Props
	const { searchQuery = () => {} } = props;
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
		searchQuery(query);
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
				className={"w-100 h-100"}
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
				<i class="fa-solid fa-magnifying-glass"></i>
			</div>
		</div>
	);
}

function Map(props) {
	// #region Props
	const { iCoord, setICoord = () => {} } = props;
	// #endregion

	const { isLoaded } = useLoadScript({ googleMapsApiKey: googleApiKey });

	const center = useMemo(() => iCoord, []);

	if (!isLoaded) {
		return <div className="h2">Loading...</div>;
	}

	return (
		<GoogleMap
			mapContainerClassName={"w-100 h-100"}
			center={center}
			zoom={15}
		>
			<Marker position={iCoord} />
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

import Modal from "react-modal";

function ControlPaneBtnModal(props) {
	// #region Props
	const { btnChild, mdlChild } = props;
	// #endregion

	// #region UseState
	const [showModal, setShowModal] = useState(false);
	// #endregion

	// #region Helper
	const toggleModal = () => setShowModal((val) => !val);
	// #endregion

	return (
		<>
			{showModal ? (
				<Modal
					isOpen={showModal}
					onRequestClose={toggleModal}
					style={{ backgroundColor: "#00F" }}
				>
					{/* Close Btn */}
					<div style={{ position: "absolute", top: 10, right: 10 }}>
						<div
							onClick={toggleModal}
							className={"btn btn-danger g_center"}
							style={{ width: 30, height: 30, borderRadius: 15 }}
						>
							<i class="fa-solid fa-xmark"></i>
						</div>
					</div>

					{/* Modal Content */}
					{mdlChild}
				</Modal>
			) : (
				<></>
			)}
			<div onClick={toggleModal}>{btnChild}</div>
		</>
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

	// #region UseState
	const [coords, setCoords] = useState(init.coord);
	// #endregion

	// #region Helper
	const searchQuery = (val) => {
		fetchGeoCode({
			param: {
				q: val,
			},
			onSetLoading: () => {},
		})
			.then((data) => {
				let { lat, lon } = data;

				lat = +lat;
				lon = +lon;

				setCoords({
					lat: lat,
					lng: lon,
				});
			})
			.catch((err) => {
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
			<div style={{ flex: 1, background: `url(${Images.bgKl})` }}>
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
						<div
							className={"w-100 h-100"}
							style={{
								backgroundColor: "#FFF",
								borderRadius: 8,
								padding: 10,
							}}
						>
							<div style={{ fontWeight: "Bold", fontSize: 24 }}>
								Start Date
							</div>

							<input
								className={"form-control"}
								placeholder={"E.g. 2023-08-18"}
							/>
						</div>
						<ControlPaneBtnModal
							btnChild={
								<div
									className="btn btn-primary w-100 h-100 g_center"
									style={{ columnGap: 10 }}
								>
									<div className={"fs-2 fw-bold"}>Buses</div>
									<i class="fa-solid fa-bus fa-2xl"></i>
								</div>
							}
							mdlChild={
								<div className={"g_center"}>
									<div className={"fs-2 fw-bold"}>
										Buses
									</div>
								</div>
							}
						/>
						<ControlPaneBtnModal
							btnChild={
								<div
									className="btn btn-danger w-100 h-100 g_center fs-2 fw-bold"
									style={{ columnGap: 10 }}
								>
									<div className={"fs-2 fw-bold"}>
										Passengers
									</div>
									<i class="fa-solid fa-user fa-lg"></i>
								</div>
							}
							mdlChild={
								<div className={"g_center"}>
									<div className={"fs-2 fw-bold"}>
										Passengers
									</div>
								</div>
							}
						/>
						<ControlPaneBtnModal
							btnChild={
								<div
									className="btn btn-secondary w-100 h-100 g_center fs-2 fw-bold"
									style={{ columnGap: 10 }}
								>
									<div className={"fs-2 fw-bold"}>
										Ticket Fares
									</div>
									<i class="fa-solid fa-money-bill fa-lg"></i>
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
						<div
							className="btn btn-success w-100 h-50 g_center fs-2 fw-bold"
							style={{ columnGap: 10 }}
						>
							<div className={"fs-2 fw-bold"}>Start</div>
							<i class="fa-solid fa-flag-checkered fa-lg"></i>
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
						<Map
							key={JSON.stringify(coords)}
							iCoord={coords}
							setICoord={setCoords}
						/>
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
	const { ind, setInd = () => {} } = props;
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
	const { ind, setInd = () => {}, colors = [] } = props;
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
	return (
		<div>
			{/* ScrollFabBtn */}
			<ScrollFabBtn />

			{/* Control Pane */}
			<ControlPane />

			{/* Result Pane */}
			<ResultPane />
		</div>
	);
}

export default Index;
