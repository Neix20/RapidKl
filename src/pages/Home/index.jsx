import React, { useState, useEffect } from "react";

import { Logger, Utility } from "@utility";

import { Link } from "react-router-dom";

// #region Control
function BasedLogo(props) {
	const styles = {
		textParentStyle: {
			fontWeight: "bold",
			fontSize: 64,
			color: "#FFF",
		},
		wrapperStyle: {
			display: "flex",
			flexGrow: 1,
			alignItems: "center",
			justifyContent: "center",
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
		<div
			style={{
				// backgroundColor: "#00F",
				...styles.wrapperStyle,
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
			fontSize: 64,
			color: "#FFF",
		},
		wrapperStyle: {
			display: "flex",
			flexGrow: 1,
			alignItems: "center",
			justifyContent: "center",
		},
		wordDivStyle: {
			// backgroundColor: "#F00",
			display: "flex",
			alignItems: "flex-end",
			height: 100,
		},
	};

	return (
		<div
			style={{
				// backgroundColor: "#00F",
				...styles.wrapperStyle,
				...styles.textStyle,
				height: 100,
				columnGap: 40,
			}}
		>
			<div style={styles.wordDivStyle}>W</div>
			<div style={styles.wordDivStyle}>M</div>
			<div style={styles.wordDivStyle}>Q</div>
			<div style={styles.wordDivStyle}>J</div>
			<div style={styles.wordDivStyle}>G</div>
		</div>
	);
}

function ControlPane(props) {
	return (
		<div
			style={{
				flex: 1,
				backgroundColor: "#000",
				height: "100vh",
			}}
		>
			{/* Logo */}
			<Logo />
		</div>
	);
}
// #endregion

// #region Result
function ResultHeader(props) {
	return (
		<div
			style={{
				// backgroundColor: "#F00",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
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
        tabLs: ["Best", "Medium", "Worst"]
    }

    // #region Render
    const renderTab = (item, jnd) => {

        const onSelect = () => togglePane(jnd);

        const className = `nav-link ${ind == jnd ? "active" : ""}`

        return (
            <li className={"nav-item"}
				onClick={onSelect}
				style={{ cursor: "pointer", flex: 1 }}>
				<div className={className} 
                    style={{ display: "flex", justifyContent: "center" }}>
					{item}
				</div>
			</li>
        )
    }
    // #endregion

	return (
		<ul className={"nav nav-tabs"}>
			{init.tabLs.map(renderTab)}
		</ul>
	);
}

function ResultTabPane(props) {

    // #region Props
    const { ind, setInd = () => {}, colors=[] } = props;
    // #endregion

    return (
        <div style={{
            backgroundColor: colors[ind],
            flex: 1,
        }}></div>
    )
}

function ResultPane(props) {
    
	// #region UseState
	const [tabPaneInd, setTabPaneInd] = useState(0);
	// #endregion

    const colors = ["#F00", "#0F0", "#00F"]

	return (
		<div
			style={{
				// backgroundColor: "#F00",
                display: "flex",
                flexDirection: "column",
                height: "100vh",
			}}>
			<ResultHeader />

			{/* Tab Header */}
            <ResultTabHeader 
                ind={tabPaneInd}
                setInd={setTabPaneInd} />

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
