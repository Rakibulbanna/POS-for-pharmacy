import { Button, Input, NumberInput, TextInput } from "@mantine/core"
import { useForm, } from "@mantine/form"
import { showNotification } from "@mantine/notifications";
import { BaseAPI, HTTP } from "~/repositories/base";
import { useState } from "react";

export default function ({ scanProduct, addProducts, setAddProducts, setScanProducts }) {

    const [quantity, setQuantity] = useState(0);

    // const handleFormSubmit = (values) => {
    //     if (!values) return;
    //     values.product_ids = scanProduct.map(value => value.id);
    //     console.log({ values });
    //     HTTP.post(`${BaseAPI}/promotions/flat-discount`, values).then(res => {
    //         console.log(values);
    //         showNotification({
    //             title: "Success",
    //             message: "Supplier created"
    //         })
    //         form.reset();
    //     }).catch(err => {
    //         showNotification({
    //             title: "Error",
    //             message: err
    //         })
    //     })
    // }

    const handleAdd = async () => {
        let isUsed = false;

        const res = await HTTP.get(`${BaseAPI}/promotions/combo/is-product-active/${scanProduct[0].id}`)

        if (res.data.data) {
            isUsed = res.data.data;
        }

        if (isUsed) {
            showNotification({
                title: 'Already Used',
                message: 'One or more items already used ',
                color: 'red',
            });
            return;
        }

        let isExistProduct = false;
        addProducts.forEach((item) => {
            if (item.id === scanProduct[0].id) {
                isExistProduct = true;
            }

        });
        const updateScanProducts = { ...scanProduct[0], quantity: Number(quantity) };
        !isExistProduct && setAddProducts((value) => [...value, updateScanProducts]);
        setScanProducts(() => []);
        setQuantity(() => 0)
    }


    return <div className="flex justify-center justify-items-center">
        <form
            // onSubmit={form.onSubmit(values => handleFormSubmit(values))}
            className='flex flex-col gap-2 w-full bg-slate-50 p-2 my-auto'
            style={{ border: '1px solid #cbd5e1' }}
        >
            <div className="flex justify-between w-full gap-2">

                <div className="relative z-0 w-full">
                    <label htmlFor="name" className="text-sm sm:text-md text-gray-500 ">Description</label>
                    <TextInput disabled defaultValue={scanProduct.length > 0 ? `${scanProduct[0].name} ${scanProduct[0]?.color?.name ? '- ' + scanProduct[0].color.name : ''} ${scanProduct[0]?.style_size ? '- ' + scanProduct[0].style_size : ''} ` : ''} />
                </div>
                <div className="relative z-0 w-1/2 group">
                    <label htmlFor="name" className="text-sm sm:text-md text-gray-500 ">Quantity</label>
                    <TextInput required onChange={(e) => { setQuantity(() => e.target.value) }} value={quantity} />
                </div>
                <div className="relative z-0 w-1/2 group">
                    <label htmlFor="name" className="text-sm sm:text-md text-gray-500 ">Stock</label>
                    <Input value={scanProduct.length > 0 ? scanProduct[0].stock : 0} />
                </div>
                <div className="relative z-0 w-1/2 group">
                    <label htmlFor="cpu" className="text-sm sm:text-md text-gray-500">CPU</label>
                    <Input required value={scanProduct.length > 0 ? scanProduct[0].cost_price : 0} />
                </div>
                <div className="relative z-0 w-1/2 group">
                    <label htmlFor="rpu" className="text-sm sm:text-md text-gray-500">RPU</label>
                    <Input required value={scanProduct.length > 0 ? scanProduct[0].MRP_price : 0} />
                </div>

                {/* <div className="flex justify-between gap-4">
                    <div className="relative z-0 w-full group">
                        <label htmlFor="disc_in_percent" className="text-sm sm:text-md text-gray-500">Discount In Percent <span className="text-sky-500">( % )</span></label>
                        <NumberInput min={0} {...form.getInputProps("disc_in_percent")} />
                    </div>

                    <div className="relative z-0 w-full group">
                        <label htmlFor="disc_in_amount" className="text-sm sm:text-md text-gray-500">Discount In Amount</label>
                        <NumberInput min={0} {...form.getInputProps("disc_in_amount")} />
                    </div>
                </div> */}
            </div>
            <Button disabled={scanProduct.length > 0 && quantity ? false : true} onClick={handleAdd} className="col-start-1 col-end-3" >Add</Button>
        </form>
    </div>
}