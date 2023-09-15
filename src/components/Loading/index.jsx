import React, { useState, useEffect } from "react";

import { Logger, Utility } from "@utility";
import { Animation } from "@config";

import Lottie from "react-lottie";
import Modal from "react-modal";

import "@config/globalStyles.css";

function Index(props) {

	const { loading = true } = props;

	const styles = {
		modal: {
			overlay: {
				zIndex: 10,
			},
			content: {
				// borderRadius: 8,
				backgroundColor: "rgba(255, 255, 255, 0.1)",
				top: 0,
				bottom: 0,
				left: 0,
				right: 0
			},
		}
	}

	const loadingOption = {
		loop: true,
		autoplay: true,
		animationData: Animation.Loading,
		rendererSettings: {
			preserveAspectRatio: "xMidYMid slice"
		}
	};

	return (
		<Modal
			isOpen={loading}
			style={styles.modal}
		>
			{/* Modal Content */}
			<div className={"w-100 h-100 g_center"}>
				<Lottie
					options={loadingOption}
					height={400}
					width={400}
				/>
			</div>
		</Modal>
	)
}

export default Index;