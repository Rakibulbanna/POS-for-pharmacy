import {useEffect, useState} from "react";
import Edit from "./edit"
import {useParams} from "react-router-dom";
import {BaseAPI, HTTP} from "~/repositories/base";
import Create from "./create";

export default function (){
  const [brand, setBrand] = useState(null)
  let {id} = useParams()


  useEffect(()=>{
    HTTP.get(`${BaseAPI}/brands/${id}`).then(res=>{
      setBrand(res.data.data)
    }).catch(err=>{
      console.log({err})
    })
  },[])
  return (
    <>
      {!!brand && <Create brand={brand}/>}
    </>
  )
}
