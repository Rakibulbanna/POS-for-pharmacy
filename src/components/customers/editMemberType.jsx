import { Input } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useRef, useState } from "react";
import { BaseAPI, HTTP } from "~/repositories/base";
import deleteIcon from "~/src/images/delete-icon.svg"

export default function ({ editMemberInfo,setEditMemberInfo, setRerenderMemberType }) {
    const refNewMemberType = useRef(null);
    const refNewMemberDiscount = useRef(null);
    const [memberInfo, setMemberInfo] = useState(editMemberInfo);
    console.log(editMemberInfo);

    const handleEditMemberTypes = () => {
        const data = {};

        data.id = editMemberInfo[0].id;
        data.name = refNewMemberType.current?.value;
        data.discount = refNewMemberDiscount.current?.value;

        console.log({ data })
        if (!data.name || !data.discount) return;

        HTTP.patch(`${BaseAPI}/membership-types/${data.id}`, data)
            .then(res => {
                showNotification({
                    title: "Success",
                    message: "Category updated"
                })
                setRerenderMemberType((value) => !value);
                setEditMemberInfo(()=>[]);
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
        <div className=" h-full w-full z-50 flex items-center justify-center p-2 ">
            <div className=" bg-slate-50 m-auto top-0 p-2 rounded w-fit shadow-lg shadow-slate-700 ">
                <div className="text-lg text-center relative flex  flex-col justify-center text-slate-700 py-3 text-md capitalize">
                    Edit Card
                    <span onClick={()=>setEditMemberInfo(()=>[])} className="duration-150 absolute right-0 top-2 cursor-pointer">
                        <img className="h-8 hover:scale-110" src={deleteIcon} alt="delete" />
                    </span>
                </div>
                <div className="bg-gray-30 flex gap-4 justify-between mt-3">
                    <div className="font-semibold text-sm py-2">Name:</div>
                    <div className=" h-4">
                        <Input  onChange={(e) => setMemberInfo((value) => [{ ...value[0], name: e.target.value }])} value={memberInfo[0].name} ref={refNewMemberType} className="bg-gray-50 h-8 my-1 active:border-sky-400" placeholder="Member type" />
                    </div>
                </div>
                <div className="bg-gray-30 flex gap-4 justify-between mt-3">
                    <div className=" font-semibold text-sm py-2">Discount: <span className="text-sky-400">( % )</span></div>
                    <div className=" h-4 mb-4">
                        <Input onChange={(e) => setMemberInfo((value) => [{ ...value[0], discount: e.target.value }])} value={memberInfo[0].discount} ref={refNewMemberDiscount} type="number" className="bg-gray-50 h-8 my-1 active:border-sky-400" placeholder="discount" />
                    </div>
                </div>

                <div onClick={handleEditMemberTypes} className=" mt-4 cursor-pointer duration-150 hover:bg-slate-500 text-gray-100 w-full p-2 text-center text-base bg-slate-400 mt-4">Update</div>
            </div>
        </div>
    )
}