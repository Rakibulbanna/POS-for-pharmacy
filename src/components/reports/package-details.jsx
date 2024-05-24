import ReportPage from "@/utility/reportPage";
import React, { useEffect, useState } from "react"
import { BaseAPI, HTTP } from "~/repositories/base"


export default function () {
    const [sells, setSells] = useState([{
        barcode: 'sdfsad',
        description: 'masfafaglk',
        cpu: 6544,
        rpu: 6544,
        package_rpu: 16544,
    }]);

    const [total, setTotal] = useState({
        package_rpu: 5465
    });

    const [totalTbody, setTotalTbody] = useState([]);

    // useEffect(() => {
    //     HTTP.get(`${BaseAPI}/reports/day-wise-sell`).then(res => {
    //         setSells(res.data.data)
    //     }).catch(err => {
    //         console.log(err);
    //     })
    // }, []);

    useEffect(() => {
        const copyValue = { ...total };
        sells?.length > 0 &&
            sells.forEach((sell) => {
                for (const key in sell) {
                    if (Object.keys(copyValue).includes(key)) {
                        copyValue[key] = copyValue[key] + sell[key];
                    }
                };
            });

        setTotal(() => copyValue);
    }, [sells]);

    useEffect(() => {
        if (total) {
            const data = [];
            data.push(<td className="px-1">Total</td>);
            data.push(<td className="px-1"></td>);
            data.push(<td className="px-1"></td>);
            data.push(<td className="px-1"></td>);

            for (const key in total) {
                data.push(<td className="px-1">{total[key]}</td>);
            };
            setTotalTbody(() => data);
        }
    }, [total]);

    return (
        <>
            <ReportPage
                name='Package Details'
                totalTbody={totalTbody}
                datas={sells}
                thead={['barcode', 'item description', 'cpu', 'rpu', 'package RPU']}
            />
        </>
    )
}
