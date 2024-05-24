import { Button, NumberInput, Select, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form"
import { showNotification } from "@mantine/notifications";
import { BaseAPI, HTTP } from "~/repositories/base"
import stopImage from "~/src/images/delete-icon.svg";

export default function ({ categories, editProduct, setEditProduct,handlePaginationChange,paginationCurrentPage }) {


  const form = useForm({
    initialValues: {
      category_id: editProduct.category_id || '',
      name: editProduct.name || '',
      zone_id: editProduct.zone_id ?? undefined,
      vat_in_percent: editProduct.vat_in_percent,
      discount: editProduct.discount,
    }
  });
 

  const handleSubmit = (values) => {

    HTTP.patch(`${BaseAPI}/products/${editProduct.id}`, values).then(res => {
      showNotification({
        title: "Success",
        message: "Entry Product updated"
      });

      handlePaginationChange(paginationCurrentPage)
      setEditProduct({})
      //clear form data
      form.reset();

    }).catch(err => {
      console.log(err);
      showNotification({
        title: "Error",
        message: "Entry Product update"
      });
    })
  }

  const handleSendToMain = () => {
    setEditProduct({})
  }


  return (
    <>

      <div className="absolute top-0 left-0 z-10 backdrop-blur-sm flex w-full h-full justify-center justify-items-center">
        <form
          className='relative w-1/2 max-w-lg flex flex-col gap-2 min-w-fit bg-slate-50 p-10 my-auto rounded-md shadow-sm shadow-slate-700'
          onSubmit={form.onSubmit(values => handleSubmit(values))}
        >
          <div className="mb-2 font-semibold text-base text-center">Edit Entry Product</div>
          <img onClick={handleSendToMain} className="absolute right-10 h-9 hover:scale-105 duration-100 cursor-pointer" src={stopImage} />
          <Select label="Select Category" data={categories} {...form.getInputProps("category_id")} searchable />
          <TextInput label="Product Name" {...form.getInputProps("name")} />
          <NumberInput label="Zone ID" {...form.getInputProps("zone_id")} />
          <NumberInput precision={2} label="Vat (%)" {...form.getInputProps("vat_in_percent")} />
          <NumberInput precision={2} label="Discount (%)" {...form.getInputProps("discount")} />
          <Button className="mt-4" type="submit">Submit</Button>
        </form>
      </div>

    </>
  )
}
