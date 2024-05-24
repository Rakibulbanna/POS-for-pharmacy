import ReportPage from "@/utility/reportPage";
import moment from "moment";
import React, { useEffect, useState } from "react"
import { BaseAPI, HTTP } from "~/repositories/base"
import HeaderInfo from "../reports/HeaderInfo";
// import HeaderInfo from "../HeaderInfo";

export default function ({fromDate,toDate}) {

  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    let url = `${BaseAPI}/account-management/accounts?`
    if (fromDate) url += `from_date=${fromDate}&`
    if (toDate) url += `to_date=${toDate}`
    
    HTTP.get(url).then(res => {
      // console.log({ res: res.data.data })
      setAccounts(() => res.data.data);

    }).catch(err => {
      console.log(err);
    })
  }, [fromDate,toDate])

  return <>
    <div style={{ textAlign: 'center', }}>
      <HeaderInfo title='Chart Of Accounts Reports' />
      <div style={{display:'flex',justifyContent:'center' }}>
        <table style={{ minWidth:"50%",maxWidth:'100%', fontSize: '12px',border: '1px solid #8c8c8c',padding:'2px' }} >
          <thead style={{ backgroundColor: 'black', color: '#EFEFEF', fontSize: '15px' }}  >
            <tr>
                <th style={{ padding: '0 5px',width:'5%' }}>ID</th>
                <th style={{ padding: '0 5px' }}>Name</th>
                <th style={{ padding: '0 5px',width:'20%' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {accounts.length > 0 && accounts.map((value, index) => (
              <tr key={index} style={index % 2 === 0 ? { backgroundColor: "#f1f5f9", textAlign: 'right' } : { backgroundColor: "#e2e8f0", textAlign: 'right' }} >
                <td style={{ padding: '0 3px', textAlign: "center" }}>{value.id}</td>
                <td style={{ padding: '0 3px', textAlign: "center" }}>{value.name}</td>
                <td style={{ padding: '0 3px', textAlign: "center" }}>{moment(value.created_at).format("DD-MM-YYYY")}</td>
               
                {/* <td style={{ padding: '1px 0' }}>{value.MRP_price}</td>
                  <td style={{ padding: '1px 0' }}>{(value.cost_price * value.stock).toFixed(2)}</td>
                  <td style={{ padding: '1px 0' }}>{(value.MRP_price * value.stock).toFixed(2)}</td> */}
                {/* <td style={{ padding: '2px 0' }}>{((value.MRP_price * value.stock) - (value.cost_price * value.stock)).toFixed(2)}</td> */}
              </tr>
            ))}

            {/* <tr style={{ fontWeight: 'bold', textAlign: 'right' }}>
              <td colSpan={6} >Grand Total:</td>
              <td >{accounts.reduce((prev, curr) => prev + curr.credit_spend, 0)}</td>

            </tr> */}
          </tbody>
        </table>
      </div>
      {/* total salse amount */}
      { }
    </div>
  </>
}