import {useEffect, useState} from "react";
import Edit from "./edit"
import {useParams} from "react-router-dom";
import {BaseAPI, HTTP} from "~/repositories/base";
import Create_edit_form from "@/components/supplier/create_edit_form";

export default function (){
  const [brand, setBrand] = useState(null);
  const [payModes, setPayModes] = useState(null);
  const [isReady,setIsReady] = useState(false);
  
  let {id} = useParams();

  const handleAllFetch = async () => {

    let res = await HTTP.get(`${BaseAPI}/supplier/${id}`)
    setBrand(res.data.data);

    res = await HTTP.get(`${BaseAPI}/pay-modes`);
    setPayModes(res.data.data);

    setTimeout(() => {
      setIsReady(true);
    }, 1)
  }

  useEffect(() => {
    handleAllFetch()
  }, []);

  return (
    <>
      {isReady &&  <Create_edit_form payModes={payModes} supplier={brand}/>}
    </>
  )
}
