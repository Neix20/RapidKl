import React, { useState, useEffect, useMemo, useContext, createContext } from "react";

import { Logger, Utility } from "@utility";

import { googleApiKey, Images, SampleData, SampleDirection, SampleDirectionRes } from "@config";

import "@config/globalStyles.css";

import { fetchGeoCode, fetchSimulation } from "@api";
import { WqScrollFabBtn, WqModalBtn, WqLoading, WqLoadingModal } from "@components";

import { useToggle } from "@hooks";

import { DateTime } from "luxon";

const Context = createContext();

import { GoogleMap, Marker, Polyline, InfoWindow, useLoadScript } from "@react-google-maps/api";

import WqBus from "./Bus";
import WqStation from "./Station";
import WqExpenses from "./Expenses";

// #region Custom Hooks
function useBus(value = []) {
	const [busLs, setBusLs] = useState(value);

	useEffect(() => {
		let arr = [...busLs];
		for (let ind in arr) {
			arr[ind].pos = ind;
		}
		setBusLs(arr);
	}, [])

	const AddBus = (lat = 3.140853, lng = 101.693207) => {
		let arr = [...busLs];

		let obj = {
			"name": `Bus ${arr.length + 1}`,
			"driver": `Driver ${arr.length + 1}`,
			"max_occupants": 50,
			"starting_time": 0,
			"time_iso": "06:00",
			"fuel_consumption_per_km": 0.41,
			"major_break": 0,
			lat: lat,
			lng: lng,
			pos: arr.length
		}
		arr.push(obj);

		for (let ind in arr) {
			arr[ind].pos = ind;
		}

		setBusLs(arr);
	}

	const UpdateBus = (item) => {
		const { pos, time_iso, max_occupants } = item;

		const dt = DateTime.fromISO(`2023-08-18T${time_iso}:00`);

		const minDt = DateTime.fromISO(`2023-08-18T00:00:00`);

		const { minutes } = dt.diff(minDt, 'minutes').toObject();

		let arr = [...busLs];
		arr[pos] = item;
		arr["starting_time"] = minutes;
		arr["max_occupants"] = Math.floor(max_occupants);
		setBusLs(arr);
	}

	const DeleteBus = (pos) => {
		let arr = [...busLs];
		if (pos > -1) {
			arr.splice(pos, 1);
		}

		for (let ind in arr) {
			arr[ind].pos = ind;
		}

		setBusLs(arr);
	}

	return [busLs, setBusLs, AddBus, UpdateBus, DeleteBus];
}

function useStation(value = []) {
	const [stationLs, setStationLs] = useState(value);

	const color = Utility.genRideZoneColor();

	useEffect(() => {
		let arr = [...stationLs];

		for (let ind in arr) {
			const { ride_zone } = arr[ind];
			arr[ind].pos = ind;
			arr[ind].color = color[ride_zone];
		}

		setStationLs(arr);
	}, []);

	const MakeStationHub = (item) => {
		const { pos } = item;

		let arr = [...stationLs];

		for (let ind in arr) {
			arr[ind].is_hub = false;
		}

		arr[pos].is_hub = true;

		setStationLs(arr);
	}

	const AddStation = (lat, lng) => {

		let arr = [...stationLs];

		const is_hub = (arr.length == 0) ? true : false;

		let supply_arr = [];
		let demand_arr = [];

		for (let ind = 6; ind <= 23; ind += 1) {
			supply_arr.push(1);
			demand_arr.push(1);
		}

		let obj = {
			name: `Station ${arr.length + 1}`,
			lat: lat,
			lng: lng,
			is_hub: is_hub,
			pos: arr.length,
			ride_zone: 1,
			color: color[0],
			supply: supply_arr,
			demand: demand_arr
		};

		arr.push(obj);

		for (let ind in arr) {
			arr[ind].pos = ind;
		}

		setStationLs(arr);
	}

	const DeleteStation = (ind) => {
		let arr = [...stationLs];

		if (ind > -1) {
			arr.splice(ind, 1);
		}

		for (let ind in arr) {
			arr[ind].pos = ind;
		}

		if (arr.length > 0) {
			arr[0].is_hub = true;
		}

		setStationLs(arr);
	}

	const UpdateStation = (item) => {

		const { pos, ride_zone = 1, lat, lng } = item;

		let arr = [...stationLs];

		let obj = {
			...item,
			lat: +lat,
			lng: +lng,
			color: color[ride_zone - 1]
		}

		arr[pos] = obj;

		setStationLs(arr);
	}

	return [stationLs, setStationLs, AddStation, DeleteStation, UpdateStation, MakeStationHub];
}

