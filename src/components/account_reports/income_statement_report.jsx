import ReportPage from "@/utility/reportPage";
import moment from "moment";
import React, { useEffect, useState } from "react"
import { BaseAPI, HTTP } from "~/repositories/base"
import HeaderInfo from "../reports/HeaderInfo";
import { Table } from "@mantine/core";
import { HTTPCall } from "~/lib/http";


export default function ({ barcode, fromDate, toDate }) {
  const [voucherPayments, setVoucherPayments] = useState([]);
  const [supplierPayments, setSupplierPayments] = useState([]);
  const [sales, setSales] = useState([]);
  const [totalSaleProfit, setTotalSaleProfit] = useState(0);
  const [totalSaleLost, setTotalSaleLost] = useState(0);
  const [damageAndLostProducts, setDamageAndLostProducts] = useState([]);
  const [profit, setProfit] = useState(0)
  const [lost, setLost] = useState(0)
  const [accounts, setAccounts] = useState([])
  const [totalSaleWithoutCredit, setTotalSaleWithoutCredit] = useState(0)
  const [totalCOGS, setTotalCOGS] = useState(0)
  const [totalCreditSale, setTotalCreditSale] = useState(0)
  const [totalDamageAndLost, setTotalDamageAndLost] = useState(0)
  const [totalExchangeAmount, setTotalExchangeAmount] = useState(0)
  const [totalReturnAmount, setTotalReturnAmount] = useState(0)

  const urlHandlers = (path) => {
    let url = `${path}?`
    if (fromDate) url += `from_date=${fromDate}&`
    if (toDate) url += `to_date=${toDate}`
    return url;
  }

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

    getAccounts()
    getTotalSaleWithoutCreditSale()
    getTotalCOGS()
    getTotalCreditSale()
    getTotalDamageAndLost()
    getTotalExchangeAmount()
    getTotalReturnAmount()
  }, [fromDate, toDate])

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
  }, [fromDate, toDate])

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

  const getTotalExchangeAmount = async () => {
    let url = urlHandlers("/sales/total-exchange-amount")

    const [res, err] = await HTTPCall(url)
    if (err) return

    setTotalExchangeAmount(res.data.total)

  }

  const getTotalReturnAmount = async () => {
    let url = urlHandlers("/sales/total-return-amount")

    const [res, err] = await HTTPCall(url)
    if (err) return

    setTotalReturnAmount(res.data.total)
  }

  // get account head with sub heads
  const getAccounts = async () => {
    let url = urlHandlers("/account-management/accounts")
    
    const [res, err] = await HTTPCall(url)
    if (err) {
      console.log(err)
      return
    }
    // console.log(res.data.data)
    setAccounts(res.data.data)
  }

  const getTotalSaleWithoutCreditSale = async () => {
    let url = urlHandlers("/pos-sales/get-total-sale-without-credit-sale")

    const [res, err] = await HTTPCall(url)
    if (err) {
      return
    }
    setTotalSaleWithoutCredit(res?.data?._sum?.total)
  }

  const getTotalDamageAndLost = async () => {
    let url = urlHandlers("/products/get-total-damage-and-lost")
    
    const [res, err] = await HTTPCall(url)
    if (err) {
      return
    }
    setTotalDamageAndLost(res?.data?._sum?.cost)
  }

  const getTotalCOGS = async () => {
    let url = urlHandlers("/pos-sales/total-cogs")
    
    const [res, err] = await HTTPCall(url)
    if (err) return

    setTotalCOGS(res.data.total)
  }

  const getSubAccountAmount = (subAccount) => {
    return subAccount.vouchers.map(voucher => voucher.payment_amount).reduce((pv, cv) => pv + cv, 0)
  }

  const getTotalCreditSale = async () => {
    let url = urlHandlers("/pos-sales/get-total-credit-sale")

    const [res, err] = await HTTPCall(url)
    if (err) return

    setTotalCreditSale(res.data._sum.total)

  }

  const getSubTotal = () => {
    let total = 0
    total += totalSaleWithoutCredit - totalExchangeAmount - totalReturnAmount
    total += totalCreditSale
    total -= totalCOGS

    accounts.forEach(account => {
      if (account.name === "Equity" || account.name === "Liability") {
        return
      }
      account.sub_accounts.forEach(subAcc => {
        if (subAcc.name === "Account Receivable" || subAcc.name === "Sale") {
          return
        }
        if (subAcc.balance_type == 1) {
          total -= subAcc.vouchers.map(voucher => voucher.payment_amount).reduce((pv, cv) => pv + cv, 0)
        } else {
          total += subAcc.vouchers.map(voucher => voucher.payment_amount).reduce((pv, cv) => pv + cv, 0)
        }
      })
    })

    return parseFloat(total || 0)
  }


  return <>
    <div style={{ textAlign: 'center' }}>
      <HeaderInfo title='Income Statement Report' fromDate={fromDate} toDate={toDate} />
      {/* <div>FROM {moment(fromDate).format('DD-MM-YYYY')} TO {moment(toDate).format('DD-MM-YYYY')}</div> */}
      <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>

        <div style={{ marginTop: '10px', textAlign: 'left', fontSize: '15px', fontWeight: '500' }}>Income:</div>
        <table style={{ width: '100%', fontSize: '12px', border: '1px solid #8c8c8c', padding: '2px' }}>
          <thead style={{ backgroundColor: 'black', color: '#EFEFEF', fontSize: '15px' }}>
            <tr>
              <th colSpan={2}>Item</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={2}>Sale</td>
              <td>{(totalSaleWithoutCredit - totalExchangeAmount - totalReturnAmount).toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan={2}>Credit Sale</td>
              <td>{parseFloat(totalCreditSale || 0).toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan={2}>COGS</td>
              <td>{totalCOGS.toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan={2}>Damage & Lost</td>
              <td>{parseFloat(totalDamageAndLost || 0).toFixed(2)}</td>
            </tr>
            {accounts.map(account => {
              if (account.name === "Equity" || account.name === "Liability") {
                return ""
              }
              return (
                <>
                  <tr key={account.id}>
                    <td colSpan={3}>{account.name}</td>
                  </tr>
                  {account?.sub_accounts?.map(subAcc => {
                    if (subAcc.name === "Account Receivable" || subAcc.name === "Sale" || subAcc.name === "Supplier Payment") {
                      return ""
                    }

                    return (
                      <tr key={subAcc.id}>
                        <td></td>
                        <td>{subAcc.name}</td>
                        <td>{getSubAccountAmount(subAcc)?.toFixed(2)}</td>
                      </tr>
                    )
                  })}
                </>
              )
            })}
            <tr>
              <td colSpan={2}>Total</td>
              <td>{(getSubTotal() - parseFloat(totalDamageAndLost || 0)).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>


      </div>
    </div>
  </>
}