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
    HTTP.get(url).then(res => {
      setPurchases(res.data.data);
    }).catch(err => {
      console.log(err);
    })
  }, [fromDate, toDate, supplier]);

  return (
    <>
      <HeaderInfo title={"Purchase Order Return Details Reports"} />

      <div style={{ marginTop: '1px', marginBottom: '2px' }}>
        {fromDate && <><span style={{ fontWeight: 600 }}>FROM </span><span> {fromDate.toLocaleDateString()} </span></>}
        {toDate && <><span style={{ fontWeight: 600 }}> TO </span><span> {toDate.toLocaleDateString()}</span></>}
      </div>
      {
        purchases.length > 0 ?
          purchases.map((po, index) => (
            <div key={index} style={{ fontFamily: 'Arial' }}>
              <div style={{ fontSize: '13px', marginTop: '5px' }}>Purchase Return Id : {po.id}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <div>Supplier Name : {po.supplier.first_name + ' ' + po.supplier.last_name}</div>
                <div>Phone Number : +88{po.supplier.phone_number}</div>
              </div>

              <div style={{ border: '1px solid #8c8c8c', padding: '0.1rem' }}>
                <table key={po.id} style={{ width: '100%', fontSize: '12px', textAlign: 'right' }}>
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
                  <tbody >

                    <tr style={{ backgroundColor: '#e5e7eb' }}>
                      <td style={{ padding: '0 1px', width: '20%', textAlign: 'center' }}>{po.product?.name + `${po.product?.style_size ? ', ' + po.product.style_size : ''}`}</td>
                      <td style={{ padding: '0 1px', textAlign: 'center' }}>{po.product.product_barcode}</td>
                      <td style={{ padding: '0 1px' }}>{po.quantity}</td>
                      <td style={{ padding: '0 1px' }}>{po.product.cost_price}</td>
                      <td style={{ padding: '0 1px' }}>{(po.quantity * po.product.cost_price)?.toFixed(2)}</td>
                      <td style={{ padding: '0 1px' }}>{po.product.MRP_price}</td>
                      <td style={{ padding: '0 1px' }}>{(po.quantity * po.product.MRP_price)?.toFixed(2)}</td>
                    </tr>

                  </tbody>
                  {/* <tfoot style={{ fontWeight: '600' }}>
                  <tr>
                    <td colSpan="2" style={{ textAlign: 'center' }} >Grand Total:</td>
                    <td style={{ padding: '0 1px' }}>{total[index]?.quantity}</td>
                    <td style={{ padding: '0 1px' }}></td>
                    <td style={{ padding: '0 1px' }}>{total[index]?.product.cost_price}</td>
                    <td style={{ padding: '0 1px' }}></td>
                    <td style={{ padding: '0 1px' }}>{total[index]?.product.MRP_price}</td>
                  </tr>
                </tfoot> */}
                </table>
              </div>
            </div>
          ))
          :
          <div style={{ fontFamily: 'Arial' }}>
            <div style={{ fontSize: '13px', marginTop: '5px' }}>Purchase Return Id : </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <div>Supplier Name : </div>
              <div>Phone Number : +88</div>
            </div>

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
                <tbody >
                  <tr style={{ backgroundColor: '#e5e7eb' }}>
                    <td style={{ padding: '0 1px', width: '20%', textAlign: 'center' }}></td>
                    <td style={{ padding: '0 1px', textAlign: 'center' }}>00000</td>
                    <td style={{ padding: '0 1px' }}>{0}</td>
                    <td style={{ padding: '0 1px' }}>0</td>
                    <td style={{ padding: '0 1px' }}>0</td>
                    <td style={{ padding: '0 1px' }}>0</td>
                    <td style={{ padding: '0 1px' }}>0</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
      }
    </>
  )
}
