import {Button} from "@mantine/core"
import React, {useRef, useState} from "react"
import { BaseAPI, HTTP } from "~/repositories/base"
import HeaderInfo from "./HeaderInfo";
import {FaSitemap} from "react-icons/fa";
import ReactToPrint from "react-to-print";
import {PassPrintToElectron} from "~/lib/electron";
import {Delay} from "~/lib/lib";


export default function ({ fromDate = null, toDate = null, searchType, barcode }) {
    const printContent = useRef()
    const [sells, setSells] = useState([]);

    const setData = async () => {
        let url = `${BaseAPI}/reports/item-wise-sale-summery?`
        if (barcode && searchType === 'barcode') url += `barcode=${barcode}&`
        if (barcode && searchType === 'supplier') url += `supplier_id=${barcode}&`
        if (fromDate) url += `from_date=${fromDate}&`
        if (toDate) url += `to_date=${toDate}`

        try {
            const res = await HTTP.get(url)
            setSells(res.data.data)
            await Delay(10)
        }catch (e) {
            // todo: handle
        }
    }

    return (
        <>
            <ReactToPrint
                onBeforeGetContent={setData}
                content={() => printContent.current}
                trigger={() => (
                    <Button radius="xs" color="violet" className=" text-center h-40 w-72 min-w-72 min-w-fit leading-normal" uppercase>
                        <div>
                            <FaSitemap className=" text-3xl text-pink-100 stroke-1" />
                            <br></br>
                            <span>Item Wise Sales</span>
                        </div>
                    </Button>
                )}
                print={PassPrintToElectron}
            />

            <div className={'hidden'}>
                <div ref={printContent}>
                    <HeaderInfo title={"Item Wise Sale Report"} />
                    <div style={{ border: '1px solid #8c8c8c' }}>
                        <table style={{ width: '100%', fontSize: '12px', textAlign: 'right' }} >
                            <thead style={{ backgroundColor: '#1f2937', color: '#f9fafb', textAlign: 'center', textTransform: 'uppercase' }}>
                            <tr>
                                <th style={{ padding: '1px' }}>Barcode</th>
                                <th style={{ padding: '1px' }}>Style/Size</th>
                                <th style={{ padding: '1px' }}>Supplier</th>
                                <th style={{ padding: '1px' }}>product</th>
                                <th style={{ padding: '1px' }}>group</th>
                                <th style={{ padding: '1px' }}>sqty</th>
                                <th style={{ padding: '1px' }}>CPU</th>
                                <th style={{ padding: '1px' }}>RPU</th>
                                <th style={{ padding: '1px' }}>Total CPU</th>
                                <th style={{ padding: '1px' }}>Total RPU</th>
                                <th style={{ padding: '1px' }}>Discount Amount</th>
                                <th style={{ padding: '1px' }}>Excg. Amt</th>
                                <th style={{ padding: '1px' }}>Return Amount</th>
                                {/* <th style={{ padding: '1px' }}>Profit</th> */}
                            </tr>
                            </thead>
                            <tbody>
                            {sells.map((sell, index) => (
                                <tr style={index % 2 === 0 ? { backgroundColor: '#f3f4f6', } : { backgroundColor: '#e5e7eb' }}>
                                    <td style={{ padding: '1px', textAlign: 'center' }}>{sell.product_barcode}</td>
                                    <td style={{ padding: '1px', textAlign: 'center' }}>{sell.style_size}</td>
                                    <td style={{ padding: '1px', textAlign: 'center' }}>{sell?.company_name}</td>
                                    <td style={{ padding: '1px', textAlign: 'center' }}>{sell.product_name}</td>
                                    <td style={{ padding: '1px', textAlign: 'center' }}>{sell.brand_name}</td>
                                    <td style={{ padding: '1px' }}>{sell.sqty}</td>
                                    <td style={{ padding: '1px' }}>{sell.cpu}</td>
                                    <td style={{ padding: '1px' }}>{sell.rpu}</td>
                                    <td style={{ padding: '1px' }}>{sell.total_cpu.toFixed(2)}</td>
                                    <td style={{ padding: '1px' }}>{sell.total_rpu.toFixed(2)}</td>
                                    <td style={{ padding: '1px' }}>{sell.discount_amount.toFixed(2)}</td>
                                    <td style={{ padding: '1px' }}>{sell.exchange_amount}</td>
                                    <td style={{ padding: '1px' }}>{sell.return_amount}</td>
                                    {/* <td style={{ padding: '1px' }}>{(sell.sale_amount - sell.total_cpu).toFixed(2)}</td> */}

                                </tr>
                            ))}
                            <tr style={{ fontWeight: '700' }}>
                                <td colSpan="5" style={{ padding: '1px', textAlign: 'center' }}>Grand Total</td>
                                <td style={{ padding: '1px' }}>{sells.reduce((prev, curr) => prev + curr.sqty, 0)}</td>
                                <td style={{ padding: '1px' }}>{sells.reduce((prev, curr) => prev + curr.cpu, 0).toFixed(2)}</td>
                                <td style={{ padding: '1px' }}>{sells.reduce((prev, curr) => prev + curr.rpu, 0).toFixed(2)}</td>
                                <td style={{ padding: '1px' }}>{sells.reduce((prev, curr) => prev + curr.total_cpu, 0).toFixed(2)}</td>
                                <td style={{ padding: '1px' }}>{sells.reduce((prev, curr) => prev + curr.total_rpu, 0).toFixed(2)}</td>
                                <td style={{ padding: '1px' }}>{sells.reduce((prev, curr) => prev + curr.discount_amount, 0).toFixed(2)}</td>
                                <td style={{ padding: '1px' }}>{sells.reduce((prev, curr) => prev + curr.exchange_amount, 0).toFixed(2)}</td>
                                <td style={{ padding: '1px' }}>{sells.reduce((prev, curr) => prev + curr.return_amount, 0).toFixed(2)}</td>
                                {/* <td style={{ padding: '1px' }}>{sells.reduce((prev, curr) => prev + (curr.sale_amount - curr.total_cpu), 0).toFixed(2)}</td> */}
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}
