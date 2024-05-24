import deleteicon from "~/src/images/delete-icon.svg";
import HeaderInfo from "../reports/HeaderInfo";

export default function ({ addedProducts, setShowPreview }) {
  return (
    <>
      <div style={{ textAlign: 'center', }}>
        <HeaderInfo title={'Stock Ledger '} />
        <div style={{ position: 'relative', margin: 'auto', width: '100%', borderRadius: '5px', padding: '2px', border: '1px solid #8c8c8c', marginTop: '20px', }}>
          <table style={{ width: '100%', fontSize: '12px' }} >
            <thead style={{ backgroundColor: 'black', color: '#EFEFEF' }} >
              <tr style={{ fontSize: '13px', textTransform: 'uppercase' }}>
                <th style={{ padding: '2px' }}>Sl.NO.</th>
                <th style={{ padding: '2px' }}>Product Name</th>
                <th style={{ padding: '2px' }}>Product Barcode</th>
                <th style={{ padding: '2px' }}>CPU</th>
                <th style={{ padding: '2px' }}>RPU</th>
                <th style={{ padding: '2px' }}>Stock</th>
                <th style={{ padding: '2px' }}>Available Stock</th>
                <th style={{ padding: '2px' }}>MORE/LESS Stock</th>
              </tr>
            </thead>
            <tbody>
              {addedProducts.length > 0 && addedProducts.map((item, index) => (
                <tr key={item.id} style={index % 2 === 0 ? { backgroundColor: "#f8fafc", textAlign: 'right' } : { backgroundColor: "#e2e8f0", textAlign: 'right' }} >
                  <td style={{ padding: '1px 0' }}>{index}</td>
                  <td style={{ padding: '1px 0' }}>{item.name}</td>
                  <td style={{ padding: '1px 0' }}>{item.product_barcode}</td>
                  <td style={{ padding: '1px 0' }}>{item.cost_price}</td>
                  <td style={{ padding: '1px 0' }}>{item.MRP_price}</td>
                  <td style={{ padding: '1px 0' }}>{item.stock}</td>
                  <td style={{ padding: '1px 0' }}>{item.available_stock}</td>
                  <td style={{ padding: '1px 0' }}>{item.available_stock - item.stock}</td>
                </tr>
              ))}

              <tr style={{ fontWeight: '600' }}>
                <td colSpan={3} style={{ padding: '1px 0', textAlign: "center" }}>Grand Total</td>
                <td style={{ padding: '1px 20px', textAlign: "right" }}>{addedProducts.reduce((prev, curr) => prev + curr.cost_price, 0)}</td>
                <td style={{ padding: '1px 20px', textAlign: "right" }}>{addedProducts.reduce((prev, curr) => prev + curr.MRP_price, 0)}</td>
                <td style={{ padding: '1px 20px', textAlign: "right" }}>{addedProducts.reduce((prev, curr) => prev + curr.stock, 0)}</td>
                <td style={{ padding: '1px 20px', textAlign: "right" }}>{addedProducts.reduce((prev, curr) => prev + curr.available_stock, 0)}</td>
                <td style={{ padding: '1px 20px', textAlign: "right" }}>{addedProducts.reduce((prev, curr) => prev + (curr.available_stock - curr.stock), 0)}</td>
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