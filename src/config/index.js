import * as clsConst from "./const";

import Images from "./image";
import Animation from "./animation";

import googleApi from "./auth/googleApi.json";

import SampleData from "./ref/sample.json";
import SampleDirection from "./ref/direction.json";
import SampleDirectionRes from "./ref/directionRes.json";
import SampleRapidKlOutput from "./ref/rapidKlOutput.json";

const { apiKey: googleApiKey } = googleApi;

export { 
    clsConst,
    googleApiKey,
    Images,
    Animation,
    SampleData,
    SampleDirection,
    SampleDirectionRes,
    SampleRapidKlOutput,
};
