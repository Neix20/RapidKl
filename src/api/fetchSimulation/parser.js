function binarySearchWithClosest(arr, targetTimestamp) {
    let left = 0;
    let right = arr.length - 1;
    let closestBefore = null;
    let closestAfter = null;

    let closestBeforeIndex = arr.length;
    let closestAfterIndex = arr.length;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const midTimestamp = arr[mid].timestamp;

        if (midTimestamp === targetTimestamp) {
            var preparedOutput = arr[mid];
            for (let i = mid + 1; i < arr.length; i += 1) {
                if (arr[i].timestamp == midTimestamp) {
                    preparedOutput = arr[i];
                }
                else {
                    break;
                }
            }
            // Found the target timestamp
            return [preparedOutput, null]; // Return the found item and null for closest after
        } else if (midTimestamp < targetTimestamp) {
            left = mid + 1; // Adjust the left boundary
            closestBefore = arr[mid];
            closestBeforeIndex = mid;
        } else {
            right = mid - 1; // Adjust the right boundary
            closestAfter = arr[mid];
            closestAfterIndex = mid;
        }
    }

    //Remove delay dependancies
    for (let i = closestBeforeIndex + 1; i < arr.length; i += 1) {
        if (arr[i].timestamp == closestBefore.timestamp) {
            closestBefore = arr[i];
        }
        else {
            break;
        }
    }
    for (let i = closestAfterIndex + 1; i < arr.length; i += 1) {
        if (arr[i].timestamp == closestAfter.timestamp) {
            closestAfter = arr[i];
        }
        else {
            break;
        }
    }

    // If the target timestamp is not found, return the closest before and after
    return [closestBefore, closestAfter];
}

function binarySearchForCoords(arr, targetDist) {
    let left = 0;
    let right = arr.length - 1;

    let closestBeforeIndex = arr.length;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const midDist = arr[mid];

        if (midDist === targetDist) {
            return [mid, null];
        } else if (midDist < targetDist) {
            left = mid + 1; // Adjust the left boundary
            closestBeforeIndex = mid;
        } else {
            right = mid - 1; // Adjust the right boundary
        }
    }

    // If the target timestamp is not found, return the closest before and after
    return [closestBeforeIndex, closestBeforeIndex == arr.length - 1 ? null : closestBeforeIndex + 1];
}

function getDistance(lat1, lon1, lat2, lon2) {
    // Convert latitude and longitude from degrees to radians
    const lat1Rad = (Math.PI / 180) * lat1;
    const lon1Rad = (Math.PI / 180) * lon1;
    const lat2Rad = (Math.PI / 180) * lat2;
    const lon2Rad = (Math.PI / 180) * lon2;

    // Radius of the Earth in kilometers
    const earthRadius = 6371000; // You can also use 3958.8 for miles

    // Haversine formula
    const dLat = lat2Rad - lat1Rad;
    const dLon = lon2Rad - lon1Rad;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;

    return distance;
}


