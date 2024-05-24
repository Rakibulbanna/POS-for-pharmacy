import { Button, NumberInput } from "@mantine/core";
import purchaseOrder from "~/src/images/purchase-order.svg";

export default function ({ products, setProducts }) {

    //update product quantity
    const handleUpdateProduct = (value) => {

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
        <div className=" h-32 overflow-x-auto relative bg-slate-50 " style={{ border: '1px solid #cbd5e1' }}>
            <table className="w-full text-xs text-left text-gray-300">
                <thead className="text-xs uppercase bg-gray-700 text-gray-300">
                    <tr>
                        <th scope="col" className="px-4 py-1">
                            Product name
                        </th>
                        <th scope="col" className="px-4 py-1">
                            Quantity
                        </th>
                        <th scope="col" className="px-4 py-1">
                            Stock
                        </th>
                        <th scope="col" className="px-4 py-1">
                            CPU
                        </th>
                        <th scope="col" className="px-4 py-1">
                            RPU
                        </th>
                        <th scope="col" className="px-4 py-1">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody className="text-gray-600 overflow-y-auto bg-gray-100 text-xs">
                    {products.map((product, index) =>
                        <tr key={index} className={`${index % 2 === 0 ? '' : 'bg-gray-200'} border-b  border-gray-700`}>
                            <th scope="row" className="px-3 font-medium  whitespace-nowrap text-gray-600">
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
                            <td className="px-3">
                                {product.stock}
                            </td>
                            <td className="px-3">
                                {product.cost_price}
                            </td>
                            <td className="px-3">
                                {product.MRP_price}
                            </td>
                            <td className="px-3">
                                <Button size="xs" onClick={() => handleDeleteProduct(product)} color={"red"} className="h-8"> Delete</Button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

        </div>

    </>
}