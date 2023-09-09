import { BrowserRouter } from "react-router-dom";
import { RouteNavigator } from "@components";

import Debug from "./../Debug";
import DebugII from "./../Debug/debugII";

const RouteItems = {
	Debug: {
		path: "/Debug",
		component: <Debug />,
		title: "Debug",
	},
	"DebugII": {
		path: "/DebugII",
		component: <DebugII />,
		title: "DebugII"
	},
};

function Index() {
	const defaultRoute = "Debug";

	// const dispatch = useDispatch();
	// dispatch(Actions.onChangeHistoryLs([]));

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