function getRealTimeData(midJourneyCalculationsArr, logsArr, timestamp) {
    //The bus only runs between 6am to 11:30pm
    if (timestamp < 0 || timestamp > 1050) {
        console.log("Cannot RUN SIMULATION AT THAT TIME")
        return null
    }

    let output = {}

    let releventRows = binarySearchWithClosest(logsArr, timestamp);

    output['station_state'] = []
    output['buses_states'] = []

    for (let i = 0; i < releventRows[0].stations_state.length; i += 1) {
        const station = releventRows[0].stations_state[i];
        output['station_state'].push({
            'name': station.name,
            'people_waiting': station.cur_supply,
            'inbound': station.results.supplied,
            'outbound': station.results.demand_recv,
        })
    }

    // if (releventRows[0].timestamp == timestamp || releventRows[1] == null)
    // {
    //     for (const bus of releventRows[0].buses_states)
    //     {
    //         output['buses_states'].push({
    //             'name': bus.name,
    //             'current_occupants': bus.current_occupants,
    //             'current_state': bus.current_state.state,

    //             //If current_state is resting, then this is the station it is at
    //             //If current_state is moving, then this is the station it is moving towards
    //             'destination': bus.current_state.current_station_index,

    //             'total_distance_travelled': bus.results.distance_travelled,
    //             'total_passangers_transported': bus.results.transported,
    //         })
    //     }

    //     return output;
    // }

    let closestBefore = releventRows[0]
    //let closestAfter = releventRows[1]
    //console.log(closestBefore.timestamp, closestAfter.timestamp)
    //console.log(closestBefore)

    //let percentage = (timestamp - closestBefore.timestamp) / (closestAfter.timestamp - closestBefore.timestamp)

    for (const bus of closestBefore.buses_states) {
        let currentStateStartTime = bus.current_state.start_time
        let currentStateEndTime = bus.current_state.end_time

        let percentageProgress = currentStateEndTime == 0 ? 0.0 :
            ((timestamp - currentStateStartTime) / (currentStateEndTime - currentStateStartTime));

        let newBusState = {
            'name': bus.name,
            'current_occupants': bus.current_occupants,
            'current_state': bus.current_state.state,

            //If current_state is resting, then this is the station it is at
            //If current_state is moving, then this is the station it is moving towards
            'destination': bus.current_station_index,

            //If current_state is resting, ignore
            //If current_state is moving, this float is how far down the path that it is actually travelling
            'progress': percentageProgress,

            'total_distance_travelled': bus.results.distance_travelled
                + bus.current_state.travelling_distance * percentageProgress,
            'total_passangers_transported': bus.results.transported,
        }

        if (newBusState['current_state'] == 'RESTING') {
            //At Station
            newBusState['lat'] = midJourneyCalculationsArr[newBusState['destination']].lat_lngs[0].lat
            newBusState['lng'] = midJourneyCalculationsArr[newBusState['destination']].lat_lngs[0].lng
        }
        else {
            let n = midJourneyCalculationsArr.length
            let lengthRes = (((newBusState['destination'] - 1) % n) + n) % n
            let curMidJourney = midJourneyCalculationsArr[lengthRes]
            let resultIndex = binarySearchForCoords(curMidJourney.accu_dists, curMidJourney.total_dist * percentageProgress)
            if (resultIndex[1] == null) {
                newBusState['lat'] = curMidJourney.lat_lngs[resultIndex[0]].lat
                newBusState['lng'] = curMidJourney.lat_lngs[resultIndex[0]].lng
            }
            else {
                let remainingDist = curMidJourney.total_dist * percentageProgress - curMidJourney.accu_dists[resultIndex[0]]
                let distInSection = curMidJourney.accu_dists[resultIndex[1]] - curMidJourney.accu_dists[resultIndex[0]]
                if (distInSection <= 0) {
                    console.log('How??', distInSection)
                }
                let sectionPercentage = (remainingDist) / (distInSection)
                let point1 = curMidJourney.lat_lngs[resultIndex[0]]
                let point2 = curMidJourney.lat_lngs[resultIndex[1]]

                newBusState['lat'] = point1.lat + ((point2.lat - point1.lat) * sectionPercentage)
                newBusState['lng'] = point1.lng + ((point2.lng - point1.lng) * sectionPercentage)
            }
        }

        output['buses_states'].push(newBusState)
    }

    return output;
}

function parser(jsonData, directionJson) {
    let run_keys = ['best_run', 'median_run', 'worst_run'];

    let legsJson = directionJson['routes'][0]['legs'];
    let midJourneyCalculationsArr = Array(legsJson.length);

    for (let i = 0; i < legsJson.length; i += 1) {
        let leg = legsJson[i];
        let steps = leg['steps']

        let total_dist_in_step = 0
        let dist_between_points = [0] //Accumulate
        let all_points_in_path = []

        for (let j = 0; j < steps.length; j += 1) {
            let latlongs = steps[j]['lat_lngs']
            let secondPoint = null
            for (let k = 0; k < latlongs.length - 1; k += 1) {
                let firstPoint = latlongs[k]
                secondPoint = latlongs[k + 1]

                all_points_in_path.push(firstPoint)
                total_dist_in_step += getDistance(firstPoint.lat, firstPoint.lng, secondPoint.lat, secondPoint.lng)
                dist_between_points.push(total_dist_in_step)
            }

            if (j == steps.length - 1) {
                all_points_in_path.push(secondPoint)
            }
        }

        midJourneyCalculationsArr[(i) % (midJourneyCalculationsArr.length)] = {
            "total_dist": total_dist_in_step,
            "accu_dists": dist_between_points,
            "lat_lngs": all_points_in_path,
        }
    }

    for (const key_name of run_keys) {
        let logsArr = jsonData[key_name]['logs']
        for (let i = 0; i < logsArr.length; i += 1) {
            logsArr[i] = JSON.parse(logsArr[i])
        }
    }

    return midJourneyCalculationsArr;
}

// readFiles((err, jsonData, directionJson) => {
//     if (!err) {


//         // ----- 
//         // END OF PRE PROCESSING
//         // -----

//         const midJourneyCalculationsArr = parser(jsonData, directionJson);
//         getRealTimeData(midJourneyCalculationsArr, jsonData['best_run']['logs'], 1042);

//         console.log(
//             getRealTimeData(midJourneyCalculationsArr, jsonData['best_run']['logs'], 1042)
//         )

//         // "res": {
//         //     "fares_revenue": 412,
//         //     "driver_expenses": 240,
//         //     "fuel_expenses": 347.813455,
//         //     "other_expenses": 250,
//         //     "total_expenses": 587.813455,
//         //     "total_profit": 662,
//         //     "net_profit": 74.18654500000002,
//         //     "passangers_transported": 412,
//         //     "passangers_missed": 0
//         // }
//     }
// });

export {
    parser,
    getRealTimeData
}