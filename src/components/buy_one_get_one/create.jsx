import { useEffect, useState, useRef } from "react";
import { Button, Input, NumberInput, Radio, Switch, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form"
import { showNotification } from "@mantine/notifications";
import { BaseAPI, HTTP } from "~/repositories/base";

export default function ({ addedbuyOneGetOneProducts,setAddedbuyOneGetOneProducts }) {
    const [buttonDisable, setButtonDisable] = useState(true);

    let form = useForm({
        initialValues: {
            name: "",
            effective_date: "",
            expiry_date: ""
        }
    });

    useEffect(() => {
        const { name, effective_date, expiry_date } = { ...form.values };
        
        if (name && effective_date && expiry_date && addedbuyOneGetOneProducts.length) {
            setButtonDisable(()=>false);
        }
        if(addedbuyOneGetOneProducts.length === 0) setButtonDisable(()=>true)
  
    }, [form,addedbuyOneGetOneProducts]);


    const handleFormSubmit = (values) => {
        HTTP.post(`${BaseAPI}/promotions/bxgx`, {...values, pairs: addedbuyOneGetOneProducts}).then(res => {
            showNotification({
                title: "Success",
                message: "Successfully created"
            })
            form.reset();
            setAddedbuyOneGetOneProducts(()=>[])
        }).catch(err => {
            console.log(err);
            showNotification({
                title: "Error",
                message: "Error created"
            })
        })
    }

    return <div className="h-full w-full mt-1 flex justify-center justify-items-center ">
        <form
            onSubmit={form.onSubmit(values => handleFormSubmit(values))}
            className=' flex flex-col gap-2 w-full bg-slate-50 p-1 my-auto'
            style={{ border: '1px solid #cbd5e1' }}
        >
            <div className="flex justify-between gap-2">
                <div className="relative z-0 w-full group">
                    <label htmlFor="name" className="text-sm sm:text-md text-gray-500 ">Name</label>
                    <TextInput {...form.getInputProps("name")} />
                </div>

                {/* <div className="relative z-0 w-full group">
                <label htmlFor="price" className="text-sm sm:text-md text-gray-500">Price</label>
                <NumberInput min={0} {...form.getInputProps("price")} />
                </div> */}

                <div className="relative z-0 w-full group">
                    <label htmlFor="effective_date" className="text-sm sm:text-md text-gray-500">Effective Date</label>
                    <Input type={"date"} required  {...form.getInputProps('effective_date')} />
                </div>

                <div className="relative z-0 w-full group">
                    <label htmlFor="expiry_date" className="text-sm sm:text-md text-gray-500">Expire Date</label>
                    <Input type={"date"} required {...form.getInputProps('expiry_date')} />
                </div>

                {/* <div className="relative z-0 w-full group mb-4">
                <label htmlFor="is_active" className="text-sm sm:text-md text-gray-500 mb-1">Active</label>
                <Switch {...form.getInputProps('is_active')} />
            </div> */}
            </div>
            <Button disabled={buttonDisable } className="mt-1" type={"submit"}>Submit</Button>
        </form>
    </div>
}