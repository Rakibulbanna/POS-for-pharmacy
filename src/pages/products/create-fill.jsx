import { Select, Input, TextInput, NumberInput, Button, Box, Text } from "@mantine/core"
import { useForm } from "@mantine/form"
import { useFocusWithin } from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { BaseAPI, HTTP } from "~/repositories/base"
import stopImage from "~/src/images/delete-icon.svg";

export default function () {
  const [isReady, setIsReady] = useState(false)
  const [suppliers, setSuppliers] = useState([])
  const [brands, setBrands] = useState([])
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [colors, setColors] = useState([])

  const [selectedCategoryID, setSelectedCategoryID] = useState(null)
  const [selectedProductID, setSelectedProductID] = useState(null)

  const navigate = useNavigate();

  useEffect(() => {
    getDeps()
  }, [])

  const getDeps = async () => {
    try {
      let res = await HTTP.get(`${BaseAPI}/categories`)
      setCategories(res.data.data.map(cat => {
        return {
          label: cat.name,
          value: cat.id
        }
      }))

      res = await HTTP.get(`${BaseAPI}/suppliers`)
      setSuppliers(res.data.data.map(sup => {
        return {
          label: sup.company_name,
          value: sup.id
        }
      }))

      res = await HTTP.get(`${BaseAPI}/brands`)
      setBrands(res.data.data.map(brand => {
        return {
          label: brand.name,
          value: brand.id,
        }
      }))

      res = await HTTP.get(`${BaseAPI}/colors`)
      setColors(res.data.data.map(color => {
        return {
          label: color.name,
          value: color.id,
        }
      }))

      setTimeout(() => {
        setIsReady(true)
      }, 1);
    } catch (err) {
      console.log(err);
    }



  }


  const handleCategoryChange = (v) => {
    setSelectedCategoryID(v)
    HTTP.get(`${BaseAPI}/products/index-without-pagination?category_id=${v}&for=fill`).then(res => {
      setProducts(res.data.data.map(prod => {
        return {
          label: prod.name,
          value: prod.id
        }
      }))
    }).catch(err => {
      console.log(err);
    })
  }




  const form = useForm({
    initialValues: {
      style_size: "",
      product_barcode: "",
      minimum_order_quantity: 0,
      maximum_order_quantity: 0,
      re_order_quantity: 0,
      whole_sale_price: 0,
      product_expiry_date: "",
      batch_expiry_date: "",
      cost_price: 0,
      mrp_price: 0,
      brand_id: "",
      supplier_id: "",
      color_id: null,
      product_id: null,
    },
    validate: {
      supplier_id: (value) => !!value ? null : "Select Supplier",
      // product_id: (value) => !!value ? null : "Select Product",
      brand_id: (value) => !!value ? null : "Select Group",
      product_barcode: (value) => !!value ? null : "Input Product Barcode",
      cost_price: (value) => !!value ? null : "Input Cost Price",
      mrp_price: (value) => !!value ? null : "Input MRP Price",
      style_size: (v) => !!v ? null : "Style/Size Required",
    }

  });

  const onFormSubmit = () => {
    const res = form.validate()
    if (res.hasErrors) {
      return
    }

    handleFormSubmit(form.values)
  }

  const handleFormSubmit = (values => {
    // if (selectedProductID) {
    //   HTTP.patch(`${BaseAPI}/products/${selectedProductID}/fill-info`, values).then(res => {
    //     form.reset()
    //     setSelectedCategoryID(null)
    //     setSelectedProductID(null)
    //     showNotification({
    //       title: "Success",
    //       message: "Updated Successfully"
    //     })
    //   }).catch(err => {
    //     showNotification({
    //       title: "Error",
    //       message: err.response.data.data,
    //     })
    //     console.log(err);
    //   })
    // }
    handleSubmitWithoutClear();
    form.reset();
    setSelectedCategoryID(null)
    setSelectedProductID(null)
  })

  // const handleFormSubmitNext = (values) => {
  //   if (form.values.product_id) {
  //     HTTP.patch(`${BaseAPI}/products/${form.values.product_id}/fill-info`, values).then(res => {
  //       showNotification({
  //         title: "Success",
  //         message: "Updated Successfully"
  //       })
  //     }).catch(err => {
  //       console.log(err);
  //     })
  //   }

  // }

  const handleSubmitWithoutClear = () => {
    const res = form.validate()
    if (res.hasErrors) return;

    // handleFormSubmitNext(form.values)
    HTTP.post(`${BaseAPI}/products`, {
      ...form.values,
      category_id: selectedCategoryID,
      product_id: selectedProductID,
    }).then(res => {
      showNotification({
        title: "Success",
        message: "Updated Successfully"
      })
    }).catch(err => {
      showNotification({
        title: "Error",
        message: err.response.data.data,
      })
      return
    })

    // remove only style size and color

    form.setValues({
      ...form.values,
      style_size: "",
      color_id: null,
      product_barcode: "",
    })

  }


  const handleSendToMain = () => {
    navigate('/products')
  }


  const { ref, focused } = useFocusWithin();
  useEffect(() => {
    if (focused && !form.getInputProps("product_barcode").value) {


      form.setFieldValue("product_barcode", Date.now().toString())

    }
  }, [focused]);

  const onFormSubmitResetForm = () => {
    form.reset();
    setSelectedCategoryID(null);
    setSelectedProductID(null);
  };

  return (
    <div className=" flex justify-center justify-items-center p-1 w-full h-full">
      {isReady &&
        <form
          className='relative flex flex-col gap-2 min-w-fit bg-slate-50 p-10 my-auto rounded-md  '
        >
          <span className=" mb-2 font-semibold text-base text-center">Create Fill Form</span>
          <img onClick={handleSendToMain} className="absolute right-10 h-9 hover:scale-105 duration-100 cursor-pointer" src={stopImage} />


          <div className="grid grid-cols-3 gap-8">
            <Select
              className="w-full"
              label=" Supplier "
              placeholder="Select a Supplier"
              data={suppliers}
              searchable
              {...form.getInputProps('supplier_id')}
              required
            />
            <Select
              className="w-full"
              label=" Category "
              placeholder="Select a Category"
              data={categories}
              onChange={handleCategoryChange}
              value={selectedCategoryID}
              required
              searchable
            // {...form.getInputProps("category_id")}
            />
            <Select label="Select Product"
              className="w-full"
              data={products}
              onChange={v => setSelectedProductID(v)}
              value={selectedProductID}
              required
              searchable
            />

            <Select
              className="w-full"
              label="Group "
              placeholder="Select a Group"
              data={brands}
              {...form.getInputProps('brand_id')}
              required
              searchable
            />
            <Input.Wrapper className="w-full" label={"Style size"}>
              <TextInput {...form.getInputProps('style_size')} />
            </Input.Wrapper>

            <Select
              className="w-full"
              label=" Color "
              placeholder="Select a Color"
              data={colors}
              {...form.getInputProps('color_id')}
            />


            <Input.Wrapper className="w-full" label={"CPU"} required>
              <NumberInput required precision={2} type="number" {...form.getInputProps('cost_price')} />
            </Input.Wrapper>

            <Input.Wrapper className="w-full" label={"RPU"} required>
              <NumberInput required precision={2} type="number" {...form.getInputProps('mrp_price')} />
            </Input.Wrapper>
            <Input.Wrapper className="w-full" label={"Whole Sale Price"}>
              <NumberInput precision={2} {...form.getInputProps('whole_sale_price')} />
            </Input.Wrapper>
            <Input.Wrapper label="Product Barcode" required>
              <TextInput {...form.getInputProps('product_barcode')} />
            </Input.Wrapper>





            {/* <Input.Wrapper className="w-full" label={"Minimum Order Quantity"} >
              <NumberInput required {...form.getInputProps('minimum_order_quantity')} ref={ref} />
            </Input.Wrapper>
            <Input.Wrapper className="w-full" label={"Maximum Order Quantity"}>
              <NumberInput required {...form.getInputProps('maximum_order_quantity')} />
            </Input.Wrapper> */}
            <Input.Wrapper className="w-full" label={"Re Order Quantity"}>
              <NumberInput {...form.getInputProps('re_order_quantity')} ref={ref}/>
            </Input.Wrapper>









            {/* <Input.Wrapper className="w-full" label={"Product Expiry Date"}>
              <Input type={"date"}   {...form.getInputProps('product_expiry_date')} />
            </Input.Wrapper> */}
            <Input.Wrapper className="w-full"
            //label={"Batch Expiry Date"} 
            >
              {/* <Input type={"date"} {...form.getInputProps('batch_expiry_date')} /> */}
            </Input.Wrapper>
            <Button className="mt-2 " type={"button"} color='yellow' onClick={onFormSubmitResetForm}>Reset</Button>
            <Button className="mt-2 " type={"button"} onClick={handleSubmitWithoutClear}>Submit(Save)</Button>
            <Button className="mt-2 " type={"button"} onClick={onFormSubmit}>Submit</Button>
          </div>



        </form>
      }
    </div>
  )
}
