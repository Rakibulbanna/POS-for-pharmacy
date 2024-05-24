import { Table } from "@mantine/core"
import React, { useEffect, useState } from "react"
import { BaseAPI, HTTP } from "~/repositories/base"


export default function () {
    const [sells, setSells] = useState([{
        customer_id:'4565465',
        customer_name: 'Sumiya',
        phone: '01465454666',
        invoice: '01546546546546',
        net_amount: 5465,
        point_earn: 2.5,
    }]);

    const [total, setTotal] = useState({
        point_earn: 2.5,
    });
    // useEffect(() => {
    //     HTTP.get(`${BaseAPI}/reports/day-wise-sell`).then(res => {
    //         setSells(res.data.data)
    //     }).catch(err => {
    //         console.log(err);
    //     })
    // }, []);

    //for total value 
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

    //item table map
    const handlerSellproductList = (value,index) => {
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
                <div className="p-2 font-bold text-lg w-fit mx-auto" style={{ border: '2px solid #8c8c8c' }}>Data Wise Customer Shopping Summary</div>
                <div className="pt-5 pb-10 font-semibold" >09/08/2022 to 15/08/20220</div>
                <div className="relative sm:rounded-lg w-full" style={{ border: '1px solid #8c8c8c' }}>
                    <table className="w-full text-sm text-left text-gray-200" >
                        <thead className="text-[10px] uppercase bg-gray-700 text-gray-200">
                            <tr>
                                <th className="py-1 px-1">customer id</th>
                                <th className="py-1 px-1">Customer name</th>
                                <th className="py-1 px-1">phone</th>
                                <th className="py-1 px-1">invoice</th>
                                <th className="py-1 px-1">net amount</th>
                                <th className="py-1 px-1">point earn</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 bg-gray-100">
                            {sells.map((sell, index) => (
                                <tr key={index} className={`${index % 2 === 0 ? '' : 'bg-gray-200'} border-b  border-gray-700`}>
                                    
                                    {
                                        handlerSellproductList(sell,index)
                                    }
                                </tr>
                            ))}

                            <tr className="text-white bg-gray-500 ">
                                <td className="px-1"></td>
                                <td className="px-1">Total</td>
                                <td className="px-1"></td>
                                <td className="px-1"></td>
                                <td className="px-1"></td>
                                {
                                    Object.keys(total).map((value) => <td key={value} className="px-1">{total[value]}</td>
                                    )
                                }
                                
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}
