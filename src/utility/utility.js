import { clsConst } from "@config";

function genLogUrl(action) {
	const { LOG_URL } = clsConst;
	return `${LOG_URL}/${action}`;
}

function genServerUrl(action) {
	const { SERVER_URL } = clsConst;
	return `${SERVER_URL}/${action}`;
}

export { genLogUrl, genServerUrl };
