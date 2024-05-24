import { Button, Chip, Table } from "@mantine/core"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react";
import { BaseAPI, HTTP } from "~/repositories/base";
import { showNotification } from "@mantine/notifications";
import EmptyNotification from "@/utility/emptyNotification";
import { GiCrossedSabres } from "react-icons/gi";
import { FaCheck } from "react-icons/fa";

export default function () {
  const [suppliers, setSuppliers] = useState([]);
  const [rerenderGetSupplier, setRerenderGetSupplier] = useState(false);

  useEffect(() => {
    HTTP.get(`${BaseAPI}/suppliers`).then(res => {
      console.log(res.data.data)
      setSuppliers(res.data.data)
    }).catch(err => {
      console.log(err)
    })
  }, [rerenderGetSupplier])

  //delete table
  const handleDelete = (id) => {
    HTTP.delete(`${BaseAPI}/suppliers/${id}`).then(res => {
      showNotification({
        title: "Success",
        message: "Category deleted"
      });
      setRerenderGetSupplier((value) => !value);
    }).catch(err => {
      console.log(err)
      showNotification({
        title: "Error",
        message: ""
      })
    })
  }


  return (
    <>
      <div className="mb-4 flex w-full justify-end">
        <Link to={"/suppliers/create"}>
          <Button>Create New Suppliers</Button>
        </Link>
      </div>

      <div className=" h-[calc(100vh-85px)] overflow-auto w-full mx-auto shadow-sm shadow-black p-1 rounded-sm" >
        <div className="h-fit min-h-full shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-300">

            <thead className="text-xs uppercase bg-gray-700 text-gray-300 sticky -top-1 left-0 z-10">
              <tr>
                <th scope="col" className="py-3 px-2">name</th>
                <th scope="col" className="py-3 px-2">Company Name</th>
                <th scope="col" className="py-3 px-2">Is Vendor</th>
                <th scope="col" className="py-3 px-2">Address</th>
                <th scope="col" className="py-3 px-2">Phone Number</th>
                <th scope="col" className="py-3 px-2">Email Address</th>
                <th scope="col" className="py-3 px-2">Payment Mode</th>
                <th scope="col" className="py-3 px-2">Discount</th>
                <th scope="col" className="py-3 px-2">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 overflow-y-auto bg-gray-100">
              {suppliers.map((sup, index) => (
                <tr key={sup.id} className={`${index % 2 === 0 ? '' : 'bg-gray-200'} border-b  border-gray-700`}>
                  <th scope="row" className=" px-2 font-medium  whitespace-nowrap text-gray-600">
                    {sup.first_name + " " + `${sup.last_name ? sup.last_name : ''}`}
                  </th>
                  <td className=" px-2">
                    {sup.company_name}
                  </td>
                  <td className="px-2 text-center">
                   {sup.is_vendor ? <FaCheck color="green" fontSize={20}/> :  <GiCrossedSabres color="red" fontSize={20}/>}
                  </td>
                  <td className=" px-2">
                    {sup.address}
                  </td>
                  <td className=" px-2">
                    {sup.phone_number}
                  </td>
                  <td className=" px-2">
                    {sup.email_address}
                  </td>
                  <td className=" px-2">
                    {'Needed upgrade'}
                  </td>
                  <td className=" px-2">
                    {sup.discount}
                  </td>
                  <td className=" px-2 w-fit flex">
                    <Link to={`/suppliers/edit/${sup.id}`}>
                      <Button size="xs" color={"cyan"}>Edit</Button>
                    </Link>
                    <Button size="xs" onClick={() => handleDelete(sup.id)} className={"ml-6"} variant="outline" color={"red"} >Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {
            suppliers.length === 0 &&
            <div className=" mt-20 flex justify-center">
              <EmptyNotification value='Suppliers' />
            </div>
          }
        </div>
      </div>
    </>
  )
}
