import { clsConst } from "@config";

import { DateTime } from "luxon";

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

function genHourArr(startHr, endHr) {
    let arr = [];

    for (let hr = startHr; hr <= endHr; hr += 1) {
        arr.push(hr);
    }

    return arr;
}

function genHourDict(startHr, endHr) {
    let arr = genHourArr(startHr, endHr);

    let dict = {};

    for (let hr of arr) {
        const hrDt = DateTime.fromObject({ hour: hr });

        let hrIso = hrDt.toFormat("h:mma");

        let obj = {
            iso: hrIso,
            supply: 1,
            demand: 1
        };

        dict[hrIso] = obj;
    }

    return dict;
}

function genRideZone() {
    let arr = [];

    for (let ind = 1; ind <= 8; ind += 1) {
        let obj = {
            value: ind,
            name: `Ride Zone ${ind}`
        }

        arr.push(obj);
    }

    return arr;
}

function genRideZoneColor() {

    let arr = [
        "#141013",
        "#580909",
        "#910c5c",
        "#7c34ad",
        "#537cda",
        "#27d5b2",
        "#54f044",
        "#eeda28"
    ];

    return arr;
}

export {
    genLogUrl,
    genServerUrl,
    requestObj,
    genFetchUrl
};

export {
    genHourArr,
    genHourDict,
    genRideZone,
    genRideZoneColor
};
