import ReportPage from "@/utility/reportPage";
import { Table } from "@mantine/core"
import React, { useEffect, useState } from "react"
import { BaseAPI, HTTP } from "~/repositories/base"
import HeaderInfo from "./HeaderInfo";


export default function ({ fromDate, toDate, isReceived, supplier, category }) {
    // const [sells, setSells] = useState([{
    //     barCode: 'sdfsad',
    //     product: 'safdasd',
    //     qty: 4,
    //     cpu: 645,
    //     total_cost: 465465,
    //     rpu: 85,
    //     total_value: 646565
    // }]);

    const [purchaseOrders, setPurchaseOrders] = useState([])
    const [total, setTotal] = useState([]);

    // const [totalTbody, setTotalTbody] = useState([]);

    useEffect(() => {

        let url = `${BaseAPI}/purchase_order?`
        if (supplier) {
            //    console.log("supplier___",supplier);
            url += `supplier_id=${supplier}`
        }
        if (category) {
            url += `&category_id=${category}`
        }
        url += `&is_received=${isReceived}`

        if (fromDate) url += `&from_date=${fromDate}`
        if (toDate) url += `&to_date=${toDate}`
        console.log(url);
        HTTP.get(url).then(res => {
            setPurchaseOrders(res.data.data);
        }).catch(err => {
            console.log(err);
        })
    }, [fromDate, toDate, isReceived, supplier, category]);

    useEffect(() => {
        const copyTotal = [];

        purchaseOrders?.length > 0 &&
            purchaseOrders.forEach((sell) => {
                const copyValue = {
                    total_quantity: 0,
                    total_cost: 0,
                    total_value: 0,
                };

                sell.products?.length > 0 && sell.products.forEach((val) => {

                    // if(['received_quantity','cost_price','mrp_price']
                    const quantity = isReceived ? val.received_quantity : val.quantity;
                    copyValue.total_quantity += quantity;
                    copyValue.total_cost += quantity * val.cost_price;
                    copyValue.total_value += quantity * val.mrp_price;
                })
                copyTotal.push(copyValue);
            });
        setTotal((v) => copyTotal)

    }, [purchaseOrders]);

    return (
        <>
            <HeaderInfo title={isReceived ? "Purchase Received Details Reports" : "Purchase Order Details Reports"} />

            {isReceived &&
                <div>
                    {fromDate && `From ${fromDate?.toLocaleDateString()}`} {toDate && `To ${toDate?.toLocaleDateString()}`}
                </div>
            }
            {
                purchaseOrders.length > 0 ?
                    purchaseOrders.map((po, index) => (
                        <div style={{ fontFamily: 'Arial' }}>
                            <div style={{ fontSize: '13px', marginTop: '5px' }}>Purchase Order Id : {po.id}</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                <div>Supplier Name : {po.supplier.first_name + ' ' + `${po.supplier.last_name ? po.supplier.last_name : ''}`}</div>
                                <div>Phone Number : +88{po.supplier.phone_number}</div>
                            </div>

                            <div style={{ border: '1px solid #8c8c8c', padding: '0.1rem' }}>
                                <table key={po.id} style={{ width: '100%', fontSize: '12px', textAlign: 'right' }}>
                                    <thead style={{ backgroundColor: '#1f2937', color: '#f9fafb', textAlign: 'center' }}>
                                        <tr>
                                            <th style={{ padding: '1px', width: '20%' }}>Product Name</th>
                                            <th style={{ padding: '1px' }}>Product Barcode</th>
                                            <th style={{ padding: '1px' }}>{isReceived ? 'Receive QTY' : 'QTY'}</th>
                                            <th style={{ padding: '1px' }}>CPU</th>
                                            <th style={{ padding: '1px' }}>Total CPU</th>
                                            <th style={{ padding: '1px' }}>RPU</th>
                                            <th style={{ padding: '1px' }}>Total RPU</th>
                                        </tr>
                                    </thead>
                                    <tbody >
                                        {po.products.map((product, index) => (
                                            <tr style={index % 2 === 0 ? { backgroundColor: '#f3f4f6', } : { backgroundColor: '#e5e7eb' }} key={product.product.id}>
                                                <td style={{ padding: '0 1px', width: '20%', textAlign: 'center' }}>{product.product.name + `${product.product.style_size ? ', ' + product.product.style_size : ''}`}</td>
                                                <td style={{ padding: '0 1px', textAlign: 'center' }}>{product.product.product_barcode}</td>
                                                <td style={{ padding: '0 1px' }}>{isReceived ? product.received_quantity : product.quantity}</td>
                                                <td style={{ padding: '0 1px' }}>{product.cost_price}</td>
                                                <td style={{ padding: '0 1px' }}>{(isReceived ? product.received_quantity * product.cost_price : product.quantity * product.cost_price)?.toFixed(2)}</td>
                                                <td style={{ padding: '0 1px' }}>{(product.mrp_price)?.toFixed(2)}</td>
                                                <td style={{ padding: '0 1px' }}>{(isReceived ? product.received_quantity * product.mrp_price : product.quantity * product.mrp_price)?.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot style={{ fontWeight: '600' }}>
                                        <tr>
                                            <td colSpan="2" style={{ textAlign: 'center' }} >Grand Total:</td>
                                            <td style={{ padding: '0 1px' }}>{total[index]?.total_quantity}</td>
                                            <td style={{ padding: '0 1px' }}></td>
                                            <td style={{ padding: '0 1px' }}>{total[index]?.total_cost?.toFixed(2)}</td>
                                            <td style={{ padding: '0 1px' }}></td>
                                            <td style={{ padding: '0 1px' }}>{(total[index]?.total_value)?.toFixed(2)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>

                    ))

                    :
                    <div style={{ fontFamily: 'Arial' }}>

                        <div style={{ border: '1px solid #8c8c8c', padding: '0.1rem' }}>
                            <table style={{ width: '100%', fontSize: '12px', textAlign: 'right' }}>
                                <thead style={{ backgroundColor: '#1f2937', color: '#f9fafb', textAlign: 'center' }}>
                                    <tr>
                                        <th style={{ padding: '1px', width: '20%' }}>Product Name</th>
                                        <th style={{ padding: '1px' }}>Product Barcode</th>
                                        <th style={{ padding: '1px' }}>QTY</th>
                                        <th style={{ padding: '1px' }}>CPU</th>
                                        <th style={{ padding: '1px' }}>Total CPU</th>
                                        <th style={{ padding: '1px' }}>RPU</th>
                                        <th style={{ padding: '1px' }}>Total RPU</th>
                                    </tr>
                                </thead>
                                <tfoot style={{ fontWeight: '600' }}>
                                    <tr>
                                        <td colSpan="2" style={{ textAlign: 'center' }} >Grand Total:</td>
                                        <td style={{ padding: '0 1px' }}>{0}</td>
                                        <td style={{ padding: '0 1px' }}></td>
                                        <td style={{ padding: '0 1px' }}>{0}</td>
                                        <td style={{ padding: '0 1px' }}></td>
                                        <td style={{ padding: '0 1px' }}>{0}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
            }

        </>
    )
}
