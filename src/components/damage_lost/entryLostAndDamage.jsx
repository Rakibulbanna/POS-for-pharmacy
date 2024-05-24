import { Button, NumberInput } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useEffect, useState } from "react"
import { BaseAPI, HTTP } from "~/repositories/base";
import returnImage from '~/src/images/return-icon.svg'

export default function ({ setEntrydamageandlost }) {

    const [productDescription, setProductDescription] = useState([]);
    const [quantity, setQuantity] = useState({});

    //for get scan products
    const handleScanProduct = (e) => {
        console.log(e.target.value)
        //get products by scan number 
        if (!e.target.value) return;

        HTTP.get(`${BaseAPI}/products?product_barcode=${e.target.value}`)
            .then((res) => {
                console.log(res.data.data)
                setProductDescription(() => res.data.data);

                //set default quantity 
                const datas = {};
                res.data.data.map((value) => {
                    datas[value.id] = 0
                })
                setQuantity(() => datas)
            })
            .catch(err => {
                console.log(err)
                showNotification({
                    title: "Error",
                    message: ""
                })
            })
    }

    const handleSearchProduct = (e) => {
        console.log(e.target.value)
    }

    //handle change quantity
    const handleChangeQuantity = (id, value) => {
        console.log(id, value)
        const copyQuantity = { ...quantity };
        copyQuantity[id] = value;
        setQuantity(() => copyQuantity)
    }

    //handle lost and damage product
    const handleLostandDamage = (id, status) => {
        console.log(quantity[id], status);
        HTTP.post(`${BaseAPI}/products/${id}/damage-lost?status=${status}&quantity=${quantity[id]}`)
            .then((res) => {
                console.log(res.data.data)
                setProductDescription(() => res.data.data);

                //set default quantity 
                const datas = {};
                res.data.data.map((value) => {
                    datas[value.id] = 1
                })
                setQuantity(() => datas)
            })
            .catch(err => {
                console.log(err)
                showNotification({
                    title: "Error",
                    message: ""
                })
            })
    }

    useEffect(() => {
        console.log(quantity)
    })

    return <div className="">
        <div className=" flex justify-between ">
            <div className="flex gap-4">
                <div>
                    <input onChange={handleScanProduct} className=" min-w-full text-base rounded border border-sky-500 px-4 py-2" placeholder="scan product barcode" />
                </div>
                <div className="relative">
                    <input onChange={handleSearchProduct} className=" min-w-full text-base rounded border border-sky-500 px-4 py-2" placeholder="input product name" />
                    <div className=" hidden absolute z-10 duration-300 mt-1 w-full text-gray-100 rounded overflow-hidden">
                        <div className="bg-gray-400 duration-500 hover:bg-gray-500 pl-4 py-2 cursor-pointer">hi</div>
                        <div className="bg-gray-400 duration-500 hover:bg-gray-500 pl-4 py-2 cursor-pointer">hi</div>
                        <div className="bg-gray-400 duration-500 hover:bg-gray-500 pl-4 py-2 cursor-pointer">hi</div>
                    </div>
                </div>
            </div>

            {/* <Button
                size="md"
                
            >
                {'return'}
            </Button> */}
            <div className="my-auto" >
                <img
                    onClick={() => setEntrydamageandlost((value) => !value)}
                    src={returnImage} 
                    className='h-10 px-4 py-2 rounded bg-sky-500 hover:bg-sky-600 duration-200 cursor-pointer '
                />
            </div>
        </div>
        <div className=" mt-10 h-full shadow-sm shadow-black p-2 rounded-md" >
            <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-300">
                    <thead className="text-xs uppercase bg-gray-700 text-gray-300">
                        <tr>
                            <th scope="col" className="py-3 px-6">
                                Product Name
                            </th>
                            <th scope="col" className="py-3 px-6">
                                Quantity
                            </th>
                            <th scope="col" className="py-3 px-6">
                                CPU
                            </th>
                            <th scope="col" className="py-3 px-6">
                                RPU
                            </th>
                            <th scope="col" className="py-3 px-6">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 overflow-y-auto">
                        {productDescription.map((product, index) =>
                            <tr key={index} className={`${index % 2 === 0 ? '' : 'bg-gray-100'} border-b  border-gray-700`}>
                                <th scope="row" className="px-6 font-medium  whitespace-nowrap text-gray-600">
                                    {product.name}
                                </th>
                                <td className="px-6">
                                    <NumberInput
                                        typeof="number"
                                        width={150}
                                        step={1}
                                        onChange={(e) => handleChangeQuantity(product.id, e)}
                                        value={quantity[product.id]}
                                        min={1}
                                        max={product.maximum_order_quantity}
                                    />
                                </td>
                                <td className="px-6">
                                    {product.cost_price}
                                </td>
                                <td className="px-6">
                                    {product.MRP_price}
                                </td>
                                <td className="flex gap-4 justify-center my-auto h-full">
                                    {/* <Button onClick={() => handleLostandDamage(product.id, 'damage',)} color={"yellow"}> Damage </Button> */}
                                    {/* <Button onClick={() => handleLostandDamage(product.id, 'lost')} color={"red"}> Lost </Button> */}

                                </td>
                            </tr>
                        )}

                    </tbody>
                </table>
            </div>

        </div>

    </div>
}