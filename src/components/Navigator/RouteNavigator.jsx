import { Routes, Route } from "react-router-dom";

function RouteNavigator(props) {
    const { defaultRoute = "Debug", routeItems } = props;

    const initRoute = routeItems[defaultRoute];

    const routeLs = Object.values(routeItems);
    
    return (
        <Routes>
            <Route index element={initRoute["component"]} />
            {
                routeLs.map((obj, ind) => {
                    const { component, path } = obj;
                    return (
                        <Route
                            key={ind}
                            path={path}
                            element={component}
                        />
                    )
                })
            }
        </Routes>
    )
}

export default RouteNavigator;