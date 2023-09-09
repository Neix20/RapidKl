import { fetchInfoLog, fetchErrorLog } from "@api";

class Log {
    info(param) {
        const obj = JSON.stringify({
            ...param,
            app: "WMQJG",
        });

        console.log(obj);

        fetchInfoLog(param)
        .then(res => {
            console.log(res);
        })
        .catch((err) => {
            console.log(`Error: ${err}`);
        });
    }

    error(param) {
        const obj = JSON.stringify({
            ...param,
            app: "WMQJG",
        });

        console.log(obj);

        fetchErrorLog(param)
        .then(res => {
            console.log(res);
        })
        .catch((err) => {
            console.log(`Error: ${err}`);
        });
    }
}

const obj = new Log();

export default obj;