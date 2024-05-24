import ReportPage from "@/utility/reportPage";
import moment from "moment";
import React, { useEffect, useState } from "react"
import { BaseAPI, HTTP } from "~/repositories/base"
import HeaderInfo from "../reports/HeaderInfo";
// import HeaderInfo from "../HeaderInfo";

export default function ({fromDate, toDate,scanSupplierType,scanSupplierValue}) {

  const [supplierPayments, setSupplierPayments] = useState([]);

  useEffect(() => {
    
    let url = `${BaseAPI}/account-management/supplier_payments?`
    if (scanSupplierType) url += `type=${scanSupplierType}&`
    if (scanSupplierValue) url += `value=${scanSupplierValue}&`
    if (fromDate) url += `from_date=${fromDate}&`
    if (toDate) url += `to_date=${toDate}`
    
    HTTP.get(url).then(res => {
      // console.log({ res: res.data.data })
      setSupplierPayments(() => res.data.data);

    }).catch(err => {
      console.log(err);
    })
  }, [fromDate, toDate,scanSupplierType,scanSupplierValue])

  return <>
    <div style={{ textAlign: 'center', }}>
      <HeaderInfo title='Supplier Payments Reports' />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <table style={{ width: '100%', fontSize: '12px', border: '1px solid #8c8c8c', padding: '2px' }} >
          <thead style={{ backgroundColor: 'black', color: '#EFEFEF', fontSize: '15px' }}  >
            <tr>
              <th style={{ padding: '1px' }}>ID</th>
              <th style={{ padding: '1px' }}>Supplier Name</th>
              <th style={{ padding: '1px' }}>Date</th>
              <th style={{ padding: '1px' }}>Payment Type</th>
              <th style={{ padding: '1px' }}>Bank Name</th>
              <th style={{ padding: '1px' }}>Account Number</th>
              <th style={{ padding: '1px' }}>Payment Amount</th>
            </tr>
          </thead>
          <tbody>
            {supplierPayments.length > 0 && supplierPayments.map((value, index) => (
              <tr key={index} style={index % 2 === 0 ? { backgroundColor: "#f1f5f9", textAlign: 'right' } : { backgroundColor: "#e2e8f0", textAlign: 'right' }} >
                <td style={{ padding: '1px 0', textAlign: "center" }}>{value.id}</td>
                <td style={{ padding: '1px 0', textAlign: "center" }}>{value.supplier?.first_name + ' ' + value.supplier?.last_name}</td>
                <td style={{ padding: '1px 0', textAlign: "center" }}>{moment(value.created_at).format("DD-MM-YYYY")}</td>
                <td style={{ padding: '1px 0', textAlign: "center" }}>{(value.payment_type === 1 && 'Cash') || (value.payment_type === 2 && 'Card') || (value.payment_type === 3 && 'Check')}</td>
                <td style={{ padding: '1px 0', textAlign: "center" }}>{value.bank_name}</td>
                <td style={{ padding: '1px 0', textAlign: "center" }}>{value.account_number}</td>
                <td style={{ padding: '1px 0', textAlign: "right" }}>{value.payment_amount}</td>

                {/* <td style={{ padding: '1px 0' }}>{value.MRP_price}</td>
                  <td style={{ padding: '1px 0' }}>{(value.cost_price * value.stock).toFixed(2)}</td>
                  <td style={{ padding: '1px 0' }}>{(value.MRP_price * value.stock).toFixed(2)}</td> */}
                {/* <td style={{ padding: '2px 0' }}>{((value.MRP_price * value.stock) - (value.cost_price * value.stock)).toFixed(2)}</td> */}
              </tr>
            ))}

            <tr style={{ fontWeight: 'bold', textAlign: 'right' }}>
              <td colSpan={6} >Grand Total:</td>
              <td >{supplierPayments.reduce((prev, curr) => prev + curr.payment_amount, 0).toFixed(2)}</td>

            </tr>
          </tbody>
        </table>
      </div>
      {/* total salse amount */}
      { }
    </div>
  </>
}