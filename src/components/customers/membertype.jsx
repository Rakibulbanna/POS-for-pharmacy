import { Button, NumberInput, TextInput } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useRef, useState } from "react";
import { BaseAPI, HTTP } from "~/repositories/base";
import EditMemberType from "./editMemberType";
import purchaseOrder from "~/src/images/purchase-order.svg";

export default function ({ getMembersType, setRerenderMemberType }) {

    const [editMemberInfo, setEditMemberInfo] = useState([]);
    const [newCardData, setNewCardData] = useState({
        name: '',
        discount: 0
    })

    //handle create a 
    const handleCreateMemberTypes = (e) => {

        if (!newCardData.name || !newCardData.discount) return;

        HTTP.post(`${BaseAPI}/membership-types`, newCardData)
            .then((res) => {
                showNotification({
                    title: "Success",
                    message: "Category updated"
                })
                setRerenderMemberType((value) => !value);
                setNewCardData({ name: '', discount: 0 });
            })
            .catch(err => {
                console.log(err)
                showNotification({
                    title: "Error",
                    message: ""
                })
            })
    };

    //for delete card type
    const handleDeletMemberType = (id) => {

        HTTP.delete(`${BaseAPI}/membership-types/${id}`)
            .then(res => {
                showNotification({
                    title: "Success",
                    message: "Member type deleted"
                })
                setRerenderMemberType((value) => !value);
            })
            .catch(err => {
                console.log(err)
                showNotification({
                    title: "Error",
                    message: ""
                })
            })
    }
    return (
        <div className="">
            <div className="flex gap-4">
                <div className="overflow-y-auto h-52 w-full" style={{ border: '1px solid #d1d5db' }}>
                    <table className=" w-full text-sm text-left text-gray-500 h-6 ">
                        <thead className=" w-full z-10 text-xs uppercase bg-gray-600 text-gray-200 sticky -top-1 left-0">
                            <tr className="sticky top-0 w-full h-10">
                                <th scope="col" className=" px-2">
                                    Card name
                                </th>
                                <th scope="col" className=" px-2">
                                    discount <span className="text-sky-300"> ( % )</span>
                                </th>

                                <th scope="col" className=" px-2">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody className="relative">
                            {
                                getMembersType.length > 0 &&
                                getMembersType.map((item, index) => (
                                    <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'} border-b border-gray-700 duration-150`}>
                                        <th scope="row" className=" px-6 font-medium text-gray-900 whitespace-nowrap">
                                            {item.name}
                                        </th>
                                        <td className="px-6">
                                            {item.discount}
                                        </td>
                                        <td className="">
                                            <Button onClick={() => setEditMemberInfo(() => [item])} className={"ml-6 h-6"} radius='xs' color={"cyan"} >Edit</Button>
                                            <Button onClick={() => handleDeletMemberType(item.id)} className={"ml-6 h-6"} radius='xs' color={"red"} >Delete</Button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    {
                        getMembersType.length === 0 &&
                        <div className="pt-8 w-full flex justify-center flex-col text-center">
                            <div className="relative bg-sky-100 p-5  mx-auto border border-gray-500 rounded-full ">
                                <img className=" absolute top-[10px] left-[10px]  h-5 fill-gray-400 " src={purchaseOrder} />
                            </div>
                            <div className="pt-6 font-semibold text-base text-gray-400">Sorry! No Member Type Founds</div>
                        </div>
                    }
                </div>

                {/* create product */}
                <div className="w-1/3 flex justify-between flex-col h-52 p-[1px]" style={{ border: '1px solid #d1d5db' }}>
                    <div className="bg-slate-700 text-slate-200 py-2.5 text-md capitalize text-center">
                        Add new Card
                    </div>
                    <div className="bg-gray-30 flex gap-4 justify-between">
                        <div className="font-semibold text-sm py-2 pl-2">Name:</div>
                        <div className=" h-4">
                            <TextInput value={newCardData.name} onChange={(e) => { setNewCardData((value) => ({ ...value, name: e.target.value })) }} className="bg-gray-50 w-44 h-8 my-1 active:border-sky-400" placeholder="card name" />
                        </div>
                    </div>
                    <div className="bg-gray-30 flex gap-4 justify-between mt-3 pb-1">
                        <div className=" font-semibold text-sm py-2 pl-2">Discount: <span className="text-sky-400">( % )</span></div>
                        <div className=" h-4">
                            <NumberInput value={newCardData.discount} onChange={(val) => { setNewCardData((value) => ({ ...value, discount: val })) }} type="number" className="bg-gray-50 w-44 h-8 my-1 active:border-sky-400" placeholder="discount" />
                        </div>
                    </div>

                    <div onClick={handleCreateMemberTypes} className=" cursor-pointer duration-150 hover:bg-slate-500 text-gray-100 w-full p-2 text-center text-base bg-slate-400">Add</div>
                </div>
            </div>

            {/* edit member type components */}
            {
                editMemberInfo.length > 0 &&
                <div className="absolute backdrop-blur h-screen w-screen left-0 top-0 mx-auto z-50">
                    <EditMemberType
                        setRerenderMemberType={setRerenderMemberType}
                        editMemberInfo={editMemberInfo}
                        setEditMemberInfo={setEditMemberInfo}
                    />
                </div>
            }


        </div>
    )
}