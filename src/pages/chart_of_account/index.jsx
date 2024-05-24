import EmptyNotification from '@/utility/emptyNotification';
import { Button } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BaseAPI, HTTP } from '~/repositories/base';
import Create from './create';

export default function () {


  const [accounts, setAccounts] = useState([]);
  const [showCreatePage, setShowCreatePage] = useState(false);
  const [editAccount, setEditAccount] = useState(null);
  const [rerender,setRerender] = useState(false);

  useEffect(() => {
    HTTP.get(`${BaseAPI}/account-management/accounts`).then(res => {
      setAccounts(()=>res.data.data)
    })
  }, [rerender])

  const handleEditAccount = (account)=>{
    setShowCreatePage(()=>true);
    setEditAccount(()=>account);
  }

  const handleDelete = (id) => {
    HTTP.delete(`${BaseAPI}/account-management/account/${id}`).then(res => {
      showNotification({
        title: "Success",
        message: "account deleted"
      })
      setRerender((value)=>!value);

    }).catch(err => {
      console.log(err)
      showNotification({
        title: "Error",
        message: ""
      })
    })
  }


  return <>

    <div className="my-4 flex w-full justify-end">
      {/* <Link to={"/accounts/create"}> */}
      <Button onClick={() => setShowCreatePage(() => true)}>Create</Button>
      {/*<Button onClick={() => setShowCreatePage(() => true)}>Create Sub Account</Button>*/}
      {/* </Link> */}
       <Link to={"/account_management/chart_of_account/sub-accounts"}>
         <Button>Sub Accounts</Button>
       </Link>
    </div>
    {
      showCreatePage === false ?
        <div className=" h-[calc(100vh-100px)] overflow-auto w-1/2 mx-auto shadow-sm shadow-black" >
        
            <table className="w-full text-sm text-left text-gray-300 relative">
              <thead className="text-xs uppercase bg-gray-700 text-gray-300 sticky top-0 z-50 ">
                <tr>
                  <th scope="col" className="py-3 px-6">ID</th>
                  <th scope="col" className="py-3 px-6">name</th>
                  <th scope="col" className="py-3 px-6">Action</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 bg-gray-100">
                {
                  accounts.map((account, index) => (
                    <tr key={account.id} className={`${index % 2 === 0 ? '' : 'bg-gray-200'} border-b  border-gray-700`}>
                      <th scope="row" className=" px-6 font-medium text-gray-600">  {account.id}</th>
                      <th scope="row" className=" px-6 font-medium text-gray-600">  {account.name}</th>
                      <td className=" px-6 flex gap-4">
                        
                        <Button size="xs" onClick={()=>handleEditAccount(account)} color={"cyan"}>Edit</Button>
                        
                        <Button size="xs" className={"ml-4"} variant={"outline"} color={"red"} onClick={() => handleDelete(account.id)}>Delete</Button>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
            {
              accounts.length === 0 &&
              <div className=" mt-20 flex justify-center">
                <EmptyNotification value='Colors' edit />
              </div>
            }
          
        </div>
        :
        <Create 
        setShowCreatePage={setShowCreatePage} 
        editAccount={editAccount}
        setEditAccount={setEditAccount}
        setRerender={setRerender}
        />
    }
  </>
}