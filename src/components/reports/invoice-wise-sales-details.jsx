import { useEffect, useState } from "react"
import { BaseAPI, HTTP } from "~/repositories/base"


export default function () {
    const [sells, setSells] = useState([{
        invoice: 'sdfsad',
        totalBarcodePrice: 55454,
        totalDiscAmount: 545,
        vat: 10,
        specialDisc: 55,
        exchangeAmount: 15,
        netAmount: 150,
        roundValue: 200,
        cashAmount: 10000,
        CardAmount: 5000,
        pointValue: 10,
        totalCost: 175005,
        cashReturn: 1555,
        cardName: 'CASH',
        nameOfCustomer: 'Mehedi'
    }]);

    const [total, setTotal] = useState({
        totalBarcodePrice: 0,
        totalDiscAmount: 0,
        vat: 0,
        specialDisc: 0,
        exchangeAmount: 0,
        netAmount: 0,
        roundValue: 0,
        cashAmount: 0,
        CardAmount: 0,
        pointValue: 0,
        totalCost: 0,
        cashReturn: 0,
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
                <div className="p-2 font-bold text-lg w-fit mx-auto" style={{ border: '2px solid #8c8c8c' }}>Invoice Wise Sales Details</div>
                <div className="pt-5 pb-10 font-semibold" >09/08/2022 to 15/08/20220</div>
                <div className="relative sm:rounded-lg w-full" style={{ border: '1px solid #8c8c8c' }}>
                    <table className="w-full text-sm text-left text-gray-200" >
                        <thead className="text-[10px] uppercase bg-gray-700 text-gray-200">
                            <tr>
                                <th className="py-1 px-1">Invoice</th>
                                <th className="py-1 px-1">Total of BarcodePrice</th>
                                <th className="py-1 px-1">Total Disc. Amt</th>
                                <th className="py-1 px-1">VAT</th>
                                <th className="py-1 px-1">Special Discount</th>
                                <th className="py-1 px-1">Exchange Amount</th>
                                <th className="py-1 px-1">Net Amount</th>
                                <th className="py-1 px-1">Round Value</th>
                                <th className="py-1 px-1">Cash Amount</th>
                                <th className="py-1 px-1">Card Amount</th>
                                <th className="py-1 px-1">Point Value</th>
                                <th className="py-1 px-1">Total Cost</th>
                                <th className="py-1 px-1">Cash Return/Void</th>
                                <th className="py-1 px-1">Card Name</th>
                                <th className="py-1 px-1">Name Of Customer</th>

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
                                {
                                    Object.keys(total).map((value) =><td key={value} className="px-1">{total[value]}</td>
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
                                <td className="px-1"></td>
                                <td className="px-1"></td>
                            </tr>

                        </tbody>
                    </table>
                </div>
                <div className="w-1/2 mt-10 text-base gap-2 font-semibold mx-auto text-gray-700">
                    <div className="flex justify-between px-4">
                        <span>Total Sale Amount</span>
                        <span>{total.netAmount}</span>
                    </div>
                    <div className="flex justify-between px-4">
                        <span>(-) Void Amount</span>
                        <span>{0.00}</span>
                    </div>
                    <div className="my-1" style={{ borderBottom: '1px solid #8c8c8c' }}></div>
                    <div className="flex justify-between px-4">
                        <span>Grand Sale Amount</span>
                        <span>{total.netAmount - 0.00}</span>
                    </div>
                    
                </div>
            </div>
        </>
    )
}
