import { WorkingDirectReceiveAdditionalCost, WorkingDirectReceiveItems } from "@/store/purchase";
import { Table } from "@mantine/core";
import { useAtom } from "jotai";
import HeaderInfo from "../reports/HeaderInfo";

export default function ({ supplierName, companyName }) {
    const [workingDirectReceiveItems, setWorkingDirectReceiveItems] = useAtom(WorkingDirectReceiveItems)
    const [workingDirectReceiveAdditionalCost, setWorkingDirectReceiveAdditionalCost] = useAtom(WorkingDirectReceiveAdditionalCost)

    function getTotal(type) {
        if (type === "cpu") {
            return workingDirectReceiveItems.map(item => item.cpu * item.receive_quantity).reduce((pv, cv) => pv + cv, 0).toFixed(2)
        }

        if (type === "rpu") {
            return workingDirectReceiveItems.map(item => item.rpu * item.receive_quantity).reduce((pv, cv) => pv + cv, 0).toFixed(2)
        }

        return 0
    }
    return (
        <>
            <HeaderInfo title="Purchase Receive" />
            <h3 style={{ textAlign: "center", marginBottom: 0 }}>Company Name: {companyName}</h3>
            <h3 style={{ textAlign: "center", marginTop: 0 }}>Supplier Name: {supplierName}</h3>
            <h4>Date: {new Date().toLocaleDateString("en-GB")}</h4>
            <div style={{ position: 'relative', width: '100%', borderRadius: '5px', padding: '2px', border: '1px solid #8c8c8c', marginTop: '20px', }}>
                <table style={{ width: '100%', fontSize: '12px' }}>
                    <thead style={{ backgroundColor: 'black', color: '#EFEFEF', fontSize: '15px' }}>
                        <tr>
                            <th style={{ padding: '1px' }}>Product ID</th>
                            <th style={{ padding: '1px' }}>Product Name</th>
                            <th style={{ padding: '1px' }}>CPU</th>
                            <th style={{ padding: '1px' }}>RPU</th>
                            <th style={{ padding: '1px' }}>Receive QTY</th>
                            <th style={{ padding: '1px' }}>Bonus QTY</th>
                            <th style={{ padding: '1px' }}>Wholesale Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {workingDirectReceiveItems.map((item, index) => (
                            <tr key={item.product_id} style={index % 2 === 0 ? { backgroundColor: "#F5F5F5", textAlign: 'right' } : { backgroundColor: "#E0E0E0", textAlign: 'right' }}>
                                <td style={{ padding: '1px 0', textAlign: "center" }}>{item.product_id}</td>
                                <td style={{ padding: '1px 0', textAlign: "center" }}>{item.product_name + `${item.style_size ? ', ' + item.style_size : ''}`}</td>
                                <td style={{ padding: '1px 0' }}>{item.cpu}</td>
                                <td style={{ padding: '1px 0' }}>{item.rpu}</td>
                                <td style={{ padding: '1px 0' }}>{item.receive_quantity}</td>
                                <td style={{ padding: '1px 0' }}>{item.bonus_quantity}</td>
                                <td style={{ padding: '1px 0' }}>{item.wholesale_price}</td>
                            </tr>
                        ))}
                        <tr style={{textAlign:'right', fontWeight: 'bold',}}>
                            <td colSpan={2} style={{textAlign: "Center" }}>Grand Total:</td>
                            <td style={{ padding: '1px 0' }}>{getTotal("cpu")}</td>
                            <td style={{ padding: '1px 0' }}>{getTotal("rpu")}</td>
                            <td style={{ padding: '1px 0' }}>{workingDirectReceiveItems.map(item => item.receive_quantity).reduce((pv, cv) => pv + cv, 0)}</td>
                            <td style={{ padding: '1px 0' }}>{workingDirectReceiveItems.map(item => item.bonus_quantity).reduce((pv, cv) => pv + cv, 0)}</td>
                            <td style={{ padding: '1px 0' }}>{workingDirectReceiveItems.map(item => item.wholesale_price).reduce((pv, cv) => pv + cv, 0)}</td>
                        </tr>
                        <tr>
                            <td colSpan={6} style={{ textAlign: "right" }}>Additional Cost:</td>
                            <td style={{textAlign:'right'}}>{workingDirectReceiveAdditionalCost}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    )
}