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

    return (
        <>
            <HeaderInfo title={"Flat Discount Summary Reports"} />
            <div style={{ border: '1px solid #8c8c8c', padding: '0.1rem', fontFamily: 'Arial' }}>
                <table style={{ fontSize: '12px', width: '100%', textAlign: 'center' }} >
                    <thead>
                        <tr style={{ backgroundColor: '#1f2937', color: '#f9fafb' }}>
                            <th style={{ padding: '1px' }}>Discount Number</th>
                            <th style={{ padding: '1px' }}>Discount Name</th>
                            <th style={{ padding: '1px' }}>Effective Date</th>
                            <th style={{ padding: '1px' }}>Expire Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {flatDiscounts.map((discount, index) => (
                            <tr key={index} style={index % 2 === 0 ? { backgroundColor: '#f3f4f6' } : { backgroundColor: '#e5e7eb' }}>
                                <td style={{ padding: '0 1px' }}>{discount.id}</td>
                                <td style={{ padding: '0 1px' }}>{discount.name}</td>
                                <td style={{ padding: '0 1px' }}>{new Date(discount.effective_date).toLocaleDateString()}</td>
                                <td style={{ padding: '0 1px' }}>{new Date(discount.expiry_date).toLocaleDateString()}</td>
                            </tr>
                        ))}

                    </tbody>
                    {/* <tfoot style={{ fontWeight: '600', textAlign: 'right' }}>
                        <tr>
                            <td colSpan={3} >Grand Total:</td>
                            <td style={{ padding: '0 1px' }}>{purchases.reduce((prev, curr) => prev + curr.quantity, 0)}</td>
                            <td style={{ padding: '0 1px' }}>{purchases.reduce((prev, curr) => prev + curr.product.cost_price, 0)}</td>
                            <td style={{ padding: '0 1px' }}>{purchases.reduce((prev, curr) => prev + curr.product.cost_price * curr.quantity, 0)}</td>
                            <td style={{ padding: '0 1px' }}>{purchases.reduce((prev, curr) => prev + curr.product.MRP_price, 0)}</td>
                            <td style={{ padding: '0 1px' }}>{purchases.reduce((prev, curr) => prev + curr.product.MRP_price * curr.quantity, 0)}</td>
                        </tr>
                    </tfoot> */}
                </table>
            </div>
        </>
    )
}
