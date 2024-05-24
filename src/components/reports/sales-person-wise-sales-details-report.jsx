import { Table } from "@mantine/core"
import React, { useEffect, useState } from "react"
import { BaseAPI, HTTP } from "~/repositories/base"


export default function () {
    const [sells, setSells] = useState([{
        barcode:'65465',
        style_size: 'xl',
        supplier:'Sfafa',
        product: 'safdasd',
        group: 15,
        sqty:10,
        cpu:546,
        rpu:56,
        total_cpu: 5000,
        total_rpu: 10,
        vat: 10,
        discount: 1555,
        special_discount: 54,
        exchange_amount: 46465,
        net_amount: 516565,
        ret_amount: 65465,
        grand_sale: 150,
        profit: 150,
        gp: 8.14
    }]);

    const [total, setTotal] = useState({
       
        total_cpu: 5000,
        total_rpu: 10,
        vat: 10,
        discount: 1555,
        special_discount: 541,
        exchange_amount: 46465,
        net_amount: 516565,
        ret_amount: 74,
        grand_sale: 150,
        profit: 150,
        gp: 8.14
    });

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
    }, [sells])

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
                <div className="p-2 font-bold text-lg w-fit mx-auto" style={{ border: '2px solid #8c8c8c' }}>Sales Person Wise Sales Details Report</div>
                <div className="pt-5 pb-10 font-semibold" >09/08/2022 to 15/08/20220</div>
                <div className="relative sm:rounded-lg w-full" style={{ border: '1px solid #8c8c8c' }}>
                    <table className="w-full text-sm text-left text-gray-200" >
                        <thead className="text-[10px] uppercase bg-gray-700 text-gray-200">
                            <tr>
                                <th className="py-1 px-1">Barcode</th>
                                <th className="py-1 px-1">style size</th>
                                <th className="py-1 px-1">supplier</th>
                                <th className="py-1 px-1">product</th>
                                <th className="py-1 px-1">group</th>
                                <th className="py-1 px-1">sqty</th>
                                <th className="py-1 px-1">cpu</th>
                                <th className="py-1 px-1">rpu</th>
                                <th className="py-1 px-1">Total CPU</th>
                                <th className="py-1 px-1">Total RPU</th>
                                <th className="py-1 px-1">VAT</th>
                                <th className="py-1 px-1">Disc</th>
                                <th className="py-1 px-1">Spacial Dis.</th>
                                <th className="py-1 px-1">Excg. Amt</th>
                                <th className="py-1 px-1">Net. Amt</th>
                                <th className="py-1 px-1">Ret. Amt</th>
                                <th className="py-1 px-1">Grand Sale</th>
                                <th className="py-1 px-1">Profit</th>
                                <th className="py-1 px-1">GP (%)</th>
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
                                <td className="px-1"></td>
                                <td className="px-1"></td>
                                <td className="px-1"></td>
                                <td className="px-1">Total</td>
                                <td className="px-1"></td>
                                <td className="px-1"></td>
                                <td className="px-1"></td>
                                <td className="px-1"></td>
                                {
                                    Object.keys(total).map((value) => <td key={value} className="px-1">{total[value]}</td>
                                    )
                                }
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
                                {/* <td className="px-1"></td>
                                <td className="px-1"></td> */}
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}
