import { Logger, Utility } from "@utility";

import { parser, getRealTimeData } from "./parser";

import { SampleDirectionRes, SampleRapidKlOutput } from "@config";

const Index = async (props) => {

    const { param, stationData, directionData } = props;
    const { onSetLoading } = props;

    const action = "api";
    const url = Utility.genServerUrl(action);

    // Static Data
    let obj = Utility.requestObj(param);

    const resp = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
    });

    const data = await resp.json();
    onSetLoading(false);

    const { result } = data;

    const midJourneyCalculationsArr = parser(result, directionData);

    const final_res = {};

    for (let key in result) {

        const { logs = [], res } = result[key];

        let helper_res = {};

        helper_res["expenses"] = res;

        for (let key in res) {
            let val = res[key];
            res[key] = Math.round(val * 100) / 100;
        }

        let station_ls = [];
        let buses_ls = [];
        for (let ind = 0; ind < 1051; ind += 1) {

            const rtData = getRealTimeData(midJourneyCalculationsArr, logs, ind);

            const { station_state, buses_states } = rtData;

            let station_arr = [...station_state];

            for (let jnd in station_arr) {
                const { lat, lng } = stationData[jnd];
                station_arr[jnd] = {
                    ...station_arr[jnd],
                    lat: lat,
                    lng: lng,
                    is_hub: false,
                }
            }

            station_arr[0].is_hub = true;

            station_ls.push(station_arr);
            buses_ls.push(buses_states);
        }

        helper_res["station_list"] = station_ls;
        helper_res["buses_list"] = buses_ls;

        final_res[key] = helper_res;
    }

    onSetLoading(false);

    return final_res;
};

export default Index;