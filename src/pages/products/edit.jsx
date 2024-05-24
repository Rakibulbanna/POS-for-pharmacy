import { Button, Input, PasswordInput, Switch } from "@mantine/core";
import { useForm } from "@mantine/form"
import { useEffect, useState } from "react";
import { BaseAPI, HTTP } from "~/repositories/base";
import { useNavigate, useParams } from "react-router-dom";
import { showNotification } from "@mantine/notifications";
import ProductForm from "@/components/products/products_create_form"


export default function ({ product }) {
  const [isReady, setIsReady] = useState(false)

  const [suppliers, setSuppliers] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);

  const navigate = useNavigate();

  const getDeps = async () => {

    let res = await HTTP.get(`${BaseAPI}/suppliers`)
    setSuppliers(res.data.data)


    res = await HTTP.get(`${BaseAPI}/brands`)
    setBrands(res.data.data)


    res = await HTTP.get(`${BaseAPI}/categories`)
    setCategories(res.data.data)

    res = await HTTP.get(`${BaseAPI}/colors`)
    setColors(res.data.data)


    setTimeout(() => {
      setIsReady(true)
    }, 1)
  }

  useEffect(() => {
    getDeps()
  }, [])

  const handleSubmit = async (values) => {
    return new Promise((resolve, reject) => {
      HTTP.patch(`${BaseAPI}/products/${product.id}`, values).then(res => {
        showNotification({
          title: "Success",
          message: "Product updated"
        })
        resolve(res);
        navigate(-1);
        
      }).catch(err => {
        showNotification({
          title: "Error",
          message: ""
        })
        reject(err)
      })
    })
  }

  return (
    <>
      {isReady && <ProductForm product={product} suppliers={suppliers} brands={brands} categories={categories} colors={colors} onSubmit={handleSubmit} />}
    </>
  )
}
