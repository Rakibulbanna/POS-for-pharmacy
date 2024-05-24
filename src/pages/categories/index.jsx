import { Link } from "react-router-dom";
import { ActionIcon, Button, Table, TextInput } from "@mantine/core";
import { useEffect, useState, useRef } from "react";
import { BaseAPI, HTTP } from "~/repositories/base";
import { showNotification } from "@mantine/notifications";
import EmptyNotification from "@/utility/emptyNotification";
import { IconSearch } from "@tabler/icons";
import { fullStringCheck } from "@/utility/functions";

export default function () {
  const [categories, setCategories] = useState([])
  const [filterCategories, setFilterCategories] = useState(null)

  const searchText = useRef();
  useEffect(() => {
    HTTP.get(`${BaseAPI}/categories`).then(res => {
      setCategories(res.data.data)
    })
  }, [])

  const handleDelete = (id) => {
    HTTP.delete(`${BaseAPI}/categories/${id}`).then(res => {
      showNotification({
        title: "Success",
        message: "Category deleted"
      })

      HTTP.get(`${BaseAPI}/categories`).then(res => {
        setCategories(res.data.data)
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
      const filter = categories.filter(i => i.name.toLowerCase().includes(searchText.current.value.toLowerCase()))
      setFilterCategories(filter)
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
                setFilterCategories(null)
              }
            }}
            ref={searchText}
          />
          <ActionIcon variant="filled" onClick={handelSearch} size='lg'>
            <IconSearch size="1rem" />
          </ActionIcon>
        </div>
        <Link to={"/categories/create"}>
          <Button>Create New Categorie</Button>
        </Link>
      </div>
      <div className=" h-[calc(100vh-85px)] w-fit overflow-auto mx-auto shadow-sm shadow-black p-1 rounded-sm" >
        <div className="h-fit min-h-full shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs uppercase bg-gray-700 text-gray-300 sticky -top-1 left-0  z-10 ">
              <tr>
                <th scope="col" className="py-2 px-6">name</th>
                <th scope="col" className="py-2 px-6">Zone Id</th>
                <th scope="col" className="py-2 px-6">Vat ( % )</th>
                <th scope="col" className="py-2 px-6">Discount ( % )</th>
                <th scope="col" className="py-2 px-6">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 overflow-y-auto bg-gray-100">
              {(filterCategories ? filterCategories : categories).map((category, index) => (
                <tr key={category.id} className={`${index % 2 === 0 ? '' : 'bg-gray-200'} border-b  border-gray-700`}>
                  <th scope="row" className=" px-6 font-medium  whitespace-nowrap text-gray-600">
                    {category.name}
                  </th>
                  <td scope="row" className=" px-6 whitespace-nowrap text-gray-600">
                    {category.floor_id}
                  </td>
                  <td scope="row" className="px-6 whitespace-nowrap text-gray-600">
                    {category.vat_in_percent}
                  </td>
                  <td scope="row" className=" px-6 whitespace-nowrap text-gray-600">
                    {category.discount_in_percent}
                  </td>
                  <td className=" px-6 flex gap-4">
                    <Link to={"/categories/edit/" + category.id}>
                      <Button className="h-7" color={"cyan"}>Edit</Button>
                    </Link>
                    <Button className={"ml-6 h-7"} variant="outline" color={"red"} onClick={() => handleDelete(category.id)}>Delete</Button>
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
          {
            categories.length === 0 &&
            <div className=" mt-20 flex justify-center">
              <EmptyNotification value='Categories' />
            </div>
          }
        </div>
      </div>
    </>
  )
}
