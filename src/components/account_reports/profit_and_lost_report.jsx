import ReportPage from "@/utility/reportPage";
import moment from "moment";
import React, { useEffect, useState } from "react"
import { BaseAPI, HTTP } from "~/repositories/base"
import HeaderInfo from "../reports/HeaderInfo";


export default function ({ barcode, fromDate, toDate }) {
  const [voucherPayments, setVoucherPayments] = useState([]);
  const [supplierPayments, setSupplierPayments] = useState([]);
  const [sales, setSales] = useState([]);
  const [totalSaleProfit, setTotalSaleProfit] = useState(0);
  const [totalSaleLost, setTotalSaleLost] = useState(0);
  const [damageAndLostProducts, setDamageAndLostProducts] = useState([]);
  const [profit, setProfit] = useState(0)
  const [lost, setLost] = useState(0)
  //voucher payments
  useEffect(() => {

    let url = `${BaseAPI}/account-management/vouchers?`

    if (fromDate) url += `from_date=${fromDate}&`
    if (toDate) url += `to_date=${toDate}`

    HTTP.get(url).then(res => {
      // console.log({ res: res.data.data })

      setVoucherPayments(() => res.data.data.length > 0 ? res.data.data.reduce((prev, curr) => prev + curr.payment_amount, 0) : []);

    }).catch(err => {
      console.log(err);
    })
  }, [])

  //supplier payments
  useEffect(() => {

    let url = `${BaseAPI}/account-management/supplier_payments?`

    if (fromDate) url += `from_date=${fromDate}&`
    if (toDate) url += `to_date=${toDate}`

    HTTP.get(url).then(res => {
      // console.log({ res: res.data.data })
      setSupplierPayments(() => res.data.data.length > 0 ? res.data.data.reduce((prev, curr) => prev + curr.payment_amount, 0) : []);

    }).catch(err => {
      console.log(err);
    })
  }, [])

  //items wise sales summery
  useEffect(() => {
    let url = `${BaseAPI}/reports/item-wise-sale-summery?`
    // if(barcode)  url+= `barcode=${barcode}&`
    if (fromDate) url += `from_date=${fromDate}&`
    if (toDate) url += `to_date=${toDate}`

    HTTP.get(url).then(res => {
      setSales(res.data.data);
      if (res.data.data.length > 0) {
        const filterProfit = res.data.data.map((value) => (value.sale_amount - value.total_cpu) > 0 ? value.sale_amount - value.total_cpu : 0).reduce((prev, curr) => prev + curr, 0).toFixed(2)
        const filterLost = res.data.data.map((value) => (value.sale_amount - value.total_cpu) < 0 ? value.total_cpu - value.sale_amount : 0).reduce((prev, curr) => prev + curr, 0).toFixed(2)

        setTotalSaleProfit(() => Number(filterProfit));
        setTotalSaleLost(() => Number(filterLost));
      }
      else {
        setTotalSaleProfit(() => 0);
        setTotalSaleLost(() => 0);
      }
    }).catch(err => {
      console.log(err);
    })
  }, [fromDate, toDate, barcode]);

  // damage and lost 
  useEffect(() => {
    let url = `${BaseAPI}/reports/damage-and-lost?`
    if (fromDate) url += `from_date=${fromDate}`
    if (toDate) url += `&to_date=${toDate}`

    HTTP.get(url).then(res => {
      setDamageAndLostProducts(() => res.data.data)
    }).catch(err => {
      console.log(err);
    })
  }, [fromDate, toDate]);

  //grand profit lost
  useEffect(() => {
    const damageAndLost = damageAndLostProducts.reduce((prev, curr) => prev + (curr.quantity * curr.product?.cost_price), 0);

    const total = totalSaleProfit - (voucherPayments + supplierPayments + totalSaleLost + damageAndLost);
    if (total >= 0) setProfit(() => total.toFixed(2));
    if (total < 0) setLost(() => total.toFixed(2));

  }, [voucherPayments, supplierPayments, totalSaleProfit, totalSaleLost, damageAndLostProducts])

  // console.log({ voucherPayments, supplierPayments, totalSaleProfit, totalSaleLost })



  return <>
    <div style={{ textAlign: 'center' }}>
      <HeaderInfo title='Profit & Loss Report' fromDate={fromDate} toDate={toDate} />
      {/* <div>FROM {moment(fromDate).format('DD-MM-YYYY')} TO {moment(toDate).format('DD-MM-YYYY')}</div> */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <table style={{ width: '100%', fontSize: '12px', border: '1px solid #8c8c8c', padding: '2px' }} >
          <thead style={{ backgroundColor: 'black', color: '#EFEFEF', fontSize: '15px' }}  >
            <tr>
              {/* <th style={{ padding: '1px' }}>Product Name</th>
              <th style={{ padding: '1px' }}>Product Barcode</th>
              <th style={{ padding: '1px' }}>Date</th>
              <th style={{ padding: '1px' }}>Quantity</th>
              <th style={{ padding: '1px' }}>Total CPU</th>
              <th style={{ padding: '1px' }}>Total RPU</th>
              <th style={{ padding: '1px' }}>Sale Amount</th>
              <th style={{ padding: '1px' }}>Profit</th>
              <th style={{ padding: '1px' }}>Lost</th> */}
              {/* <th style={{ padding: '1px' }}>Type</th> */}
              <th style={{ padding: '1px' }}>Quantity</th>
              <th style={{ padding: '1px' }}>Total CPU</th>
              <th style={{ padding: '1px' }}>Total RPU</th>
              <th style={{ padding: '1px' }}>Sale Amount</th>
              <th style={{ padding: '1px' }}>Profit</th>
              <th style={{ padding: '1px' }}>Loss</th>

            </tr>
          </thead>
          <tbody>
            {/* {sales.length > 0 && sales.map((value, index) => ( */}
            {/* <tr key={index} style={index % 2 === 0 ? { backgroundColor: "#f1f5f9", textAlign: 'right' } : { backgroundColor: "#e2e8f0", textAlign: 'right' }} > */}
            <tr style={{ fontSize: '14px', fontWeight: '500' }}>
              <td colSpan={7}>Sales:</td>
            </tr>
            <tr style={{ backgroundColor: "#e2e8f0", textAlign: 'right' }} >
              {/* <td style={{ textAlign: "center" }}>Sales</td> */}
              <td style={{}}>{sales.reduce((prev, curr) => prev + curr.sqty, 0)}</td>
              <td style={{}}>{sales.reduce((prev, curr) => prev + curr.total_cpu, 0).toFixed(2)}</td>
              <td style={{}}>{sales.reduce((prev, curr) => prev + curr.total_rpu, 0).toFixed(2)}</td>
              <td style={{}}>{sales.reduce((prev, curr) => prev + curr.sale_amount, 0).toFixed(2)}</td>
              <td style={{}}>{totalSaleProfit >= totalSaleLost && totalSaleProfit - totalSaleLost}</td>
              <td style={{}}>{totalSaleProfit < totalSaleLost && totalSaleLost - totalSaleProfit}</td>

              {/* <td style={{ padding: '1px 0', textAlign: "center", maxWidth: '150px' }}>{value.product_name}</td>
                <td style={{ padding: '1px 0', textAlign: "center" }}>{value.product_barcode}</td>
                <td style={{ padding: '1px 0', textAlign: "center" }}>{moment(value.created_at).format("DD-MM-YYYY")}</td>
                <td style={{ padding: '1px 0', textAlign: "center" }}>{value.sqty}</td>
                <td style={{ padding: '1px 0', textAlign: "center" }}>{value.total_cpu}</td>
                <td style={{ padding: '1px 0', textAlign: "center" }}>{value.total_rpu}</td>
                <td style={{ padding: '1px 0', textAlign: "right" }}>{value.sale_amount}</td>
                <td style={{ padding: '1px 0', textAlign: "right" }}>{value.sale_amount - value.total_cpu >= 0 && value.sale_amount - value.total_cpu}</td>
                <td style={{ padding: '1px 0', textAlign: "right" }}>{value.sale_amount - value.total_cpu <= 0 && value.sale_amount - value.total_cpu}</td> */}

              {/* <td style={{ padding: '1px 0' }}>{value.MRP_price}</td>
                  <td style={{ padding: '1px 0' }}>{(value.cost_price * value.stock).toFixed(2)}</td>
                  <td style={{ padding: '1px 0' }}>{(value.MRP_price * value.stock).toFixed(2)}</td> */}
              {/* <td style={{ padding: '2px 0' }}>{((value.MRP_price * value.stock) - (value.cost_price * value.stock)).toFixed(2)}</td> */}
            </tr>
            {/* ))} */}
            <tr style={{ fontSize: '14px', fontWeight: '500' }}>
              <td colSpan={7}>Damage And Lost:</td>
            </tr>

            <tr style={{ backgroundColor: "#e2e8f0", textAlign: 'right' }}>
              <td>{damageAndLostProducts.reduce((prev, curr) => prev + curr.quantity, 0)}</td>
              <td>{damageAndLostProducts.reduce((prev, curr) => prev + (curr.quantity * curr.product?.cost_price), 0)}</td>
              <td>{damageAndLostProducts.reduce((prev, curr) => prev + (curr.quantity * curr.product?.MRP_price), 0)}</td>
              <td></td>
              <td></td>
              <td>{damageAndLostProducts.reduce((prev, curr) => prev + (curr.quantity * curr.product?.cost_price), 0)}</td>
            </tr>

            <tr style={{ fontWeight: '500', fontSize: '15px' }}>
              <td colSpan={3}>{`Expense (Voucher Payments):`}</td>
              <td style={{ fontWeight: '600', textAlign: 'center', backgroundColor: 'black', color: '#EFEFEF' }}> Payment Amount</td>
              <td colSpan={2}></td>
            </tr>

            <tr style={{ backgroundColor: "#e2e8f0", textAlign: 'right' }}>
              <td></td>
              <td></td>
              <td></td>
              <td>{voucherPayments}</td>
              <td></td>
              <td>{voucherPayments}</td>
            </tr>

            {/* <tr style={{ fontWeight: '500', fontSize: '15px' }}>
              <td colSpan={6}>Supplier Payments:</td>
              
            </tr>

            <tr style={{ backgroundColor: "#e2e8f0", textAlign: 'right' }}>
              <td></td>
              <td></td>
              <td></td>
              <td>{supplierPayments}</td>
              <td></td>
              <td>{supplierPayments}</td>
            </tr> */}

            <tr style={{ fontWeight: 'bold', textAlign: 'right' }}>
              <td colSpan={4} >Grand Total:</td>
              <td >{profit}</td>
              <td >{lost}</td>

              {/* <td style={{ textAlign: 'center' }} >{sales.reduce((prev, curr) => prev + curr.sqty, 0)}</td>
              <td >{sales.reduce((prev, curr) => prev + curr.total_cpu, 0).toFixed(2)}</td>
              <td >{sales.reduce((prev, curr) => prev + curr.total_rpu, 0).toFixed(2)}</td>
              <td >{sales.reduce((prev, curr) => prev + curr.total_rpu, 0).toFixed(2)}</td>
              <td >{sales.reduce((prev, curr) => prev + curr.sale_amount, 0).toFixed(2)}</td>
              <td >{totalSaleProfit}</td>
              <td >{totalSaleLost}</td> */}

            </tr>
          </tbody>
        </table>
      </div>

      {/* total salse amount */}
      {/* <div style={{ paddingTop: '50px', fontWeight: 'bold', maxWidth: '50%', margin: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Total Profit: </span> {totalSaleProfit}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Total Lost:</span> {totalSaleLost}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid black' }}>
          {
            totalSaleProfit - totalSaleLost >= 0 && <><span style={{ marginRight: '20px' }}>Overall Profit:</span>{(totalSaleProfit - totalSaleLost).toFixed(2)}</>
          }
          {
            totalSaleProfit - totalSaleLost < 0 && <><span style={{ marginRight: '20px' }}>Overall Lost:</span>{(totalSaleProfit - totalSaleLost).toFixed(2)}</>
          }
        </div>
      </div> */}
    </div>
  </>
}