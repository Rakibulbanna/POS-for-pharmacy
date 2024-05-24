import HeaderInfo from "../reports/HeaderInfo";

export default function ({ purchaseProductList }) {
    // const [workingDirectReceiveItems, setWorkingDirectReceiveItems] = useAtom(WorkingDirectReceiveItems)
    // const [workingDirectReceiveAdditionalCost, setWorkingDirectReceiveAdditionalCost] = useAtom(WorkingDirectReceiveAdditionalCost)

    // function getTotal(type) {
    //     if (type === "cpu") {
    //         return workingDirectReceiveItems.map(item => item.cpu * item.receive_quantity).reduce((pv, cv) => pv + cv, 0).toFixed(2)
    //     }

    //     if (type === "rpu") {
    //         return workingDirectReceiveItems.map(item => item.rpu * item.receive_quantity).reduce((pv, cv) => pv + cv, 0).toFixed(2)
    //     }

    //     return 0
    // }
    
    return (
        <>
            <HeaderInfo title="Purchase Order" />
            {/* <h3 style={{ textAlign: "center", marginBottom: 0 }}>Company Name: {companyName}</h3>
            <h3 style={{ textAlign: "center", marginTop: 0 }}>Supplier Name: {supplierName}</h3> */}
            {/* <h3 style={{ textAlign: "center", marginTop: 0 }}>Purchase Order Id: {purchaseProductList[0]?.purchase_order_id}</h3> */}
            <h4>Date: {new Date().toLocaleDateString("en-GB")}</h4>
            <div style={{ position: 'relative', width: '100%', borderRadius: '5px', padding: '2px', border: '1px solid #8c8c8c', marginTop: '20px', }}>
                <table style={{ width: '100%', fontSize: '12px' }}>
                    <thead style={{ backgroundColor: 'black', color: '#EFEFEF', fontSize: '15px' }}>
                        <tr>
                            <th style={{ padding: '1px' }}>ID</th>
                            <th style={{ padding: '1px' }}>Barcode</th>
                            <th style={{ padding: '1px' }}>Description</th>
                            <th style={{ padding: '1px' }}>CPU</th>
                            <th style={{ padding: '1px' }}>RPU</th>
                            <th style={{ padding: '1px' }}>Total CPU</th>
                            <th style={{ padding: '1px' }}>Total RPU</th>
                            <th style={{ padding: '1px' }}>Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {purchaseProductList.map((item, index) => (
                            <tr key={item.product_id} style={index % 2 === 0 ? { backgroundColor: "#F5F5F5", textAlign: 'right' } : { backgroundColor: "#E0E0E0", textAlign: 'right' }}>
                                <td style={{ padding: '1px 0', textAlign: "center" }}>{item.id}</td>
                                <td style={{ padding: '1px 0', textAlign: "center" }}>{item.barcode}</td>
                                <td style={{ padding: '1px 0', textAlign: "center" }}>{item.description}</td>
                                <td style={{ padding: '1px 0' }}>{item.cost_price}</td>
                                <td style={{ padding: '1px 0' }}>{item.sell_price}</td>
                                <td style={{ padding: '1px 0' }}>{item.cost_price * item.quantity}</td>
                                <td style={{ padding: '1px 0' }}>{item.sell_price * item.quantity}</td>
                                <td style={{ padding: '1px 0' }}>{item.quantity}</td>
                            </tr>
                        ))}
                        <tr style={{ textAlign: 'right', fontWeight: 'bold', }}>
                            <td colSpan={3} style={{ textAlign: "Center" }}>Grand Total:</td>
                            <td style={{ padding: '1px 0' }}>{purchaseProductList.reduce((prev, curr) => prev + curr.cost_price, 0)}</td>
                            <td style={{ padding: '1px 0' }}>{purchaseProductList.reduce((prev, curr) => prev + curr.sell_price, 0)}</td>
                            <td style={{ padding: '1px 0' }}>{purchaseProductList.reduce((prev, curr) => prev + (curr.cost_price * curr.quantity), 0)}</td>
                            <td style={{ padding: '1px 0' }}>{purchaseProductList.reduce((prev, curr) => prev + (curr.sell_price * curr.quantity), 0)}</td>
                            <td style={{ padding: '1px 0' }}>{purchaseProductList.reduce((prev, curr) => prev + curr.quantity, 0)}</td>
                            {/* <td style={{ padding: '1px 0' }}>{purchaseProductList.reduce((prev, curr) => prev + curr.bonus_quantity, 0)}</td> */}
                            {/* <td style={{ padding: '1px 0' }}>{form_updated_product.map(item => item.wholesale_price).reduce((pv, cv) => pv + cv, 0)}</td>  */}
                        </tr>
                        {/* <tr>
                            <td colSpan={6} style={{ textAlign: "right" }}>Additional Cost:</td>
                            <td style={{textAlign:'right'}}>{''}</td>
                        </tr> */}
                    </tbody>
                </table>
            </div>
        </>
    )
}