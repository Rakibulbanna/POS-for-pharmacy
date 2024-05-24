import { Button, Modal, Radio, Select, Table, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { HTTPCall } from "~/lib/http";
import { BackTop } from "@arco-design/web-react";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";

export default function SubAccounts() {
    const [showCreateModal, setShowCreteModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [subAccounts, setSubAccounts] = useState([])
    const [editId, setEditUId] = useState();
    useEffect(() => {
        getSubAccounts()
    }, [])
    const getSubAccounts = async () => {
        const [res, err] = await HTTPCall("/account-management/sub-accounts")
        if (err) {
            console.log(err)
            return
        }
        setSubAccounts(res.data)
    }
    const handleDelete = async (id) => {
        const [res, err] = await HTTPCall("/account-management/sub-accounts/" + id, "DELETE")
        if (err) {
            console.log(err)
            return
        }

        showNotification({
            message: "Deleted"
        })
        getSubAccounts()
    }
    const handleEdit = async (id) => {
        const [res, err] = await HTTPCall("/account-management/sub-accounts/" + id, "PATCH")
        if (err) {
            console.log(err)
            return
        }

        showNotification({
            message: "Deleted"
        })
        getSubAccounts()
    }


    return (
        <>
            <Button onClick={() => {
                setShowCreteModal(true);
            }}>Create Sub Account</Button>
            <Table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Account Name</th>
                        <th>Payment Type</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {subAccounts.map(account => (
                        <tr key={account.id}>
                            <td>{account.name}</td>
                            <td>{account.account.name}</td>
                            <td>{account.balance_type == 1 ? "Debit" : "Credit"}</td>



                            <td><div className="flex gap-2 "><Button onClick={() => {
                                setEditUId(account.id);
                                setShowEditModal(true);
                            }}>Edit</Button>
                                <Button onClick={() => handleDelete(account.id)}>Delete</Button> </div></td>
                        </tr>
                    ))}

                </tbody>
            </Table>
            <Modal opened={showCreateModal} onClose={setShowCreteModal} title={"Create Sub Account"}>
                <CreateUI onSuccess={() => {
                    setShowCreteModal(false);
                    getSubAccounts();
                }} />
            </Modal>
            <Modal opened={showEditModal} onClose={setShowEditModal} title={"Edit Sub Account"}>
                <EditUI onSuccess={() => {
                    setShowEditModal(false);
                    getSubAccounts();
                }} editId={editId} />
            </Modal>
        </>
    )
}

function CreateUI({ onSuccess, editId }) {

    return (
        <>
            <div>
                <Form editId={editId} onSuccess={onSuccess} />
            </div>
        </>
    )
}

function EditUI({ onSuccess, editId }) {
    
    const [subAccount, setSubAccount] = useState(null)
    useEffect(()=>{
        getSubAccount()
    },[])
    const getSubAccount = async () => {
        const [res, err] = await HTTPCall("/account-management/sub-accounts/"+editId)
        if (err) {
            console.log(err);
            return
        }

        setSubAccount(res.data)

    }
    return (
        <>
            <div>
                <Form subAccount={subAccount} onSuccess={onSuccess} />
            </div>
        </>
    )
}

function Form({ onSuccess, subAccount=null }) {
    // get all the existing accounts
    const [accounts, setAccounts] = useState([])

    const form = useForm({
        initialValues: {
            account_id: null,
            name: "" ,
            balance_type: null,
        },
        validate: {
            account_id: v => v !== null ? null : "select account",
            balance_type: v => v !== null ? null : "select balance type"
        }
    })

    useEffect(() => {
        getNSetAccounts()
    }, [])

    useEffect(()=>{
        if (subAccount) {
            form.setFieldValue("account_id", subAccount.account_id)
            form.setFieldValue("name", subAccount.name)
            form.setFieldValue("balance_type", subAccount.balance_type.toString())
        }
    },[subAccount])

    const getNSetAccounts = async () => {
        const [res, err] = await HTTPCall("/account-management/accounts")
        if (err) {
            console.log(err)
            return
        }

        setAccounts(res.data.data.map(account => {
            return { ...account, label: account.name, value: account.id }
        }))
    }
    const handleSubmit = async (values) => {
        if (subAccount) {
            const [res, err] = await HTTPCall(`/account-management/sub-accounts/${subAccount.id}`, "PATCH", values)
            if (err) {
                console.log(err)
                showNotification({
                    message: "Error",
                    color: "red",
                })
                return
            }

            showNotification({
                message: "Edited Successfully"
            })
        }
        else {
            const [res, err] = await HTTPCall("/account-management/sub-accounts", "POST", values)
            if (err) {
                console.log(err)
                showNotification({
                    message: "Error",
                    color: "red",
                })
                return
            }

            showNotification({
                message: "Created Successfully"
            })
        }

        onSuccess()
    }
    return (
        <>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Select data={accounts}
                    //  defaultValue={}
                    label={"Select Account"}
                    required={true}
                    {...form.getInputProps("account_id")}
                />

                <TextInput label={"Name"} required={true} {...form.getInputProps("name")} />
                <Radio.Group label={"Balance Type"} name={"balance_type"} {...form.getInputProps("balance_type")} withAsterisk={true}>
                    <Radio value={"1"} label={"Debit"} />
                    <Radio value={"2"} label={"Credit"} />
                </Radio.Group>
                <Button type={"submit"}>Submit</Button>
            </form>

        </>
    )
}