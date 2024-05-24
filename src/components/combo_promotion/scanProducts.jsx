import { Button, NumberInput } from "@mantine/core";
import purchaseOrder from "~/src/images/purchase-order.svg";

export default function ({ products, setProducts }) {

    //update product quantity
    const handleUpdateProductQuantity = (value) => {

        const updatepPurchaseProductList = products.map((product) => {
            if (product.id !== value.id) return product;

            return { ...product, quantity: value.quantity }
        })
        setProducts(() => updatepPurchaseProductList);
    }

    //handle update product
    const handleDeleteProduct = (product) => {
        const mapProductDescription = products.filter((value) =>
            value.id !== product.id
        )
        setProducts(() => mapProductDescription)
    }

    return <>
        <div className="" >
            <div className="h-[calc(100vh-430px)] overflow-x-auto relative bg-gray-50" style={{ border: '1px solid #cbd5e1' }}>
                <table className="w-full text-sm text-left text-gray-300">
                    <thead className="text-xs uppercase bg-gray-700 text-gray-300">
                        <tr>
                            <th scope="col" className="py-1 px-2 w-10">
                                SL
                            </th>
                            <th scope="col" className="py-1 px-2">
                                Product name
                            </th>
                            <th scope="col" className="py-1 px-2">
                                Stock
                            </th>
                            <th scope="col" className="py-1 px-2">
                                Quantity
                            </th>
                            <th scope="col" className="py-1 px-2">
                                CPU
                            </th>
                            <th scope="col" className="py-1 px-2">
                                RPU
                            </th>
                            <th scope="col" className="py-1 px-2">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 overflow-y-auto bg-gray-100">
                        {products.map((product, index) =>
                            <tr key={index} className={`${index % 2 === 0 ? '' : 'bg-gray-200'} border-b  border-gray-700`}>
                                <th scope="row" className="px-3 font-medium  whitespace-nowrap text-gray-600">
                                    {index + 1}
                                </th>
                                <th scope="row" className="px-3 font-medium  whitespace-nowrap text-gray-600">
                                    {product.name}
                                </th>
                                <td className="px-3">
                                    {product.stock}
                                </td>
                                <td className="px-3 w-fit">
                                    <NumberInput
                                        className=" w-28"
                                        typeof="number"
                                        onChange={(e) => handleUpdateProductQuantity({ quantity: e, id: product.id })}
                                        defaultValue={product?.request_quantity}
                                        value={product?.quantity}
                                        min={product.minimum_order_quantity}
                                        max={product.stock}
                                    />
                                </td>

                                <td className="px-3">
                                    {product.cost_price}
                                </td>
                                <td className="px-3">
                                    {product.MRP_price}
                                </td>
                                <td className="px-3">
                                    <Button className="h-8" onClick={() => handleDeleteProduct(product)} color={"red"}> Delete</Button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {
                    products.length === 0 &&
                    <div className="p-20 w-full flex justify-center flex-col text-center">
                        <div className="bg-sky-100 py-5 p-6 mx-auto border border-gray-500 rounded-full ">
                            <img className=" h-4 fill-gray-400 " src={purchaseOrder} />
                        </div>
                        <div className="pt-3 font-semibold text-base text-gray-400">Sorry! No Products Selected</div>
                    </div>
                }
            </div>

        </div>
    </>
}