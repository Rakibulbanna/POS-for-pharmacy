import { Button, NumberInput } from "@mantine/core";
import purchaseOrder from "~/src/images/purchase-order.svg";

export default function ({ addedbuyOneGetOneProducts }) {

  //update product quantity
  // const handleUpdateProduct = (value) => {

  //     const updatepPurchaseProductList = products.map((product) => {
  //         if (product.id !== value.id) return product;

  //         return { ...product, quantity: value.quantity }
  //     })
  //     setProducts(() => updatepPurchaseProductList);
  // }

  //handle update product
  // const handleDeleteProduct = (product) => {
  //     const mapProductDescription = products.filter((value) =>
  //         value.id !== product.id
  //     )
  //     setProducts(() => mapProductDescription)
  // }

  return <>
    <div className=" h-[calc(100vh-387px)] bg-slate-50 overflow-auto relative p-1" style={{ border: '1px solid #64748b' }} >
      {
        addedbuyOneGetOneProducts.length > 0 ?
          addedbuyOneGetOneProducts.map((value, index) => (
            <div key={index} className={` ${index > 0 ? 'mt-1 ' : ''} grid grid-cols-2 overflow-auto`} style={{ border: '1px solid #94a3b8' }}>
              
              <div className="px-1 col-start-1 col-end-2 font-semibold">
                <div>Buy Products </div>
              </div>
              <div className="px-1  font-semibold">
                <div>Get Products </div>
              </div>
              <div className="flex gap-1 col-start-1 col-end-3">
                <table className="h-fit col-start-1 col-end-2 w-full text-xs text-left text-gray-300">
                  <thead className="text-xs uppercase bg-gray-700 text-gray-300">
                    <tr>
                      <th scope="col" className="px-4 py-1"> Product name</th>
                      <th scope="col" className="px-4 py-1 w-2/12 min-w-fit">Quantity</th>
                      <th scope="col" className="px-4 py-1"> Stock</th>
                      <th scope="col" className="px-4 py-1">CPU</th>
                      <th scope="col" className="px-4 py-1">RPU</th>
                      {/* <th scope="col" className="px-4 py-1">Action </th> */}
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 overflow-y-auto bg-gray-100 text-xs">
                    {value.buy_products.map((product, index) =>
                      <tr key={index} className={`${index % 2 === 0 ? '' : 'bg-gray-200'}  border-gray-700`}>
                        <th className="px-3 whitespace-nowrap text-gray-600">
                          {product.name}
                        </th>
                        <td className="px-2">
                          <NumberInput
                            size="xs"
                            typeof="number"
                            onChange={(e) => handleUpdateProduct({ quantity: e, id: product.id })}
                            width={10}
                            defaultValue={product?.quantity}
                            value={product?.quantity}
                            min={product.minimum_order_quantity}
                            max={product.stock}
                          />
                        </td>
                        <td className="px-3">{product.stock}</td>
                        <td className="px-3">{product.cost_price}</td>
                        <td className="px-3">{product.MRP_price}</td>
                        {/* <td className="px-3">
                      <Button onClick={() => handleDeleteProduct(product)} color={"red"} className="h-8"> Delete</Button>
                    </td> */}
                      </tr>
                    )}
                  </tbody>
                </table>
                <table className=" h-fit col-start-2 col-end-3 w-full text-xs text-left text-gray-300">
                  <thead className="text-xs uppercase bg-gray-700 text-gray-300">
                    <tr>
                      <th scope="col" className="px-4 py-1"> Product name</th>
                      <th scope="col" className="px-4 py-1 w-2/12 min-w-fit">Quantity</th>
                      <th scope="col" className="px-4 py-1"> Stock</th>
                      <th scope="col" className="px-4 py-1">CPU</th>
                      <th scope="col" className="px-4 py-1">RPU</th>
                      {/* <th scope="col" className="px-4 py-1">Action </th> */}
                    </tr>
                  </thead>

                  <tbody className="text-gray-600 overflow-y-auto bg-gray-100 text-xs">
                    {value.get_products.map((product, index) =>
                      <tr key={index} className={`${index % 2 === 0 ? '' : 'bg-gray-200'} border-b  border-gray-700`}>
                        <th scope="row" className="px-3 whitespace-nowrap text-gray-600">
                          {product.name}
                        </th>
                        <td className="px-2">
                          <NumberInput
                            typeof="number"
                            size="xs"
                            onChange={(e) => handleUpdateProduct({ quantity: e, id: product.id })}
                            width={10}
                            defaultValue={product?.quantity}
                            value={product?.quantity}
                            min={product.minimum_order_quantity}
                            max={product.stock}
                          />
                        </td>
                        <td className="px-3">{product.stock}</td>
                        <td className="px-3">{product.cost_price}</td>
                        <td className="px-3">{product.MRP_price}</td>
                        {/* <td className="px-3">
                      <Button onClick={() => handleDeleteProduct(product)} color={"red"} className="h-8"> Delete</Button>
                    </td> */}
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )
          )
          :
          <div className="p-10 mt-8 w-full flex justify-center flex-col text-center">
            <div className="bg-sky-100 pt-6 p-5 px-6 mx-auto border border-gray-500 rounded-full ">
              <img className=" h-4 fill-gray-400 " src={purchaseOrder} />
            </div>
            <div className="pt-3 font-semibold text-base text-gray-400">Sorry! No Products Added</div>
          </div>

      }

    </div>

  </>
}