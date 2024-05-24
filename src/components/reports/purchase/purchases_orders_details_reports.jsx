import ReportPage from "@/utility/reportPage";
import { Table } from "@mantine/core"
import React, { useEffect, useState } from "react"
import { BaseAPI, HTTP } from "~/repositories/base"
import HeaderInfo from "../HeaderInfo";


export default function () {
  const [purchaseOrders, setPurchaseOrders] = useState([]);

  const [total, setTotal] = useState({
    quantity: 0,
    total_cost: 0,
    total_value: 0,
  });

  const [totalTbody, setTotalTbody] = useState([]);

  useEffect(() => {
    HTTP.get(`${BaseAPI}/reports/purchases/order-details`).then(res => {

      setPurchaseOrders(()=>res.data.data);
      // if (res.data.data.length > 0) {

      //   const total = res.data.data.map((item) => {
      //     const date = new Date(item.created_at);

      //     item.date = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
      //     item.total_quantity = item.products.reduce((prev, curr) => prev + curr.quantity, 0);
      //     item.total_cost_price = item.products.reduce((prev, curr) => prev + (curr.cost_price * curr.quantity), 0);
      //     item.total_mrp_price = item.products.reduce((prev, curr) => prev + (curr.mrp_price * curr.quantity), 0);

      //     return item;
      //   });
      //   setPurchaseOrders(() => total);
      // }
      // else {
      //   setPurchaseOrders(() => [])
      // }

    }).catch(err => {
      console.log(err);
    })
  }, []);

  console.log({ purchaseOrders })
  return (
    <>
      <HeaderInfo title={"Purchases Orders Details Reports"} />
      {
        purchaseOrders.length > 0 &&
        purchaseOrders.map((po, index) => (
          <div style={{ fontFamily: 'Arial' }}>
            <div style={{ fontSize: '13px', marginTop: '5px' }}>Purchase Order Id : {po.id}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <div>Supplier Name : {po.supplier.first_name + ' ' + po.supplier.last_name}</div>
              <div>Phone Number : +88{po.supplier.phone_number}</div>
            </div>

            <div style={{ border: '1px solid #8c8c8c', padding: '0.1rem' }}>
              <table key={po.id} style={{ width: '100%', fontSize: '12px', textAlign: 'right' }}>
                <thead style={{ backgroundColor: '#1f2937', color: '#f9fafb', textAlign: 'center' }}>
                  <tr>
                    <th style={{ padding: '1px', width: '20%' }}>Product Name</th>
                    <th style={{ padding: '1px' }}>Product Barcode</th>
                    <th style={{ padding: '1px' }}>QTY</th>
                    <th style={{ padding: '1px' }}>CPU</th>
                    <th style={{ padding: '1px' }}>Total CPU</th>
                    <th style={{ padding: '1px' }}>RPU</th>
                    <th style={{ padding: '1px' }}>Total RPU</th>
                  </tr>
                </thead>
                <tbody >
                  {po.products.map((product, index) => (
                    <tr style={index % 2 === 0 ? { backgroundColor: '#f3f4f6', } : { backgroundColor: '#e5e7eb' }} key={product.id}>
                      <td style={{ padding: '0 1px', width: '20%', textAlign: 'center' }}>{product.name}</td>
                      <td style={{ padding: '0 1px', textAlign: 'center' }}>{product.product_barcode}</td>
                      <td style={{ padding: '0 1px' }}>{product.quantity}</td>
                      <td style={{ padding: '0 1px' }}>{product.cost_price}</td>
                      <td style={{ padding: '0 1px' }}>{product.quantity * product.cost_price}</td>
                      <td style={{ padding: '0 1px' }}>{product.mrp_price}</td>
                      <td style={{ padding: '0 1px' }}>{product.quantity * product.mrp_price}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot style={{ fontWeight: '600' }}>
                  <tr>
                    <td colSpan="2" style={{ textAlign: 'center' }} >Grand Total:</td>
                    <td style={{ padding: '0 1px' }}>{total[index]?.total_received_quantity}</td>
                    <td style={{ padding: '0 1px' }}></td>
                    <td style={{ padding: '0 1px' }}>{total[index]?.total_cost}</td>
                    <td style={{ padding: '0 1px' }}></td>
                    <td style={{ padding: '0 1px' }}>{total[index]?.total_value}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        ))}

    </>
  )
}
