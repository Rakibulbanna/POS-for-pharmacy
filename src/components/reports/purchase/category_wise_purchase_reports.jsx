import { useState, useEffect } from "react"
import { BaseAPI, HTTP } from "~/repositories/base"
import HeaderInfo from "../HeaderInfo"


export default function ({ fromDate, toDate, isReceived, supplier, supplierList }) {
    const [purchases, setPurchases] = useState([])

    useEffect(() => {
        let url = `${BaseAPI}/reports/purchases/category?`
        if (fromDate) url += `&from_date=${fromDate}`
        if (toDate) url += `&to_date=${toDate}`

        if (supplier) {
            url += `&supplier_id=${supplier}`;
        }

        HTTP.get(url).then(res => {

            let data = res.data;
            
            if (data?.length > 0) {
                data = data.map(category => {
                    const total = { total_quantity: 0, total_cost_price: 0, total_MRP_price: 0 };
                    category.products.forEach(product => {
                        if (product?.purchase_orders) {
                            total.total_quantity += product?.purchase_orders[0].received_quantity;
                            total.total_cost_price += product?.purchase_orders[0].cost_price * product?.purchase_orders[0].received_quantity || 0;
                            total.total_MRP_price += product?.purchase_orders[0].mrp_price * product?.purchase_orders[0].received_quantity || 0;
                        }
                    })

                    return ({ id: category.id, name: category.name, ...total })
                });

            };
            setPurchases(data);
            // setTimeout(()=>{
            //     console.log(purchases);
            // },1000)
        }).catch(err => {
            console.log(err);
        })
    }, [fromDate, toDate, isReceived, supplier])

    return (
        <>
            <HeaderInfo title={'Category wise Purchases received Reports'} />
            {
                supplier && <h4>Suppiler Name: {supplierList.find(i => i.value == supplier)?.label}</h4>
            }
            {isReceived &&
                <div style={{ marginTop: '1px', marginBottom: '2px' }}>
                    {fromDate && <><span style={{ fontWeight: 600 }}>FROM </span><span> {fromDate.toLocaleDateString()} </span></>}
                    {toDate && <><span style={{ fontWeight: 600 }}> TO </span><span> {toDate.toLocaleDateString()}</span></>}
                </div>
            }
            <div style={{ border: '1px solid #8c8c8c', padding: '0.1rem', fontFamily: 'Arial' }}>
                <table style={{ fontSize: '12px', width: '100%', textAlign: 'right' }} >
                    <thead>
                        <tr style={{ backgroundColor: '#1f2937', color: '#f9fafb' }}>
                            <th style={{ padding: '1px 4px', textAlign: 'center' }}>Category Name</th>
                            <th style={{ padding: '1px 4px' }}>Quantity</th>
                            <th style={{ padding: '1px 4px' }}>Total CPU</th>
                            <th style={{ padding: '1px 4px' }}>Total RPU</th>
                        </tr>
                    </thead>
                    <tbody style={{ textAlign: 'right' }}>
                        {purchases.map((purchase, index) => (
                            <tr key={purchase.id} style={index % 2 === 0 ? { backgroundColor: '#f3f4f6' } : { backgroundColor: '#e5e7eb' }}>
                                <td style={{ padding: '0 4px', textAlign: 'center' }}>{purchase?.name}</td>
                                <td style={{ padding: '0 4px' }}>{purchase?.total_quantity?.toFixed(3)}</td>
                                <td style={{ padding: '0 4px' }}>{purchase?.total_cost_price?.toFixed(2)}</td>
                                <td style={{ padding: '0 4px' }}>{purchase?.total_MRP_price?.toFixed(2)}</td>
                            </tr>
                        ))}

                    </tbody>
                    <tfoot style={{ fontWeight: '600', textAlign: 'right' }}>
                        <tr>
                            <td colSpan={1} style={{ textAlign: "center", fontWeight: '500' }}>Grand Total:</td>
                            <td style={{ padding: '0 4px' }}>{purchases.reduce((prev, curr) => prev + curr?.total_quantity, 0).toFixed(3)}</td>
                            <td style={{ padding: '0 4px' }}>{purchases.reduce((prev, curr) => prev + curr?.total_cost_price, 0).toFixed(2)}</td>
                            <td style={{ padding: '0 4px' }}>{purchases.reduce((prev, curr) => prev + curr?.total_MRP_price, 0).toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </>
    )
}
