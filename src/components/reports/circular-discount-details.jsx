import { useEffect, useState } from "react"
import { BaseAPI, HTTP } from "~/repositories/base"
import HeaderInfo from "./HeaderInfo";


export default function ({ fromDate, toDate }) {
    const [flatDiscounts, setFlatDiscounts] = useState([]);

    useEffect(() => {
        let url = `${BaseAPI}/promotions/flat?`;

        if (fromDate) url += `fromDate=${fromDate}&`;
        if (toDate) url += `toDate=${toDate}`;

        HTTP.get(url).then(res => {
            setFlatDiscounts(() => res.data.data)
        }).catch(err => {
            console.log(err);
        })
    }, [fromDate, toDate]);

    // console.log({ flatDiscounts })

    return (
        <>
            <HeaderInfo title={"Flat Discount Details Reports"} />
            {
                flatDiscounts.length > 0 &&
                flatDiscounts.map((po, index) => (
                    <div key={index} style={{ fontFamily: 'Arial' }}>
                        {/* <div style={{display:'flex',justifyContent:'space-between'}}> */}
                        <div style={{ fontSize: '13px', fontWeight: '600' }}>Discount Id: {po.id}</div>
                        <div style={{ fontSize: '13px', }}><span style={{ fontWeight: '600' }}>Discount Name:</span> {po.name}</div>
                        {/* </div> */}
                        <div style={{ fontSize: '13px', display: 'flex', justifyContent: 'space-between' }}>
                            <div><span style={{ fontWeight: '600' }}> Effective Date:</span>{` ${new Date(po.effective_date).toLocaleDateString()}`}</div>
                            <div><span style={{ fontWeight: '600', marginLeft: '10px' }}>Expire Date: </span> {`  ${new Date(po.expiry_date).toLocaleDateString()}`}</div>
                        </div>

                        <div style={{ border: '1px solid #8c8c8c', padding: '0.1rem' }}>
                            <table style={{ width: '100%', fontSize: '12px', textAlign: 'right' }}>
                                <thead style={{ backgroundColor: '#1f2937', color: '#f9fafb', textAlign: 'center' }}>
                                    <tr>
                                        <th style={{ padding: '1px' }}>SL No</th>
                                        <th style={{ padding: '1px', width: '20%' }}>Product Name</th>
                                        <th style={{ padding: '1px' }}>Product Barcode</th>
                                        <th style={{ padding: '1px' }}>QTY</th>
                                        <th style={{ padding: '1px' }}>CPU</th>
                                        <th style={{ padding: '1px' }}>Total CPU</th>
                                        <th style={{ padding: '1px' }}>RPU</th>
                                        <th style={{ padding: '1px' }}>Total RPU</th>
                                    </tr>
                                </thead>
                                <tbody >
                                    {
                                        po.products.map((product, index) =>
                                            <tr key={index} style={index % 2 === 0 ? { backgroundColor: '#f3f4f6' } : { backgroundColor: '#e5e7eb' }}>
                                                <td style={{ padding: '0 1px', width: 'fit content', textAlign: 'center' }}>{index + 1}</td>
                                                <td style={{ padding: '0 1px', width: '20%', textAlign: 'center' }}>{product.product.name}</td>
                                                <td style={{ padding: '0 1px', textAlign: 'center' }}>{product.product.product_barcode}</td>
                                                <td style={{ padding: '0 1px' }}>{product.quantity}</td>
                                                <td style={{ padding: '0 1px' }}>{product.product.cost_price}</td>
                                                <td style={{ padding: '0 1px' }}>{(product.quantity * product.product.cost_price)?.toFixed(2)}</td>
                                                <td style={{ padding: '0 1px' }}>{product.product.MRP_price}</td>
                                                <td style={{ padding: '0 1px' }}>{(product.quantity * product.product.MRP_price)?.toFixed(2)}</td>
                                            </tr>
                                        )}
                                </tbody>
                                <tfoot style={{ fontWeight: '600', textAlign: 'right' }}>
                                    <tr>
                                        <td colSpan="3" >Grand Total:</td>
                                        <td style={{ padding: '0 1px' }}>{po.products.reduce((prev, curr) => prev + curr.quantity, 0)}</td>
                                        <td style={{ padding: '0 1px' }}></td>
                                        <td style={{ padding: '0 1px' }}>{po.products.reduce((prev, curr) => prev + (curr.quantity * curr.product.cost_price), 0)?.toFixed(2)}</td>
                                        <td style={{ padding: '0 1px' }}></td>
                                        <td style={{ padding: '0 1px' }}>{po.products.reduce((prev, curr) => prev + (curr.quantity * curr.product.MRP_price), 0)?.toFixed(2)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                ))}
        </>
    )
}
