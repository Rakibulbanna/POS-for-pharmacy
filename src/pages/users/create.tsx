import { Input, PasswordInput, Button, Switch, NumberInput, } from "@mantine/core";
import { useForm } from '@mantine/form';
import { BaseAPI, HTTP } from "~/repositories/base"
import { showNotification } from "@mantine/notifications";
import deleteicon from "~/src/images/delete-icon.svg";
import { useNavigate } from "react-router-dom";

export default function ({ user = null }) {

  const navigate = useNavigate();



  let form = useForm({
    initialValues: {
      first_name: "",
      last_name: "",
      username: "",
      phone_number: "",
      email: "",
      password: "",
      can_give_discount: true,
      is_active: true,
      maximum_discount: 0,
      // termsOfService: false,
    },

    // validate: {
    //   email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    // },
  });

  // console.log("form", form);


  if (user) {
    form = user && useForm({
      initialValues: user
    })
  }


  const handleBackToMainPage = () => {
    navigate("/users")
  }

  const handleFormSubmit = (values: any) => {
    if (user) {
      // TODO: extract this notification to helper function
      HTTP.patch(`${BaseAPI}/users/${user.id}`, values).then(res => {
        showNotification({
          title: "Success",
          message: "User Updated"
        })
        //navigate main user page handler
        handleBackToMainPage()

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
      HTTP.post(`${BaseAPI}/users`, values).then(res => {
        showNotification({
          title: "Success",
          message: "User created"
        });
        //form reset
        form.reset();
      }).catch(err => {
        console.log(err)
        showNotification({
          title: "Error",
          message: ""
        })
      })
    }
  }

  return (
    <>
      <div className=" absolute h-full w-full backdrop-blur top-0 left-0 flex justify-center justify-items-center ">
        <form
          onSubmit={form.onSubmit(handleFormSubmit)}
          className='z-50 flex flex-col gap-1 w-fit bg-slate-50 p-10 my-auto rounded-md shadow-md shadow-slate-700'
        >
          <div className=" flex justify-center text-lg  text-center relative z-0 mb-6 w-full group">
            <div>{user ? 'Edit User' : 'Create New User'}</div>
            <img className="absolute right-0 top-0 cursor-pointer h-8 hover:scale-110 duration-150 " src={deleteicon} onClick={handleBackToMainPage} />
          </div>
          <div className="flex gap-4" >
            <div className="relative z-0 mb-6 w-full group">
              <Input className="" required {...form.getInputProps('first_name')} />
              <label htmlFor="first_name" className=" peer-focus:z-10 bg-white peer-focus:font-medium absolute text-sm sm:text-md lg:text-lg text-gray-500 dark:text-gray-400 duration-300 htmlForm -translate-y-6 scale-75 top-0 -z-10 origin-[0] peer-focus:left-6 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">First name</label>
            </div>
            <div className="relative z-0 mb-6 w-full group">
              <Input className=""  {...form.getInputProps('last_name')} />
              <label htmlFor="last_name" className=" bg-white peer-focus:font-medium absolute text-sm sm:text-md lg:text-lg text-gray-500 dark:text-gray-400 duration-300 htmlForm -translate-y-6 scale-75 top-0 -z-10 peer-focus:z-10 origin-[0] peer-focus:left-6 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Last name</label>
            </div>
          </div>

          <div className="relative z-0 mb-6 w-full group">
            <Input className="" required {...form.getInputProps('username')} />
            <label htmlFor="phone_number" className="top-0 bg-white peer-focus:font-medium absolute text-sm sm:text-md lg:text-lg text-gray-500 dark:text-gray-400 duration-300 htmlForm -translate-y-6 scale-75 -z-10 peer-focus:z-10 origin-[0] peer-focus:left-6 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">User Name</label>
          </div>

          <div className="relative z-0 mb-6 w-full group">
            <Input type={"tel"} {...form.getInputProps('phone_number')} />
            <label htmlFor="phone_number" className=" bg-white peer-focus:font-medium absolute text-sm sm:text-md lg:text-lg text-gray-500 dark:text-gray-400 duration-300 htmlForm -translate-y-6 scale-75 top-0 -z-10 peer-focus:z-10 origin-[0] peer-focus:left-6 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Phone Number</label>
          </div>

          <div className="relative z-0 mb-6 w-full group">
            <Input type={"email"} label={"email"} {...form.getInputProps('email')} />
            <label htmlFor="email" className=" bg-white peer-focus:font-medium absolute text-sm sm:text-md lg:text-lg text-gray-500 dark:text-gray-400 duration-300 htmlForm -translate-y-6 scale-75 top-0 -z-10 peer-focus:z-10 origin-[0] peer-focus:left-6 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email</label>
          </div>

          <div className="relative z-0 mb-6 w-full group">
            <label htmlFor="address" className=" bg-white peer-focus:font-medium absolute text-sm sm:text-md lg:text-lg text-gray-500 dark:text-gray-400 duration-300 htmlForm -translate-y-6 scale-75 top-0 -z-10 peer-focus:z-10 origin-[0] peer-focus:left-6 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
            <PasswordInput required {...form.getInputProps('password')} />
          </div>

          <div className="relative z-0 mb-6 w-full group flex justify-between">
            <div>
            <label htmlFor="address" className=" bg-white peer-focus:font-medium absolute text-sm sm:text-md lg:text-lg text-gray-500 dark:text-gray-400 duration-300 htmlForm -translate-y-6 scale-75 top-0 -z-10 peer-focus:z-10 origin-[0] peer-focus:left-6 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Discount ability</label>
              <Switch defaultChecked={user ? user.can_give_discount : false} {...form.getInputProps('can_give_discount')} />
            </div>

            <div>
              <label htmlFor="address" className=" bg-white peer-focus:font-medium absolute text-sm sm:text-md lg:text-lg text-gray-500 dark:text-gray-400 duration-300 htmlForm -translate-y-6 scale-75 top-0 -z-10 peer-focus:z-10 origin-[0] peer-focus:left-6 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Maximum Discount</label>
              <NumberInput disabled={!form.values.can_give_discount} {...form.getInputProps("maximum_discount")} />
            </div>

          </div>

          <div className="relative z-0 mb-6 w-full group">
            <label htmlFor="address" className=" bg-white peer-focus:font-medium absolute text-sm sm:text-md lg:text-lg text-gray-500 dark:text-gray-400 duration-300 htmlForm -translate-y-6 scale-75 top-0 -z-10 peer-focus:z-10 origin-[0] peer-focus:left-6 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Active</label>
            <Switch defaultChecked={user? user.is_active : true} {...form.getInputProps('is_active')} />
          </div>

          <input
            className="py-2 border-none first-letter text-lg w-full duration-150 active:translate-y-1 text-gray-100 bg-sky-400 cursor-pointer hover:bg-sky-500 active:bg-sky-700 rounded-md"
            type={'submit'} value='Submit' />
        </form>
      </div>
    </>
  )
}
