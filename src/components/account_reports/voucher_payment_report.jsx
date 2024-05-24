import ReportPage from "@/utility/reportPage";
import moment from "moment";
import React, { useEffect, useState } from "react"
import { BaseAPI, HTTP } from "~/repositories/base"
import HeaderInfo from "../reports/HeaderInfo";
// import HeaderInfo from "../HeaderInfo";

export default function ({fromDate, toDate}) {
  const [vouchers, setVouchers] = useState([]);

  useEffect(() => {
    let url = `${BaseAPI}/account-management/vouchers?`
    if (fromDate) url += `from_date=${fromDate}&`
    if (toDate) url += `to_date=${toDate}`
    
    HTTP.get(url).then(res => {
      // console.log({ res: res.data.data })
      setVouchers(() => res.data.data);

    }).catch(err => {
      console.log(err);
    })
  }, [fromDate, toDate])

  return <>
    <div style={{ textAlign: 'center', }}>
      <HeaderInfo title='Voucher Payment Reports' />
      <div style={{ width:'100%', border: '1px solid #8c8c8c', }}>
        <table style={{ width: '100%', fontSize: '12px', }} >
          <thead style={{ backgroundColor: 'black', color: '#EFEFEF', fontSize: '15px' }}  >
            <tr style={{textAlign:'center'}}>
              <th style={{ padding: '1px' }}>ID</th>
              <th style={{ padding: '1px 0',width:'30%' }}>Acc. Name</th>
              <th style={{ padding: '1px 0' }}>Date</th>
              <th style={{ padding: '1px 0' }}>Payment Type</th>
              <th style={{ padding: '1px 0' }}>Bank Name</th>
              <th style={{ padding: '1px 0' }}>Bank Acc. Num.</th>
              <th style={{ padding: '1px 0' }}>Payment Amount</th>
            </tr>
          </thead>
          <tbody>
            {vouchers.length > 0 && vouchers.map((value, index) => (
              <tr key={index} style={index % 2 === 0 ? { backgroundColor: "#f1f5f9", textAlign: 'right' } : { backgroundColor: "#e2e8f0", textAlign: 'right' }} >
                <td style={{ padding: '1px', textAlign: "center" }}>{value.id}</td>
                <td style={{ padding: '1px 0', textAlign: "center" }}>{value.sub_account?.name}</td>
                <td style={{ padding: '1px 0', textAlign: "center" }}>{moment(value.created_at).format("DD-MM-YYYY")}</td>
                <td style={{ padding: '1px 0', textAlign: "center" }}>{(value.payment_type === 1 && 'Cash') || (value.payment_type === 2 && 'Card') || (value.payment_type === 3 && 'Check')}</td>
                <td style={{ padding: '1px 0', textAlign: "center" }}>{value.bank_name}</td>
                <td style={{ padding: '1px 0', textAlign: "center" }}>{value.account_number}</td>
                <td style={{ padding: '1px 0', textAlign: "right" }}>{value.payment_amount}</td>
              </tr>
            ))}

            <tr style={{ fontWeight: 'bold', textAlign: 'right' }}>
              <td  style={{ padding: '1px 0', textAlign: "right" }} colSpan={6} >Grand Total:</td>
              <td  style={{ padding: '1px 0', textAlign: "right" }} >{vouchers.reduce((prev, curr) => prev + curr.payment_amount, 0).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* total salse amount */}
      { }
    </div>
  </>
}