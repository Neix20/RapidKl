import React, { useState, useEffect } from "react";

import { useScrollPosition } from "@hooks";

function Index(props) {
    
	const screenPos = useScrollPosition();

	const { scrollHeight } = document.body;

	// #region Helper
	const scrollToBottom = () => {
		window.scrollTo(0, scrollHeight);
	};

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};
	// #endregion

	let flag = screenPos < scrollHeight * 0.5;

	flag = flag || scrollHeight == 0;

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

export default Index;