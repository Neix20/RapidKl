import React, { useState, useEffect } from "react";

import { Logger, Utility } from "@utility";

import { Link } from "react-router-dom";

function Index(props) {
	return (
		<>
			<div
				style={{
					backgroundColor: "#F00",
					height: 100,
					width: 100,
				}}
			></div>
			<Link
				to={`/Debug`}
				className={"btn btn-primary"}
				style={{
					width: 60,
					borderRadius: 0,
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				Click Me
			</Link>
		</>
	);
}

export default Index;
