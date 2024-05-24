import EmptyNotification from "@/utility/emptyNotification";
import {Button, TextInput} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import { useEffect } from "react";
import { BaseAPI, HTTP } from "~/repositories/base";
import CreateEditCustomerForm from "./createEditCustomerForm";

export default function ({ editdata, setEditData, setShowEditForm, getMembersType, rerenderMemberType, setRerenderMemberType }) {

    const [customers, setCustomers] = useState([]);
    const [searchToken, setSearchToken] = useState("");

    //get all customers 
    useEffect(() => {
        HTTP.get(`${BaseAPI}/customers`)
            .then(res => {
                setCustomers(() => res.data.data);
            })
            .catch(err => {
                console.log(err)
            })
    }, [rerenderMemberType]);

    // console.log(customers)

    //handle delete customer
    const handleDeleteCustomers = (id) => {
        HTTP.delete(`${BaseAPI}/customers/${id}`)
            .then(res => {
                showNotification({
                    title: "Success",
                    message: "successfully customer created"
                })
                setRerenderMemberType((value) => !value);
            })
            .catch(err => {
                console.log(err)
            })
    }

    const handleSearch = () => {
        HTTP.get(`${BaseAPI}/customers/search-by-name-or-user?token=${searchToken}`).then(res=>{
            setCustomers(res.data.customers)
        }).catch(err=>{
            console.log(err)
        })
    }

    //handle edit 
    const handleEditButtonClick = (value) => {
        setEditData(() => [value]);
        setShowEditForm((value) => !value)
    }

    return <>
        <div className={"flex justify-center items-center gap-4 mb-2"}>
            <div>Name/Phone: </div>
            <TextInput value={searchToken} onChange={e=> setSearchToken(e.target.value)}/>
            <Button onClick={handleSearch}>Search</Button>
        </div>
        <div className="h-[calc(100vh-305px)] w-full overflow-auto" style={{ border: '1px solid #d1d5db' }}>
            <table className="w-full text-sm text-left text-gray-500 p-[1px]">
                <thead className=" w-full text-xs uppercase bg-gray-600 text-gray-200 rounded-md sticky -top-1 left-0 z-10">
                    <tr className="sticky top-0 w-full h-10">
                        <th scope="col" className="py-3 px-6">
                            Customer Id
                        </th>
                        <th scope="col" className="py-3 px-6">
                            Name
                        </th>

                        <th scope="col" className="py-3 px-6">
                            Phone Number
                        </th>
                        <th scope="col" className="py-3 px-6">
                            Card name
                        </th>
                        <th scope="col" className="py-3 px-6">
                            Credit Limit
                        </th>
                        <th scope="col" className="py-3 px-6">
                            Action
                        </th>
                    </tr>
                </thead>

                <tbody className="relative">
                    {
                        customers.length > 0 &&
                        customers.map((customer, index) => (
                            <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'} border-b border-gray-700 duration-150`}>
                                <th scope="row" className=" px-6 font-medium text-gray-900 whitespace-nowrap">
                                    {customer.customer_id}
                                </th>
                                <td className=" px-6">
                                    {customer.first_name}
                                </td>
                                <td className=" px-6">
                                    {customer.phone_number}
                                </td>
                                <td className=" px-6">
                                    {customer.membership_type?.name}
                                </td>
                                <td className=" px-6">
                                    {customer.credit_limit}
                                </td>
                                <td className="">
                                    <Button onClick={() => handleEditButtonClick(customer)} className={"ml-6 h-6"} radius="xs" color={"cyan"} >Edit</Button>
                                    <Button onClick={() => handleDeleteCustomers(customer.id)} className={"ml-6 h-6"} radius="xs" color={"red"} >Delete</Button>
                                </td>
                            </tr>
                        ))}
                </tbody>

            </table>
            {customers.length === 0 &&
                <div className=" mt-10 flex justify-center">
                    <EmptyNotification value='Customers' />
                </div>
            }

        </div>
    </>
}