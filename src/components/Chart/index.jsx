import React, { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
    TimeScale
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-luxon';

ChartJS.register(
    PointElement, LineElement,
    CategoryScale, LinearScale, TimeScale,
    Title, Tooltip, Filler, Legend
);

import "@config/globalStyles.css";

import { useToggle } from "@hooks";
import { WqModalBtn } from "@components";

function ModalBtn(props) {
    const modalHook = useToggle(false);
    const modalObj = {
        showModal: modalHook[0],
        setShowModal: modalHook[1],
        toggleModal: modalHook[2]
    }

    return (
        <WqModalBtn
            {...modalObj}
            btnChild={<></>}
            mdlChild={<></>}
        />
    )
}

import { Utility } from "@utility";

function Index(props) {

    // #region Props
    const { title = "", frameInd = 100 } = props;
    const { min = 0, max = 100 } = props;
    const { labelLs = [], dataLs = [] } = props;
    // #endregion

    // #region Use State
    const [colorLs, setColorLs] = useState([]);

    const modalHook = useToggle(false);
    const modalObj = {
        showModal: modalHook[0],
        setShowModal: modalHook[1],
        toggleModal: modalHook[2]
    }
    // #endregion

    useEffect(() => {
        let arr = [];

        for (let ind in dataLs) {
            const [borderColor, bgColor] = Utility.genRandomRgb(0.5);
            arr.push({ borderColor, bgColor });
        }

        setColorLs(arr);
    }, [dataLs.length]);

    if (colorLs.length != dataLs.length) {
        return (<></>)
    }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: title,
            },
        },
        animation: false,
        scales: {
            x: {
                type: 'time',
                time: {
                    parser: 'HH:mm',
                    unit: 'hour',
                    displayFormats: {
                        hour: 'HH:mm'
                    }
                }
            },
            y: {
                type: 'linear',
                min: min,
                max: max,
            }
        },
        datasets: {
            line: {
                // pointRadius: 0 // disable for all `'line'` datasets
            },
            spanGaps: true,
        }
    };

    const data = {
        labels: labelLs.slice(0, frameInd),
        datasets: dataLs.map((obj, ind) => {
            const { label, data } = obj;
            return {
                label: label,
                data: data.slice(0, frameInd),
                borderColor: colorLs[ind].borderColor,
                backgroundColor: colorLs[ind].bgColor
            }
        })
    };

    return (
        <WqModalBtn
            {...modalObj}
            btnChild={
                <div className='btn btn-light w-100 h-100'>
                    <Line options={options} data={data} />
                </div>
            }
            mdlChild={<Line options={options} data={data} />}
        />
    )
}

export default Index;