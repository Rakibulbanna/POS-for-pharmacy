import {useState} from "react";

const useAuth = () =>{
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const logOut = ()=>{
    setIsLoggedIn(()=> false)
  }
  return {
    isLoggedIn,
    setIsLoggedIn,
    logOut
  }
}

export default useAuth
