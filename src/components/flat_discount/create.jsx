import { useState, useEffect } from 'react';
import { Button, Input, NumberInput, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form"
import { showNotification } from "@mantine/notifications";
import { BaseAPI, HTTP } from "~/repositories/base";

export default function ({ addProducts, setAddProducts }) {

    const [disableButton, setDisableButton] = useState(true)

    let form = useForm({
        initialValues: {
            name: "",
            effective_date: "",
            expiry_date: "",
        }
    })

    useEffect(() => {
        const { name, effective_date, expiry_date } = { ...form.values };

        if (name && effective_date && expiry_date && addProducts.length) {
            setDisableButton(() => false);
        }
        if (addProducts.length === 0) setDisableButton(() => true)
    }, [addProducts, form])

    const handleFormSubmit = (values) => {
        if (!values) return;
        values.product_ids = addProducts.map(value => value.id);
        HTTP.post(`${BaseAPI}/promotions/flat-discount`, {
            name: values.name,
            effective_date: values.effective_date,
            expiry_date: values.expiry_date,
            products: addProducts,
        }).then(res => {
            showNotification({
                title: "Success",
                message: "Added"
            })
            form.reset();
            setAddProducts(() => []);
        }).catch(err => {
            showNotification({
                title: "Error",
                message: err
            })
        })
    }
    console.log({addProducts})

    return <div className=" w-full h-full my-auto flex justify-center justify-items-center pt-1 ">
        <form
            onSubmit={form.onSubmit(values => handleFormSubmit(values))}
            className=' relative flex flex-col gap-2 w-full my-auto min-w-fit bg-slate-50 p-1 rounded-sm'
            style={{border: '1px solid #cbd5e1' }}
        >
            <div className="flex justify-between gap-4">
                <div className="relative z-0 w-full group">
                    <label htmlFor="name" className=" text-sm sm:text-md text-gray-500 ">Name</label>
                    <TextInput {...form.getInputProps("name")} />
                </div>
                {/* <div className="flex justify-between gap-4"> */}
                <div className="relative z-0 w-full group">
                    <label htmlFor="effective_date" className="text-sm sm:text-md text-gray-500">Effective Date</label>
                    <Input type={"date"} required  {...form.getInputProps('effective_date')} />

                </div>

                <div className="relative z-0 w-full group">
                    <label htmlFor="expiry_date" className="text-sm sm:text-md text-gray-500">Expire Date</label>
                    <Input type={"date"} required {...form.getInputProps('expiry_date')} />
                </div>
            </div>
            <Button disabled={disableButton} type={"submit"}>Submit</Button>
        </form>
    </div>
}