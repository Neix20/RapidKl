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

function genHourIsoArr(startHr, endHr) {
    let arr = [];

    for (let hr = startHr; hr <= endHr; hr += 1) {
        const hrDt = DateTime.fromObject({ hour: hr });
        let hrIso = hrDt.toFormat("h:mma");
        arr.push(hrIso);
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

function genTsLabelArr() {
    let res = [];

    for (let ind = 0; ind < 1051; ind += 1) {
        const ts = DateTime.fromObject({ hour: 6 + Math.floor(ind / 60), minute: ind % 60 }).toFormat("HH:mm");
        res.push(ts);
    }

    return res;
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

function genRideZoneMat() {
    let mat = [];

    for (let ind = 1; ind <= 8; ind += 1) {
        let arr = [];
        for (let jnd = 1; jnd <= 8; jnd += 1) {
            arr.push(1);
        }

        mat.push(arr);
    }
    return mat;
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

function roundDown(num, base = 1000) {
    return Math.floor(num - num % base);
}

function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

function genRandomInt(min, max) {
    const res = min + Math.floor(Math.random() * (max - min + 1));
    return res;
}

function genRandomRgb(opacity) {
    const r = genRandomInt(0, 255);
    const b = genRandomInt(0, 255);
    const g = genRandomInt(0, 255);
    return [`rgb(${r},${g},${b})`, `rgb(${r},${g},${b}, ${opacity})`]
}

export {
    genLogUrl,
    genServerUrl,
    requestObj,
    genFetchUrl
};

export {
    genRideZone,
    genRideZoneColor,
    genRideZoneMat,
};

export {
    genHourArr,
    genHourIsoArr,
    genHourDict,
    genTsLabelArr,
};

export { 
    roundDown,
    isNumeric,
    genRandomInt,
    genRandomRgb
}
