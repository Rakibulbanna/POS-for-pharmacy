import {useEffect, useState} from "react";
import Edit from "./edit"
import {useParams} from "react-router-dom";
import {BaseAPI, HTTP} from "~/repositories/base";
import Create from "./create";

export default function (){
  const [category, setCategory] = useState(null)
  let {id} = useParams()


  useEffect(()=>{
    HTTP.get(`${BaseAPI}/categories/${id}`).then(res=>{
      setCategory(res.data.data)
    }).catch(err=>{
      console.log({err})
    })
  },[])
  return (
    <>
      {!!category && <Create category={category}/>}
    </>
  )
}
