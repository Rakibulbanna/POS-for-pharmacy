import CreateEditForm from "@/components/supplier/create_edit_form";
import {useEffect, useState} from "react";
import {BaseAPI, HTTP} from "~/repositories/base";

export default function () {

  const [payModes, setPayModes] = useState([])

  useEffect(()=>{
    HTTP.get(`${BaseAPI}/pay-modes`).then(res=>{
      console.log(res.data.data);
      setPayModes(res.data.data)
    }).catch(err=>{
      console.log(err)
    })
  },[])
  return (
    <>
      {payModes.length &&
        <CreateEditForm payModes={payModes}/>
      }
    </>
  )
}
