import React, { useState, useEffect, useMemo, useContext, createContext } from "react";

import { Logger, Utility } from "@utility";

import { googleApiKey, Images } from "@config";

import "@config/globalStyles.css";

import { fetchGeoCode } from "@api";
import { WqScrollFabBtn, WqModalBtn, WqLoading, WqLoadingModal } from "@components";

import { useToggle } from "@hooks";

const Context = createContext();

import { GoogleMap, Marker, Polyline, useLoadScript } from "@react-google-maps/api";

import WqBus from "./Bus";
import WqStation from "./Station";

// #region Custom Hooks
function useBus(value = []) {
	const [busLs, setBusLs] = useState(value);

	const AddBus = () => {
		let arr = [...busLs];

		let obj = {
			"name": "",
			"driver": "",
			"max_occupants": 0,
			"starting_time": 0,
			"time_iso": "6:00",
			"fuel_consumption_per_km": 0,
			"major_break": 0,
			pos: arr.length
		}
		arr.push(obj);

		setBusLs(arr);
	}

	const UpdateBus = (item) => {
		const { pos } = item;

		let arr = [...busLs];
		arr[pos] = item;
		setBusLs(arr);
	}

	const DeleteBus = (ind) => {
		let arr = [...busLs];
		if (ind > -1) {
			arr.splice(ind, 1);
		}
		setBusLs(arr);
	}

	return [busLs, setBusLs, AddBus, UpdateBus, DeleteBus];
}

function useStation(value = []) {
	const [stationLs, setStationLs] = useState(value);

	const color = Utility.genRideZoneColor();

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

		let obj = {
			name: `Station ${arr.length + 1}`,
			lat: lat,
			lng: lng,
			is_hub: is_hub,
			pos: arr.length,
			ride_zone: 1,
			color: color[0]
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
		const { pos, ride_zone = 1 } = item;
		
		let arr = [...stationLs];

		let obj = {
			...item,
			color: color[ride_zone - 1]
		}

		arr[pos] = obj;
		setStationLs(arr);
	}

	return [stationLs, setStationLs, AddStation, DeleteStation, UpdateStation, MakeStationHub];
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
		return new Promise(resolve => directionService.route(
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

					resolve(arr);
				} else {
					Logger.error({
						content: result,
						fileName: "directionRouteError",
					})
				}
			}
		));
	}

	return [direction, setDirection, GenRoute];
}

function useMap(value = null) {
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
	return (
		<Marker
			icon={"http://maps.google.com/mapfiles/ms/icons/red-dot.png"}
			{...props} />
	)
}

function StationMarker(props) {
	return (
		<Marker
			icon={"http://maps.google.com/mapfiles/ms/icons/green-dot.png"}
			{...props} />
	)
}

function BusMarker(props) {
	return (
		<Marker
			icon={"http://maps.google.com/mapfiles/ms/icons/blue-dot.png"}
			{...props} />
	)
}

