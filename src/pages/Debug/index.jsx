import React, { useState, useEffect } from "react";

import { Logger, Utility } from "@utility";

import { fetchGeoCode, fetchTest } from "@api";

import { useToggle } from "@hooks";

import { WqLoadingModal, WqModalBtn } from "@components";

function PlayBtn(props) {
	const { flag = false, onClick = () => { } } = props;

	if (flag) {
		return (
			<div onClick={onClick}
				className="btn btn-warning g_center"
				style={{ columnGap: 10 }}
			>
				<div className={"fs-2 fw-bold"}>Pause</div>
			</div>
		)
	}

	return (
		<div onClick={onClick}
			className="btn btn-success g_center"
			style={{ columnGap: 10 }}
		>
			<div className={"fs-2 fw-bold"}>Play</div>
		</div>
	)
}

function BusAnime(props) {
	const init = {
		active: "https://neix.s3.amazonaws.com/bus_color.png",
		inActive: "https://neix.s3.amazonaws.com/wqRklBus.png"
	}

	const { stateFlag = true } = props;

	const [frame, setFrame] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			if (stateFlag) {
				setFrame(() => frame + 1);
			}
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	if (stateFlag) {
		return (
			<img
				src={(active) ? init.active : init.inActive}
				style={{
					width: 100,
					height: 100
				}}
				alt={"Bus"} />
		)
	}

	return (
		<img
			src={init.active}
			style={{
				width: 100,
				height: 100
			}}
			alt={"Bus"} />
	)


}

function Index(props) {

	const init = {
		active: "https://neix.s3.amazonaws.com/bus_color.png",
		inActive: "https://neix.s3.amazonaws.com/wqRklBus.png"
	}

	const [active, setInactive, toggleActive] = useToggle(false);

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

			<PlayBtn flag={active} onClick={toggleActive} />
			<BusAnime stateFlag={active} />
		</>
	);
}

export default Index;
