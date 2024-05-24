import React, { useEffect, useState } from 'react'
import { BaseAPI, HTTP } from '~/repositories/base';

function useLoginUser(user) {
    const [isLogin,setIsLogin]=useState(false);

    useEffect(()=>{
        HTTP.get(`${BaseAPI}/users`).then(res => {
            const supps = res.data.data;
            setIsLogin(()=>supps)
          }).catch(err => {
            console.log(err)
          })
    },[])

  return isLogin
}

export default useLoginUser