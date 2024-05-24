import { Button, Input, NumberInput, PasswordInput, Switch, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { BaseAPI, HTTP } from "~/repositories/base";
import { showNotification } from "@mantine/notifications";
import deleteicon from "~/src/images/delete-icon.svg";
import { useNavigate } from "react-router-dom";

export default function ({ category = null }) {

  const navigate = useNavigate();

  let form = useForm({
    initialValues: {
      name: "",
      floor_id: 0,
      vat_in_percent: 0,
      discount_in_percent: 0,
    }
  });

  if (category) {
    form = useForm({
      initialValues: category
    })
  }

  const handleBackToMainPage = () => {
    navigate("/categories");
  }

  const handleFormSubmit = (values) => {
    if (category) {
      HTTP.patch(`${BaseAPI}/categories/${category.id}`, values).then(res => {
        showNotification({
          title: "Success",
          message: "Group updated"
        });
        //return to the main supplier page
        handleBackToMainPage();
      }).catch(err => {
        console.log(err)
        showNotification({
          title: "Error",
          message: ""
        })
      })
    }
    else {
      // TODO: extract this notification to helper function
      HTTP.post(`${BaseAPI}/categories`, values).then(res => {
        showNotification({
          title: "Success",
          message: "Category created"
        });
        //reset form data
        form.reset();

      }).catch(err => {
        console.log(err)
        showNotification({
          title: "Error",
          color:"red",
          message: err?.response?.data?.message || 'Error to created Category'
        })
      })
    }

  }

  console.log(form);

  return (
    <>
      <div className=" absolute h-full w-full backdrop-blur top-0 left-0 flex justify-center justify-items-center ">
        <form
          onSubmit={form.onSubmit(handleFormSubmit)}
          className='z-50 w-96 flex flex-col gap-1 bg-slate-50 p-10 my-auto rounded-md shadow-md shadow-slate-700'
        >
          <div className=" flex justify-center text-lg  text-center relative z-0 mb-6 w-full group">
            <div>{category ? 'Edit Category' : 'Create New Category'}</div>
            <img className="absolute right-0 top-0 cursor-pointer h-8 hover:scale-110 duration-150 " src={deleteicon} onClick={handleBackToMainPage} />
          </div>
          <div className="relative z-0 mb-6 w-full group">
            <TextInput required {...form.getInputProps("name")} />
            <label htmlFor="Name" className="top-0 bg-white peer-focus:font-medium absolute text-sm sm:text-md lg:text-lg text-gray-500 dark:text-gray-400 duration-300 htmlForm -translate-y-6 scale-75 -z-10 peer-focus:z-10 origin-[0] peer-focus:left-6 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Name</label>
          </div>
          <div className="relative z-0 mb-6 w-full group">
            <NumberInput min={0} required {...form.getInputProps("floor_id")} />
            <label htmlFor="floor_id" className="top-0 bg-white peer-focus:font-medium absolute text-sm sm:text-md lg:text-lg text-gray-500 dark:text-gray-400 duration-300 htmlForm -translate-y-6 scale-75 -z-10 peer-focus:z-10 origin-[0] peer-focus:left-6 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Floor Id</label>
          </div>
          <div className="relative z-0 mb-6 w-full group">
            <NumberInput min={0} {...form.getInputProps("vat_in_percent")} />
            <label htmlFor="vat_in_percent" className="top-0 bg-white peer-focus:font-medium absolute text-sm sm:text-md lg:text-lg text-gray-500 dark:text-gray-400 duration-300 htmlForm -translate-y-6 scale-75 -z-10 peer-focus:z-10 origin-[0] peer-focus:left-6 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Vat In Parcent ( % )
            </label>
          </div>
          <div className="relative z-0 mb-6 w-full group">
            <NumberInput min={0} {...form.getInputProps("discount_in_percent")} />
            <label htmlFor="discount_in_percent" className="top-0 bg-white peer-focus:font-medium absolute text-sm sm:text-md lg:text-lg text-gray-500 dark:text-gray-400 duration-300 htmlForm -translate-y-6 scale-75 -z-10 peer-focus:z-10 origin-[0] peer-focus:left-6 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Discount In Percent ( % )
            </label>
          </div>
          <Button type={"submit"}>Submit</Button>
        </form>
      </div>
    </>
  )
}
