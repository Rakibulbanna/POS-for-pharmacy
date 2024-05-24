import ReportPage from "@/utility/reportPage";
import React, { useEffect, useState } from "react"
import { BaseAPI, HTTP } from "~/repositories/base"
import HeaderInfo from "../HeaderInfo";



export default function ({ fromDate, toDate, type }) {
    const [customers, setCustomers] = useState([]);
    const [grandTotal, setGrandTotal] = useState({});

    const tableDynamic = type === "price-changes" ? ['CPU', 'Previous MRP', 'Current MRP'] : ['Previous Stock', 'Current Stock'];
    const tableHead = ['Barcode', 'Product Name', 'Supplier Name', ...tableDynamic];

    //get data from server
    useEffect(() => {
        let url = `${BaseAPI}/products/${type}?`;
        if (fromDate) url += 'from_date=' + fromDate;
        if (toDate) url += '&to_date=' + toDate;
        //console.log(fromDate,toDate);
        HTTP.get(url).then(res => {
            console.log(res.data);

            setCustomers(() => res.data);

        }).catch(err => {
            console.log(err);
        })
    }, [fromDate, toDate])


    useEffect(() => {
        if (type === 'price-changes' && customers.length > 0) {
            let grandTotal = { cost_price: 0, old_mrp_price: 0, new_mrp_price: 0 };
            customers?.forEach((customer) => {
                grandTotal.cost_price += customer.product?.cost_price;
                grandTotal.old_mrp_price += customer.old_mrp_price;
                grandTotal.new_mrp_price += customer.new_mrp_price;
            })
            setGrandTotal(grandTotal);
            // console.log({ grandTotal })
        }
        if(type === 'stock-changes' && customers.length > 0) {
            if (customers.length === 0) return;
            let grandTotal = { old_stock: 0, new_stock: 0 };
            customers?.forEach((customer) => {
                grandTotal.old_stock += customer.old_stock;
                grandTotal.new_stock += customer.new_stock;
            });
            setGrandTotal(grandTotal);
            // console.log({ grandTotal })
        }
    }, [customers])

    return (
        <>
            <div style={{ textAlign: 'center' }}>
                <HeaderInfo title={type === "price-changes" ? 'Price Change Reports' : 'Stock Changes Report'} />
                <div style={{ position: 'relative', width: '100%', borderRadius: '5px', padding: '2px', border: '1px solid #8c8c8c', marginTop: '20px' }}>
                    <table style={{ width: '100%', fontSize: '12px' }} >
                        <thead style={{ backgroundColor: 'black', color: '#EFEFEF', fontSize: '15px' }}  >
                            <tr>
                                {
                                    tableHead?.length > 0 &&
                                    tableHead.map((value, index) => <th key={index} style={{ padding: '1px' }}>{value}</th>)
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {customers.length > 0 && customers.map((value, index) => (
                                <tr key={index} style={index % 2 === 0 ? { backgroundColor: "#f1f5f9", textAlign: 'right' } : { backgroundColor: "#e2e8f0", textAlign: 'right' }} >
                                    <td style={{ padding: '1px 0', textAlign: "center" }}>{value?.product?.product_barcode}</td>
                                    <td style={{ padding: '1px 0', textAlign: "center" }}>{value?.product?.name} {value?.customer?.last_name}</td>
                                    <td style={{ padding: '1px 0', textAlign: "center" }}>
                                        {value?.product?.supplier.first_name ? value?.product?.supplier.first_name : ""
                                            + " " + value?.product?.supplier.last_name ? value?.product?.supplier.last_name : ""}</td>

                                    {
                                        type === 'price-changes' ?
                                            <>
                                                <td style={{ padding: '1px 0', textAlign: "center" }}>{value?.product?.cost_price}</td>
                                                <td style={{ padding: '1px 0', textAlign: "center" }}>{value?.old_mrp_price}</td>
                                                <td style={{ padding: '1px 0', textAlign: "center" }}>{value?.new_mrp_price}</td>
                                            </>
                                            :
                                            <>
                                                <td style={{ padding: '1px 0', textAlign: "center" }}>{value?.old_stock}</td>
                                                <td style={{ padding: '1px 0', textAlign: "center" }}>{value?.new_stock}</td>
                                            </>
                                    }
                                </tr>
                            ))}

                            {/* <tr style={{ fontWeight: 'bold', textAlign: 'right' }}>
                                <td colSpan={3} >Grand Total:</td>
                                {
                                    type = "price-changes" &&
                                    <td style={{ textAlign: 'center' }}>{grandTotal?.cost_price?.toFixed(2)}</td>
                                }
                                <td style={{ textAlign: 'center' }}>{type = "price-changes" ? grandTotal?.old_mrp_price?.toFixed(2) : grandTotal?.old_stock?.toFixed(2)}</td>
                                <td style={{ textAlign: 'center' }}>{type = "price-changes" ? grandTotal?.new_mrp_price?.toFixed(2) : grandTotal?.new_stock?.toFixed(2)}</td>
                            </tr> */}

                        </tbody>
                    </table>
                </div>
                {/* total salse amount */}
                { }
            </div>
        </>
    )
}
