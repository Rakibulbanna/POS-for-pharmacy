import ReportPage from "@/utility/reportPage";
import React, { useEffect, useState } from "react"
import { BaseAPI, HTTP } from "~/repositories/base"
import HeaderInfo from "./HeaderInfo";


export default function ({ fromDate = null, toDate = null }) {
    const [damageAndLostProducts, setDamageAndLostProducts] = useState([]);
    const [totalTbody, setTotalTbody] = useState([]);

    useEffect(() => {
        let url = `${BaseAPI}/reports/damage-and-lost?`
        if (fromDate) url += `from_date=${fromDate}`
        if (toDate) url += `&to_date=${toDate}`

        HTTP.get(url).then(res => {
            setDamageAndLostProducts(() => res.data.data)
        }).catch(err => {
            console.log(err);
        })
    }, [fromDate, toDate]);
    console.log({ damageAndLostProducts })
    return (
        <>
            {/* <ReportPage
                name='Damage Lost Report Details'
                datas={damageAndLostProducts}
                totalTbody={totalTbody}
                thead={['Product Name', 'Status', 'Quantity', 'Reason']}
            /> */}
            <div style={{ textAlign: 'center' }}>
                <HeaderInfo title={'Damage Lost Report Details'} />
                <div style={{ position: 'relative', margin: 'auto', width: '100%', borderRadius: '5px', padding: '2px', border: '1px solid #8c8c8c', marginTop: '20px', fontSize: '12px' }}>
                    <table style={{ width: '100%', fontSize: '12px' }} >
                        <thead style={{ backgroundColor: 'black', color: '#EFEFEF' }} >
                            <tr style={{ fontSize: '13px', textTransform: 'uppercase' }}>
                                <th style={{ padding: '1px 0' }}>Barcode</th>
                                <th style={{ padding: '1px 0' }}>Product Name</th>
                                <th style={{ padding: '1px 0' }}>Supplier Name</th>
                                <th style={{ padding: '1px 0' }}>Stock</th>
                                <th style={{ padding: '1px 0' }}>Quantity</th>
                                <th style={{ padding: '1px 0' }}>Status</th>
                                <th style={{ padding: '1px 0' }}>Reason</th>
                                <th style={{ padding: '1px 0' }}>CPU</th>
                                <th style={{ padding: '1px 0' }}>RPU</th>
                                <th style={{ padding: '1px 0' }}>Toala CPU</th>
                                <th style={{ padding: '1px 0' }}>Total RPU</th>
                            </tr>
                        </thead>
                        <tbody>
                            {damageAndLostProducts.length > 0 && damageAndLostProducts.map((value, index) => (

                                <tr key={index} style={index % 2 === 0 ? { backgroundColor: "#f1f5f9", textAlign: 'center' } : { backgroundColor: "#e2e8f0", textAlign: 'center' }} >

                                    <td style={{ padding: '1px 0' }}>{value.product?.product_barcode}</td>
                                    <td style={{ padding: '1px 0' }}>{value.product?.name + `${value.product?.style_size ? ', ' + value.product?.style_size : ''}`}</td>
                                    <td style={{ padding: '1px 0' }}>{value.product?.supplier?.first_name}</td>
                                    <td style={{ padding: '1px 0' }}>{value.product?.stock}</td>
                                    <td style={{ padding: '1px 0', width: '10px', textAlign: 'right' }}>{value.quantity}</td>
                                    <td style={value.status === 1 ? { color: '#c76e02', padding: '1px 0' } : { color: '#fc0303', padding: '1px 0' }}>{(value.status === 1 && 'Damage') || (value.status === 2 && 'Lost') || ''}</td>
                                    <td style={{ padding: '1px 20px' }}>{value.reason}</td>
                                    <td style={{ padding: '1px 0', width: '10px', textAlign: 'right' }}>{value.product?.cost_price}</td>
                                    <td style={{ padding: '1px 0', width: '10px', textAlign: 'right' }}>{value.product?.MRP_price}</td>
                                    <td style={{ padding: '1px 0', width: '10px', textAlign: 'right' }}>{(value.product?.cost_price * value.quantity)?.toFixed(2)}</td>
                                    <td style={{ padding: '1px 0', width: '10px', textAlign: 'right' }}>{(value.product?.MRP_price * value.quantity)?.toFixed(2)}</td>
                                </tr>
                            ))}
                            <tr style={{ fontWeight: '600', textAlign: 'right' }}>
                                <td colSpan="4" style={{ padding: '1px 0' }}>Grand Total:</td>
                                <td style={{ padding: '1px 0' }}>{damageAndLostProducts.reduce((prev, curr) => prev + curr.quantity, 0)}</td>
                                <td style={{ padding: '1px 0' }}></td>
                                <td style={{ padding: '1px 0' }}></td>
                                <td style={{ padding: '1px 0' }}>{damageAndLostProducts.reduce((prev, curr) => prev + curr.product?.cost_price, 0).toFixed(2)}</td>
                                <td style={{ padding: '1px 0' }}>{damageAndLostProducts.reduce((prev, curr) => prev + curr.product?.MRP_price, 0).toFixed(2)}</td>
                                <td style={{ padding: '1px 0' }}>{damageAndLostProducts.reduce((prev, curr) => prev + (curr.product?.cost_price * curr.quantity), 0)?.toFixed(2)}</td>
                                <td style={{ padding: '1px 0' }}>{damageAndLostProducts.reduce((prev, curr) => prev + (curr.product?.MRP_price * curr.quantity), 0)?.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {/* total salse amount */}
                { }
            </div>
        </>
    )
}
