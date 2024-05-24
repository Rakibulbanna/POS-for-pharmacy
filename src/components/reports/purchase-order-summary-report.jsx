import ReportPage from "@/utility/reportPage";
import { Table } from "@mantine/core"
import React, { useEffect, useState } from "react"
import { BaseAPI, HTTP } from "~/repositories/base"
import HeaderInfo from "./HeaderInfo";


export default function () {
    const [purchaseOrders, setPurchaseOrders] = useState([]);

    const [total, setTotal] = useState({
        quantity: 0,
        total_cost: 0,
        total_value: 0,
    });

    const [totalTbody, setTotalTbody] = useState([]);

    useEffect(() => {
        HTTP.get(`${BaseAPI}/reports/purchases/order-summery`).then(res => {

            if (res.data.data.length > 0) {

                const total = res.data.data.map((item) => {
                    const order_date = new Date(item.created_at);
                    item.received_date = item.is_received ? new Date(item.received_at).toLocaleDateString() + ' ' + order_date.toLocaleTimeString() : 'not receivd';
                    item.order_date = order_date.toLocaleDateString() + ' ' + order_date.toLocaleTimeString();
                    item.total_quantity = item.products.reduce((prev, curr) => prev + curr.quantity, 0);
                    item.total_cost_price = item.products.reduce((prev, curr) => prev + (curr.cost_price * curr.quantity), 0);
                    item.total_mrp_price = item.products.reduce((prev, curr) => prev + (curr.mrp_price * curr.quantity), 0);

                    return item;
                });
                setPurchaseOrders(() => total);
            }
            else {
                setPurchaseOrders(() => [])
            }

        }).catch(err => {
            console.log(err);
        })
    }, []);

    // useEffect(() => {
    //     const copyValue = { ...total };
    //     purchaseOrders?.length > 0 &&
    //         purchaseOrders.forEach((sell) => {
    //             for (const key in sell) {
    //                 if (Object.keys(copyValue).includes(key)) {
    //                     copyValue[key] = copyValue[key] + sell[key];
    //                 }
    //             };
    //         });

    //     setTotal(() => copyValue);
    // }, [purchaseOrders]);

    // useEffect(() => {
    //     if (total) {
    //         const data = [];
    //         data.push(<td colSpan="3" style={{ padding: ' 1px' }}>Grand Total</td>);
    //         data.push(<td style={{ padding: ' 1px', textAlign: 'right' }}>{total.quantity}</td>);
    //         data.push(<td style={{ padding: ' 1px', textAlign: 'right' }}>{total.total_cost}</td>);
    //         data.push(<td style={{ padding: ' 1px', textAlign: 'right' }}>{total.total_value}</td>);

    //         setTotalTbody(() => data);
    //     }
    // }, [total]);

    return (
        <>
            <HeaderInfo title={"Purchase Order Summary Reports"} />
            {/* {
                isReceived &&
                <div style={{ marginTop: '1px', marginBottom: '2px' }}>
                    {fromDate && <><span style={{ fontWeight: 600 }}>FROM </span><span> {fromDate.toLocaleDateString()} </span></>}
                    {toDate && <><span style={{ fontWeight: 600 }}> TO </span><span> {toDate.toLocaleDateString()}</span></>}
                </div>
            } */}
            <div style={{ border: '1px solid #8c8c8c', padding: '0.1rem', fontFamily: 'Arial' }}>
                <table style={{ fontSize: '12px', width: '100%', textAlign: 'center' }} >
                    <thead>
                        <tr style={{ backgroundColor: '#1f2937', color: '#f9fafb' }}>
                            <th style={{ padding: '1px' }}>Chalan No.</th>
                            <th style={{ padding: '1px' }}>Supplier Name</th>
                            <th style={{ padding: '1px' }}>Order Date</th>
                            <th style={{ padding: '1px' }}>receivd Date</th>
                            <th style={{ padding: '1px' }}>Quantity</th>
                            <th style={{ padding: '1px' }}>Total CPU</th>
                            <th style={{ padding: '1px' }}>Total RPU</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            purchaseOrders.length > 0 &&
                            purchaseOrders.map((item, index) => (
                                <tr key={index} style={index % 2 === 0 ? { backgroundColor: '#f3f4f6' } : { backgroundColor: '#e5e7eb' }}>
                                    <td style={{ padding: '0 1px' }}>{item.id}</td>
                                    <td style={{ padding: '0 1px' }}>{item.supplier.first_name + ' ' + item.supplier.last_name}</td>
                                    <td style={{ padding: '0 1px' }}>{item.order_date}</td>
                                    <td style={{ padding: '0 1px' }}>{item.received_date}</td>
                                    <td style={{ padding: '0 1px', textAlign: 'right' }}>{item.total_quantity}</td>
                                    <td style={{ padding: '0 1px', textAlign: 'right' }}>{item.total_cost_price}</td>
                                    <td style={{ padding: '0 1px', textAlign: 'right' }}>{item.total_mrp_price}</td>
                                </tr>
                            ))}

                    </tbody>
                    <tfoot style={{ fontWeight: '600', textAlign: 'right' }}>
                        {
                            purchaseOrders.length > 0 &&
                            <tr>
                                <td colSpan='3' >Grand Total:</td>
                                <td style={{ padding: '0 1px' }}>{purchaseOrders.reduce((prev, curr) => prev + curr.total_quantity, 0)}</td>
                                <td style={{ padding: '0 1px' }}>{purchaseOrders.reduce((prev, curr) => prev + curr.total_cost_price, 0)}</td>
                                <td style={{ padding: '0 1px' }}>{purchaseOrders.reduce((prev, curr) => prev + curr.total_mrp_price, 0)}</td>
                            </tr>
                        }
                    </tfoot>
                </table>
            </div>
        </>
    )
}
