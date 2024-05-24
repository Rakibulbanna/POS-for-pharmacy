import moment from "moment"
import { useState, useEffect } from "react"
import { BaseAPI, HTTP } from "~/repositories/base"
import HeaderInfo from "../HeaderInfo"


export default function ({ fromDate, toDate, isReceived, supplier, category }) {
    const [purchases, setPurchases] = useState([])

    useEffect(() => {
        let url = `${BaseAPI}/purchase_order?`
        if (supplier) {
            url += `supplier_id=${supplier}`
        }
        if (category) {
            url += `&category_id=${category}`
        }
        url += `&is_received=${isReceived}`

        if (fromDate) url += `&from_date=${fromDate}`;
        if (toDate) url += `&to_date=${toDate}`;
        // console.log(url);
        HTTP.get(url).then(res => {

            setPurchases(res.data.data)
            // setTimeout(()=>{
            //     console.log(purchases);
            // },1000)
        }).catch(err => {
            console.log(err);
        })
    }, [fromDate, toDate, isReceived, supplier, category])


    const getTotalCost = (id) => {
        const purchase = purchases.find(pur => pur.id === id)

        let cost = 0
        purchase.products.map(product => {
            const quantity = isReceived ? product.received_quantity : product.quantity;
            cost += product.cost_price * quantity;
        })

        cost += purchase.additional_cost - purchase.discount

        return cost

    }

    const getGrandTotalCost = () => {
        let costTotal = 0

        purchases.map(purchase => {
            purchase.products.map(product => {
                const quantity = isReceived ? product.received_quantity : product.quantity;
                costTotal += product.cost_price * quantity
            })

			costTotal += purchase.additional_cost - purchase.discount

        })

        return costTotal
    }

    const getTotalValue = (id) => {
        const purchase = purchases.find(pur => pur.id === id)

        let value = 0
        purchase.products.map(product => {
            const quantity = isReceived ? product.received_quantity : product.quantity;
            value += product.mrp_price * quantity
        })
        return value
    }

    const getGrandTotalValue = () => {
        let grandTotalValue = 0

        purchases.map(purchase => {
            purchase.products.map(product => {
                const quantity = isReceived ? product.received_quantity : product.quantity;
                grandTotalValue += product.mrp_price * quantity;
            })
        })

        return grandTotalValue
    }

    // console.log({ isReceived, purchases })

    return (
        <>
            <HeaderInfo title={isReceived ? 'Purchase Received Summary Reports' : 'Purchase order Summary Reports'} />
            {isReceived &&
                <div style={{ marginTop: '1px', marginBottom: '2px' }}>
                    {fromDate && <><span style={{ fontWeight: 600 }}>FROM </span><span> {fromDate.toLocaleDateString()} </span></>}
                    {toDate && <><span style={{ fontWeight: 600 }}> TO </span><span> {toDate.toLocaleDateString()}</span></>}
                </div>
            }
            <div style={{ border: '1px solid #8c8c8c', padding: '0.1rem', fontFamily: 'Arial' }}>
                <table style={{ fontSize: '12px', width: '100%', textAlign: 'center' }} >
                    <thead>
                        <tr style={{ backgroundColor: '#1f2937', color: '#f9fafb' }}>
                            <th style={{ padding: '1px' }}>Chalan No.</th>
                            <th style={{ padding: '1px' }}>Supplier Name</th>
                            <th style={{ padding: '1px' }}>Order date</th>
                            <th style={{ padding: '1px' }}>Received Date</th>
                            <th style={{ padding: '1px' }}>{isReceived ? 'Receive Quantity' : 'Quantity'}</th>
							<th style={{ padding: '1px' }}>Discount</th>
                            <th style={{ padding: '1px' }}>Total Cost</th>
                            <th style={{ padding: '1px' }}>Total Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {purchases.map((purchase, index) => (
                            <tr key={purchase.id} style={index % 2 === 0 ? { backgroundColor: '#f3f4f6' } : { backgroundColor: '#e5e7eb' }}>

                                <td style={{ padding: '0 1px' }}>{purchase.id}</td>
                                <td style={{ padding: '0 1px' }}>{purchase.supplier.first_name + " " + `${purchase.supplier.last_name ? purchase.supplier.last_name : ''}`}</td>
                                <td style={{ padding: '0 1px' }}>{moment(purchase.created_at).format('DD-MM-YYYY')}</td>
                                <td style={{ padding: '0 1px' }}>{moment(purchase.received_date).format('DD-MM-YYYY')}</td>
                                <td style={{ padding: '0 1px', textAlign: 'right' }}>{purchase.products.map(p => isReceived ? p.received_quantity : p.quantity).reduce((prev, curr) => prev + curr, 0)}</td>
								<td style={{ padding: '0 1px', textAlign: 'right' }}>{purchase.discount}</td>
								<td style={{ padding: '0 1px', textAlign: 'right' }}>{getTotalCost(purchase.id).toFixed(2)}</td>
                                <td style={{ padding: '0 1px', textAlign: 'right' }}>{getTotalValue(purchase.id).toFixed(2)}</td>
                            </tr>
                        ))}

                    </tbody>
                    <tfoot style={{ fontWeight: '600' }}>
                        <tr>
                            <td colSpan={3} style={{ textAlign: "center", fontWeight: '500' }}>Grand Total:</td>
                            <td style={{ padding: '0 1px', textAlign: 'right' }}>{purchases.map(pur => pur.products).flat().map(p => isReceived ? p.received_quantity : p.quantity).reduce((p, v) => p + v, 0)}</td>
							<td style={{ padding: '0 1px', textAlign: 'right' }}>{purchases.reduce((pv, cv) => pv + cv.discount,0)}</td>
							<td style={{ padding: '0 1px', textAlign: 'right' }}>{getGrandTotalCost().toFixed(2)}</td>
                            <td style={{ padding: '0 1px', textAlign: 'right' }}>{getGrandTotalValue().toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </>
    )
}
