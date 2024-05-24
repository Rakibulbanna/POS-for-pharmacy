import Edit from "./edit"
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {BaseAPI, HTTP} from "~/repositories/base";

export default function (){
  const [ready, setReady] = useState(false)
  let {id} = useParams()
  const [product, setProduct] = useState({})
  useEffect(()=>{
    HTTP.get(`${BaseAPI}/products/${id}`).then(res=>{
      setProduct(res.data.data)

      setTimeout(()=>{
        setReady(true)
      }, 10)
    }).catch(err=>{
      console.log({err})
    })

  },[]);


  return (
    <>
      {ready && <Edit product={product}/>}
    </>
  )
}
