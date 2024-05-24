import { Input, PasswordInput, Button, Switch, TextInput, NumberInput, NativeSelect, Select } from "@mantine/core";
import { useForm } from '@mantine/form';
import { BaseAPI, HTTP } from "~/repositories/base"
import { showNotification } from "@mantine/notifications";
import { IconHash } from "@tabler/icons";
import { useEffect, useState } from "react";
import stopImage from "~/src/images/delete-icon.svg";
import { useNavigate } from "react-router-dom";

const formatDate = (date) => {
  date = new Date(date)
  return date.toISOString().split('T')[0]
}

export default function ({ product = null, suppliers, brands, categories, onSubmit, colors }) {


  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      name: product ? product.name : "",
      style_size: product ? product.style_size : "",
      product_barcode: product ? product.product_barcode : "",
      minimum_order_quantity: product ? product.minimum_order_quantity : 0,
      maximum_order_quantity: product ? product.maximum_order_quantity : 0,
      re_order_quantity: product ? product.re_order_quantity : 0,
      whole_sale_price: product ? product.whole_sale_price : 0,
      product_expiry_date: product ? formatDate(product.product_expiry_date) : "",
      batch_expiry_date: product ? formatDate(product.batch_expiry_date) : "",
      cost_price: product ? product.cost_price : 0,
      mrp_price: product ? product.MRP_price : 0,
      brand_id: product ? product.brand_id : "",
      category_id: product ? product.category_id : "",
      supplier_id: product ? product.supplier_id : "",
      color_id: product ? product.color_id : null,
      discount: product ? product.discount : 0,
    },

  });


  const supplierData = suppliers.map((supplier) => {
    return {
      value: supplier.id,
      label: `${supplier.first_name} ${supplier.last_name ? supplier.last_name : ''}`
    }

  });

  const brandsData = brands.map((brand) => {
    return {
      value: brand.id,
      label: brand.name
    }

  });

  const categoriesData = categories.map((category) => {
    return {
      value: category.id,
      label: category.name
    }

  });

  const colorsData = colors.map((col) => {
    return {
      value: col.id,
      label: col.name
    }
  });

  const handleFormSubmit = (values) => {
    onSubmit(values).then(res => {
      if (!product) {
        form.reset()
      }
    }).catch(err => {

    })
  }

  const sendToTheBack = () => {
    navigate(-1);
  }

  return (
    <>
      <div className=" flex justify-center justify-items-center p-1 w-full h-full ">
        <form onSubmit={form.onSubmit(values => handleFormSubmit(values))}
          className='relative flex flex-col gap-6 min-w-fit bg-slate-50 p-5 my-auto rounded-md  '
          style={{ border: '1px solid #cbd5e1' }}
        >

          <span className=" mb-2 font-semibold text-base text-center">Edit Product</span>
          <img onClick={sendToTheBack} className="absolute right-10 h-9 hover:scale-105 duration-100 cursor-pointer" src={stopImage} />

          <div className="grid grid-cols-3 gap-2">
            <Select
              label=" Supplier "
              placeholder="Select a Supplier"
              data={supplierData}
              {...form.getInputProps('supplier_id')}
            />

            <Select
              label=" Category "
              placeholder="Select a Category"
              data={categoriesData}
              {...form.getInputProps('category_id')}
            />

            <Input.Wrapper label={"Name"}>
              <TextInput required {...form.getInputProps('name')} />
            </Input.Wrapper>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Select
              label=" Group "
              placeholder="Select a Group"
              data={brandsData}
              {...form.getInputProps('brand_id')}
            />

            <Input.Wrapper label={"Style size"}>
              <TextInput {...form.getInputProps('style_size')} />
            </Input.Wrapper>

            <Select
              label=" Color "
              placeholder="Select a color"
              data={colorsData}
              {...form.getInputProps('color_id')}
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Input.Wrapper label={"Cost price"}>
              <NumberInput required type="number" precision={2} {...form.getInputProps('cost_price')} />
            </Input.Wrapper>

            <Input.Wrapper label={"MRP Price"}>
              <NumberInput required type="number" precision={2} {...form.getInputProps('mrp_price')} />
            </Input.Wrapper>

            <Input.Wrapper label={"Whole Sale Price"}>
              <NumberInput {...form.getInputProps('whole_sale_price')} precision={2}/>
            </Input.Wrapper>
          </div>

          {/* <Input.Wrapper label={"Color"}>
          <TextInput {...form.getInputProps('color')} />
        </Input.Wrapper> */}
          <div className="grid grid-cols-3 gap-2">
            <Input.Wrapper label={"product Barcode"}>
              <TextInput required {...form.getInputProps('product_barcode')} />
            </Input.Wrapper>

            {/* <Input.Wrapper label={"Minimum Order Quantity"}>
              <NumberInput {...form.getInputProps('minimum_order_quantity')} />
            </Input.Wrapper>

            <Input.Wrapper label={"Maximum Order Quantity"}>
              <NumberInput {...form.getInputProps('maximum_order_quantity')} />
            </Input.Wrapper> */}

          <Input.Wrapper label={"Discount"} style={{ position: 'relative' }}>
            <NumberInput  {...form.getInputProps('discount')} precision={2}/>
            <span style={{ position: 'absolute', right: 35, top: 28 }}>%</span>
          </Input.Wrapper>


            <Input.Wrapper label={"Re Order Quantity"}>
              <NumberInput {...form.getInputProps('re_order_quantity')} />
            </Input.Wrapper>

            {/* <Input.Wrapper label={"Product Expiry Date"}>
              <Input type={"date"} required  {...form.getInputProps('product_expiry_date')} />
            </Input.Wrapper>

            <Input.Wrapper label={"Batch Expiry Date"}>
              <Input type={"date"} required {...form.getInputProps('batch_expiry_date')} />
            </Input.Wrapper> */}

          </div>

          <Button type={"submit"}>Submit</Button>
        </form>
      </div>
    </>
  )
}