function useExpense(value = {}) {

	const rideZoneMat = Utility.genRideZoneMat();

	const init = {
		expense: {
			"fuel_price": 10,
			"driver_daily_salary": 10,
			"fare_matrix": rideZoneMat,
			"other_fees": 10,
			...value,
		}
	}

	const [expense, setExpense] = useState(init.expense);

	return [expense, setExpense];
}

function useDirection(value = null) {
	const [direction, setDirection] = useState(value);

	const GenRoute = async (stationLs) => {
		let arr = [...stationLs];

		const hub_station = arr.filter(obj => obj.is_hub)[0];

		const origin = hub_station;
		const dest = hub_station;

		const wayPt = arr.filter(obj => !obj.is_hub)
			.map((obj) => (
				{
					location: obj,
					stopover: true
				}
			));

		const directionService = new google.maps.DirectionsService();
		return new Promise((resolve, reject) => directionService.route(
			{
				origin: origin,
				waypoints: wayPt,
				destination: dest,
				travelMode: google.maps.TravelMode.DRIVING
			},
			(result, status) => {
				if (status === google.maps.DirectionsStatus.OK) {
					//changing the state of directions to the result of direction service

					const { overview_path, legs } = result.routes[0];
					setDirection(overview_path);

					let arr = [...stationLs];

					const est_arr = legs.map((obj, ind) => {
						const { distance: { value: dist }, duration: { value: ts } } = obj;
						const min = Math.floor(ts / 60);

						let rObj = {
							estimated_time_to_next_station: min,
							distance_to_next_station: dist,
						};

						arr[ind] = {
							...arr[ind],
							...rObj
						}

						return rObj;
					});

					resolve([arr, result]);
				} else {
					reject(result);
				}
			}
		));
	}

	return [direction, setDirection, GenRoute];
}

function useMap() {
	const [mapRef, setMapRef] = useState();

	const onMapLoad = (map) => {
		setMapRef(map);
	}

	const onMarkerZoom = ({ lat, lng }) => {
		mapRef?.panTo({ lat, lng });
	}

	return [mapRef, setMapRef, onMapLoad, onMarkerZoom];
}
// #endregion

// #region Map Icons
function StationHubMarker(props) {

	const { onClick = () => { }, name, initial = false } = props;

	const [showModal, setShowModal, toggleModal] = useToggle(initial);

	const cusClick = () => {
		onClick();
		toggleModal();
	}

	return (
		<Marker icon={"https://neix.s3.amazonaws.com/wqRklHub.png"} {...props}
			onClick={cusClick}>
			{
				(showModal) ? (
					<InfoWindow><span>{name}</span></InfoWindow>
				) : (
					<></>
				)
			}
		</Marker>
	)
}

function StationMarker(props) {

	const { onClick = () => { }, name, initial = false } = props;

	const [showModal, setShowModal, toggleModal] = useToggle(initial);

	const cusClick = () => {
		onClick();
		toggleModal();
	}

	return (
		<Marker icon={"https://neix.s3.amazonaws.com/wqRklStation.png"} {...props}
			onClick={cusClick}>
			{
				(showModal) ? (
					<InfoWindow><span>{name}</span></InfoWindow>
				) : (
					<></>
				)
			}
		</Marker>
	)
}

