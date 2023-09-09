import { Routes, Route } from "react-router-dom";

function RouteNavigator(props) {

    const { defaultRoute = "Debug", routeItems } = props;
    
    const routeLs = Object.values(routeItems);

    let initRoute = {};

    if (defaultRoute in routeItems) {
        initRoute = routeItems[defaultRoute];
    } else {
        initRoute = routeLs[0];
    }

	// #region Render
	const renderRoute = (obj, ind) => {
		return <Route key={ind} {...obj} />;
	};
	// #endregion

	return (
		<Routes>
			<Route index {...initRoute} />
			{routeLs.map(renderRoute)}
		</Routes>
	);
}

export default RouteNavigator;
