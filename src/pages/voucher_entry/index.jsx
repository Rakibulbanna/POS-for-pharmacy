import { Button, Input, Modal, NumberInput, Select, Table, TextInput } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useState, useEffect } from 'react';
import { BaseAPI, HTTP } from '~/repositories/base';
import { HTTPCall } from "~/lib/http";
import { color } from '@mui/system';
import { useForm } from '@mantine/form';

export default function () {
    const [vouchers, setVouchers] = useState([])
    const [paymentNote, setPaymentNote] = useState("")
    const [subAccounts, setSubAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState();
    const [selectedPaymentType, setSelectedPaymentType] = useState(null)
    const [amount, setAmount] = useState(0)

    const [editModalOpened, setEditModalOpened] = useState(false);
    const [editValue, setEditValue] = useState();
    const [editId, setEditId] = useState();


    const [extraPaymentInfo, setExtraPaymentInfo] = useState({
        bank_name: null,
        account_number: null
    });

    //get all suppliers
    useEffect(() => {
        getVouchers()
        HTTP.get(`${BaseAPI}/account-management/sub-accounts`).then(res => {
            setSubAccounts(res.data.map(supp => {
                return {
                    label: supp.name,
                    value: supp.id,
                }
            }))
        }).catch(err => {
            console.log(err);
        })
    }, []);

    const getVouchers = async () => {
        const [res, err] = await HTTPCall("/account-management/vouchers")
        if (err) {
            return
        }

        setVouchers(res.data.data)
    }

    //handle select a supplier
    const handleSupplierChange = (v) => {
        setSelectedAccount(() => v);
    }

    const handlePaymentSave = () => {
        let value = {};
        value.sub_account_id = selectedAccount;
        value.payment_amount = amount;
        value.payment_note = paymentNote;

        if (selectedPaymentType === "Cash") value.payment_type = 1;
        if (selectedPaymentType === "Card") value.payment_type = 2;
        if (selectedPaymentType === "Check") value.payment_type = 3;

        if (selectedPaymentType !== "Cash") {
            value.bank_name = extraPaymentInfo.bank_name;
            value.account_number = extraPaymentInfo.account_number;
        }

        HTTP.post(`${BaseAPI}/account-management/voucher`, value).then(res => {
            showNotification({
                title: "Success",
                message: "Successfully Updated"
            });
            //reset values
            setSelectedPaymentType(() => null);
            setSelectedAccount(null)
            setPaymentNote("")
            setAmount(() => 0);
            setExtraPaymentInfo(() => ({
                bank_name: null,
                account_number: null
            }));
            HTTP.get(`${BaseAPI}/account-management/vouchers`).then((res) => {
                setVouchers(res.data.data)
            })
        }).catch(err => {
            console.log(err)
            showNotification({
                title: "Error",
                message: ""
            })
        })
    }
    const handleVoucherEdit = (values) => {
        console.log(values);
        // form.setFieldValue("account_id", subAccount.account_id)
        // form.setFieldValue("name", subAccount.name)
       // form.setFieldValue("balance_type", subAccount.balance_type.toString())

        HTTP.patch(`${BaseAPI}/account-management/vouchers/${editId}`, values).then((res) => {
            showNotification({
                title: "Success",
                message: "Voucher Updated successfully!!",
                color: "blue"
            })
            getVouchers();
        })
    }
    const handleVoucherDelete = (id) => {

        HTTP.delete(`${BaseAPI}/account-management/vouchers/${id}`).then((res) => {
            showNotification({
                title: "Success",
                message: "Voucher Deleted successfully!!",
                color: "blue"
            })
            getVouchers();

        })
    }

    const form = useForm()
    useEffect(() => {
        if (editValue) {
            // form.insertListItem editValue.id
            form.setFieldValue("sub_account_id", editValue?.sub_account?.id)
            form.setFieldValue("payment_amount", editValue?.payment_amount)
            form.setFieldValue("payment_type", editValue?.payment_type)
            form.setFieldValue("bank_name", editValue?.bank_name)
            form.setFieldValue("account_number", editValue?.account_number)
            form.setFieldValue("payment_note", editValue?.payment_note)

        }
    }, [editValue])
    return <>

        <div className="my-4 flex w-full ">
            <Select
                classNames="w-full"
                label="Accounts"
                placeholder='select an account'
                data={subAccounts}
                onChange={handleSupplierChange}
                value={selectedAccount}
                searchable
                clearable

            />
        </div>
        <div className="my-4 flex w-full gap-4 ">
            <Select
                data={["Cash", "Card", "Check"]}
                label="Payment Type"
                placeholder='select payment type'
                value={selectedPaymentType}
                onChange={(v) => setSelectedPaymentType(() => v)}
                disabled={selectedAccount ? false : true}
            />
            <NumberInput
                label="Amount"
                type="number"
                value={amount}
                onChange={(v) => setAmount(() => v)}
                disabled={selectedPaymentType ? false : true}
            />

            {(selectedPaymentType === "Card" || selectedPaymentType === "Check")
                &&
                <>
                    <div className='w-1/4'>
                        <lebel className="font-medium">Bank Name</lebel>
                        <Input onChange={(e) => setExtraPaymentInfo((val) => ({ ...val, bank_name: e.target.value }))} />
                    </div>

                    <div className='w-1/4'>
                        <lebel className="font-medium">Account Number</lebel>
                        <Input
                            type='string'
                            onChange={(e) => setExtraPaymentInfo((val) => ({ ...val, account_number: e.target.value }))}
                        />
                    </div>
                </>
            }
        </div>

        <TextInput label={"Payment Note"} value={paymentNote} onChange={e => setPaymentNote(e.target.value)} />
        <br />
        <Button disabled={amount ? false : true} onClick={handlePaymentSave}>Save</Button>
        <br />

        <Modal
            opened={editModalOpened}
            onClose={() => setEditModalOpened(false)}
            title="Voucher Edit !!"
        >
            <form onSubmit={form.onSubmit((values) => handleVoucherEdit(values))}>
                <div className="my-4 flex w-full ">
                    <Select
                        className="w-full"
                        label="Accounts"
                        placeholder='select an account'
                        data={subAccounts}

                        {...form.getInputProps('sub_account_id')}

                    />
                </div>
                <div className="my-4 flex w-full gap-4 ">
                    <Select
                        data={[{label:"Cash", value:1}, {label:"Card", value: 2}, {label:"Check", value:3}]}
                        label="Payment Type"
                        placeholder='select payment type'
                        // value={selectedPaymentType}
                        // onChange={(v) => setSelectedPaymentType(() => v)}
                        // disabled={selectedAccount ? false : true}
                        {...form.getInputProps('payment_type')}
                    />
                    <NumberInput
                        label="Amount"
                        type="number"
                        // value={amount}
                        // onChange={(v) => setAmount(() => v)}
                        // disabled={selectedPaymentType ? false : true}
                        {...form.getInputProps('payment_amount')}

                    />

                    {(form.values.payment_type == 2 || form.values.payment_type === 3)
                        &&
                        <>
                            <br />
                            <div className='w-1/4'>
                                <lebel className="font-medium">Bank Name</lebel>
                                <Input 
                                // onChange={(e) => setExtraPaymentInfo((val) => ({ ...val, bank_name: e.target.value }))}
                                {...form.getInputProps('bank_name')}
                                
                                 />
                            </div>

                            <div className='w-1/4'>
                                <lebel className="font-medium">Account Number</lebel>
                                <Input
                                    type='string'
                                    onChange={(e) => setExtraPaymentInfo((val) => ({ ...val, account_number: e.target.value }))}
                                    {...form.getInputProps('account_number')}
                                    
                                />
                            </div>
                        </>
                    }
                </div>
                <TextInput label={"Payment Note"}
                //  value={paymentNote} 
                //  onChange={e => setPaymentNote(e.target.value)} 
                {...form.getInputProps('payment_note')}
                 />
                <br />
                <Button
                    // disabled={amount ? false : true} 
                    type={"submit"}>Save</Button>
                <br />
            </form>

        </Modal>

        <Table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Account</th>
                    <th>Payment method</th>
                    <th>Amount</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {vouchers.map(voucher => (
                    <tr key={voucher.id}>
                        <td>{voucher.id}</td>
                        <td>{voucher.sub_account.name}</td>
                        <td>{voucher.payment_type == 1 ? "Cash" :
                            voucher.payment_type == 2 ? "Card" :
                                voucher.payment_type == 3 ? "Check" : ""}</td>
                        <td>{voucher.payment_amount}</td>
                        <td className='w-48 grid grid-cols-2 gap-2'>
                            <Button onClick={() => {
                                setEditId(voucher.id)
                                setEditValue(voucher)
                                setEditModalOpened(true)
                                console.log(voucher);
                            }}>Edit</Button>
                            <Button onClick={() => handleVoucherDelete(voucher.id)}>Delete</Button>
                        </td>
                    </tr>
                ))}

            </tbody>
        </Table>
    </>
}



