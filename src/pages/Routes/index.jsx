import { BrowserRouter } from "react-router-dom";
import { RouteNavigator } from "@components";

import Debug from "@pages/Debug";
import Home from "@pages/Home";

const RouteItems = {
	"Debug": {
		path: "/Debug",
		element: <Debug />,
		title: "Debug",
	},
	"Home": {
		path: "/Home",
		element: <Home />,
		title: "Home"
	},
};

function Index() {
	const defaultRoute = "Debug";

	return (
		<BrowserRouter>
			<RouteNavigator
				routeItems={RouteItems}
				defaultRoute={defaultRoute}
			/>
		</BrowserRouter>
	);
}

export default Index;
