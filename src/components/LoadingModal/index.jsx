import React, { useState, useEffect } from "react";

import { Logger, Utility } from "@utility";

import Modal from "react-modal";

import "@config/globalStyles.css";

import Loading from "./Loading";

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

	return (
		<Modal
			isOpen={loading}
			ariaHideApp={false}
			style={styles.modal}
		>
			{/* Modal Content */}
			<div className={"w-100 h-100 g_center"}>
				<Loading />
			</div>
		</Modal>
	)
}

export default Index;