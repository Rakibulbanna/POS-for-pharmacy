import moment from "moment";
import { useEffect, useState } from "react"
import { BaseAPI, HTTP } from "~/repositories/base"
import HeaderInfo from "../HeaderInfo";


export default function ({ fromDate, toDate }) {
  const [comboDiscountProducts, setComboDiscountProducts] = useState([]);

  useEffect(() => {
    let url = `${BaseAPI}/promotions/combo?`;

    if (fromDate) url += `fromDate=${fromDate}&`;
    if (toDate) url += `toDate=${toDate}`;

    HTTP.get(url).then(res => {
      setComboDiscountProducts(() => res.data.data)
    }).catch(err => {
      console.log(err);
    })
  }, [fromDate, toDate]);

  // console.log({ comboDiscountProducts })

  // const handleDate = (getDate) => {
  //   const date = new Date(getDate);
  //   console.log(date.toLocaleDateString('en-GB'));
  //   return date.toLocaleDateString();
  //   return `${new Date(date).getDay()} / ${new Date(date).getMonth()} / ${new Date(date).getFullYear()}`
  //   // `${new Date(discount.effective_date).getDay()} / ${new Date(discount.effective_date).getMonth()} / ${new Date(discount.effective_date).getFullYear()}`
  // }

  return (
    <>
      <HeaderInfo title={"Combo Discount Summary Reports"} />
      <div style={{ border: '1px solid #8c8c8c', padding: '0.1rem', fontFamily: 'Arial' }}>
        <table style={{ fontSize: '12px', width: '100%', textAlign: 'center' }} >
          <thead>
            <tr style={{ backgroundColor: '#1f2937', color: '#f9fafb' }}>
              <th style={{ padding: '1px' }}>Discount No. </th>
              <th style={{ padding: '1px' }}>Barcode </th>
              <th style={{ padding: '1px' }}>Discount Name</th>
              <th style={{ padding: '1px' }}>Effective Date</th>
              <th style={{ padding: '1px' }}>Expire Date</th>
              <th style={{ padding: '1px' }}>Status</th>
              <th style={{ padding: '1px' }}>Price</th>
            </tr>
          </thead>
          <tbody>
            {comboDiscountProducts.map((discount, index) => (
              <tr key={index} style={index % 2 === 0 ? { backgroundColor: '#f3f4f6' } : { backgroundColor: '#e5e7eb' }}>
                <td style={{ padding: '0 1px' }}>{discount.id}</td>
                <td style={{ padding: '0 1px' }}>{discount.barcode}</td>
                <td style={{ padding: '0 1px' }}>{discount.name}</td>
                <td style={{ padding: '0 1px' }}>{moment(discount.effective_date).format('DD-MM-YYYY')}</td>
                <td style={{ padding: '0 1px' }}>{moment(discount.expiry_date).format('DD-MM-YYYY')}</td>
                <td style={{ padding: '0 1px' }}>{discount.is_active ? 'Active' : 'Inactive'}</td>
                <td style={{ padding: '0 1px', textAlign: 'right' }}>{discount.price}</td>
              </tr>
            ))}
          </tbody>
          <tfoot style={{ fontWeight: '600', textAlign: 'right' }}>
            <tr>
              <td colSpan={6} >Grand Total:</td>
              <td style={{ padding: '0 1px' }}>{comboDiscountProducts.reduce((prev, curr) => prev + curr.price, 0)?.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  )
}
