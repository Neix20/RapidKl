import React, { useState, useEffect, useMemo } from "react";

import { Logger, Utility } from "@utility";

import { Link } from "react-router-dom";

import { googleApiKey, Images } from "@config";

import "./index.css";

import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { fetchGeoCode } from "@api";

// #region Hooks
const useScrollPosition = () => {
	const [scrollPosition, setScrollPosition] = useState(0);

	useEffect(() => {
		const updatePosition = () => setScrollPosition(window.scrollY);

		window.addEventListener("scroll", updatePosition);

		return () => window.removeEventListener("scroll", updatePosition);
	}, []);

	return scrollPosition;
};
// #endregion

// #region Components
function ScrollFabBtn(props) {
	const screenPos = useScrollPosition();

	const { scrollHeight } = document.body;

	console.log(screenPos, scrollHeight * 0.5);

	// #region Helper
	const scrollToBottom = () => {
		window.scrollTo(0, scrollHeight);
	};

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};
	// #endregion

	const flag = screenPos < scrollHeight * 0.5;

	return (
		<div key={flag}
			style={{
				position: "fixed",
				zIndex: 5,
				bottom: 10,
				right: 10,
			}}
		>
			{flag ? (
				<div
					onClick={scrollToBottom}
					className={"btn btn-warning"}
					style={{
						width: 40,
						height: 40,
						cursor: "pointer",
						borderRadius: 20,
					}}
				>
					<i class="fa-solid fa-down-long"></i>
				</div>
			) : (
				<div
					onClick={scrollToTop}
					className={"btn btn-warning"}
					style={{
						width: 40,
						height: 40,
						cursor: "pointer",
						borderRadius: 20,
					}}
				>
					<i class="fa-solid fa-up-long"></i>
				</div>
			)}
		</div>
	);
}
// #endregion

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
			{/* Logo */}
			<Logo />

			{/* Panel */}
			<div
				className={"g_center"}
				style={{
					flex: 1,
					padding: 20,
					columnGap: 20,
					// backgroundImage: `url(${Images.bgKl})`,
				}}
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
						className="w-100 h-100"
						style={{
							backgroundColor: "#FFF",
							padding: 5,
							borderRadius: 8,
						}}
					>
						Test
					</div>
					<div
						className="w-100 h-100"
						style={{
							backgroundColor: "#F00",
							padding: 5,
							borderRadius: 8,
						}}
					>
						Test
					</div>
					<div
						className="w-100 h-100"
						style={{
							backgroundColor: "#FFF",
							padding: 5,
							borderRadius: 8,
						}}
					>
						Test
					</div>
					<div className="btn btn-warning w-100 h-100 g_center fs-2 fw-bold">
						Help
					</div>
					<div className="btn btn-success w-100 h-100 g_center fs-2 fw-bold">
						Start
					</div>
				</div>

				{/* Map */}
				<div
					className="w-100 h-100"
					style={{
						display: "flex",
						flexDirection: "column",
						rowGap: 10,
						backgroundColor: "#000",
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