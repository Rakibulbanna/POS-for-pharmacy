import ReportPage from "@/utility/reportPage";
import React, { useEffect, useState } from "react"
import { BaseAPI, HTTP } from "~/repositories/base"
import HeaderInfo from "../HeaderInfo";



export default function ({ fromDate, toDate }) {
  const [customers, setCustomers] = useState([]);

  const tableHead = ['Customer Id', 'Customer Name', 'Phone Number', 'Email', 'Mem. Type', 'Credit Limit', 'Amount']

  //get data from server
  useEffect(() => {
    let url = `${BaseAPI}/reports/customer-wise-due-collection`;
    if (fromDate) url += '&fromDate=' + fromDate;
    if (toDate) url += '&toDate=' + toDate;

    HTTP.get(url).then(res => {
      console.log(res.data.data);
      setCustomers(() => res.data.data);

    }).catch(err => {
      console.log(err);
    })
  }, [fromDate, toDate])


  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <HeaderInfo title='Customer Wise Due Collcetion Reports' />
        <div style={{ position: 'relative', width: '100%', borderRadius: '5px', padding: '2px', border: '1px solid #8c8c8c', marginTop: '20px', }}>
          <table style={{ width: '100%', fontSize: '12px' }} >
            <thead style={{ backgroundColor: 'black', color: '#EFEFEF', fontSize: '15px' }}  >
              <tr>
                {
                  tableHead?.length > 0 &&
                  tableHead.map((value, index) => <th key={index} style={{ padding: '1px' }}>{value}</th>)
                }
              </tr>
            </thead>
            <tbody>
              {customers.length > 0 && customers.map((value, index) => (
                <tr key={index} style={index % 2 === 0 ? { backgroundColor: "#f1f5f9", textAlign: 'right' } : { backgroundColor: "#e2e8f0", textAlign: 'right' }} >
                  <td style={{ padding: '1px 0', textAlign: "center" }}>{value.customer_id}</td>
                  <td style={{ padding: '1px 0', textAlign: "center" }}>{value.first_name + ' ' + value.last_name}</td>
                  <td style={{ padding: '1px 0', textAlign: "center" }}>{value.phone_number}</td>
                  <td style={{ padding: '1px 0', textAlign: "center" }}>{value.email}</td>

                  <td style={{ padding: '1px 0', textAlign: "center" }}>{value.membership_type?.name}</td>
                  <td style={{ padding: '1px 0' }}>{(value.credit_limit).toFixed(2)}</td>
                  <td style={{ padding: '1px 0' }}>{(value.credit_spend).toFixed(2)}</td>
                </tr>
              ))}

              <tr style={{ fontWeight: 'bold', textAlign: 'right' }}>
                <td colSpan={6} >Grand Total:</td>
                <td >{customers.reduce((prev, curr) => prev + curr.credit_spend, 0)?.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* total salse amount */}
        { }
      </div>
    </>
  )
}
