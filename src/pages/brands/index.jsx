import { Link } from "react-router-dom";
import { Button, Table, TextInput } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { BaseAPI, HTTP } from "~/repositories/base";
import { showNotification } from "@mantine/notifications";
import EmptyNotification from "@/utility/emptyNotification";
import { IconSearch } from "@tabler/icons";
import { ActionIcon } from '@mantine/core';
import { fullStringCheck } from "@/utility/functions";

export default function () {
  const [brands, setBrands] = useState([])
  const [filterBrand, setFilterBrand] = useState(null)
  const searchText = useRef();

  useEffect(() => {
    HTTP.get(`${BaseAPI}/brands`).then(res => {
      setBrands(res.data.data)
    })
  }, [])

  const handleDelete = (id) => {
    HTTP.delete(`${BaseAPI}/brands/${id}`).then(res => {
      showNotification({
        title: "Success",
        message: "Group deleted"
      })

      HTTP.get(`${BaseAPI}/brands`).then(res => {

        setBrands(res.data.data)
      })
    }).catch(err => {
      console.log(err)
      showNotification({
        title: "Error",
        message: ""
      })
    })
  }
  const handelSearch = () => {
    const search = searchText.current.value;
    if (search && !fullStringCheck(search, ' ')) {
      const filter = brands.filter(i => i.name.toLowerCase().includes(searchText.current.value.toLowerCase()))
      setFilterBrand(filter)
    }
  }
  return (
    <>
      <div className="mb-4 flex w-full justify-between">
        <div className="flex justify-center gap-4">
          <TextInput className=' w-64'
            placeholder="Search here..."
            withAsterisk
            onChange={(e) => {
              if (fullStringCheck(e.target.value, '')) {
                setFilterBrand(null)
              }
            }}
            ref={searchText}
          />
          <ActionIcon variant="filled" onClick={handelSearch} size='lg'>
            <IconSearch size="1rem" />
          </ActionIcon>
        </div>
        <Link to={"/brands/create"}>
          <Button>Create New Group</Button>
        </Link>
      </div>
      <div className=" h-[calc(100vh-85px)] overflow-auto w-1/2 mx-auto shadow-sm shadow-black p-1 rounded-sm" >
        <div className="h-fit min-h-full shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs uppercase bg-gray-700 text-gray-300 sticky -top-1 left-0 z-10">
              <tr>
                <th scope="col" className="py-3 px-6">name</th>
                <th scope="col" className="py-3 px-6">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 overflow-y-auto bg-gray-100">
              {(filterBrand ? filterBrand : brands).map((brand, index) => (
                <tr key={brand.id} className={`${index % 2 === 0 ? '' : 'bg-gray-200'} border-b  border-gray-700`}>
                  <th scope="row" className=" px-6 font-medium  whitespace-nowrap text-gray-600">
                    {brand.name}
                  </th>
                  <td className=" px-6 flex gap-4">
                    <Link to={"/brands/edit/" + brand.id}>
                      <Button size="xs" color={"cyan"}>Edit</Button>
                    </Link>
                    <Button size="xs" className={"ml-4"} variant={"outline"} color={"red"} onClick={() => handleDelete(brand.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {
            brands.length === 0 &&
            <div className=" mt-20 flex justify-center">
              <EmptyNotification value='Group' />
            </div>

          }
        </div>
      </div>
    </>
  )
}
