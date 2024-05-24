import ReportPage from "@/utility/reportPage";
import React, { useEffect, useState } from "react"
import { BaseAPI, HTTP } from "~/repositories/base"


export default function () {
    const [sells, setSells] = useState([{
        'barcode': 'sfas',
        'Description': ' asdfasfaaf',
        'group': 'lg',
        'opening_qty': 12,
        'rcv_qty': 5,
        'sup_rtn_qty': 50,
        'dmi_qty': 7,
        'sqty': 5,
        'won_qty': 12,
        'woff_qty': 1,
        'closing_qty': 0,
        'cpu_value': 150,
        'rpu_value': 155
    }]);

    // const [total, setTotal] = useState({

    // });

    // const [totalTbody, setTotalTbody] = useState([]);

    // useEffect(() => {
    //     HTTP.get(`${BaseAPI}/reports/day-wise-sell`).then(res => {
    //         setSells(res.data.data)
    //     }).catch(err => {
    //         console.log(err);
    //     })
    // }, []);

    // useEffect(() => {
    //     const copyValue = { ...total };
    //     sells?.length > 0 &&
    //         sells.forEach((sell) => {
    //             for (const key in sell) {
    //                 console.log(Object.keys(copyValue).includes(key), key);
    //                 if (Object.keys(copyValue).includes(key)) {
    //                     copyValue[key] = copyValue[key] + sell[key];
    //                 }
    //             };
    //         });

    //     setTotal(() => copyValue);
    // }, [sells]);

    // useEffect(() => {
    //     if (total) {
    //         const data = [];
    //         data.push(<td className="px-1">Total</td>);
    //         data.push(<td className="px-1"></td>);
    //         data.push(<td className="px-1"></td>);

    //         for (const key in total) {
    //             data.push(<td className="px-1">{total[key]}</td>);
    //         };
    //         setTotalTbody(() => data);
    //     }
    // }, [total]);

    return (
        <>
            <ReportPage
                name='Periodical Stock Report'
                datas={sells}
                thead={['barcode', 'Description', 'group', 'opening qty', 'rcv qty', 'sup rtn qty', 'dmi qty', 'sqty', 'won qty', 'woff qty', 'closing qty', 'cpu value', 'rpu value']}
            />
        </>
    )
}
