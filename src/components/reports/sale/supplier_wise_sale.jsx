import products from "@/pages/products";
import { Table } from "@mantine/core"
import React, { useEffect, useState } from "react"
import { BaseAPI, HTTP } from "~/repositories/base"
import HeaderInfo from "../HeaderInfo";


export default function ({ fromDate = null, toDate = null, barcode }) {
  const [sells, setSells] = useState([]);
  const [grandTotal, setGrandTotal] = useState({
    totalQuantity: 0,
    totalCostPrice: 0,
    totalMrpPrice: 0
  });
  useEffect(() => {
    let url = `${BaseAPI}/reports/category-wise-sale-summery?query_name=supplier&`
    // if (barcode) url += `barcode=${barcode}&`
    if (fromDate) url += `from_date=${fromDate}&`
    if (toDate) url += `to_date=${toDate}`

    HTTP.get(url).then(res => {
      setSells(res.data.data)
    }).catch(err => {
      console.log(err);
    })
  }, [fromDate, toDate, barcode]);

  useEffect(() => {
    const total = {
      totalQuantity: 0,
      totalCostPrice: 0,
      totalMrpPrice: 0
    };

    sells.forEach(sale => {
      sale.products?.forEach(s => {
        if (s.pos_sales?.length > 0) {
          s.pos_sales?.forEach(sa => {

            total.totalQuantity += sa.quantity;
            total.totalCostPrice += sa.quantity * sa.cost_price;
            total.totalMrpPrice += sa.quantity * sa.mrp_price;
          })
        }
      })
    })

    setGrandTotal(() => ({ ...total }))

  }, [sells])

  const filterData = (sale) => {
    // console.log({ sale })
    if (sale.products.length === 0) return (
      <>
        <td style={{ padding: '1px', textAlign: 'center' }}>{sale.first_name}</td>
        <td >0</td>
        <td >0</td>
        <td >0</td>
      </>
    );

    // console.log({ sale })
    const filterPosSale = sale.products.map(sale => { if (sale.pos_sales?.length > 0) return sale.pos_sales }).filter((v) => v);
    // console.log({ filterPosSale });
    const dataFilter = {
      quantity: 0,
      cost_price: 0,
      mrp_price: 0,
    }
    filterPosSale.forEach(sale => {
      // sale.pos_sales
      sale.forEach(s => {
        dataFilter.quantity += s.quantity;
        dataFilter.cost_price += s.quantity * s.cost_price;
        dataFilter.mrp_price += s.quantity * s.mrp_price;
      });
    });

    return (
      <>
        <td style={{ padding: '1px', textAlign: 'center' }}>{sale.first_name}</td>
        <td style={{ padding: '1px' }}>{dataFilter.quantity}</td>
        <td style={{ padding: '1px' }}>{dataFilter.cost_price}</td>
        <td style={{ padding: '1px' }}>{dataFilter.mrp_price}</td>
      </>
    )
  }

  return (
    <>
      <div >
        <HeaderInfo title={"Supplier Wise Sale Report"} />
        <div style={{ border: '1px solid #8c8c8c' }}>
          <table style={{ width: '100%', fontSize: '12px', textAlign: 'right' }} >
            <thead style={{ backgroundColor: '#1f2937', color: '#f9fafb', textAlign: 'center' }}>
              <tr>
                <th style={{ padding: '1px' }}>SUPPLIER NAME</th>
                <th style={{ padding: '1px' }}>QTY</th>
                <th style={{ padding: '1px' }}>TOTAL CPU</th>
                <th style={{ padding: '1px' }}>TOTAL RPU</th>

                {/* <th style={{ padding: '1px' }}>Profit</th> */}
              </tr>
            </thead>
            <tbody>
              {sells.map((sale, index) => (
                <tr style={index % 2 === 0 ? { backgroundColor: '#f3f4f6', } : { backgroundColor: '#e5e7eb' }}>
                  {filterData(sale)}
                </tr>
              ))}
              <tr style={{ fontWeight: '700' }}>
                <td colSpan="1" style={{ padding: '1px', textAlign: 'right' }}>Grand Total</td>
                <td style={{ padding: '1px' }}>{grandTotal.totalQuantity}</td>
                <td style={{ padding: '1px' }}>{grandTotal.totalCostPrice}</td>
                <td style={{ padding: '1px' }}>{grandTotal.totalMrpPrice}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
