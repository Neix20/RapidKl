import React, { useState, useEffect } from "react";

import Modal from "react-modal";

import "@config/globalStyles.css";

function Index(props) {

	// #region Props
	const { btnChild, mdlChild } = props;
	const { btnStyle = {}, mdlStyle = {} } = props;
	// #endregion

	const { showModal, setShowModal = () => {}, toggleModal = () => {} } = props;

	const styles = {
		modal: {
			overlay: {
				zIndex: 10,
				backgroundColor: "rgba(255, 255, 255, 0.75)",
			},
			content: {
				borderRadius: 8,
				top: 20,
				bottom: 20,
				left: 20,
				right: 20,
			},
		}
	}

	return (
		<>
			{showModal ? (
				<Modal
					isOpen={showModal}
					ariaHideApp={false}
					onRequestClose={toggleModal}
					style={{
						...styles.modal,
						...mdlStyle
					}}
				>
					{/* Close Btn */}
					<div style={{ position: "absolute", top: 10, right: 10 }}>
						<div
							onClick={toggleModal}
							className={"btn btn-danger g_center"}
							style={{ width: 30, height: 30, borderRadius: 15 }}
						>
							<i className="fa-solid fa-xmark"></i>
						</div>
					</div>

					{/* Modal Content */}
					{mdlChild}
				</Modal>
			) : (
				<></>
			)}
			<div className={`w-100 h-100`}
				onClick={toggleModal}>{btnChild}</div>
		</>
	);

}

export default Index;