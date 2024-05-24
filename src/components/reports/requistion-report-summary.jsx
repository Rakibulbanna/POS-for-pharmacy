import ReportPage from "@/utility/reportPage";
import React, { useEffect, useState } from "react"
import { BaseAPI, HTTP } from "~/repositories/base"


export default function () {
    const [sells, setSells] = useState([{
        requistion_no: 'sdfsad',
        date: 'mehedi hasan',
        qty: 61.00,
        total_rpu: 6544,
    }]);

    const [total, setTotal] = useState({
        qty: 5465,
        total_rpu:0
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
            data.push(<td className="px-1"></td>);
            data.push(<td className="px-1">Total</td>);

            for (const key in total) {
                data.push(<td className="px-1">{total[key]}</td>);
            };
            setTotalTbody(() => data);
        }
    }, [total]);

    return (
        <>
            <ReportPage
                name='Requistion Report Summary'
                datas={sells}
                totalTbody={totalTbody}
                thead={['requistion no','date','qty', 'total rpu']}
            />
        </>
    )
}
