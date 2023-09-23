import React, { useState, useEffect } from "react";

import { Logger, Utility } from "@utility";

import { fetchGeoCode, fetchTest } from "@api";

import { useToggle } from "@hooks";

import { WqLoadingModal, WqModalBtn, WcChart } from "@components";

import "@config/globalStyles.css";

import { faker } from '@faker-js/faker';

const labels = Utility.genTsLabelArr();

function Index(props) {

	const init = {
		active: "https://neix.s3.amazonaws.com/bus_color.png",
		inActive: "https://neix.s3.amazonaws.com/wqRklBus.png"
	}

	const [play, setPlay, togglePlay] = useToggle(false);

	const [frame, setFrame] = useState(1050);
	
	const duration = 5;
	const maxFrame = 1050;
	const time_per_frame = 1000 * 60 * duration / maxFrame;

	useEffect(() => {
		const interval = setInterval(() => {
			if (play) {
				setFrame(frame => (frame + 1) % maxFrame);
			}
		}, time_per_frame);
		return () => clearInterval(interval);
	}, [play]);

	const dataLs = [
		{
			label: "Dataset 3",
			data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 }))
		},
		{
			label: "Dataset 3",
			data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 }))
		}
	]

	return (
		<>
			{/* <WqLoadingModal loading={loading} /> */}
			<div onClick={togglePlay} className="btn btn-primary" >Gay</div> 
			<div>{play ? "Active" : "Not Active"}</div>
			<div style={{ backgroundColor: "#00F", display: "flex" }}>
				<div className={"g_center"}
					style={{
						flex: 1,
						backgroundColor: "#FFF"
					}}>
					<WcChart title={"Chart Js"} frameInd={frame} 
					labelLs={labels} dataLs={dataLs} />
				</div>
				<div className={"g_center"}
					style={{
						flex: 1,
						backgroundColor: "#FFF"
					}}>
					<WcChart frameInd={frame} labelLs={labels} dataLs={dataLs} />
				</div>
				<div className={"g_center"}
					style={{
						flex: 1,
						backgroundColor: "#FFF"
					}}>
					<WcChart frameInd={frame} labelLs={labels} dataLs={dataLs} />
				</div>
			</div>
		</>
	);
}

export default Index;
