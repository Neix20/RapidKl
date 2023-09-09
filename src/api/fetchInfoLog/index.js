import { Utility } from "@utility";

const Index = async (param) => {
	const action = "InfoLog";
	const url = Utility.genLogUrl(action);

	const { fileName = "" } = param;

	// Static Data
	let obj = {
		content: {
			...param,
			app: "WMQJG",
		},
		fileName: fileName,
	};

	const resp = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(obj),
	});

	const data = await resp.json();

	if (data["ResponseCode"] === "00") {
		console.log("Info Logging!");
	}

	return data;
};

export default Index;
