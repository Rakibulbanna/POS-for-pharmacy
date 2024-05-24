import { Table } from "@mantine/core"
import React, { useEffect, useState } from "react"
import { BaseAPI, HTTP } from "~/repositories/base"


export default function () {
    const [sells, setSells] = useState([{
        barcode: '6546868866846',
        product: 'Pran Up',
        supllier_name : 'mehedi',
        quantity: 54,
        s_quantity: 20,
        sale_from_stock: function (){ return this.s_quantity *100/this.quantity}
    }, {
        barcode: '6546868866846',
        product: 'Pran Up',
        supllier_name : 'mehedi',
        quantity: 54,
        s_quantity: 20,
        sale_from_stock: function (){ return this.s_quantity *100/this.quantity}
    }]);

    // useEffect(() => {
    //     HTTP.get(`${BaseAPI}/reports/day-wise-sell`).then(res => {
    //         setSells(res.data.data)
    //     }).catch(err => {
    //         console.log(err);
    //     })
    // }, []);


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
                <div className="p-2 font-bold text-lg w-fit px-10 mt-10 mx-auto" style={{ border: '2px solid #8c8c8c' }}>Sales From Stock ( % ) Report</div>
                <div className="py-5 font-semibold" >09/08/2022 to 15/08/20220</div>
                <div className="relative sm:rounded-lg w-full" style={{ border: '1px solid #8c8c8c' }}>
                    <table className="w-full text-sm text-left text-gray-200" >
                        <thead className="text-[10px] uppercase bg-gray-700 text-gray-200">
                            <tr>
                                <th className="py-1 px-1">Barcode</th>
                                <th className="py-1 px-1">Product</th>
                                <th className="py-1 px-1">Supplier Name</th>
                                <th className="py-1 px-1">Quantity</th>
                                <th className="py-1 px-1">S.Quantity</th>
                                <th className="py-1 px-1">Sale From Stock ( % )</th>
                                
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

                            <tr className="text-white bg-gray-500 ">
                                <td className="px-1">Grand Total</td>
                                {/* {
                                    Object.keys(total).map((value) => <td key={value} className="px-1">{total[value]}</td>
                                    )
                                } */}
                                {/* <td className="px-1">{total.totalBarcodePrice}</td>
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
                                <td className="px-1">{total.cashReturn}</td> */}
                                <td className="px-1"></td>
                                <td className="px-1"></td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}
