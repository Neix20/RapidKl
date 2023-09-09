import React, { useState, useEffect, useMemo } from "react";

import { Logger, Utility } from "@utility";

import { Link } from "react-router-dom";

import { googleApiKey, Images } from "@config";

import "./index.css"

// #region Maps
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

function Search(props) {
    return (
        <div className={"w-100 h-100"} 
            style={{ backgroundColor: "#FFF", borderRadius: 8 }}></div>
    )
}

function Map(props) {
    const coor = {
        lat: 3.140853,
        lng: 101.693207
    }

	const { isLoaded } = useLoadScript({ googleMapsApiKey: googleApiKey });

	const center = useMemo(() => (coor), []);

	if (!isLoaded) {
		return <div className="h2">Loading...</div>;
	}

	return (
		<GoogleMap 
            mapContainerClassName={"w-100 h-100"}
			center={center}
			zoom={10}
		>
			<Marker position={coor} />
		</GoogleMap>
	);
};
// #endregion

// #region Control
function BasedLogo(props) {
	const styles = {
		textParentStyle: {
			fontWeight: "bold",
			fontSize: 64,
			color: "#FFF",
		},
		textChildStyle: {
			position: "relative",
			fontWeight: "normal",
			fontSize: 24,
			bottom: 15,
			display: "none",
		},
		divParentStyle: {
			// backgroundColor: "#F00",
			display: "flex",
			alignItems: "flex-end",
			height: 100,
		},
	};

	return (
		<div className={"g_center"}
			style={{
				// backgroundColor: "#00F",
				...styles.textParentStyle,
				height: 100,
				columnGap: 48,
			}}
		>
			<div style={styles.divParentStyle}>
				W<div style={styles.textChildStyle}>o</div>
			</div>
			<div style={styles.divParentStyle}>
				M<div style={styles.textChildStyle}>en</div>
			</div>
			<div style={styles.divParentStyle}>
				Q<div style={styles.textChildStyle}>iang</div>
			</div>
			<div style={styles.divParentStyle}>
				J<div style={styles.textChildStyle}>ian</div>
			</div>
			<div style={styles.divParentStyle}>
				G<div style={styles.textChildStyle}>irls</div>
			</div>
		</div>
	);
}

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
			<div className={"g_center"}
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
                    <div className="w-100 h-100" 
                        style={{ backgroundColor: "#FFF", padding: 5, borderRadius: 8 }}>Test</div>
                    <div className="w-100 h-100" 
                        style={{ backgroundColor: "#F00", padding: 5, borderRadius: 8 }}>Test</div>
                    <div className="w-100 h-100" 
                        style={{ backgroundColor: "#FFF", padding: 5, borderRadius: 8 }}>Test</div>
                    <div className="btn btn-warning w-100 h-100 g_center fs-2 fw-bold">Help</div>
                    <div className="btn btn-success w-100 h-100 g_center fs-2 fw-bold">Start</div>
                </div>
                {/* Map */}
				<div className="w-100 h-100" 
                    style={{ 
                        display: "flex",
                        flexDirection: "column",
                        rowGap: 10,
                        backgroundColor: "#000" 
                    }} >
                    <div style={{
                        width: "100%",
                        height: "10%",
                    }}>
                        <Search />
                    </div>
					<Map />
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
			<li className={"nav-item"}
				onClick={onSelect}
				style={{ cursor: "pointer", flex: 1 }}>
				<div className={className}
					style={{ display: "flex", justifyContent: "center" }}>
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
			{/* Control Pane */}
			<ControlPane />

			{/* Result Pane */}
			<ResultPane />
		</div>
	);
}

export default Index;