function BusColorMarker(props) {
	return (
		<Marker
			icon={"http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"}
			{...props} />
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
	const onClick = (e) => {
		const { latLng } = e;

		const lat = latLng.lat();
		const lon = latLng.lng();

		AddStation(lat, lon);
	}
	const onRightClick = (e, ind) => { DeleteStation(ind); }
	// #endregion

	// #region Render
	const renderItem = (item, index) => {

		const { is_hub } = item;
		const onClick = () => onMarkerZoom(item);
		const onRightClick = (e) => onRightClick(e, index + 1);

		const CMarker = (is_hub) ? StationHubMarker : StationMarker;

		return (
			<CMarker key={index}
				onClick={onClick}
				onRightClick={onRightClick}
				position={{ ...item }}
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
			onClick={onClick}
			onLoad={onMapLoad}>
			{
				stationLs.map(renderItem)
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

function ControlPane(props) {

	// #region Init
	const init = {
		coord: {
			lat: 3.140853,
			lng: 101.693207,
		},
	};
	// #endregion

	// #region Custom Hooks
	const stationHook = useStation([]);
	const stationObj = {
		stationLs: stationHook[0],
		setStationLs: stationHook[1],
		AddStation: stationHook[2],
		DeleteStation: stationHook[3],
		UpdateStation: stationHook[4],
		MakeStationHub: stationHook[5]
	};

	const directionHook = useDirection(null);
	const directionObj = {
		direction: directionHook[0],
		setDirection: directionHook[1],
		GenRoute: directionHook[2]
	}

	const mapHook = useMap(null);
	const mapObj = {
		mapRef: mapHook[0],
		setMapRef: mapHook[1],
		onMapLoad: mapHook[2],
		onMarkerZoom: mapHook[3]
	}

	const busHook = useBus([]);
	const busObj = {
		busLs: busHook[0], 
		setBusLs: busHook[1], 
		AddBus: busHook[2], 
		UpdateBus: busHook[3], 
		DeleteBus: busHook[4]
	}
	// #endregion

	const [loading, setLoading] = useContext(Context);
	const [coords, setCoords] = useState(init.coord);

	const { stationLs, setStationLs } = stationObj;
	const { direction, setDirection, GenRoute } = directionObj;

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
				setLoading(false)
				console.log(`Error: ${err}`);
			});
	};

	const onReset = () => {
		setStationLs([]);
		setDirection(null);
	}

	const onStart = () => {
		setLoading(true);
		GenRoute(stationLs)
			.then(data => {
				setLoading(false);
				setStationLs(data);
				Logger.info({
					content: data,
					fileName: "stationFinal",
				})
			}).catch(err => {
				setLoading(false);
				Logger.error({
					content: "An Error has Occured!"
				})
			});
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
						<WqBus />
						<WqStation {...stationObj} {...mapObj} />
						<WqModalBtn
							btnChild={
								<div
									className="btn btn-warning w-100 h-100 g_center"
									style={{ columnGap: 10 }}
								>
									<div className={"fs-2 fw-bold"}>
										Ticket Fares
									</div>
									<i className="fa-solid fa-money-bill fa-lg"></i>
								</div>
							}
							mdlChild={
								<div className={"g_center"}>
									<div className={"fs-2 fw-bold"}>
										Ticket Fares
									</div>
								</div>
							}
						/>
						<div onClick={onReset}
							className="btn btn-danger w-100 h-50 g_center"
							style={{ columnGap: 10 }}
						>
							<div className={"fs-2 fw-bold"}>Reset</div>
							<i className="fa-solid fa-rotate-left fa-lg"></i>
						</div>
						<div onClick={onStart}
							className="btn btn-success w-100 h-50 g_center"
							style={{ columnGap: 10 }}
						>
							<div className={"fs-2 fw-bold"}>Start</div>
							<i className="fa-solid fa-flag-checkered fa-lg"></i>
						</div>
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
								{...directionObj} {...stationObj} {...mapObj}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
// #endregion

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
		tabLs: ["Best", "Medium", "Worst"],
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

function ResultTabPane(props) {

	// #region Props
	const { ind, setInd = () => { }, colors = [] } = props;
	// #endregion

	return (
		<div
			style={{
				backgroundColor: colors[ind],
				flex: 1,
			}}
		></div>
	);
}

function ResultPane(props) {
	// #region UseState
	const [tabPaneInd, setTabPaneInd] = useState(0);
	// #endregion

	const colors = ["#F00", "#0F0", "#00F"];

	return (
		<div
			style={{
				// backgroundColor: "#F00",
				display: "flex",
				flexDirection: "column",
				height: "100vh",
			}}
		>
			{/* Header */}
			<ResultHeader />

			{/* Tab Header */}
			<ResultTabHeader ind={tabPaneInd} setInd={setTabPaneInd} />

			<ResultTabPane
				ind={tabPaneInd}
				setInd={setTabPaneInd}
				colors={colors}
			/>
		</div>
	);
}
// #endregion

function Index(props) {

	const [loading, setLoading, toggleLoading] = useToggle(false);
	const [resultFlag, setResultFlag, toggleResultFlag] = useToggle(false);

	return (
		<Context.Provider value={[loading, setLoading]}>
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
