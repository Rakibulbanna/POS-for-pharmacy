import {Input, PasswordInput, Button, Switch} from "@mantine/core";
import {useForm} from '@mantine/form';
import {BaseAPI, HTTP} from "~/repositories/base"
import {showNotification} from "@mantine/notifications";


export default function () {


  const handleFormSubmit = (values: any) => {
    // TODO: extract this notification to helper function
    HTTP.post(`${BaseAPI}/users/nkkkk`, values).then(res => {
    showNotification({
      title: "Success",
      message: "User created"
    })
    }).catch(err => {
      console.log(err)
      showNotification({
        title: "Error",
        message: ""
      })
    })
  }

  const form = useForm({
    initialValues: {
      Product_name : "",
      Style_size : "",
      color: "",
      system_barcode: "",
      discount: 0,
      minimum_order_quantity: 0,
      maximum_order_quantity: 0,
      re_order_quantity: NaN,
      whole_sale_price : NaN,
      product_expiry_date : '',
      batch_expiry_date : '',
      cost_price : NaN,
      mrp_price : NaN,
    },

    // validate: {
    //   email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    // },
  });

  return (
    <>
      <form onSubmit={form.onSubmit(handleFormSubmit)} className={"flex flex-col gap-6"}>
        <Input.Wrapper label={"Product name"}>
          <Input type={'text'} required {...form.getInputProps('Product_name')}/>
        </Input.Wrapper>
        
        <Input.Wrapper label={"Style size"}>
          <Input type='text' required {...form.getInputProps('Style_size')}/>
        </Input.Wrapper>

        <Input.Wrapper label={"Color"}>
          <Input required {...form.getInputProps('color')}/>
        </Input.Wrapper>

        <Input.Wrapper label={"System barcode"}>
          <Input required type="text" {...form.getInputProps('system_barcode')}/>
        </Input.Wrapper>

        <Input.Wrapper label={"Discount"} style={{position:'relative'}}>
          <Input type="number" {...form.getInputProps('discount')}/>
          <span style={{position:'absolute',right:10,top:28}}>%</span>
        </Input.Wrapper>

        <Input.Wrapper label={"Minimum Order Quantity"}>
          <Input required type="number" {...form.getInputProps('minimum_order_quantity')}/>
        </Input.Wrapper>

        <Input.Wrapper label={"Maximum Order Quantity"}>
          <Input required type="number" {...form.getInputProps('maximum_order_quantity')}/>
        </Input.Wrapper>

        <Input.Wrapper label={"Re Order Quantity"}>
          <Input required type="number" {...form.getInputProps('re_order_quantity')}/>
        </Input.Wrapper>

        <Input.Wrapper label={"Whole Sale Price"}>
          <Input required type="number" {...form.getInputProps('whole_sale_price')}/>
        </Input.Wrapper>

        <Input.Wrapper label={"Product Expiry Date"}>
          <Input required type="date" {...form.getInputProps('product_expiry_date')}/>
        </Input.Wrapper>

        <Input.Wrapper label={"Batch Expiry Date"}>
          <Input required type="date" {...form.getInputProps('batch_expiry_date')}/>
        </Input.Wrapper>

        <Input.Wrapper label={"Cost price"}>
          <Input required type="number" {...form.getInputProps('cost_price')}/>
        </Input.Wrapper>

        <Input.Wrapper label={"MRP Price"}>
          <Input required type="number" {...form.getInputProps('mrp_price')}/>
        </Input.Wrapper>

        <Button type={"submit"}>Submit</Button>
      </form>
    </>
  )
}
