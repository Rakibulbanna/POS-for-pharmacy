import {useState,useEffect} from 'react';
import { Button, Input, NumberInput, Radio, Switch, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form"
import { showNotification } from "@mantine/notifications";
import { BaseAPI, HTTP } from "~/repositories/base";

export default function ({ addProducts, setAddProducts }) {

    const [disableButton, setDisableButton] = useState(true)

    let form = useForm({
        initialValues: {
            name: "",
            price: 0,
            effective_date: "",
            expiry_date: "",
            is_active: false
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
        values.products = addProducts;

        HTTP.post(`${BaseAPI}/promotions/combo`, values).then(res => {
            showNotification({
                title: "Success",
                message: "Supplier created"
            })
            form.reset();
            setAddProducts(() => []);
        }).catch(err => {
            console.log(err);
            showNotification({
                title: "Error",
                message: "Error created"
            })

        })
    }

    return <div className="h-full w-full flex justify-center justify-items-center px-1  ">
        <form
            onSubmit={form.onSubmit(values => handleFormSubmit(values))}
            className=' p-2 flex flex-col w-full bg-slate-50 '
            style={{ border: '1px solid #cbd5e1' }}
        >
            <div className="flex gap-4">
                <div className="relative z-0 w-full group">
                    <label htmlFor="name" className="text-sm sm:text-md text-gray-500 ">Name</label>
                    <TextInput {...form.getInputProps("name")} />
                </div>

                <div className="relative z-0 w-1/2 group">
                    <label htmlFor="price" className="text-sm sm:text-md text-gray-500">Price</label>
                    <NumberInput min={0} {...form.getInputProps("price")} />
                </div>

                <div className="flex gap-4">
                    <div className="relative z-0 w-fit group">
                        <label htmlFor="effective_date" className="text-sm sm:text-md text-gray-500">Effective Date</label>
                        <Input type={"date"} required  {...form.getInputProps('effective_date')} />
                    </div>

                    <div className="relative z-0 w-full group">
                        <label htmlFor="expiry_date" className="text-sm sm:text-md text-gray-500">Expire Date</label>
                        <Input type={"date"} required {...form.getInputProps('expiry_date')} />
                    </div>
                </div>
            </div>
            <div className="relative z-0 w-full group">
                <label htmlFor="is_active" className="text-sm sm:text-md text-gray-500 mb-1">Active</label>
                <Switch {...form.getInputProps('is_active')} />
                {/* <Radio.Group className="text-slate-600 pl-2 relative -top-1 flex font-medium" value={receiveType} onChange={(v) => setReceiveType(v)}>
                    <Radio value={true} label={"Purchase Order Receive"} />
                    <Radio value={"direct_receive"} label={"Direct Receive"} />
                </Radio.Group> */}
            </div>
            <Button className="mt-1" disabled={disableButton} type={"submit"}>Submit</Button>
        </form>
    </div>
}
