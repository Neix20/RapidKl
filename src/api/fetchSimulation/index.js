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

        let pass_transported_dict = {};
        let dist_travelled_dict = {};
        let route_efficiency_dict = {};

        for (let ind = 0; ind < 1051; ind += 1) {

            const rtData = getRealTimeData(midJourneyCalculationsArr, logs, ind);

            const { station_state, buses_states, graph_data } = rtData;

            const { pass_transported, dist_travelled, route_efficiency } = graph_data;

            // Add Latitude And Longituede
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

            for (const key in pass_transported) {
                const val = pass_transported[key];
                if (key in pass_transported_dict) {
                    pass_transported_dict[key].push(val)
                } else {
                    pass_transported_dict[key] = [val]
                }
            }

            for (const key in dist_travelled) {
                const val = dist_travelled[key];
                if (key in dist_travelled_dict) {
                    dist_travelled_dict[key].push(val)
                } else {
                    dist_travelled_dict[key] = [val]
                }
            }

            for (const key in route_efficiency) {
                const val = route_efficiency[key];
                if (key in route_efficiency_dict) {
                    route_efficiency_dict[key].push(val)
                } else {
                    route_efficiency_dict[key] = [val]
                }
            }
        }

        let ptMin = Number.MAX_VALUE;
        let ptMax = Number.MIN_VALUE;
        for (const key in pass_transported_dict) {
            let val = pass_transported_dict[key];

            for(let ind = val.length - 1; ind > 0; ind --) {
                val[ind] = val[ind] - val[ind - 1];
            }

            pass_transported_dict[key] = {
                label: key,
                data: val
            }

            ptMin = Math.min(...val, ptMin);
            ptMax = Math.max(...val, ptMax);
        }
        pass_transported_dict["global"].label = "Total";

        let dtMin = Number.MAX_VALUE;
        let dtMax = Number.MIN_VALUE;
        for (const key in dist_travelled_dict) {
            const val = dist_travelled_dict[key];
            dist_travelled_dict[key] = {
                label: key,
                data: val
            }

            dtMin = Math.min(...val, dtMin);
            dtMax = Math.max(...val, dtMax);
        }
        dist_travelled_dict["global"].label = "Total";

        let reMin = Number.MAX_VALUE;
        let reMax = Number.MIN_VALUE;
        for (const key in route_efficiency_dict) {
            const val = route_efficiency_dict[key];
            route_efficiency_dict[key] = {
                label: key,
                data: val
            }

            reMin = Math.min(...val, reMin);
            reMax = Math.max(...val, reMax);
        }
        route_efficiency_dict["global"].label = "Average";

        // { label: [], data: []}

        pass_transported_dict = {
            data: Object.values(pass_transported_dict),
            min: ptMin,
            max: ptMax
        }

        dist_travelled_dict = {
            data: Object.values(dist_travelled_dict),
            min: dtMin,
            max: dtMax
        }

        route_efficiency_dict = {
            data: Object.values(route_efficiency_dict),
            min: reMin,
            max: reMax
        }

        helper_res["station_list"] = station_ls;
        helper_res["buses_list"] = buses_ls;
        helper_res["pass_transported"] = pass_transported_dict;
        helper_res["dist_travelled"] = dist_travelled_dict;
        helper_res["route_efficiency"] = route_efficiency_dict;

        final_res[key] = helper_res;
    }

    onSetLoading(false);

    return final_res;
};

export default Index;