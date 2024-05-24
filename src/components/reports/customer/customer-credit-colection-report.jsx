import ReportPage from "@/utility/reportPage";
import React, { useEffect, useState } from "react"
import { BaseAPI, HTTP } from "~/repositories/base"
import HeaderInfo from "../HeaderInfo";



export default function ({ fromDate, toDate, searchType, serchBarcode }) {
  const [customers, setCustomers] = useState([]);

  const tableHead = ['Customer Id', 'Customer Name', 'Phone', 'payment Date', 'Collection Ammount', 'Due Amount', 'Method']

  //get data from server
  useEffect(() => {
    
    let url = `${BaseAPI}/customer_payments?`;
    if (fromDate) url += 'from_date=' + fromDate;
    if (toDate) url += '&to_date=' + toDate;

    if (searchType && serchBarcode) {
     // console.log(searchType,serchBarcode);
      if (searchType == 'customer_id') {
        url+=`&customer_id=${serchBarcode}`
      }
       if (searchType == 'name') {
        url+=`&name=${serchBarcode}`
      }
       if (searchType == 'phone_number') {
        url+=`&phone_number=${serchBarcode}`
      }
    }
   // console.log("url__",url);
    HTTP.get(url).then(res => {
       console.log(res.data);

      setCustomers(() => res.data);

    }).catch(err => {
      console.log(err);
    })
  }, [fromDate, toDate, searchType, serchBarcode])


  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <HeaderInfo title='Customer Credit Collcetion Reports' />
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
                  <td style={{ padding: '1px 0', textAlign: "center" }}>{value?.customer?.first_name} {value?.customer?.last_name}</td>
                  <td style={{ padding: '1px 0', textAlign: "center" }}>{value?.customer?.phone_number}</td>
                  <td style={{ padding: '1px 0', textAlign: "center" }}>{new Date(value?.created_at).toLocaleString()}</td>
                  <td style={{ padding: '1px 0', textAlign: "center" }}>{value?.amount}</td>
                  <td style={{ padding: '1px 0', textAlign: "center" }}>{value?.remaining_amount }</td>
                  <td style={{ padding: '1px 0', textAlign: "center" }}>{getPaymentMethod(value?.pay_method)}</td>


                </tr>
              ))}
              <tr style={{ fontWeight: 'bold', textAlign: 'right' }}>
                <td colSpan={4} >Grand Total:</td>
                <td style={{ textAlign: 'center' }}>{customers.reduce((prev, curr) => prev + curr.amount, 0)?.toFixed(2)}</td>
                <td style={{ textAlign: 'center' }}>{customers.reduce((prev, curr) => prev + curr.remaining_amount, 0)?.toFixed(2)}</td>
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


function getPaymentMethod(method){
  switch (method){
    case 1:
      return "CASH"
    case 2:
      return "CARD"
    case 3:
      return "CHECK"
    default:
      return "Unknown"
  }
}
