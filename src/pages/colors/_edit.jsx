import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {BaseAPI, HTTP} from "~/repositories/base";
import Create from "./create";

export default function (){
  const [colors, setColors] = useState(null)
  let {id} = useParams()


  useEffect(()=>{
    HTTP.get(`${BaseAPI}/colors/${id}`).then(res=>{
      setColors(res.data.data)
    }).catch(err=>{
      console.log({err})
    })
  },[])
  return (
    <>
      {!!colors && <Create colors={colors}/>}
    </>
  )
}
