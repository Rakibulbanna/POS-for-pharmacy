import HeaderInfo from "../reports/HeaderInfo";

export default function ({ returnableProducts }) {

    return (
        <>
            <HeaderInfo title="Purchase Oder Return" />
            {/* <h3 style={{ textAlign: "center", marginBottom: 0 }}>Company Name: {companyName}</h3>
            <h3 style={{ textAlign: "center", marginTop: 0 }}>Supplier Name: {supplierName}</h3>
            <h4>Date: {new Date().toLocaleDateString("en-GB")}</h4> */}
            <div style={{ position: 'relative', width: '100%', borderRadius: '5px', padding: '2px', border: '1px solid #8c8c8c', marginTop: '20px', }}>
                <table style={{ width: '100%', fontSize: '11px' }}>
                    <thead style={{ backgroundColor: 'black', color: '#EFEFEF', fontSize: '12px' }}>
                        <tr>
                            <th style={{ padding: '1px' }}>BARCODE</th>
                            <th style={{ padding: '1px' }}>DESCRIPTION</th>
                            <th style={{ padding: '1px' }}>Stock</th>
                            <th style={{ padding: '1px'}}>Return Qty</th>
                            <th style={{ padding: '1px' }}>CPU</th>
                            <th style={{ padding: '1px' }}>RPU</th>
                        </tr>
                    </thead>
                    <tbody>
                        {returnableProducts.map((item, index) => (
                            <tr key={item.item_id} style={index % 2 === 0 ? { backgroundColor: "#F5F5F5", textAlign: 'right' } : { backgroundColor: "#E0E0E0", textAlign: 'right' }}>
                                <td style={{ padding: '1px', textAlign: "center" }}>{item.product_barcode}</td>
                                <td style={{ padding: '1px', textAlign: "center" }}>{`${item.name} - ${item?.style_size ? item.style_size : ''} - ${item?.color?.name ? item.color.name : ''}`}</td>
                                <td style={{ padding: '1px' }}>{item.stock}</td>
                                <td style={{ padding: '1px' }}>{item.quantity}</td>
                                <td style={{ padding: '1px' }}>{item.cost_price}</td>
                                <td style={{ padding: '1px' }}>{item.MRP_price}</td>
                            </tr>
                        ))}
                        <tr style={{ textAlign: 'right', fontWeight: 'bold', }}>
                            <td colSpan={2} style={{ textAlign: "center" }}>Grand Total:</td>
                            <td style={{ padding: '1px 0' }}>{returnableProducts.reduce((prev, curr) => prev + curr.stock, 0)}</td>
                            <td style={{ padding: '1px 0' }}>{returnableProducts.reduce((prev, curr) => prev + curr.quantity, 0)}</td>
                            <td style={{ padding: '1px 0' }}>{returnableProducts.reduce((prev, curr) => prev + curr.cost_price, 0)}</td>
                            <td style={{ padding: '1px 0' }}>{returnableProducts.reduce((prev, curr) => prev + curr.MRP_price, 0)}</td>
                        </tr>
                        {/* <tr>
                            <td colSpan={6} style={{ textAlign: "right" }}>Additional Cost:</td>
                            <td style={{ textAlign: 'right' }}>{workingDirectReceiveAdditionalCost}</td>
                        </tr> */}
                    </tbody>
                </table>
            </div>
        </>
    )
}