import ReportPage from "@/utility/reportPage";
import React, { useEffect, useState } from "react"
import { BaseAPI, HTTP } from "~/repositories/base"
import HeaderInfo from "../HeaderInfo";



export default function () {
  const [reOrder, setReOrder] = useState([]);

  //get data from server
  useEffect(() => {
    HTTP.get(`${BaseAPI}/reports/stock/item-wise`).then(res => {
      setReOrder(() => res.data.data.filter(product => product.stock <= product.re_order_quantity));
    }).catch(err => {
      console.log(err);
    })
  }, [])

  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <HeaderInfo title='Re Order Report ' />
        <div style={{ position: 'relative', width: '100%', borderRadius: '5px', padding: '2px', border: '1px solid #8c8c8c', marginTop: '20px', }}>
          <table style={{ width: '100%', fontSize: '12px' }} >
            <thead style={{ backgroundColor: 'black', color: '#EFEFEF', fontSize: '15px' }}  >
              <tr>
                <th style={{ padding: '1px' }}>supplier </th>
                <th style={{ padding: '1px' }}>category</th>
                <th style={{ padding: '1px' }}>Group</th>
                <th style={{ padding: '1px' }}>product name</th>
                <th style={{ padding: '1px' }}>size</th>
                <th style={{ padding: '1px' }}>stock</th>
              </tr>
            </thead>
            <tbody>
              {reOrder.length > 0 && reOrder.map((value, index) => (
                <tr key={index} style={index % 2 === 0 ? { backgroundColor: "#f1f5f9", textAlign: 'right' } : { backgroundColor: "#e2e8f0", textAlign: 'right' }} >
                  <td style={{ padding: '1px 0', textAlign: "center" }}>{value.supplier?.first_name +' '+ value.supplier?.last_name}</td>
                  <td style={{ padding: '1px 0', textAlign: "center" }}>{value.category?.name}</td>
                  <td style={{ padding: '1px 0', textAlign: "center" }}>{value.brand?.name}</td>
                  <td style={{ padding: '1px 0', textAlign: "center" }}>{value.name}</td>
                  <td style={{ padding: '1px 0',textAlign: "center" }}>{value.style_size}</td>
                  <td style={{ padding: '1px 0' }}>{value.stock}</td>
                </tr>
              ))}

              <tr style={{ fontWeight: 'bold', textAlign: 'right' }}>
                <td colSpan={5} >Grand Total:</td>
                <td >{reOrder.reduce((prev, curr) => prev + curr.stock, 0)}</td>
               </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
