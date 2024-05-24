import Edit from "./edit"
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {BaseAPI, HTTP} from "~/repositories/base";
import Create from "./create";

export default function (){
  const [ready, setReady] = useState(false)
  let {id} = useParams()
  const [user, setUser] = useState({})
  useEffect(()=>{
    HTTP.get(`${BaseAPI}/users/${id}`).then(res=>{
      setUser(res.data.data)

      setTimeout(()=>{
        setReady(true)
      }, 10)
    }).catch(err=>{
      console.log({err})
    })
  },[])

  return (
    <>
      {ready && <Create user={user}/>}
    </>
  )
}
