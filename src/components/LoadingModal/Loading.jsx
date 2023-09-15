import React, { useState, useEffect } from "react";

import { Animation } from "@config";

import Lottie from "react-lottie";

function Index(props) {
	const loadingOption = {
		loop: true,
		autoplay: true,
		animationData: Animation.Loading,
		rendererSettings: {
			preserveAspectRatio: "xMidYMid slice"
		}
	};

	return (
		<div className={"g_center"} 
			style={{ flexDirection: "column", rowGap: 10 }}>
			<Lottie
				options={loadingOption}
				height={400}
				width={400}
			/>
			<div className={"h3"}>Loading ...</div>
		</div>
	)
}

export default Index;