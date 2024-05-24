import { useEffect, useState } from "react"
import { BaseAPI, HTTP } from "~/repositories/base"
import HeaderInfo from "../HeaderInfo";


export default function ({ selectedStockLedger }) {
  const [products, setProducts] = useState([]);
  const [grandTotal, setGrandTotal] = useState([]);

  useEffect(() => {
    // if (selectedStockLedger.length === 0) return
    HTTP.get(`${BaseAPI}/stock_ledger/${selectedStockLedger}`).then(res => {
      setProducts(() => res.data.data);
    }).catch(err => {
      setProducts(() => []);
      console.log(err);
    })
  }, [selectedStockLedger]);

  useEffect(() => {
    const total = {
      total_cost_price: 0,
      total_mrp_price: 0,
      total_prev_stock: 0,
      total_curr_stock: 0,
      more_less_stock: 0,
    }
    products.forEach(item => {
      total.total_cost_price += item.cost_price;
      total.total_mrp_price += item.mrp_price;
      total.total_prev_stock += item.previous_stock;
      total.total_curr_stock += item.current_stock;
      total.more_less_stock += item.current_stock - item.previous_stock
    })
    setGrandTotal(() => total)
  }, [products])

  return (
    <>
      <div style={{ textAlign: 'center', }}>
        <HeaderInfo title={' Inventory Report '} />
        <div style={{ position: 'relative', margin: 'auto', width: '100%', borderRadius: '5px', padding: '2px', border: '1px solid #8c8c8c', marginTop: '20px', }}>
          <table style={{ width: '100%', fontSize: '12px' }} >
            <thead style={{ backgroundColor: 'black', color: '#EFEFEF' }} >
              <tr style={{ fontSize: '13px', textTransform: 'uppercase' }}>
                <th style={{ padding: '2px' }}>Sl.NO.</th>
                <th style={{ padding: '2px' }}>Product Name</th>
                <th style={{ padding: '2px' }}>Product Barcode</th>
                <th style={{ padding: '2px' }}>CPU</th>
                <th style={{ padding: '2px' }}>RPU</th>
                <th style={{ padding: '2px' }}>Prev Stock</th>
                <th style={{ padding: '2px' }}>Available Stock</th>
                <th style={{ padding: '2px' }}>MORE/LESS Stock</th>
              </tr>
            </thead>
            <tbody>
              {(products.length > 0 || products.length < 1000) && products.map((item, index) => (
                <tr key={item.id} style={index % 2 === 0 ? { backgroundColor: "#f8fafc", textAlign: 'right' } : { backgroundColor: "#e2e8f0", textAlign: 'right' }} >
                  <td style={{ padding: '1px 0' }}>{index}</td>
                  <td style={{ padding: '1px 0', textAlign: 'center' }}>{item.product.name}</td>
                  <td style={{ padding: '1px 0', textAlign: 'center' }}>{item.product.product_barcode}</td>
                  <td style={{ padding: '1px 0' }}>{item.cost_price}</td>
                  <td style={{ padding: '1px 0' }}>{item.mrp_price}</td>
                  <td style={{ padding: '1px 0' }}>{item.previous_stock}</td>
                  <td style={{ padding: '1px 0' }}>{item.current_stock}</td>
                  <td style={{ padding: '1px 0' }}>{item.current_stock - item.previous_stock}</td>
                </tr>
              ))}
              <tr style={{ fontWeight: '600' }}>
                <td colSpan="3" style={{ padding: '1px 0', textAlign: "center" }}>Grand Total</td>
                <td style={{ padding: '1px 0', textAlign: "right" }}>{grandTotal.total_cost_price?.toFixed(2)}</td>
                <td style={{ padding: '1px 0', textAlign: "right" }}>{grandTotal.total_mrp_price?.toFixed(2)}</td>
                <td style={{ padding: '1px 0', textAlign: "right" }}>{grandTotal.total_prev_stock?.toFixed(2)}</td>
                <td style={{ padding: '1px 0', textAlign: "right" }}>{grandTotal.total_curr_stock?.toFixed(2)}</td>
                <td style={{ padding: '1px 0', textAlign: "right" }}>{grandTotal.more_less_stock?.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* total salse amount */}
        { }
      </div>
    </>
  )
}
