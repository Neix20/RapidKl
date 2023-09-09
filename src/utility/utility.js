import { clsConst } from "@config";

function genLogUrl(action) {
	const { LOG_URL } = clsConst;
	return `${LOG_URL}/${action}`;
}

function genServerUrl(action) {
	const { SERVER_URL } = clsConst;
	return `${SERVER_URL}/${action}`;
}

function requestObj(obj) {
	return obj;
}

function genFetchUrl(url, param = {}) {
    let res = url;

    if (Object.keys(param).length > 0) {
        res += "?";

        for (let key in param) {
            let val = param[key];
            res += `${key}=${val}`;
        }
    }

    return res;
}

export { genLogUrl, genServerUrl, requestObj, genFetchUrl };
