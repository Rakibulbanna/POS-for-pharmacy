import { Table } from "@mantine/core"
import React, { useEffect, useState } from "react"
import { BaseAPI, HTTP } from "~/repositories/base"
import HeaderInfo from "./HeaderInfo";


export default function () {
    const [sells, setSells] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        HTTP.get(`${BaseAPI}/reports/day-wise-sell`).then(res => {
            console.log(res.data.data);
            setSells(res.data.data)

            let tot = 0
            res.data.data.forEach(sale => {
                tot = tot + sale.sum
            });

            setTotal(tot)

        }).catch(err => {
            console.log(err);
        })
    }, []);

    // useEffect(() => {
    //     const copyValue = { ...total };

    //     if (sells?.length > 0) {
    //         const totalAmount = sells.reduce((prev,curr) => prev + curr['amount'],0);
    //         setTotal(() => totalAmount);
    //     }

    // }, [sells])

    const handlerSellproductList = (value) => {
        const data = [];
        for (const key in value) {
            data.push(<td className="px-1">{value[key]}</td>);
        };
        return data;
    }

    return (
        <>
            <div className=" text-center">
                <HeaderInfo title={"Day Wise Sale Report"}/>
                <div className="relative sm:rounded-lg w-full" style={{ border: '1px solid #8c8c8c' }}>
                    <table className="w-full text-sm text-left text-gray-200" >
                        <thead className="w-full text-[10px] uppercase bg-gray-700 text-gray-200">
                            <tr>
                                <th className="py-1 px-1">Dates</th>
                                <th className="py-1 px-1">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 bg-gray-100">
                            {sells.map((sell, index) => (
                                <tr key={index} className={`${index % 2 === 0 ? '' : 'bg-gray-200'} border-b  border-gray-700`}>

                                    <td className="px-1">{new Date(sell.date_trunc).toLocaleDateString()}</td>
                                    <td className="px-1">{sell.sum}</td>
                                </tr>
                            ))}

                            <tr className="text-white bg-gray-500 ">
                                <td className="px-1">Total:</td>
                                <td className="px-1">{total}</td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}
