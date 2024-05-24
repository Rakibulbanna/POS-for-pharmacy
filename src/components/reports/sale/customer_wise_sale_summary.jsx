import ReportPage from "@/utility/reportPage";
import React, { useEffect, useState } from "react"
import { BaseAPI, HTTP } from "~/repositories/base"
import HeaderInfo from "../HeaderInfo";



export default function ({ fromDate = null, toDate = null, customerID = null, phoneNumber = null }) {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    let url = `${BaseAPI}/reports/sales/customer-wise-summery?`;

    if (fromDate) url += `from_date=${fromDate}&`;
    if (toDate) url += `to_date=${toDate}`;
    if (customerID) url += `&customer_id=${customerID}`
    if (phoneNumber) url += `&phone_number=${phoneNumber}`

    HTTP.get(url).then(res => {
      setCustomers(() => res.data.data);
    }).catch(err => {
      console.log(err)
    })
  }, [fromDate, toDate, customerID, phoneNumber])

  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <HeaderInfo title='Customer Wise Sales Summary ' />
        <div style={{ position: 'relative', width: '100%', borderRadius: '5px', padding: '2px', border: '1px solid #8c8c8c', marginTop: '20px', }}>
          <table style={{ width: '100%', fontSize: '12px' }} >
            <thead style={{ backgroundColor: 'black', color: '#EFEFEF', fontSize: '15px' }}  >
              <tr>
                <th style={{ padding: '1px' }}>Customer Id</th>
                <th style={{ padding: '1px' }}>Customer Name</th>
                <th style={{ padding: '1px' }}>Total</th>
                <th style={{ padding: '1px' }}>Discount Amount</th>
                <th style={{ padding: '1px' }}>Profit</th>
              </tr>
            </thead>
            <tbody>
              {customers.length > 0 && customers.map((value, index) => (
                <tr key={index} style={index % 2 === 0 ? { backgroundColor: "#f1f5f9", textAlign: 'right' } : { backgroundColor: "#e2e8f0", textAlign: 'right' }} >
                  <td style={{ padding: '1px 0', textAlign: "center" }}>{value.customer_id}</td>
                  <td style={{ padding: '1px 0', textAlign: "center" }}>{value.first_name + ' ' + `${value.last_name || ''}`}</td>

                  <td style={{ padding: '1px 0' }}>{(value.total).toFixed(2)}</td>
                  <td style={{ padding: '1px 0' }}>{(value.discount_amount).toFixed(2)}</td>
                  <td style={{ padding: '1px 0' }}>{(value.profit).toFixed(2)}</td>
                </tr>
              ))}

              <tr style={{ fontWeight: 'bold', textAlign: 'right' }}>
                <td colSpan={2} >Grand Total:</td>
                <td >{customers.reduce((prev, curr) => prev + curr.total, 0).toFixed(2)}</td>
                <td >{customers.reduce((prev, curr) => prev + curr.discount_amount, 0).toFixed(2)}</td>
                <td >{customers.reduce((prev, curr) => prev + curr.profit, 0).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
