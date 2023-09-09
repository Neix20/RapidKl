import { Utility } from "@utility";

const Index = async (props) => {

    const { param } = props;
    const { onSetLoading } = props;

    // Static Data
    let obj = Utility.requestObj(param);

    const action = "https://geocode.maps.co/search";
    const url = Utility.genFetchUrl(action, obj);

    const resp = await fetch(url, {
        method: "GET"
    });

    const data = await resp.json();
    onSetLoading(false);

    if (data["ResponseCode"] === "00") {
        // return data;
    }
    else {
        console.log(`Home - GeoCode - Request - ${JSON.stringify(obj)}`);
        console.log(`Home - GeoCode - Response - ${JSON.stringify(data)}`);
    }

    return data;
};

export default Index;