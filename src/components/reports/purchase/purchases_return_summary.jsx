import moment from "moment"
import { useState, useEffect } from "react"
import { BaseAPI, HTTP } from "~/repositories/base"
import HeaderInfo from "../HeaderInfo"


export default function ({ fromDate, toDate, supplier }) {
  const [purchases, setPurchases] = useState([])

  useEffect(() => {

    let url = `${BaseAPI}/reports/purchases/return-summery?`;
    if (fromDate) url += `&from_date=${fromDate}`;
    if (toDate) url += `&to_date=${toDate}`;
    if (supplier) {
      url += `&supplier_id=${supplier}`;
    }
    // console.log(url);
    HTTP.get(url).then(res => {
      setPurchases(res.data.data);
    }).catch(err => {
      console.log(err);
    })
  }, [fromDate, toDate, supplier]);

  return (
    <>
      <HeaderInfo title={"Purchase Order Return Summary Reports"} />

      <div style={{ marginTop: '1px', marginBottom: '2px' }}>
        {fromDate && <><span style={{ fontWeight: 600 }}>FROM </span><span> {fromDate.toLocaleDateString()} </span></>}
        {toDate && <><span style={{ fontWeight: 600 }}> TO </span><span> {toDate.toLocaleDateString()}</span></>}
      </div>

      <div style={{ border: '1px solid #8c8c8c', padding: '0.1rem', fontFamily: 'Arial' }}>
        <table style={{ fontSize: '12px', width: '100%', textAlign: 'center' }} >
          <thead>
            <tr style={{ backgroundColor: '#1f2937', color: '#f9fafb' }}>
              <th style={{ padding: '1px' }}>Chalan No.</th>
              <th style={{ padding: '1px' }}>Supplier Name</th>
              <th style={{ padding: '1px' }}>Date</th>
              <th style={{ padding: '1px' }}>Quantity</th>
              <th style={{ padding: '1px' }}>CPU</th>
              <th style={{ padding: '1px' }}>Total CPU</th>
              <th style={{ padding: '1px' }}>RPU</th>
              <th style={{ padding: '1px' }}>Total RPU</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((purchase, index) => (
              <tr key={purchase.id} style={index % 2 === 0 ? { backgroundColor: '#f3f4f6' } : { backgroundColor: '#e5e7eb' }}>
                <td style={{ padding: '0 1px' }}>{purchase.id}</td>
                <td style={{ padding: '0 1px' }}>{purchase.supplier.first_name + " " + purchase.supplier.last_name}</td>
                <td style={{ padding: '0 1px' }}>{moment(purchase.created_at).format('DD-MM-YYYY')}</td>
                <td style={{ padding: '0 1px', textAlign: 'right' }}>{purchase.quantity}</td>
                <td style={{ padding: '0 1px', textAlign: 'right' }}>{purchase.product.cost_price}</td>
                <td style={{ padding: '0 1px', textAlign: 'right' }}>{(purchase.product.cost_price * purchase.quantity)?.toFixed(2)}</td>
                <td style={{ padding: '0 1px', textAlign: 'right' }}>{purchase.product.MRP_price}</td>
                <td style={{ padding: '0 1px', textAlign: 'right' }}>{(purchase.product.MRP_price * purchase.quantity)?.toFixed(2)}</td>
              </tr>
            ))}

          </tbody>
          <tfoot style={{ fontWeight: '600', textAlign: 'right' }}>
            <tr>
              <td colSpan={3} >Grand Total:</td>
              <td style={{ padding: '0 1px' }}>{purchases.reduce((prev, curr) => prev + curr.quantity, 0)}</td>
              <td style={{ padding: '0 1px' }}>{purchases.reduce((prev, curr) => prev + curr.product.cost_price, 0)?.toFixed(2)}</td>
              <td style={{ padding: '0 1px' }}>{purchases.reduce((prev, curr) => prev + curr.product.cost_price * curr.quantity, 0)?.toFixed(2)}</td>
              <td style={{ padding: '0 1px' }}>{purchases.reduce((prev, curr) => prev + curr.product.MRP_price, 0)?.toFixed(2)}</td>
              <td style={{ padding: '0 1px' }}>{purchases.reduce((prev, curr) => prev + curr.product.MRP_price * curr.quantity, 0)?.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  )
}
