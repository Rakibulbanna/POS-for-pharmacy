import { Link } from "react-router-dom";
import { Button } from "@mantine/core";
import { useEffect, useState } from "react";
import { BaseAPI, HTTP } from "~/repositories/base";
import { showNotification } from "@mantine/notifications";
import EmptyNotification from "@/utility/emptyNotification";

export default function () {
    const [colors, setColors] = useState([])

    useEffect(() => {
        HTTP.get(`${BaseAPI}/colors`).then(res => {
            setColors(res.data.data)
        })
    }, [])

    const handleDelete = (id) => {
        HTTP.delete(`${BaseAPI}/colors/${id}`).then(res => {
            showNotification({
                title: "Success",
                message: "color deleted"
            })

            HTTP.get(`${BaseAPI}/colors`).then(res => {
                setColors(res.data.data)
            })
        }).catch(err => {
            console.log(err)
            showNotification({
                title: "Error",
                message: ""
            })
        })
    }

    return (
        <>
            <div className="mb-4 flex w-full justify-end">
                <Link to={"/colors/create"}>
                    <Button>Create New Colors</Button>
                </Link>
            </div>
            <div className=" h-[calc(100vh-85px)] overflow-auto w-1/2 mx-auto shadow-sm shadow-black p-1 rounded-md" >
                <div className="h-fit min-h-full shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs uppercase bg-gray-700 text-gray-300 sticky -top-1 left-0">
                            <tr>
                                <th scope="col" className="py-3 px-6">name</th>
                                <th scope="col" className="py-3 px-6">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 overflow-y-auto bg-gray-100">
                            {
                                colors.map((color, index) => (
                                    <tr key={color.id} className={`${index % 2 === 0 ? '' : 'bg-gray-200'} border-b  border-gray-700`}>
                                        <th scope="row" className=" px-6 font-medium  whitespace-nowrap text-gray-600">
                                            {color.name}
                                        </th>
                                        <td className=" px-6 flex gap-4">
                                            <Link to={"/colors/edit/" + color.id}>
                                                <Button size="xs" color={"cyan"}>Edit</Button>
                                            </Link>
                                            <Button size="xs" className={"ml-4"} variant={"outline"} color={"red"} onClick={() => handleDelete(color.id)}>Delete</Button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    {
                        colors.length === 0 &&
                        <div className=" mt-20 flex justify-center">
                            <EmptyNotification value='Colors' />
                        </div>
                    }
                </div>
            </div>
        </>
    )
}
