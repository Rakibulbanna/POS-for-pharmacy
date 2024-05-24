import { useEffect, useState } from "react"
import { BaseAPI, HTTP } from "~/repositories/base"
import HeaderInfo from "../HeaderInfo";


export default function ({ fromDate, toDate }) {
  const [buyOneGetOneProducts, setBuyOneGetOneProducts] = useState([]);

  useEffect(() => {
    let url = `${BaseAPI}/promotions/combo?`;

    if (fromDate) url += `fromDate=${fromDate}&`;
    if (toDate) url += `toDate=${toDate}`;

    HTTP.get(url).then(res => {

      const { data } = res.data;
      console.log({data});
      const getIds = data.map((item) => item.id);

      const filterIds = [...new Set(getIds)];

      const filterItem = filterIds.map((id) => {
        return data.filter((item) => item.id === id);
      })

      // setBuyOneGetOneProducts(() => filterItem);

    }).catch(err => {
      console.log(err);
    })
  }, [fromDate, toDate]);

  return (
    <>
      <HeaderInfo title={"Combo Discount Details Reports"} />
      {
        buyOneGetOneProducts.length > 0 &&
        buyOneGetOneProducts.map((po, index) => (
          <div key={index} style={{ fontFamily: 'Arial' }}>
            <div style={{ fontSize: '13px', marginTop: '5px', fontWeight: '600' }}> Id : {po[0].id}</div>
            <div style={{ fontSize: '13px', marginTop: '5px', fontWeight: '600' }}> Id : {po[0].name}</div>
            {/* <div style={{ fontSize: '13px', marginTop: '5px' }}>
              <span style={{ fontWeight: '600' }}> Effective Date:</span>{` ${new Date(po.effective_date).toLocaleDateString()}`}
              <span style={{ fontWeight: '600', marginLeft: '10px' }}>Expire Date: </span> {` ${new Date(po.expiry_date).toLocaleDateString()}`}
            </div> */}

            <div style={{ border: '1px solid #8c8c8c', padding: '0.1rem' }}>
              <table style={{ width: '100%', fontSize: '12px', textAlign: 'right' }}>
                <thead style={{ backgroundColor: '#1f2937', color: '#f9fafb', textAlign: 'center' }}>
                  <tr>
                    <th style={{ padding: '1px', width: '10%' }}>SL No</th>
                    <th style={{ padding: '1px', width: '10%' }}>Product Id</th>
                    <th style={{ padding: '1px', }}>Product Name</th>
                    <th style={{ padding: '1px', width: '10%' }}>Count</th>
                    <th style={{ padding: '1px', width: '10%' }}>Type</th>

                  </tr>
                </thead>
                <tbody >
                  {
                    po.map((product, index) =>
                      <tr key={index} style={index % 2 === 0 ? { backgroundColor: '#f3f4f6' } : { backgroundColor: '#e5e7eb' }}>
                        <td style={{ padding: '0 1px', width: '10%', textAlign: 'center' }}>{index + 1}</td>
                        <td style={{ padding: '0 1px', width: '10%', textAlign: 'center' }}>{product.product_id}</td>
                        <td style={{ padding: '0 1px', textAlign: 'center' }}>{product.product_name}</td>
                        <td style={{ padding: '0 1px', textAlign: 'center' }}>{product.count}</td>
                        <td style={{ padding: '0 1px', width: '10%', textAlign: 'center' }}>{product.type}</td>
                      </tr>
                    )}
                </tbody>
                {/* <tfoot style={{ fontWeight: '600', textAlign: 'right' }}>
                  <tr>
                    <td colSpan="3" >Grand Total:</td>
                    <td style={{ padding: '0 1px' }}>{po.products.reduce((prev, curr) => prev + curr.quantity, 0)}</td>
                    <td style={{ padding: '0 1px' }}></td>
                    <td style={{ padding: '0 1px' }}>{po.products.reduce((prev, curr) => prev + (curr.quantity * curr.product.cost_price), 0)}</td>
                    <td style={{ padding: '0 1px' }}></td>
                    <td style={{ padding: '0 1px' }}>{po.products.reduce((prev, curr) => prev + (curr.quantity * curr.product.MRP_price), 0)}</td>
                  </tr>
                </tfoot> */}
              </table>
            </div>
          </div>
        ))}
    </>
  )
}