function BusColorMarker(props) {

	const { onClick = () => { }, name, initial = false } = props;

	const [showModal, setShowModal, toggleModal] = useToggle(initial);

	const cusClick = () => {
		onClick();
		toggleModal();
	}

	return (
		<Marker icon={"https://neix.s3.amazonaws.com/bus_color.png"} {...props}
			onClick={cusClick}>
			{
				(showModal) ? (
					<InfoWindow><span>{name}</span></InfoWindow>
				) : (
					<></>
				)
			}
		</Marker>
	)
}
// #endregion

// #region Map Res Icons
function StationHubResMarker(props) {

	const { onClick = () => { }, name, initial = false } = props;

	const [showModal, setShowModal, toggleModal] = useToggle(initial);

	const cusClick = () => {
		onClick();
		toggleModal();
	}

	return (
		<Marker icon={"https://neix.s3.amazonaws.com/wqRklHub.png"} {...props}
			onClick={cusClick}>
			{
				(showModal) ? (
					<InfoWindow><span>{name}</span></InfoWindow>
				) : (
					<></>
				)
			}
		</Marker>
	)
}

function StationResMarker(props) {

	const { onClick = () => { }, name, initial = false } = props;

	const [showModal, setShowModal, toggleModal] = useToggle(initial);

	const cusClick = () => {
		onClick();
		toggleModal();
	}

	return (
		<Marker icon={"https://neix.s3.amazonaws.com/wqRklStation.png"} {...props}
			onClick={cusClick}>
			{
				(showModal) ? (
					<InfoWindow><span>{name}</span></InfoWindow>
				) : (
					<></>
				)
			}
		</Marker>
	)
}

function BusColorResMarker(props) {

	const { onClick = () => { }, name, initial = false } = props;

	const [showModal, setShowModal, toggleModal] = useToggle(initial);

	const cusClick = () => {
		onClick();
		toggleModal();
	}

	return (
		<Marker icon={"https://neix.s3.amazonaws.com/bus_color.png"} {...props}
			onClick={cusClick}>
			{
				(showModal) ? (
					<InfoWindow><span>{name}</span></InfoWindow>
				) : (
					<></>
				)
			}
		</Marker>
	)
}
// #endregion

// #region Maps
function Search(props) {

	// #region Props
	const { searchQuery = () => { } } = props;
	// #endregion

	// #region UseState
	const [query, setQuery] = useState("");
	// #endregion

	// #region Helper
	const onChangeQuery = (e) => {
		const { value } = e.target;
		setQuery(value);
	};

	const toggleSearchQuery = () => {
		if (query !== "") {
			searchQuery(query);
		} else {
			alert("Please Put in an input!")
		}
		setQuery("");
	};

	const handleKeyDown = (e) => {
		const { key } = e;
		if (key === "Enter") {
			toggleSearchQuery();
		}
	};
	// #endregion

	return (
		<div
			className={"w-100 h-100"}
			style={{
				display: "flex",
				backgroundColor: "#FFF",
				borderRadius: 8,
			}}
		>
			<input
				className={"form-control"}
				value={query}
				onChange={onChangeQuery}
				onKeyDown={handleKeyDown}
				name="query"
				type="text"
				x-webkit-speech="true"
				autoComplete="off"
				placeholder=" Search ..."
				style={{
					borderWidth: 0,
					borderRadius: 8,
					padding: "0px 10px"
				}}
			/>

			{/* Search */}
			<div
				className={"g_center"}
				onClick={toggleSearchQuery}
				style={{
					width: 40,
					backgroundColor: "#FFF",
					borderRadius: 8,
					cursor: "pointer",
				}}
			>
				<i className="fa-solid fa-magnifying-glass"></i>
			</div>
		</div>
	);
}

