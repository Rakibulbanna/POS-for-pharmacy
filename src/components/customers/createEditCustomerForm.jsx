import { Button, Input } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { BaseAPI, HTTP } from "~/repositories/base";
import deleteicon from "~/src/images/delete-icon.svg";

export default function ({ setShowForm, getMembersType, setRerenderMemberType, editdata = [] }) {

    const [getFormData, setGetFormData] = useState(editdata[0]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectMembership, setSelectMembership] = useState(null);

    useEffect(() => {
        if (editdata[0]?.membership_type?.name) setSelectMembership(() => editdata[0].membership_type?.name);
    }, [editdata])

    const handleFormInput = (event) => {
        const copyFormData = { ...getFormData };
        copyFormData[event.target.name] = event.target.value;
        setGetFormData(() => copyFormData);
    }

    const handleGetMemberId = (value) => {
        setSelectMembership(() => value.name)
        const copyFormData = { ...getFormData };
        copyFormData['membership_type_id'] = value.id;
        setGetFormData(() => copyFormData);
        setShowDropdown((value) => !value);
    }

    //form send to database ;
    const handleForm = (e) => {
        e.preventDefault();

        if (editdata?.length > 0) {
            //edit product dend database
            const { id, first_name, phone_number, email, address, membership_type_id, customer_id, credit_limit } = getFormData;
            const copyData = { id, first_name, phone_number, email, address, membership_type_id, customer_id, credit_limit };

            HTTP.patch(`${BaseAPI}/customers/${editdata[0].id}`, copyData)
                .then(res => {
                    showNotification({
                        title: "Success",
                        message: "successfully customer created"
                    })
                    setRerenderMemberType((value) => !value);
                    setShowForm(() => false)
                })
                .catch(err => {
                    console.log(err)
                    showNotification({
                        title: "Error",
                        message: ""
                    })
                })
        }
        //create new product send to database
        else {
            // console.log(getFormData)
            HTTP.post(`${BaseAPI}/customers`, getFormData)
                .then(res => {
                    showNotification({
                        title: "Success",
                        message: "successfully customer created"
                    })
                    setRerenderMemberType((value) => !value);
                    setShowForm(false)
                })
                .catch(err => {
                    console.log(err)
                    showNotification({
                        title: "Error",
                        message: ""
                    })
                })
        }
    }

    // console.log({ getFormData })

    return <>
        <div className=" absolute h-full w-full backdrop-blur top-0 left-0 flex justify-center justify-items-center z-50">
            <form
                onSubmit={handleForm}
                className='z-50 w-fit bg-slate-50 p-10 my-auto rounded-md shadow-md shadow-slate-700'
            >
                <div className=" flex justify-center text-lg  text-center relative z-0 mb-6 w-full group">
                    <div>{editdata?.length > 0 ? 'Edit Customer' : 'New Customer'}</div>
                    <img className="absolute right-0 top-0 cursor-pointer h-10 hover:scale-110 duration-150 " src={deleteicon} onClick={() => setShowForm(() => false)} />
                </div>
                <div className="flex gap-4" >
                    <div className="relative z-0 mb-6 w-full group">
                        <label htmlFor="first_name" className=" left-10 ">Name</label>
                        <Input onChange={handleFormInput} value={getFormData?.first_name} type="text" name="first_name" id="floating_first_name" className=" w-full text-sm " placeholder=" " />
                    </div>
                    <div className="relative z-0 mb-6 w-full group">
                        <label htmlFor="customer_id" className=" left-10 bg-slate-50 ">Customer ID</label>
                        <Input onChange={handleFormInput} value={getFormData?.customer_id} type="text" name="customer_id" id="customer_id" className=" w-full text-sm " placeholder=" " />
                    </div>
                </div>

                <div className="relative z-0 mb-6 w-full group">
                    <label htmlFor="phone_number" className=" left-10 bg-slate-50 ">Phone Number</label>
                    <Input required onChange={handleFormInput} value={getFormData?.phone_number} type="number" name="phone_number" id="floating_first_name" className=" w-full text-sm " placeholder=" " />
                </div>
                <div className="relative z-0 mb-6 w-full group">
                    <label htmlFor="email" className=" left-10 bg-slate-50 ">Email</label>
                    <Input onChange={handleFormInput} value={getFormData?.email} type="email" name="email" id="floating_first_name" className=" w-full text-sm " placeholder=" " />
                </div>
                <div className="relative z-0 mb-6 w-full group">
                    <label htmlFor="address" className=" left-10 bg-slate-50 ">Address</label>
                    <Input onChange={handleFormInput} value={getFormData?.address} type="text" name="address" id="address" className=" w-full text-sm " placeholder=" " />
                </div>
                <div className="relative z-0 mb-6 w-full group">
                    <label htmlFor="address" className=" left-10 bg-slate-50 ">Credit Limit</label>
                    <Input type="number" onChange={handleFormInput} value={getFormData?.credit_limit} name="credit_limit" id="credit_limit" className=" w-full text-sm " placeholder=" " />
                </div>
                <div className="relative z-0 mb-6 w-52 group">
                    <button
                        type="button"
                        className="  inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-slate-50 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                        id="menu-button"
                        aria-expanded="true"
                        aria-haspopup="true"
                        onClick={() => setShowDropdown((value) => !value)}
                    >
                        {getFormData?.membership_type_id ? selectMembership : 'Membership Type'}
                        <svg className={`${showDropdown ? 'rotate-90' : 'rotate-0'} relative duration-150 -mr-1 ml-2 h-5 w-5`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                        </svg>

                    </button>
                    {
                        getMembersType.length > 0 && showDropdown &&
                        <div className=" scroll-smooth max-h-40 overflow-auto capitalize absolute mt-1 w-full text-gray-700 rounded shadow-md shadow-slate-600 bg-slate-50">
                            {
                                getMembersType.map(
                                    (value, index) =>
                                        <div onClick={() => handleGetMemberId(value)} key={index} value={value.id} name="membership_type_id" className=" hover:bg-gray-300 pl-4 py-2 cursor-pointer">{value.name}</div>
                                )
                            }
                        </div>
                    }

                </div>
                <Button className="-z-10" type="submit" fullWidth>
                    Submit
                </Button>
            </form>
        </div>
    </>
}