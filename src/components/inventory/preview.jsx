import { useEffect, useState } from "react";
import { BaseAPI, HTTP } from "~/repositories/base";
import deleteicon from "~/src/images/delete-icon.svg";

export default function ({ grandTotal, addedProducts, setShowPreview }) {
  const [notAddedProducts, setNotAddedProducts] = useState([]);
  useEffect(() => {
    let url = `${BaseAPI}/products/index-without-pagination`;

    HTTP.get(url).then(async res => {

      const addedIds = addedProducts?.map(v => v.id);
      const { data } = res.data;

      const filterProducts = data?.filter((product) => ([...addedIds].includes(product.id)) ? false : true);
      console.log(filterProducts?.length);
      setNotAddedProducts(() => filterProducts)
    });
  }, []);

  return (
    <div className="h-[calc(100vh-35px)] overflow-auto" style={{ border: '1px solid #cbd5e1' }}>

      <img className="absolute right-5 top-0 bg-sky-400 p-1 z-20 cursor-pointer h-10 text-gray-50 hover:scale-110 duration-150 " src={deleteicon} onClick={() => setShowPreview(() => false)} />
      <table className="w-full overflow-auto  text-xs text-left text-gray-500 ">
        <thead className="uppercase bg-gray-600 text-gray-200 sticky -top-1 left-0 z-10">
          <tr>
            <th scope="col" className="p-2">Id</th>
            <th scope="col" className="p-2">Product Barcode</th>
            <th scope="col" className="p-2">Product Name</th>
            <th scope="col" className="p-2">Category</th>
            <th scope="col" className="p-2">Group</th>
            <th scope="col" className="p-2">CPU</th>
            <th scope="col" className="p-2">RPU</th>
            <th scope="col" className="p-2">Prev Stock</th>
            <th scope="col" className="p-2">Available Stock</th>
            <th scope="col" className="p-2">MORE/LESS Stock</th>
            <th scope="col" className="p-2">Total CPU</th>
            <th scope="col" className="p-2">Total RPU</th>
          </tr>
        </thead>
        <tbody className="">
          {
            addedProducts.length > 0 && addedProducts.map((item, index) => (
              <tr key={item.id} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-300'} border-b border-gray-700 hover:bg-slate-200 duration-150 h-fit`}>
                <th scope="row" className="pl-2 font-medium text-gray-900 whitespace-nowrap">
                  {item.id}
                </th>
                <td className="pl-2 px-6">{item.product_barcode}</td>
                <td className="pl-2 px-6">{item.name}</td>
                <td className="pl-2 px-6">{item.category.name}</td>
                <td className="pl-2 px-6">{item.brand.name}</td>
                <td className="pl-2 w-40">{item.cost_price}</td>
                <td className="pl-2 w-40">{item.MRP_price}</td>
                <td className="pl-2 w-40">{item.stock}</td>
                <td className="pl-2 w-40">{item.available_stock}</td>
                <td className="pl-2 w-40">{item.available_stock - item.stock}</td>
                <td className="pl-2 w-40">{item.available_stock * item.cost_price}</td>
                <td className="pl-2 w-40">{item.available_stock * item.MRP_price}</td>
              </tr>
            ))
          }
          {
            notAddedProducts.length > 0 &&
            <>
              <tr>
                <td style={{ fontSize: '14px', padding: '6px', fontWeight: 600, color: 'white', backgroundColor: '#1864ab' }} colSpan={12}>Not Added Products:</td>
              </tr>
              {
                notAddedProducts.map((item, index) => (
                  <tr key={item.id} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-300'} border-b border-gray-700 hover:bg-slate-200 duration-150 h-fit`}>
                    <th scope="row" className="pl-2 font-medium text-gray-900 whitespace-nowrap">
                      {item.id}
                    </th>
                    <td className="pl-2 px-6">{item.product_barcode}</td>
                    <td className="pl-2 px-6">{item.name}</td>
                    <td className="pl-2 px-6">{item.category?.name}</td>
                    <td className="pl-2 px-6">{item.brand?.name}</td>
                    <td className="pl-2 w-40">{item.cost_price}</td>
                    <td className="pl-2 w-40">{item.MRP_price}</td>
                    <td className="pl-2 w-40">{item.stock}</td>
                    <td className="pl-2 w-40">{0}</td>
                    <td className="pl-2 w-40">{0 - item.stock}</td>
                    <td className="pl-2 w-40">{0 * item.cost_price}</td>
                    <td className="pl-2 w-40">{0 * item.MRP_price}</td>
                  </tr>
                ))
              }
            </>
          }
        </tbody>
        <tfoot className="bg-slate-500 text-slate-50 sticky bottom-0 left-0 text-xs text-left">
          <tr className="" style={{ fontWeight: '600',  }}>
            <td className="pl-2 text-right" colSpan={7}>Grand Total</td>
            {/* <td className="pl-2 ">{grandTotal?.cost_price}</td>
            <td className="pl-2 ">{grandTotal?.MRP_price}</td>
            <td className="pl-2 ">{grandTotal?.stock}</td> */}
            <td className="pl-2 ">{notAddedProducts.reduce((prev, curr) => prev + curr.stock, 0) + grandTotal.stock}</td>
            <td className="pl-2 ">{grandTotal?.available_stock}</td>
            <td className="pl-2 ">{-notAddedProducts.reduce((prev, curr) => prev + curr.stock, 0) + grandTotal?.stock_difference}</td>
            <td className="pl-2 ">{Number(grandTotal?.total_cost_price).toFixed(2)}</td>
            <td className="pl-2 ">{Number(grandTotal?.total_MRP_price).toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}