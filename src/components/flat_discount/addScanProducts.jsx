import { Button, Input, NumberInput, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form"
import { showNotification } from "@mantine/notifications";
import { BaseAPI, HTTP } from "~/repositories/base";

export default function ({ scanProduct, addProducts, setAddProducts, setScanProducts }) {

    let form = useForm({
        initialValues: {
            request_quantity: "",
            disc_in_percent: 0,
            disc_in_amount: 0,
        }
    });

    // const handleFormSubmit = (values) => {
    //     if (!values) return;
    //     values.product_ids = scanProduct.map(value => value.id);
    //     HTTP.post(`${BaseAPI}/promotions/flat-discount`, values).then(res => {
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

        //check if any product previously added promotion
        const res = await HTTP.get(`${BaseAPI}/promotions/flat/is-product-active/${scanProduct[0].id}`);
        if (res.data.data) {
            showNotification({
                title: 'Already Used',
                message: 'One or more items already used ',
                color: 'red',
            });
            return;
        };

        let isExistProduct = false;
        addProducts.forEach((item) => {
            if (item.id === scanProduct[0].id) {
                isExistProduct = true;
            }

        });
        let { disc_in_percent, disc_in_amount } = { ...form.values };

        if (disc_in_amount > 0) {
            const disPercent = (disc_in_amount / scanProduct[0].MRP_price) * 100;
            disc_in_percent = disc_in_percent > disPercent ? disc_in_percent : disPercent;
        }
        // console.log({ disc_in_percent });

        const updateScanProducts = {
            ...scanProduct[0],
            request_quantity: form.values.request_quantity,
            disc_in_percent,
            disc_in_amount,
        };

        !isExistProduct && setAddProducts((value) => [...value, updateScanProducts]);
        setScanProducts(() => []);
        form.reset();
    }
    console.log({ scanProduct })
    // console.log(form.values.request_quantity)
    return <div className="flex justify-center justify-items-center">
        <form
            // onSubmit={form.onSubmit(values => handleFormSubmit(values))}
            className='grid grid-cols-2 gap-2 w-full min-w-fit bg-slate-50 p-2 pt-1 my-auto rounded-sm '
            style={{ border: '1px solid #cbd5e1' }}

        >
            <div className="flex flex-col justify-between">
                <div className="relative z-0 w-full group">
                    <label htmlFor="name" className="text-sm sm:text-md text-gray-500 ">Description</label>
                    <TextInput disabled value={scanProduct.length > 0 ? `${scanProduct[0].name} ${scanProduct[0]?.color?.name ? '- ' + scanProduct[0].color.name : ''} ${scanProduct[0]?.style_size ? '- ' + scanProduct[0].style_size : ''} ` : ''} />
                </div>
                <div className="flex justify-between gap-4">
                    <div className="relative z-0 w-full group">
                        <label htmlFor="name" className="text-sm sm:text-md text-gray-500 ">Request Quantity</label>
                        <TextInput required {...form.getInputProps("request_quantity")} />
                    </div>
                    <div className="relative z-0 w-full group">
                        <label htmlFor="name" className="text-sm sm:text-md text-gray-500 ">Stock</label>
                        <Input value={scanProduct.length > 0 ? scanProduct[0].stock : 0} />
                    </div>
                </div>
            </div>

            <div className="">
                <div className="flex justify-between gap-4">
                    <div className="relative z-0 w-full group">
                        <label htmlFor="effective_date" className="text-sm sm:text-md text-gray-500">CPU</label>
                        <Input required value={scanProduct.length > 0 ? scanProduct[0].cost_price : 0} />
                    </div>
                    <div className="relative z-0 w-full group">
                        <label htmlFor="expiry_date" className="text-sm sm:text-md text-gray-500">RPU</label>
                        <Input required value={scanProduct.length > 0 ? scanProduct[0].MRP_price : 0} />
                    </div>
                </div>
                <div className="flex justify-between gap-4">
                    <div className="relative z-0 w-full group">
                        <label htmlFor="disc_in_percent" className="text-sm sm:text-md text-gray-500">Discount In Percent <span className="text-sky-500">( % )</span></label>
                        <NumberInput min={0} {...form.getInputProps("disc_in_percent")} />
                    </div>

                    <div className="relative z-0 w-full group">
                        <label htmlFor="disc_in_amount" className="text-sm sm:text-md text-gray-500">Discount In Amount</label>
                        <NumberInput min={0} {...form.getInputProps("disc_in_amount")} />
                    </div>
                </div>
            </div>
            <Button disabled={scanProduct.length > 0 && form.values.request_quantity ? false : true} onClick={handleAdd} className="col-start-1 col-end-3" >Add</Button>
        </form>
    </div>
}