function Map(props) {

	// #region Props
	const { iCoord = { lat: 0, lng: 0 }, setICoord = () => { } } = props;

	const { direction, setDirection, GenRoute } = props;
	const { stationLs, AddStation, DeleteStation, setStationLs, UpdateStation, MakeStationHub } = props;
	const { mapRef, setMapRef, onMapLoad, onMarkerZoom } = props;
	const { busLs, DeleteBus } = props;
	// #endregion

	// #region Constant
	const { isLoaded } = useLoadScript({ googleMapsApiKey: googleApiKey });
	const center = useMemo(() => (iCoord), []);

	const mapOption = {
		styles: [
			{
				featureType: 'poi',
				elementType: 'labels',
				stylers: [{ visibility: 'off' }],
			},
			{
				featureType: 'transit',
				elementType: 'labels',
				stylers: [{ visibility: 'off' }],
			}
		]
	};
	// #endregion

	// #region UseEffect
	useEffect(() => {
		const { lat, lng } = iCoord;
		if (lat != 0 && lng != 0) {
			onMarkerZoom(iCoord);
		}
	}, [JSON.stringify(iCoord)]);
	// #endregion

	// #region Helper
	const onMapClick = (e) => {
		const { latLng } = e;

		const lat = latLng.lat();
		const lon = latLng.lng();

		AddStation(lat, lon);
	}

	const RemoveStation = (e, ind) => { DeleteStation(ind); }
	const RemoveBus = (e, ind) => { DeleteBus(ind); }
	// #endregion

	// #region Render
	const renderStation = (item, index) => {

		const { is_hub } = item;
		const onClick = () => onMarkerZoom(item);
		const onRightClick = (e) => RemoveStation(e, index);

		const CMarker = (is_hub) ? StationHubMarker : StationMarker;

		return (
			<CMarker key={index}
				onClick={onClick}
				onRightClick={onRightClick}
				position={item}
				{...item}
			/>
		)
	}

	const renderBus = (item, index) => {
		const onClick = () => onMarkerZoom(item);
		const onRightClick = (e) => RemoveBus(e, index);

		return (
			<BusColorMarker key={index}
				onClick={onClick}
				onRightClick={onRightClick}
				position={item}
				{...item}
			/>
		)
	}
	// #endregion

	if (!isLoaded) {
		return (
			<div className="w-100 h-100 g_center" style={{ backgroundColor: "#FFF" }}>
				<WqLoading />
			</div>
		)
	}

	return (
		<GoogleMap
			mapContainerClassName="w-100 h-100"
			options={mapOption}
			zoom={15} center={center}
			onClick={onMapClick}
			onLoad={onMapLoad}>
			{
				stationLs.map(renderStation)
			}
			<div key={busLs.map(obj => `${obj.lat}${obj.lng}`)}>
				{
					busLs.map(renderBus)
				}
			</div>
			{
				(direction != null) ? (
					<>
						{/* <DirectionsRenderer directions={direction} /> */}
						<Polyline
							path={direction}
							geodesic={false}
							options={{
								strokeColor: '#38B44F',
								strokeOpacity: 1,
								strokeWeight: 7,
							}}
						/>
					</>
				) : (
					<></>
				)
			}
		</GoogleMap>
	);
}
// #endregion

// #region Control
function Logo(props) {
	const styles = {
		textStyle: {
			fontWeight: "bold",
			fontSize: 48,
			color: "#FFF",
		},
		wordDivStyle: {
			// backgroundColor: "#F00",
		},
	};

	return (
		<div
			className={"g_center"}
			style={{
				...styles.textStyle,
				minHeight: 40,
				columnGap: 20,
			}}
		>
			<div>WMQJG</div>
			<div className={"fst-italic"}>RapidKL</div>
			<div>Simulator</div>
		</div>
	);
}

function StartBtn(props) {
	const { flag = false, onClick = () => { } } = props;

	if (!flag) {
		return (
			<div className="btn btn-warning w-100 h-50 g_center disabled"
				style={{ columnGap: 10 }}>
				<div className={"fs-2 fw-bold"}>Gen Route</div>
				<i className="fa-solid fa-map-location-dot fa-lg"></i>
			</div>
		)
	}

	return (
		<div onClick={onClick}
			className="btn btn-warning w-100 h-50 g_center"
			style={{ columnGap: 10 }}>
			<div className={"fs-2 fw-bold"}>Gen Route</div>
			<i className="fa-solid fa-map-location-dot fa-lg"></i>
		</div>
	)
}

