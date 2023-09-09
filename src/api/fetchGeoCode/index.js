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

    let data = await resp.json();
    onSetLoading(false);

    if (data.length > 0) {
        data = data[0];
    }

    return data;
};

export default Index;