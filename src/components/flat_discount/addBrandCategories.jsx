import { Button, Input, NumberInput, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form"
import { showNotification } from "@mantine/notifications";
import { BaseAPI, HTTP } from "~/repositories/base";

export default function ({ scanProduct, addProducts, setAddProducts, setScanProducts }) {

  let form = useForm({
    initialValues: {
      name: "",
      request_quantity: "",
      disc_in_percent: 0,
      disc_in_amount: 0,
    }
  });

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

    //check if any product previously added promotion
    for (let product of scanProduct) {
      const res = await HTTP.get(`${BaseAPI}/promotions/flat/is-product-active/${product.id}`)
      if (res.data.data) {
        showNotification({
          title: 'Already Used',
          message: 'One or more items already used ',
          color: 'red',
        });
        return;
      }
    };

    let copyAddProduct = [...addProducts];

    if (addProducts.length === 0) {

      //for calculating discount depend on discount_in_percent & discount_in_amount


      const mapScanProduct = scanProduct.map((item) => {
        let { disc_in_percent, disc_in_amount, request_quantity } = { ...form.values };

        if (disc_in_amount > 0) {
          const disPercent = ((disc_in_amount / item.MRP_price) * 100).toFixed(2);
          disc_in_percent = disc_in_percent > disPercent ? disc_in_percent : disPercent;
        }
        console.log({ disc_in_percent });

        return ({
          ...item,
          request_quantity : request_quantity||0,
          disc_in_percent,
          disc_in_amount,
        })
      })
      setAddProducts(() => mapScanProduct);
      setScanProducts(() => []);
      form.reset();
      return;
    }

    const mapAddProductsId = addProducts.map((product) => product.id);
    console.log({ mapAddProductsId, copyAddProduct })

    scanProduct.forEach((item) => {
      if (mapAddProductsId.includes(item.id)) return;

      let { disc_in_percent, disc_in_amount, request_quantity } = { ...form.values };

      if (disc_in_amount > 0) {
        const disPercent = ((disc_in_amount / item.MRP_price) * 100).toFixed(2);
        disc_in_percent = disc_in_percent > disPercent ? disc_in_percent : disPercent;
      }
      console.log({ disc_in_percent });

      copyAddProduct.push({
        ...item,
        request_quantity : request_quantity|| 0,
        disc_in_percent,
        disc_in_amount
      });
    })

    setAddProducts(() => copyAddProduct);
    setScanProducts(() => []);
    form.reset();
  }

  return <div className="flex justify-center justify-items-center">
    <form
      // onSubmit={form.onSubmit(values => handleFormSubmit(values))}
      className='grid grid-cols-2 gap-2 w-full min-w-fit p-2 pt-1 my-auto rounded-sm '
      style={{border: '1px solid #cbd5e1'}}
    >
      <div className="flex flex-col justify-between">
        <div className="relative z-0 w-full group">
          <label htmlFor="name" className="text-sm sm:text-md text-gray-500 ">No Of Products</label>
          <TextInput disabled value={scanProduct.length} />
        </div>
        <div className="flex justify-between gap-4">
          <div className="relative z-0 w-full group">
            <label htmlFor="name" className="text-sm sm:text-md text-gray-500 ">Request Quantity</label>
            <TextInput type='number' {...form.getInputProps("request_quantity")} />
          </div>
        </div>
      </div>

      <div className="">
        <div className="flex justify-between gap-4">
          <div className="relative z-0 w-full group">
            <label htmlFor="effective_date" className="text-sm sm:text-md text-gray-500"> Total CPU</label>
            <Input disabled value={scanProduct.reduce((prev, n) => n.cost_price + prev, 0)} />
          </div>
          <div className="relative z-0 w-full group">
            <label htmlFor="expiry_date" className="text-sm sm:text-md text-gray-500">Total RPU</label>
            <Input disabled value={scanProduct.reduce((prev, n) => n.MRP_price + prev, 0)} />
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

      <Button disabled={scanProduct.length > 0 ? false : true} onClick={handleAdd} className="col-start-1 col-end-3" >Add</Button>
    </form>
  </div>
}