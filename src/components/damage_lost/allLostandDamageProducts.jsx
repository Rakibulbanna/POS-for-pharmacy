import { Badge, Button } from "@mantine/core";
import { useEffect, useState } from "react";
import { BaseAPI, HTTP } from "~/repositories/base";

export default function ({ damageAndLostProductRerender }) {

    const [damageAndLostProducts, setDamageAndLostProducts] = useState([])

    // useEffect(() => {
    //     HTTP.get(`${BaseAPI}/damage-lost`)
    //         .then((res) => {
    //             setDamageAndLostProducts(() => res.data.data);
    //             // console.log(res.data.data)
    //         })
    //         .catch(err => {
    //             console.log(err)
    //         })
    // }, [damageAndLostProductRerender])

    return <>

        <div
            className="mt-2 h-[calc(100vh-165px)] shadow-black rounded-sm max-w-full"
            style={{ border: '1px solid #cbd5e1' }}
        >
            <div className="overflow-x-auto relative">
                <table className="w-full text-sm text-left text-gray-300">
                    <thead className="text-xs uppercase bg-gray-700 text-gray-300">
                        <tr>
                            <th scope="col" className="py-3 px-6">
                                Product Name
                            </th>
                            <th scope="col" className="py-3 px-6">
                                Quantity
                            </th>
                            <th scope="col" className="py-3 px-6 w-28">
                                Status
                            </th>
                            <th scope="col" className="py-3 px-6">Reason</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 overflow-y-auto">
                        {
                            damageAndLostProducts.length > 0 &&
                            damageAndLostProducts.map((product, index) =>
                                <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'} border-b  border-gray-700`}>
                                    <th scope="row" className="px-6 font-medium  whitespace-nowrap text-gray-600">
                                        {product.product.name}
                                    </th>
                                    <td className="px-6 w-16 text-center">
                                        {product.quantity}
                                    </td>
                                    <td className="px-6">
                                        {product.status === 1 &&
                                            <Badge radius="0" fullWidth variant={'outline'} color="yellow">Damage</Badge>
                                        }
                                        {product.status === 2 &&
                                            <Badge radius="0" fullWidth variant={'outline'} color="red">Lost</Badge>
                                        }
                                    </td>
                                    <td className=" text-ellipsis">{product.reason}</td>
                                </tr>
                            )}

                    </tbody>
                </table>
            </div>

        </div>
    </>
}