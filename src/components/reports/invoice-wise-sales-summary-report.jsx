import React, { useEffect, useRef, useState } from "react"
import { BaseAPI, HTTP } from "~/repositories/base"
import HeaderInfo from "./HeaderInfo";
import { Button } from "@mantine/core";
import { FaSitemap } from "react-icons/fa";
import ReactToPrint from "react-to-print";
import { PassPrintToElectron } from "~/lib/electron";
import { Delay } from "~/lib/lib";
import dayjs from "dayjs";

export default function ({ fromDate = null, toDate = null, barcode }) {
    const printContent = useRef();
    const printDetailsContent = useRef();
    const [sales, setSales] = useState([]);
    const [totalCASHAmount, setTotalCASHAmount] = useState(0)
    const [totalCardAmount, setTotalCardAmount] = useState(0)
    const [getGrandRoundingAmount, setGrandRoundingAmount] = useState(0)
    const [details, setDetails] = useState(false)
    const [grandTotalQuantity, setGrandTotalQuantity] = useState(0)

    function filterGrandTotalQuantity(sales) {
        const filterTotalQuantity = sales.map((sale) => sale.products.reduce((prev, curr) => prev + curr.quantity, 0)).reduce((prev, curr) => prev + curr, 0);
        setGrandTotalQuantity(filterTotalQuantity)
    }
    function getCASHAmount(sale) {
        const cashPay = sale.pos_payments.find(payment => payment.method === 1)
        if (!cashPay) return 0;
        return cashPay.amount
    }
    function getCardAmount(sale) {
        let total = 0;
        sale.pos_payments.forEach(payment => {
            if (payment.method === 2 || payment.method === 5) total += payment?.amount;
        })
        return total;
    }
    const getReturnAmount = (sale) => {
        return sale.returns.map(r => r.return_amount).reduce((pv, cv) => pv + cv, 0)
    }
    const getReturnCpuAmount = (sale) => {
        return sale.returns?.reduce((pv, cv) => pv + cv?.product?.cost_price * cv.quantity || 0, 0)
    }
    const getExchangedProductsAmount = (sale) => {
        let amount = 0
        sale.exchanged_products.forEach(ep => {
            const productOnPosSale = sale.products.find(p => p.product_id === ep.product_id)
            if (productOnPosSale) {
                amount += productOnPosSale.sale_amount
            }
        })
        return amount
    }
    const getExchangeCpuAmount = (sale) => {
        return sale.exchanged_products?.reduce((pv, cv) => pv + cv?.product?.cost_price * cv.quantity || 0, 0)
    }
    const getRoundingAmount = (amount) => amount.return_amount.toFixed(2);

    useEffect(() => {
        const totalRounding = sales.reduce((prev, curr) => prev + parseFloat(curr.return_amount.toFixed(2)), 0)
        setGrandRoundingAmount(totalRounding);
    }, [sales])

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

    const getGrandTotalCPU = () => {
        return sales.map(sale => {
            return sale.total_cost_price - getReturnCpuAmount(sale) - getExchangeCpuAmount(sale);
        }).reduce((pv, cv) => pv + cv, 0).toFixed(2)
    }

    const getGrandTotalRPU = () => {
        return sales.map(sale => {
            return sale.total - getReturnAmount(sale) - getExchangedProductsAmount(sale);
        }).reduce((pv, cv) => pv + cv, 0).toFixed(2)
    }

    const getProfit = (sale) => {

        const unReturnedProducts = sale.products.filter(p => {
            const found = sale.returns.find(ret => ret.pos_sale_id === p.pos_sale_id && ret.product_id === p.product_id);
            return !found;
        })

        const filterUnreturnExchange = unReturnedProducts.filter(p => {
            const found = sale.exchanged_products.find(ex => ex.origin_sale_id === p.pos_sale_id && ex.product_id === p.product_id);
            return !found;
        })

        return filterUnreturnExchange.map(p => p.sale_amount - (p.cost_price * p.quantity)).reduce((p, c) => p + c, 0)
    }

    const getGrandProfit = () => {
        let profit = 0
        sales.forEach(sale => {
            profit += getProfit(sale) + parseFloat(sale.return_amount.toFixed(2))
        })
        return profit
    }

    const setData = async (details = false) => {
        setDetails(details)
        let url = `${BaseAPI}/reports/invoice-wise-sale?`;

        if (fromDate) url += `from_date=${fromDate}&`;
        if (toDate) url += `to_date=${toDate}&`;
        if (barcode) url += `barcode=${barcode}`;

        try {
            const res = await HTTP.get(url)
            setSales(res.data.data)
            filterGrandTotalQuantity(res.data.data)
            //total cash amount filter
            const filterTotalCASH = res.data.data.reduce((prev, curr) => {
                let amount = 0;
                curr?.pos_payments?.forEach(pos_payment => { if (pos_payment?.method === 1) amount += pos_payment?.amount});
                return amount + prev;
            }, 0)
            setTotalCASHAmount(() => filterTotalCASH)

            //total cash amount filter
            const filterTotalCard = res.data.data.reduce((prev, curr) => {
                let amount = 0;
                //  2 means card and 5 means redeem amount
                curr?.pos_payments?.forEach(pos_payment => { if ([2,5].includes(pos_payment?.method)) amount += pos_payment?.amount});
                return amount + prev;
                // return (curr?.pos_payments[0]?.method === 2 || curr?.pos_payments[0]?.method === 5) ? prev + curr?.pos_payments[0]?.amount : prev + 0;
            }, 0)
            setTotalCardAmount(() => filterTotalCard)
        } catch (e) {
            console.log(e)
        }

        // this is for side effect of multiple editing and data sync
        await Delay(10)
    }


    const tableHead = (sale, index) => {
        if (index !== 0) return;
        return <>
            <th rowSpan={sale.products.length} style={{ padding: '0 1px', textAlign: 'center' }}>{sale.id}</th>
            <th rowSpan={sale.products.length} style={{ padding: '0 1px', textAlign: 'center' }}>{dayjs(sale.created_at).format('MM-DD-YYYY hh:mm:ss ')}</th>
            <th rowSpan={sale.products.length} style={{ padding: '0 1px', textAlign: 'center' }}>{sale.user?.first_name || ''}</th>
            <th rowSpan={sale.products.length} style={{ padding: '0 1px', textAlign: 'center' }}>{sale.customer?.first_name || ''}</th>
            <th rowSpan={sale.products.length} style={{ padding: '0 1px' }}>{getCASHAmount(sale).toFixed(2)}</th>
            <th rowSpan={sale.products.length} style={{ padding: '0 1px' }}>{getCardAmount(sale).toFixed(2)}</th>
            <th rowSpan={sale.products.length} style={{ padding: '0 1px' }}>{getCardName(sale)}</th>
            <th rowSpan={sale.products.length} style={{ padding: '0 1px' }}>{getReturnAmount(sale)}</th>
            <th rowSpan={sale.products.length} style={{ padding: '0 1px' }}>{getExchangedProductsAmount(sale)}</th>
            <th rowSpan={sale.products.length} style={{ padding: '0 1px' }}>{getProfit(sale).toFixed(2)}</th>
        </>
    }

    const total = (sale) => {

        const total = {
            quantity: 0,
        }
        sale.products.forEach(product => { total['quantity'] += product.quantity })

        return <>
            <td>{total.quantity}</td>
            <td>{sale.total}</td>
            <td>{sale.discount_amount}</td>
            <td>{sale.vat_amount}</td>
            <td>{sale.total_cost_price}</td>
            <td>{sale.total}</td>
        </>
    }
    // console.log({ sales })

    return (
        <>
            <div className={' flex gap-4"'}>
                <div className={'mr-4'}>
                    <ReactToPrint
                        onBeforeGetContent={setData}
                        content={() => printContent.current}
                        trigger={() => (
                            <Button radius="xs" color="teal" className=" text-center h-40 w-72 min-w-fit leading-normal" uppercase>
                                <div>
                                    <FaSitemap className=" text-3xl text-pink-100 stroke-2" />
                                    <br></br>
                                    <span>Invoice Wise Sales <br></br> Summary</span>
                                </div>
                            </Button>
                        )}
                        print={PassPrintToElectron}
                    />
                </div>
                <div>
                    <ReactToPrint
                        onBeforeGetContent={() => setData(true)}
                        content={() => printDetailsContent.current}
                        trigger={() => (
                            <Button radius="xs" color="lime" className=" text-center h-40 w-72 min-w-fit leading-normal" uppercase>
                                <div>
                                    <FaSitemap className=" text-3xl text-pink-100 stroke-2" />
                                    <br></br>
                                    <span>Invoice wise Sales <br></br> Details</span>
                                </div>
                            </Button>
                        )}
                        print={PassPrintToElectron}
                    />
                </div>

            </div>

            <div className={'hidden'}>
                <div ref={printContent}>
                    <HeaderInfo title={details ? "Invoice Wise Sale Details" : "Invoice Wise Sale Summary"} />
                    <div style={{ border: '1px solid #8c8c8c', width: 'fit-content', margin: 'auto' }}>
                        <table style={{ width: 'fit-content', fontSize: '12px', textAlign: 'right' }} >
                            <thead style={{ backgroundColor: '#1f2937', color: '#f9fafb', textAlign: 'center' }}>
                                <tr>
                                    <th style={{ padding: '1px' }}>Invoice</th>
                                    {details &&
                                        <th>Products</th>
                                    }
                                    <th style={{ padding: '1px' }}>Total of BarcodePrice</th>
                                    <th style={{ padding: '1px' }}>Total Disc. Amt</th>
                                    <th style={{ padding: '1px' }}>VAT</th>
                                    {/* style={{padding:'1px'}}x-1">Special Discount</th> */}
                                    {/* style={{padding:'1px'}}x-1">Exchange Amount</th> */}

                                    <th style={{ padding: '1px' }}>Total CPU</th>
                                    <th style={{ padding: '1px' }}>Total RPU</th>
                                    {/* style={{padding:'1px'}}x-1">Round Value</th> */}
                                    <th style={{ padding: '1px' }}>CASH Amount</th>
                                    <th style={{ padding: '1px' }}>Card Amount</th>
                                    <th style={{ padding: '1px' }}>Card Name</th>
                                    <th style={{ padding: '1px' }}>Return Amount</th>
                                    <th style={{ padding: '1px' }}>Exchange Amount</th>
                                    <th style={{ padding: '1px' }}>Rounding Amount</th>
                                    <th style={{ padding: '1px' }}>Profit</th>
                                    <th style={{ padding: '1px' }}>Customer Name</th>

                                </tr>
                            </thead>
                            <tbody >
                                {
                                    sales.map((sale, index) => (
                                        sale.products.length > 0 &&
                                        <tr key={index} style={index % 2 === 0 ? { backgroundColor: '#f3f4f6', } : { backgroundColor: '#e5e7eb' }}>
                                            <td style={{ padding: '0 1px', textAlign: 'center' }}>{sale.id}</td>
                                            {details &&
                                                <td>{sale.products?.map(p => p.product.name).join(",")}</td>
                                            }
                                            <td style={{ padding: '0 1px' }}>{sale.sub_total}</td>
                                            <td style={{ padding: '0 1px' }}>{sale.discount_amount}</td>
                                            <td style={{ padding: '0 1px' }}>{sale.vat_amount}</td>
                                            <td style={{ padding: '0 1px' }}>{(sale.total_cost_price - (getExchangeCpuAmount(sale) + getReturnCpuAmount(sale))).toFixed(2)}</td>
                                            <td style={{ padding: '0 1px' }}>{(sale.total - getReturnAmount(sale) - getExchangedProductsAmount(sale)).toFixed(2)}</td>
                                            <td style={{ padding: '0 1px' }}>{getCASHAmount(sale).toFixed(2)}</td>
                                            <td style={{ padding: '0 1px' }}>{getCardAmount(sale).toFixed(2)}</td>
                                            <td style={{ padding: '0 1px' }}>{getCardName(sale)}</td>
                                            <td style={{ padding: '0 1px' }}>{getReturnAmount(sale)}</td>
                                            <td style={{ padding: '0 1px' }}>{getExchangedProductsAmount(sale)}</td>
                                            <td style={{ padding: '0 1px' }}>{getRoundingAmount(sale)}</td>
                                            <td style={{ padding: '0 1px' }}>{getProfit(sale).toFixed(2)}</td>
                                            <td style={{ padding: '0 1px' }}>{sale.customer ? `${sale.customer.first_name} ${sale.customer.last_name || ''}` : ""}</td>

                                        </tr>
                                    ))
                                }

                                <tr style={{ fontWeight: '700' }}>
                                    <td colSpan={details ? '3' : '2'} style={{ padding: '0 1px' }}>Grand Total</td>

                                    <td style={{ padding: '0 1px' }}>{sales.reduce((prev, curr) => prev + curr.discount_amount, 0).toFixed(2)}</td>
                                    <td style={{ padding: '0 1px' }}>{sales.reduce((prev, curr) => prev + curr.vat_amount, 0).toFixed(2)}</td>
                                    <td style={{ padding: '0 1px' }}>{getGrandTotalCPU()}</td>
                                    <td style={{ padding: '0 1px' }}>{getGrandTotalRPU()}</td>
                                    <td style={{ padding: '0 1px' }}> {totalCASHAmount.toFixed(2)}</td>
                                    <td style={{ padding: '0 1px' }}> {totalCardAmount}</td>
                                    <td></td>
                                    <td>{sales.map(s => getReturnAmount(s)).reduce((pv, cv) => pv + cv, 0)}</td>
                                    <td>{sales.map(s => getExchangedProductsAmount(s)).reduce((pv, cv) => pv + cv, 0).toFixed(2)}</td>
                                    <td style={{ padding: '0 1px' }}> {getGrandRoundingAmount.toFixed(2)}</td>
                                    <td style={{ padding: '0 1px' }}>{getGrandProfit().toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className={'hidden'}>

                <div ref={printDetailsContent}>
                    <HeaderInfo title="Invoice Wise Sale Details" />
                    <div style={{ border: '1px solid #8c8c8c', width: 'fit-content', margin: 'auto' }}>
                        <table style={{ width: 'fit-content', fontSize: '12px', textAlign: 'right' }} >
                            <thead style={{ backgroundColor: '#1f2937', color: '#f9fafb', textAlign: 'center' }}>
                                <tr>
                                    <th style={{ padding: '1px' }}>Invoice No</th>
                                    <th style={{ padding: '4px 0px' }}>Date</th>
                                    <th style={{ padding: '1px' }}>Sales Man</th>
                                    <th style={{ padding: '1px' }}>Customer Name</th>
                                    <th style={{ padding: '1px' }}>CASH AMT.</th>
                                    <th style={{ padding: '1px' }}>CARD AMT.</th>
                                    <th style={{ padding: '1px' }}>CARD Name</th>
                                    <th style={{ padding: '1px' }}>RET AMT.</th>
                                    <th style={{ padding: '1px' }}>EX AMT.</th>
                                    <th style={{ padding: '1px' }}>PROFIT</th>

                                    <th style={{ padding: '1px' }}>Barcode</th>
                                    <th style={{ padding: '1px' }}>Product Name</th>
                                    <th style={{ padding: '1px' }}>SQTY</th>
                                    <th style={{ padding: '1px' }}>MRP</th>
                                    <th style={{ padding: '1px' }}>DIS</th>
                                    <th style={{ padding: '1px' }}>VAT</th>
                                    <th style={{ padding: '1px' }}>Total CPU</th>
                                    <th style={{ padding: '1px' }}>Total MRP</th>


                                </tr>
                            </thead>
                            <tbody >
                                {
                                    sales.map((sale, index) => (
                                        sale.products.length > 0 &&
                                        <tr key={index}
                                        //  style={index % 2 === 0 ? { backgroundColor: '#f3f4f6', } : { backgroundColor: '#e5e7eb' }}
                                        >

                                            {sale.products?.map((p, pIndex) => <tr key={p.id}
                                                style={index % 2 === 0 ?
                                                    // { backgroundColor: '#f3f4f6', } 
                                                    { backgroundColor: '#e5e7eb', }
                                                    :
                                                    { backgroundColor: '#e5e7eb' }}
                                            >

                                                {tableHead(sale, pIndex)}

                                                <td>{p.product.product_barcode}</td>
                                                <td>{p.product.name}</td>
                                                <td>{p.quantity}</td>
                                                <td>{p.mrp_price}</td>
                                                <td>{p.discount_amount}</td>
                                                <td>{p.product.vat_in_percent || 0}</td>
                                                <td>{(p.cost_price * p.quantity).toFixed(2)}</td>
                                                <td>{(p.mrp_price * p.quantity).toFixed(2)}</td>
                                            </tr>
                                            )}
                                            {/* </td> */}
                                            <tr style={{ fontWeight: 700 }}>
                                                <th colSpan={10} ></th>
                                                <td />
                                                <td />
                                                {total(sale)}
                                            </tr>
                                        </tr>
                                    ))
                                }

                                {/* GRAND TOTAL */}
                                <tr style={{ background: 'lightgray' }}>
                                    <th colSpan={4}>Grand Total:</th>
                                    <th style={{ padding: '0 1px' }}> {totalCASHAmount.toFixed(2)}</th>
                                    <th style={{ padding: '0 1px' }}> {totalCardAmount.toFixed(2)}</th>
                                    <th></th>
                                    <th>{sales.map(s => getReturnAmount(s)).reduce((pv, cv) => pv + cv, 0)}</th>
                                    <th>{sales.map(s => getExchangedProductsAmount(s)).reduce((pv, cv) => pv + cv, 0).toFixed(2)}</th>
                                    <th style={{ padding: '0 1px' }}>{getGrandProfit().toFixed(2)}</th>
                                    <th></th>
                                    <th></th>
                                    <th style={{ padding: '0 1px' }}>{grandTotalQuantity.toFixed(3)}</th>
                                    <th style={{ padding: '0 1px' }}>{sales.reduce((prev, curr) => prev + curr.sub_total, 0).toFixed(2)}</th>
                                    <th style={{ padding: '0 1px' }}>{sales.reduce((prev, curr) => prev + curr.discount_amount, 0).toFixed(2)}</th>
                                    <th style={{ padding: '0 1px' }}>{sales.reduce((prev, curr) => prev + curr.vat_amount, 0).toFixed(2)}</th>
                                    {/* <th style={{ padding: '0 1px' }}> {getGrandRoundingAmount.toFixed(2)}</th> */}
                                    <th style={{ padding: '0 1px' }}>{getGrandTotalCPU()}</th>
                                    <th style={{ padding: '0 1px' }}>{getGrandTotalRPU()}</th>
                                </tr>
                            </tbody>

                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}
