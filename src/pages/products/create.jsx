import ProductCreateForm from "@/components/products/products_create_form";
import {useEffect, useState} from "react";
import {BaseAPI, HTTP} from "~/repositories/base";
import {showNotification} from "@mantine/notifications";

export default function () {
  const [isReady, setIsReady] = useState(false)

  const [suppliers, setSuppliers] = useState([])
  const [brands, setBrands] = useState([])
  const [categories, setCategories] = useState([]);

  const getDeps = async () => {

    let res = await HTTP.get(`${BaseAPI}/suppliers`)
    setSuppliers(res.data.data)


    res = await HTTP.get(`${BaseAPI}/brands`)
    setBrands(res.data.data)


    res = await HTTP.get(`${BaseAPI}/categories`)
    setCategories(res.data.data)


    setTimeout(() => {
      setIsReady(true)
    }, 1)
  }

  const handleSubmit = async (values) => {
    return new Promise((resolve, reject) => {
      HTTP.post(`${BaseAPI}/products`, values).then(res => {
        showNotification({
          title: "Success",
          message: "Product created"
        })
        resolve(res)
      }).catch(err => {
        showNotification({
          title: "Error",
          message: err?.response?.data?.message || 'Error to created Product'
        })
        reject(err)
      })
    })
  }

  useEffect(() => {
    getDeps();
  }, [])


  return (
    <>
      {isReady ?
        <ProductCreateForm suppliers={suppliers} brands={brands} categories={categories} onSubmit={handleSubmit}/> 
          :
        <h1></h1>
      }
    </>
  )
}
