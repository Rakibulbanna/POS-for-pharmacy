import ReportPage from "@/utility/reportPage";
import React, { useEffect, useState } from "react"
import { BaseAPI, HTTP } from "~/repositories/base"


export default function () {
    const [sells, setSells] = useState([{
        barcode: 'sdfsad',
        product_description: 'safdasd',
        qty:15,
        rpu: 6544,
        total:6565
    }]);

    const [total, setTotal] = useState({
        
    });

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
                name='Promotion Details'
                datas={sells}
                thead={['barcode', 'productionDescription', 'qty', 'rpu','total']}
            />
        </>
    )
}
