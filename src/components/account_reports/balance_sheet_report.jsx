import ReportPage from "@/utility/reportPage";
import moment from "moment";
import React, {useEffect, useState} from "react"
import {BaseAPI, HTTP} from "~/repositories/base"
import HeaderInfo from "../reports/HeaderInfo";
import {HTTPCall} from "~/lib/http";


export default function ({barcode, fromDate, toDate}) {
    const [voucherPayments, setVoucherPayments] = useState([]);
    const [supplierPayments, setSupplierPayments] = useState([]);
    const [sales, setSales] = useState([]);
    const [totalSaleProfit, setTotalSaleProfit] = useState(0);
    const [totalSaleLost, setTotalSaleLost] = useState(0);
    const [damageAndLostProducts, setDamageAndLostProducts] = useState([]);
    const [profit, setProfit] = useState(0)
    const [lost, setLost] = useState(0)
    const [totalCOGS, setTotalCOGS] = useState(0)
    const [totalSupplierPayable, setTotalSupplierPayable] = useState(0)
    const [totalCashOnHand, setTotalCashOnHand] = useState(0)
    const [customerCreditReceivable, setCustomerCreditReceivable]  = useState(0)
    const [totalOwnerPayments, setTotalOwnerPayments] = useState(0)
    const [totalVatAmount, setTotalVatAmount] = useState(0)
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

        getTotalCOGS()
        getTotalSupplierPayable()
        getTotalCashOnHand()
        getAndSetCustomerCreditReceivable()
        getTotalOfOwnerPayments()
        getTotalVatAmount()
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
            } else {
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


    const getTotalCOGS = async () => {
        const [res, err] = await HTTPCall("/products/get-total-cogs")
        if (err) {
            return
        }
        setTotalCOGS(res.data[0].sum)
    }

    const getTotalVatAmount = async () => {
        const [res, err] = await HTTPCall("/pos-sales/total-vat")
        if (err) return

        setTotalVatAmount(res.data.total)
    }

    const getTotalSupplierPayable = async () => {
        const [res, err] = await HTTPCall("/suppliers/get-total-supplier-payable")
        if (err) return
        setTotalSupplierPayable(res.data)
    }

    const getTotalCashOnHand = async () => {
        const [res, err] = await HTTPCall("/pos-sales/get-total-sale-without-credit-sale")
        if (err) return

        const saleWithoutCredit = res.data._sum.total

        const [res2, err2] = await HTTPCall("/account-management/vouchers/get-total-of-voucher-credit")
        if (err2) return

        const totalOfVoucherCredit = res2.data._sum.payment_amount


        const [res3, err3] = await HTTPCall("/customers/get-total-credit-collected")
        if (err3) return

        const totalCreditCollected = res3.data.total

        const [res4, err4] = await HTTPCall("/suppliers/get-total-supplier-paid")
        if (err4) return

        const totalSupplierPaid = res4.data.total


        setTotalCashOnHand(saleWithoutCredit - totalOfVoucherCredit + totalCreditCollected - totalSupplierPaid)
    }

    const getAndSetCustomerCreditReceivable = async () => {
        const [res, err] = await HTTPCall("/pos-sales/get-total-credit-sale-receivable-of-users")
        if (err) return

        setCustomerCreditReceivable(res.data)
    }

    const getTotalOfOwnerPayments = async () => {
        const [res, err] = await HTTPCall("/account-management/vouchers/get-total-of-owners-payments")
        if (err) return

        // console.log(res.data)
        setTotalOwnerPayments(res.data._sum.payment_amount)

    }


    return <>
        <div style={{textAlign: 'center'}}>
            <HeaderInfo title='Balance Sheet Report' fromDate={fromDate} toDate={toDate}/>
            {/* <div>FROM {moment(fromDate).format('DD-MM-YYYY')} TO {moment(toDate).format('DD-MM-YYYY')}</div> */}
            <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
                <table style={{border: "1px solid black"}}>
                    <thead>
                    <tr>
                        <th colSpan={2}>Asset</th>
                        <th colSpan={2}>Liability</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>Stock</td>
                        <td>{totalCOGS?.toFixed(2)}</td>
                        <td>Acc Payable</td>
                        <td>{totalSupplierPayable.toFixed(2)}</td>

                    </tr>
                    <tr>
                        <td>Cash on hand</td>
                        <td>{totalCashOnHand.toFixed(2)}</td>
                        <td>Owner Equity</td>
                        <td>{totalOwnerPayments}</td>
                    </tr>
                    <tr>
                        <td>Account Receivable</td>
                        <td>{customerCreditReceivable.toFixed(2)}</td>
                        <td>VAT</td>
                        <td>{totalVatAmount?.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Total:</td>
                        <td>{(totalCOGS+totalCashOnHand+customerCreditReceivable).toFixed(2)}</td>
                        <td></td>
                        <td>{(totalSupplierPayable + totalOwnerPayments + totalVatAmount).toFixed(2)}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </>
}