function SubmitBtn(props) {
	const { flag = false, onClick = () => { } } = props;

	if (!flag) {
		return (
			<div className="btn btn-success w-100 h-50 g_center disabled"
				style={{ columnGap: 10 }}>
				<div className={"fs-2 fw-bold"}>Submit</div>
				<i className="fa-solid fa-flag-checkered fa-lg"></i>
			</div>
		)
	}

	return (
		<div onClick={onClick}
			className="btn btn-success w-100 h-50 g_center"
			style={{ columnGap: 10 }}>
			<div className={"fs-2 fw-bold"}>Submit</div>
			<i className="fa-solid fa-flag-checkered fa-lg"></i>
		</div>
	)
}

function ControlPane(props) {

	// #region Init
	const init = {
		coord: {
			lat: 3.1720151676225,
			lng: 101.69593158369
		},
	};

	const { stations_info = [], buses_info = [], other_panel_info = [] } = SampleData;
	// #endregion

	// #region Custom Hooks
	const stationHook = useStation(stations_info);
	const stationObj = {
		stationLs: stationHook[0],
		setStationLs: stationHook[1],
		AddStation: stationHook[2],
		DeleteStation: stationHook[3],
		UpdateStation: stationHook[4],
		MakeStationHub: stationHook[5]
	};

	const directionHook = useDirection(SampleDirection);
	const directionObj = {
		direction: directionHook[0],
		setDirection: directionHook[1],
		GenRoute: directionHook[2]
	}

	const mapHook = useMap();
	const mapObj = {
		mapRef: mapHook[0],
		setMapRef: mapHook[1],
		onMapLoad: mapHook[2],
		onMarkerZoom: mapHook[3]
	}

	const busHook = useBus(buses_info);
	const busObj = {
		busLs: busHook[0],
		setBusLs: busHook[1],
		AddBus: busHook[2],
		UpdateBus: busHook[3],
		DeleteBus: busHook[4]
	}

	const expenseHook = useExpense(other_panel_info);
	const expenseObj = {
		expense: expenseHook[0],
		setExpense: expenseHook[1]
	}
	// #endregion

	const [loading, setLoading, setResultFlag, toggleResultFlag, resDirection, setResDirection, resData, setResData] = useContext(Context);
	const [coords, setCoords] = useState(init.coord);

	const { stationLs, setStationLs } = stationObj;
	const { direction, setDirection, GenRoute } = directionObj;
	const { busLs, setBusLs, AddBus } = busObj;
	const { expense, setExpense } = expenseObj;

	const [directionRes, setDirectionRes] = useState(SampleDirectionRes);

	useEffect(() => {
		if (stationLs.length > 0) {
			const { lat, lng } = stationLs.filter(obj => obj.is_hub)[0];

			let arr = [...busLs];

			for (let ind in arr) {
				arr[ind].lat = lat;
				arr[ind].lng = lng;
			}

			setBusLs(arr);
		}
	}, [JSON.stringify(stationLs.map(obj => `${obj.lat}${obj.lng}${obj.is_hub}`))]);

	// #region Helper
	const searchQuery = (val) => {
		setLoading(true);
		fetchGeoCode({
			param: {
				q: val,
			},
			onSetLoading: setLoading,
		})
			.then((data) => {
				let { lat, lon } = data;

				lat = +lat;
				lon = +lon;

				const flag = !isNaN(lat) && !isNaN(lon);

				if (flag) {
					setCoords({
						lat: lat,
						lng: lon
					})
				}
			})
			.catch((err) => {
				setLoading(false);
				console.log(`Error: ${err}`);
			});
	};

	const InsertBus = () => {
		if (stationLs.length > 0) {
			const { lat, lng } = stationLs.filter(obj => obj.is_hub)[0];
			AddBus(lat, lng);
		}
	}

	const onReset = () => {
		setBusLs([]);
		setStationLs([]);
		setDirection(null);
	}

	const onStart = () => {
		setLoading(true);
		GenRoute(stationLs)
			.then(data => {
				const [station_new_arr, tDirectionRes] = data;
				setLoading(false);
				setStationLs(station_new_arr);
				setDirectionRes(tDirectionRes);
			}).catch(err => {
				setLoading(false);
				setDirection(null);
				Logger.error({
					content: err,
					fileName: "directionRouteError"
				})
			});
	}

	const onSubmit = () => {
		let final = {};

		final["data"] = {};

		final["data"]["stations_info"] = stationLs;
		final["data"]["buses_info"] = busLs;
		final["data"]["other_panel_info"] = expense;

		setLoading(true);
		fetchSimulation({
			param: final,
			stationData: stationLs.map(({ lat, lng }) => ({ lat, lng })),
			directionData: directionRes,
			onSetLoading: setLoading,
		})
			.then(data => {

				Logger.info({
					content: data,
					fileName: "Final_Res"
				})

				// Data
				setResData(data);

				// Set Direction
				setResDirection(direction);

				// Set Flag
				setResultFlag(true);
			})
			.catch(err => {
				setLoading(false);
				console.log(`Error: ${err}`)
			})

	}
	// #endregion

	return (
		<div
			style={{
				display: "flex",
				height: "100vh",
				backgroundColor: "#000",
				flexDirection: "column",
			}}
		>
			{/* Background */}
			<div
				style={{
					flex: 1,
					// background: `url(${Images.bgKl})`,
					backgroundColor: "#000",
				}}
			>
				<div
					className={"w-100 h-100"}
					style={{ backgroundColor: "rgba(255, 255, 255, 0.25)" }}
				></div>
			</div>

			{/* Items */}
			<div
				className={"g_overlay"}
				style={{ display: "flex", flexDirection: "column" }}
			>
				{/* Logo */}
				<Logo />

				{/* Panel */}
				<div
					className={"g_center"}
					style={{ flex: 1, padding: 20, columnGap: 20 }}
				>
					{/* Control */}
					<div
						style={{
							height: "100%",
							width: "30%",
							display: "flex",
							flexDirection: "column",
							rowGap: 10
						}}
					>
						<WqBus flag={stationLs.length > 1} {...busObj} {...mapObj} AddBus={InsertBus} />
						<WqStation {...stationObj} {...mapObj} />
						<WqExpenses flag={stationLs.length > 1} {...expenseObj} />
						<div onClick={onReset}
							className="btn btn-danger w-100 h-50 g_center"
							style={{ columnGap: 10 }}
						>
							<div className={"fs-2 fw-bold"}>Reset</div>
							<i className="fa-solid fa-rotate-left fa-lg"></i>
						</div>
						<StartBtn onClick={onStart} flag={stationLs.length > 1} />
						<SubmitBtn onClick={onSubmit} flag={stationLs.length > 1 & busLs.length > 1 && direction != null} />
					</div>

					{/* Map */}
					<div
						className={"w-100 h-100"}
						style={{ display: "flex", flexDirection: "column", rowGap: 10 }}
					>
						<div style={{ width: "100%", height: "10%" }}>
							<Search searchQuery={searchQuery} />
						</div>
						<div className={"w-100 h-100"}>
							<Map
								iCoord={coords} setICoord={setCoords}
								{...directionObj} {...stationObj} {...mapObj} {...busObj}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
// #endregion

function MapRes(props) {

	// #region Props
	const { iCoord = { lat: 0, lng: 0 }, setICoord = () => { } } = props;
	const { direction, stationLs, busLs, onMapLoad, onMarkerZoom, frame = 0 } = props;
	// #endregion

	// #region Constant
	const { isLoaded } = useLoadScript({ googleMapsApiKey: googleApiKey });
	const center = useMemo(() => (iCoord), []);

	const mapOption = {
		styles: [
			{
				featureType: 'poi',
				elementType: 'labels',
				stylers: [{ visibility: 'off' }],
			},
			{
				featureType: 'transit',
				elementType: 'labels',
				stylers: [{ visibility: 'off' }],
			}
		]
	};
	// #endregion

	// #region UseEffect
	useEffect(() => {
		const { lat, lng } = iCoord;
		if (lat != 0 && lng != 0) {
			onMarkerZoom(iCoord);
		}
	}, [JSON.stringify(iCoord)]);
	// #endregion

	// #region Render
	const renderStation = (item, index) => {

		const { is_hub } = item;
		const onClick = () => onMarkerZoom(item);

		const CMarker = (is_hub) ? StationHubResMarker : StationResMarker;

		return (
			<CMarker key={index}
				onClick={onClick}
				position={item}
				{...item}
			/>
		)
	}

	const renderBus = (item, index) => {
		const onClick = () => onMarkerZoom(item);

		return (
			<BusColorResMarker key={index}
				onClick={onClick}
				position={item}
				{...item}
			/>
		)
	}
	// #endregion

	if (!isLoaded) {
		return (
			<div className="w-100 h-100 g_center" style={{ backgroundColor: "#FFF" }}>
				<WqLoading />
			</div>
		)
	}

	return (
		<GoogleMap
			mapContainerClassName="w-100 h-100"
			options={mapOption}
			zoom={15} center={center}
			onLoad={onMapLoad}>
			{
				stationLs[frame].map(renderStation)
			}
			{
				busLs[frame].map(renderBus)
			}
			{
				(direction != null) ? (
					<>
						{/* <DirectionsRenderer directions={direction} /> */}
						<Polyline
							path={direction}
							geodesic={false}
							options={{
								strokeColor: '#38B44F',
								strokeOpacity: 1,
								strokeWeight: 7,
							}}
						/>
					</>
				) : (
					<></>
				)
			}
		</GoogleMap>
	);
}

// #region Result
function ResultHeader(props) {
	return (
		<div
			className={"g_center"}
			style={{
				// backgroundColor: "#F00",
				height: 100,
			}}
		>
			<div
				style={{
					fontWeight: "bold",
					fontSize: 64,
					color: "#000",
				}}
			>
				Result
			</div>
		</div>
	);
}

function ResultTabHeader(props) {
	// #region Props
	const { ind, setInd = () => { } } = props;
	// #endregion

	// #region Helper
	const togglePane = (val) => setInd(val);
	// #endregion

	const init = {
		tabLs: ["Best", "Median", "Worst"],
	};

	// #region Render
	const renderTab = (item, jnd) => {
		const onSelect = () => togglePane(jnd);

		const className = `nav-link ${ind == jnd ? "active" : ""}`;

		return (
			<li
				className={"nav-item"}
				onClick={onSelect}
				style={{ cursor: "pointer", flex: 1 }}
			>
				<div
					className={className}
					style={{ display: "flex", justifyContent: "center" }}
				>
					{item}
				</div>
			</li>
		);
	};
	// #endregion

	return <ul className={"nav nav-tabs"}>{init.tabLs.map(renderTab)}</ul>;
}

function PlayBtn(props) {
	const { flag = false, onClick = () => { } } = props;

	if (flag) {
		return (
			<div onClick={onClick}
				className="btn btn-warning g_center"
				style={{ columnGap: 10 }}
			>
				<div className={"fs-2 fw-bold"}>Pause</div>
				<i className="fa-solid fa-pause fa-2xl"></i>
			</div>
		)
	}

	return (
		<div onClick={onClick}
			className="btn btn-success g_center"
			style={{ columnGap: 10 }}
		>
			<div className={"fs-2 fw-bold"}>Play</div>
			<i className="fa-solid fa-play fa-2xl"></i>
		</div>
	)
}

function ResultTabPane(props) {

	// #region Props
	const { indKey = "" } = props;
	// #endregion

	const [play, setPlay, togglePlay] = useToggle(false);

	const { resDirection, resData } = props;

	const mapHook = useMap();
	const mapObj = {
		mapRef: mapHook[0],
		setMapRef: mapHook[1],
		onMapLoad: mapHook[2],
		onMarkerZoom: mapHook[3]
	}

	useEffect(() => {
		setFrame(0);
	}, [indKey]);

	const [frame, setFrame] = useState(1000);

	const [duration, setDuration] = useState(1);

	const maxFrame = 1051;
	const time_per_frame = 1000 * 60 * duration / maxFrame;

	useEffect(() => {
		const interval = setInterval(() => {
			if (play) {
				setFrame(frame => (frame + 1) % maxFrame);
			}
		}, time_per_frame);
		return () => clearInterval(interval);
	}, [play]);

	return (
		<div className="w-100 h-100" style={{ display: "flex" }}>
			<div className="w-100 h-100" style={{ flex: .2, display: "flex", flexDirection: "column" }}>
				<div className={"g_center"} style={{ flex: .2 }}>
					<PlayBtn flag={play} onClick={togglePlay} />

				</div>
				<div className={"g_center"}
					style={{ flex: .8, padding: 10 }}>
					<div className={"w-100 h-100"} style={{ display: "flex", flexDirection: "column", borderWidth: 3, borderStyle: "solid", padding: 10 }}>
						<div className={"g_center"} style={{ flex: .1 }}>
							<div className={"fw-bold fs-2"}>Result</div>
						</div>
						<div style={{ flex: .9 }}>
							<div className={"fw-bold fs-2"}>Frame {frame}</div>
						</div>
					</div>
				</div>
			</div>
			<div className="w-100 h-100" style={{ flex: .8, backgroundColor: "#F00" }}>
				{
					(resData[indKey]["station_list"].length > 0) ? (
						<MapRes
							frame={frame}
							direction={resDirection}
							iCoord={resData[indKey]["station_list"][0][0]}
							stationLs={resData[indKey]["station_list"]}
							busLs={resData[indKey]["buses_list"]}
							{...mapObj} />
					) : (
						<></>
					)
				}
			</div>
		</div>
	);
}

function ResultPane(props) {

	// #region UseState
	const [tabPaneInd, setTabPaneInd] = useState(0);
	// #endregion

	const contextHook = useContext(Context);
	const contextObj = {
		loading: contextHook[0],
		setLoading: contextHook[1],
		setResultFlag: contextHook[2],
		toggleResultFlag: contextHook[3],
		resDirection: contextHook[4],
		setResDirection: contextHook[5],
		resData: contextHook[6],
		setResData: contextHook[7]
	}

	const init = {
		tabLs: ["best_run", "median_run", "worst_run"],
	};

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				height: "100vh",
			}}
		>
			{/* Header */}
			<ResultHeader />

			{/* Tab Header */}
			<ResultTabHeader ind={tabPaneInd} setInd={setTabPaneInd} />

			<ResultTabPane indKey={init.tabLs[tabPaneInd]} {...contextObj} />
		</div>
	);
}
// #endregion

function Index(props) {

	const [loading, setLoading, toggleLoading] = useToggle(false);
	const [resultFlag, setResultFlag, toggleResultFlag] = useToggle(false);

	const [resData, setResData] = useState({});

	const directionHook = useDirection(null);
	const directionObj = {
		resDirection: directionHook[0],
		setResDirection: directionHook[1]
	}

	const { resDirection, setResDirection } = directionObj;

	return (
		<Context.Provider value={[loading, setLoading, setResultFlag, toggleResultFlag, resDirection, setResDirection, resData, setResData]}>

			{/* Loading */}
			<WqLoadingModal loading={loading} />

			{/* Control Pane */}
			<ControlPane />

			{/* Result Pane && ScrollFabBtn */}
			{
				(resultFlag) ? (
					<>
						<WqScrollFabBtn />
						<ResultPane />
					</>
				) : (
					<></>
				)
			}
		</Context.Provider>
	);
}

export default Index;
