import HeaderInfo from "@/components/reports/HeaderInfo";
import React, {useEffect, useState} from "react";
import {HTTPCall} from "~/lib/http";
import dayjs from "dayjs";

export default function SlowFastMoving({fromDate = null, toDate = null}){
    const [products, setProducts] = useState([])

    useEffect( ()=>{
        setTableData(fromDate, toDate)
    },[fromDate, toDate])

    const setTableData = async (fromDate, toDate) => {
        const fDate = fromDate ?? dayjs().add(-1, "month").toDate()
        const tDate = toDate ?? dayjs().toDate()

        const numberOfDays = dayjs(tDate).diff(fDate, "days")
        const inMonth = Math.round(numberOfDays / 30)

        let prods = await getProducts(fDate, tDate)
        prods = prods.map(prod=>{
            const totalSold = prod.pos_sales.map(p=>p.quantity).reduce((pv, cv) => pv+cv,0)

            let slowFastTag = 1
            if ((inMonth * prod.slow_fast_quantity) < totalSold) slowFastTag = 100

            return {...prod, total_sold: totalSold, slow_fast_tag: slowFastTag}
        })
        setProducts(prods)
    }

    const getProducts = async (fromDate, toDate) => {
        const [res, err] = await HTTPCall(`/products/list-with-sales?from_date=${fromDate}&to_date=${toDate}`)
        if (err) return
        return res.data
    }
    return (
        <>
            <div style={{ textAlign: 'center' }}>
                <HeaderInfo title='Slow/Fast Moving Report ' />
                <table>
                    <thead>
                    <tr>
                        <th>Barcode</th>
                        <th>Supplier Name</th>
                        <th>Product Name</th>
                        <th>Group</th>
                        <th>Category</th>
                        <th>Quantity</th>
                        <th>Total CPU</th>
                        <th>Total RPU</th>
                    </tr>
                    </thead>
                    <tbody>
                    {products.map(product=>(
                        <tr key={product.id}>
                            <td>{product.product_barcode}</td>
                            <td>{product.supplier?.company_name}</td>
                            <td>{product.name}</td>
                            <td>{product.brand?.name}</td>
                            <td>{product.category?.name}</td>
                            <td>{product.stock}</td>
                            <td>{product.cost_price * product.stock}</td>
                            <td>{product.MRP_price * product.stock}</td>
                            {/*<td>{product.slow_fast_tag === 1 ? "Slow" : "Fast"}</td>*/}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}