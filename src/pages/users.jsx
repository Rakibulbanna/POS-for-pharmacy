import { Button, Table } from "@mantine/core"
import { Route, Link } from "react-router-dom";
import Create from "@/pages/users/create"
import { useEffect, useState } from "react";
import { BaseAPI, HTTP } from "~/repositories/base";
import { showNotification } from "@mantine/notifications";
import EmptyNotification from "@/utility/emptyNotification";
import { useAtom } from "jotai";
import {LoggedInUser } from "@/store/auth";

export default function () {
  const [loggedInUser,] =  useAtom(LoggedInUser);
  console.log({loggedInUser: loggedInUser.role});
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    HTTP.get(`${BaseAPI}/users?role=${loggedInUser.role}`).then(res => {
      setUsers(res.data.data)
    }).catch(err => {
      console.log(err);
    })
  }, [])

  const handleDelete = (id) => {
    HTTP.delete(`${BaseAPI}/users/${id}`).then(res => {
      showNotification({
        title: "Success",
        message: "Item deleted"
      })

      HTTP.get(`${BaseAPI}/users?role=${loggedInUser.role}`).then(res => {
        setUsers(res.data.data)
      }).catch(err => {
        console.log(err)
      })
    }).catch(err => {
      showNotification({
        title: "Error",
        message: "Error to deleted User"
    })
    })
  }


  return (
    <>
      <div className="my-4 flex w-full justify-end">
        {/*<Route path={"users/create"} element={<Create/>}></Route>*/}
        <Link to={"/users/create"}><Button>Create New User</Button></Link>
        {/*<Button onClick={()=>}>Create</Button>*/}

      </div>

      <div className="h-fit shadow-sm shadow-black p-2 rounded-md" >
        <div className="h-[calc(100vh-120px)] overflow-x-auto relative shadow-md sm:rounded-lg">
          <table className=" w-full text-sm text-left text-gray-300">
            <thead className="text-xs uppercase bg-gray-700 text-gray-300">
              <tr>
                <th scope="col" className="py-3 px-6">Name</th>
                <th scope="col" className="py-3 px-6">Phone Number</th>
                <th scope="col" className="py-3 px-6">Email</th>
                <th scope="col" className="py-3 px-6">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 overflow-y-auto">
              {users.map((user, index) =>
                <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'} border-b  border-gray-700`}>
                  <th scope="row" className="px-6 font-medium  whitespace-nowrap text-gray-600">
                    {user.first_name + user.last_name}
                  </th>
                  <td className="px-6">
                    {user.phone_number}
                  </td>
                  <td className="px-6">
                    {user.email}
                  </td>
                  <td className=" py-1 px-6 ">
                    <Link className=" mr-5" to={`/users/edit/${user.id}`}>
                      <Button color={"cyan"}>Edit</Button>
                    </Link>
                    <Button onClick={() => handleDelete(user.id)} color={"red"}> Delete</Button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {
            users?.length === 0 &&
            <div className=" mt-40">
            <EmptyNotification value='User' />
          </div>
          }
        </div>
      </div>
    </>
  )
}
