import ReportPage from "@/utility/reportPage";
import React, { useEffect, useState } from "react"
import { BaseAPI, HTTP } from "~/repositories/base"
import HeaderInfo from "../HeaderInfo";



export default function ({ fromDate = null, toDate = null, customerID = null, phoneNumber = null }) {
  const [customers, setCustomers] = useState([]);
  const [totalCash, setTotalCash] = useState(0);
  const [totalCard, setTotalCard] = useState(0);

  //get data from server
  useEffect(() => {
    let url = `${BaseAPI}/pos-sales?only_customers=true&`;
    if (fromDate) url += `from_date=${fromDate}&`;
    if (toDate) url += `to_date=${toDate}`;
    if (customerID) url += `&customer_id=${customerID}`
    if (phoneNumber) url += `&phone_number=${phoneNumber}`


    HTTP.get(url).then(res => {
      setCustomers(() => res.data.data);
      console.log("dd",res.data.data)
    }).catch(err => {
      console.log(err);
    })
  }, [fromDate, toDate, customerID, phoneNumber])


  const getCardName = (sale) => {

    let payType = [];

    sale.pos_payments.forEach(payment => {
      if (payment.method === 1) payType.push('CASH');
      if (payment.method === 2) payType.push(payment.via);
      if (payment.method === 3) payType.push('POINT/REDEEM');
      if (payment.method === 4) payType.push('EXCHANGE');
      if (payment.method === 5) payType.push('CREDIT');
    })

    return payType.join(', ');

  }

  function getCashAmount(sale) {
    const cashPay = sale.pos_payments.find(payment => payment.method === 1)
    if (!cashPay) return 0

    return cashPay.amount
  }

  function getCardAmount(sale) {
    const cardPay = sale.pos_payments.find(payment => payment.method === 2)
    if (!cardPay) return 0

    return cardPay.amount
  }

  useEffect(() => {
    if (customers.length === 0) return;
    const filterCash = customers.map((customer) => customer.pos_payments.reduce((prev, curr) => prev + curr?.method === 1 ? curr.amount : 0, 0)).reduce((prev, curr) => prev + curr, 0).toFixed(2);
    setTotalCash(() => filterCash);

    const filterCard = customers.map((customer) => customer.pos_payments.reduce((prev, curr) => prev + curr?.method === 2 ? curr.amount : 0, 0)).reduce((prev, curr) => prev + curr, 0).toFixed(2);
    setTotalCard(() => filterCard);

  }, [customers]);

  return (
    <>
      <div>
        <HeaderInfo title={"Customers Wise Sales Details"} />
        <div style={{ border: '1px solid #8c8c8c', width: 'fit-content', margin: 'auto' }}>
          <table style={{ width: 'fit-content', fontSize: '12px', textAlign: 'right' }} >
            <thead style={{ backgroundColor: '#1f2937', color: '#f9fafb', textAlign: 'center' }}>
              <tr>
                <th style={{ padding: '1px' }}>Invoice</th>
                <th style={{ padding: '1px' }}>Customer Name</th>
                <th style={{ padding: '1px' }}>Products</th>
                <th style={{ padding: '1px' }}>Total BarcodePrice</th>
                <th style={{ padding: '1px' }}>Total Disc. Amt</th>
                <th style={{ padding: '1px' }}>VAT</th>
                <th style={{ padding: '1px' }}>Total CPU</th>
                <th style={{ padding: '1px' }}>Total RPU</th>
                <th style={{ padding: '1px' }}>PAY TYPE</th>
                <th style={{ padding: '1px' }}>Cash Amount</th>
                <th style={{ padding: '1px' }}>Card Amount</th>
                <th style={{ padding: '1px' }}>Profit</th>
                <th style={{ padding: '1px' }}>Date</th>
              </tr>
            </thead>
            <tbody >
              {customers.map((customer, index) => (
                <tr key={index} style={index % 2 === 0 ? { backgroundColor: '#f3f4f6', } : { backgroundColor: '#e5e7eb' }}>
                  <td style={{ padding: '0 1px', textAlign: 'center' }}>{customer.id}</td>
                  <td style={{ padding: '0 1px', textAlign: 'center' }}>{customer.customer?.first_name + ' ' + `${customer.customer?.last_name || ''}`}</td>
                  <td style={{ padding: '0 1px', textAlign: 'left' }}>{customer.products.map(p => p.product.name).join(",")}</td>
                  <td style={{ padding: '0 1px' }}>{customer.sub_total}</td>
                  <td style={{ padding: '0 1px' }}>{customer.discount_amount}</td>
                  <td style={{ padding: '0 1px' }}>{customer.vat_amount}</td>
                  <td style={{ padding: '0 1px' }}>{customer.total_cost_price}</td>
                  <td style={{ padding: '0 1px' }}>{customer.total}</td>
                  <td style={{ padding: '0 1px' }}>{getCardName(customer)}</td>
                  <td style={{ padding: '0 1px' }}>{getCashAmount(customer)}</td>
                  <td style={{ padding: '0 1px' }}>{getCardAmount(customer)}</td>
                  <td style={{ padding: '0 1px' }}>{(customer.total - customer.total_cost_price).toFixed(2)}</td>
                  <td style={{ padding: '0 1px' }}>{new Date(customer.created_at).toLocaleDateString('en-gb') +" "+ new Date(customer.created_at).toLocaleTimeString('en-us')}</td>
                </tr>
              ))}

              <tr style={{ fontWeight: '700' }}>
                <td colSpan='6' style={{ padding: '0 1px' }}>Grand Total</td>
                <td style={{ padding: '0 1px' }}>{customers.reduce((pv, cv) => pv + cv.total_cost_price, 0).toFixed(2)}</td>
                <td style={{ padding: '0 1px' }}>{customers.map(customer => customer.total).reduce((pv, cv) => pv + cv, 0).toFixed(2)}</td>
                <td style={{ padding: '0 1px' }}></td>
                <td style={{ padding: '0 1px' }}>{totalCash}</td>
                <td style={{ padding: '0 1px' }}>{totalCard}</td>
                <td style={{ padding: '0 1px' }}>{customers.reduce((pv, cv) => pv + (cv.total - cv.total_cost_price), 0).toFixed(2)}</td>

              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
