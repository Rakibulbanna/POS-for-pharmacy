import { Button, Input, NumberInput } from "@mantine/core";
import purchaseOrder from "~/src/images/purchase-order.svg";

export default function ({ products, setProducts, }) {

    //update product quantity
    const handleUpdateProduct = (value) => {

        const updatepPurchaseProductList = products.map((product) => {
            if (product.id !== value.id) return product;

            return { ...product }
        })
        setProducts(() => updatepPurchaseProductList);
    }

    //handle update product
    const handleDeleteProduct = (product) => {

        const mapProductDescription = products.filter((value) => value.id !== product.id)
        setProducts(() => mapProductDescription)
    }

    const handleDiscPercentChange = (value, productId, type) => {
        let updateProduct = [];
        if (type === 'percent') {
            updateProduct = products.map((item) => productId === item.id ? { ...item, disc_in_percent: value } : item)
            // setProducts((value) => )
        }
        if (type === 'amount') {
            updateProduct = products.map((item) => productId === item.id ? { ...item, disc_in_amount: value } : item)
            // setProducts((value) => )
        }
        setProducts(() => updateProduct)
    }


    return <>

        <div className=" h-[calc(100vh-394px)] overflow-auto relative overflow-y-auto mt-1"
            style={{ border: '1px solid #94a3b8' }}
        >
            <table className="w-full text-sm text-left text-gray-300  overflow-y-auto">
                <thead className=" text-xs uppercase bg-gray-700 text-gray-300 overflow-auto">
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
                            Disc. In Percent
                        </th>
                        <th scope="col" className="py-1 px-2">
                            Disc. In Amt.
                        </th>
                        <th scope="col" className="py-1 px-2">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody className="text-gray-600 overflow-y-auto bg-gray-100 text-xs">
                    {products.map((product, index) =>
                        <tr key={index} className={`${index % 2 === 0 ? '' : 'bg-gray-200'} border-b  border-gray-700`}>
                            <th scope="row" className="py-1 px-2 font-medium  whitespace-nowrap text-gray-600">
                                {index + 1}
                            </th>
                            <th scope="row" className="py-1 px-2 font-medium  whitespace-nowrap text-gray-600">
                                {product.name}
                            </th>
                            <td className="py-1 px-2">
                                {product.stock}
                            </td>
                            <td className="py-1 px-2">
                                {product.request_quantity}
                            </td>
                            <td className="py-1 px-2">
                                {product.cost_price}
                            </td>
                            <td className="py-1 px-2">
                                {product.MRP_price}
                            </td>
                            <td className="py-1 px-2 w-fit">
                                <Input size="xs" height={4} className="w-fit h-fit" onChange={(e) => handleDiscPercentChange(e.target.value, product.id, 'percent')} value={product.disc_in_percent} />
                            </td>
                            <td className="py-1 px-2">
                                <Input size="xs" className="w-fit h-" onChange={(e) => handleDiscPercentChange(e.target.value, product.id, 'amount')} value={product.disc_in_amount} />
                            </td>

                            <td className="px-2">
                                <Button size="xs" onClick={() => handleDeleteProduct(product)} color={"red"}> Delete</Button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            {
                products.length === 0 &&
                <div className=" mt-10 w-full flex justify-center flex-col text-center">
                    <div className="bg-sky-100 pt-6 p-5 px-6 mx-auto border border-gray-500 rounded-full ">
                        <img className=" h-4 fill-gray-400 " src={purchaseOrder} />
                    </div>
                    <div className="pt-3 font-semibold text-base text-gray-400">Sorry! No Products Selected</div>
                </div>
            }
        </div>
    </>
}