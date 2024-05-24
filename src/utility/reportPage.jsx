import HeaderInfo from "@/components/reports/HeaderInfo";
import React, { useEffect, useState } from "react"
import { BaseAPI, HTTP } from "~/repositories/base"


export default function ({ name = '', datas = [], thead = [], alltotal = null, totalTbody = [] }) {

    const handlerSellproductList = (value) => {
        const data = [];
        for (const key in value) {
            data.push(<td className="px-1">{value[key]}</td>);
        };
        return data;
    }

    return (
        <>
            <div >
                <HeaderInfo title={name}/>
                <div style={{ border: '1px solid #8c8c8c' }}>
                    <table style={{width:'100%'}} >
                        <thead className="text-[10px] uppercase bg-gray-700 text-gray-200">
                            <tr>
                                {
                                    thead?.length > 0 &&
                                    thead.map((value, index) => <th key={index} className="py-1 px-1">{value}</th>)
                                }
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 bg-gray-100">
                            {/* item table saction */}
                            {datas.length > 0 && datas.map((sell, index) => (

                                <tr key={index} className={`${index % 2 === 0 ? '' : 'bg-gray-200'} border-b  border-gray-700`}>

                                    {
                                        handlerSellproductList(sell)
                                    }
                                </tr>
                            ))}

                            {/* total section */}
                            {
                                totalTbody?.length > 0 &&
                                <tr className="text-white bg-gray-500 ">
                                    {totalTbody}
                                    {/* <td className="px-1">Grand Total</td>
                                <td className="px-1"></td>
                                {
                                    Object.keys(total).map((value) => <td key={value} className="px-1">{total[value]}</td>
                                    )
                                }
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
                                <td className="px-1"></td> */}
                                </tr>
                            }

                        </tbody>
                    </table>
                </div>
                {/* total salse amount */}
                { }
            </div>
        </>
    )
}
