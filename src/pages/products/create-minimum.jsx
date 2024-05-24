import { Button, Input, NumberInput, Select, Table, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form"
import { showNotification } from "@mantine/notifications";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { BaseAPI, HTTP } from "~/repositories/base"
import stopImage from "~/src/images/delete-icon.svg";
import { useNotification } from "~/hooks/useNotification";
import { openConfirmModal } from "@mantine/modals";

export default function () {
  const [successNotification] = useNotification()
  const [products, setProducts] = useState([])
  const [isReady, setIsReady] = useState(false);
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  const getProducts = () => {
    HTTP.get(`${BaseAPI}/products?for=fill`).then(res => {
      setProducts(res.data.data)
    })
  }

  useEffect(() => {
    // get categories
    HTTP.get(`${BaseAPI}/categories`).then(res => {
      const cats = res.data.data.map(cat => {
        return {
          label: cat.name,
          value: cat.id
        }
      })

      setCategories(cats)
      setTimeout(() => {
        setIsReady(true)
      }, 1);
    }).catch(err => {
      console.log(err);
    })

    getProducts()
  }, [])

  const form = useForm({
    initialValues: {
      category_id: null,
      name: "",
      zone_id: undefined,
      vat_in_percent: 0,
      discount: 0,
    }
  })


  const handleSubmit = (values) => {
    HTTP.post(`${BaseAPI}/products-minimum`, values).then(res => {
      showNotification({
        title: "Success",
        message: "Minimum updated"
      });

      //clear form data
      form.reset();

    }).catch(err => {
      console.log(err);
      showNotification({
        title: "Error",
        message: "Minimum updated"
      });
    })
  }

  const handleSendToMain = () => {
    navigate('/product-entries')
  }

  const openDeleteModal = (id) =>
    openConfirmModal({
      title: 'Are You Sure!',
      centered: true,
      labels: { confirm: 'Confirm', cancel: "Cancel" },
      confirmProps: { color: 'red' },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => handleDelete(id),
    });

  const handleDelete = (id) => {
    HTTP.delete(`${BaseAPI}/products/${id}/hard`).then(res => {
      successNotification("Deleted")
      getProducts()
    }).catch(err => {

    })
  }

  return (
    <>
      {isReady &&
        <div className="flex w-full h-full justify-center justify-items-center">
          <form
            className='relative w-1/2 flex flex-col gap-2 min-w-fit bg-slate-50 p-10 my-auto rounded-md shadow-sm shadow-slate-700'
            onSubmit={form.onSubmit(values => handleSubmit(values))}
          >
            <div className="mb-2 font-semibold text-base text-center">Create Entry Product</div>
            <img onClick={handleSendToMain} className="absolute right-10 h-9 hover:scale-105 duration-100 cursor-pointer" src={stopImage} />
            <Select label="Select Category" data={categories} {...form.getInputProps("category_id")} searchable />
            <TextInput label="Product Name" {...form.getInputProps("name")} />
            <NumberInput label="Zone ID" {...form.getInputProps("zone_id")} />
            <NumberInput precision={2} label="Vat (%)" {...form.getInputProps("vat_in_percent")} />
            <NumberInput precision={2} label="Discount (%)" {...form.getInputProps("discount")} />
            <Button className="mt-4" type="submit">Submit</Button>
          </form>
        </div>
      }
    </>
  )
}
