import ShowCreatedCustomer from "@/components/customers/createCustomerType";
import CreateEditCustomerForm from "@/components/customers/createEditCustomerForm";
import Membertype from "@/components/customers/membertype";
import { Button } from "@mantine/core";
import { useEffect, useState } from "react"
import { BaseAPI, HTTP } from "~/repositories/base"

export default function () {

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [getMembersType, setMembersType] = useState([]);
    const [rerenderMemberType, setRerenderMemberType] = useState(false);
    const [editdata, setEditData] = useState([]);

    //get members types
    useEffect(() => {
        HTTP.get(`${BaseAPI}/membership-types`)
            .then(res => {
                setMembersType(() => res.data.data);
            })
            .catch(err => {
                console.log(err);
            })
    }, [rerenderMemberType]);


    return (
        <div className="overflow-hidden h-[100vh-12px]">
            {/* CRUD member type */}
            <Membertype
                getMembersType={getMembersType}
                setMembersType={setMembersType}
                rerenderMemberType={rerenderMemberType}
                setRerenderMemberType={setRerenderMemberType}
            />
            <div className="mb-2 mt-4">
                <div className="flex text-center justify-between">
                    <div className=" p-1 flex flex-col justify-end text-slate-600 font-semibold text-base">Customers:</div>
                    <Button
                        onClick={() => setShowCreateForm((value) => !value)}
                        size='sm'
                    >
                        + new customer
                    </Button>
                </div>
            </div>
            <div className="pb-1">
                <ShowCreatedCustomer
                    editdata={editdata}
                    setEditData={setEditData}
                    setShowEditForm={setShowEditForm}
                    rerenderMemberType={rerenderMemberType}
                    setRerenderMemberType={setRerenderMemberType}
                    getMembersType={getMembersType}
                />
            </div>
            {
                showCreateForm &&
                <CreateEditCustomerForm

                    setShowForm={setShowCreateForm}
                    getMembersType={getMembersType}
                    setRerenderMemberType={setRerenderMemberType}
                />

            }
            {
                editdata.length > 0 && showEditForm &&
                <CreateEditCustomerForm
                    setShowForm={setShowEditForm}
                    getMembersType={getMembersType}
                    editdata={editdata}
                    rerenderMemberType={rerenderMemberType}
                    setRerenderMemberType={setRerenderMemberType}
                />
            }
        </div >
    )
}