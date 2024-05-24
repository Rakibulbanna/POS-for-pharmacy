import { Table } from "@mantine/core"
import React, { useEffect, useState } from "react"
import { BaseAPI, HTTP } from "~/repositories/base"


export default function () {
    const [sells, setSells] = useState([{
        supplier: 'dafdasfsa',
        sold_quantity: 4,
        sold_amount: 80.00,
        profit_amount: 6.50,
        gp: 50
    }, {
        supplier: 'dafdasfsa',
        sold_quantity: 4,
        sold_amount: 80.00,
        profit_amount: 6.50,
        gp: 50
    }]);


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
                <div className="p-2 font-bold text-2xl w-fit px-10 mt-10 mx-auto uppercase" >fresh mart</div>
                <div className=" pb-2 font-semibold text-lg w-fit mx-auto" >Madina Shooping Complex,Boshila City Developers..</div>
                <div className="p-2 font-bold text-lg w-fit mx-auto" style={{ border: '2px solid #8c8c8c' }}>Supplier Wise GP ( % ) Report</div>
                <div className="pt-5 pb-10 font-semibold" >09/08/2022 to 15/08/20220</div>
                <div className="relative sm:rounded-lg w-full" style={{ border: '1px solid #8c8c8c' }}>
                    <table className="w-full text-sm text-left text-gray-200" >
                        <thead className="text-[10px] uppercase bg-gray-700 text-gray-200">
                            <tr>
                                <th className="py-1 px-1">Supplier</th>
                                <th className="py-1 px-1">Sold Quantity</th>
                                <th className="py-1 px-1">Sold Amount</th>
                                <th className="py-1 px-1">Profit Amount</th>
                                <th className="py-1 px-1">GP</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 bg-gray-100">
                            {sells.map((sell, index) => (
                                <tr key={index} className={`${index % 2 === 0 ? '' : 'bg-gray-200'} border-b  border-gray-700`}>

                                    {
                                        handlerSellproductList(sell)
                                    }
                                </tr>
                            ))}

                            {/* <tr className="text-white bg-gray-500 ">
                                <td className="px-1">Grand Total</td>
                                
                                <td className="px-1">{total.totalBarcodePrice}</td>
                                <td className="px-1">{total.totalDiscAmount}</td>
                                <td className="px-1">{total.vat}</td>
                                <td className="px-1">{total.specialDisc}</td>
                                <td className="px-1">{total.exchangeAmount}</td>
                                <td className="px-1">{total.netAmount}</td>
                                <td className="px-1">{total.roundValue}</td>
                                <td className="px-1">{total.cashAmount}</td>
                                <td className="px-1">{total.CardAmount}</td>
                                <td className="px-1">{total.pointValue}</td>
                                <td className="px-1">{total.totalCost}</td>
                                <td className="px-1">{total.cashReturn}</td>
                                <td className="px-1"></td>
                                <td className="px-1"></td>
                            </tr> */}

                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}
