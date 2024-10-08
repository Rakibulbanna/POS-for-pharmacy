import { Button, Input, PasswordInput, Switch, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { BaseAPI, HTTP } from "~/repositories/base";
import { showNotification } from "@mantine/notifications";
import deleteicon from "~/src/images/delete-icon.svg";
import { useNavigate } from "react-router-dom";

export default function ({ brand = null }) {

  const navigate = useNavigate();

  let form = useForm({
    initialValues: {
      name: ""
    }
  })

  if(brand){
    form = useForm({
      initialValues: brand 
    })
  }

  const handleBackToMainPage = () => {
    navigate("/brands");
  }

  const handleFormSubmit = (values) => {
    if (brand) {
      HTTP.patch(`${BaseAPI}/brands/${brand.id}`, values).then(res => {
        showNotification({
          title: "Success",
          message: "Successfully Updated"
        });
        //back to brand main page
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
      HTTP.post(`${BaseAPI}/brands`, values).then(res => {
        showNotification({
          title: "Success",
          message: "Group created"
        });
        //reset form value
        form.reset();
      }).catch(err => {
        console.log(err)
        showNotification({
          title: "Error",
          color:'red',
          message: err?.response?.data?.message || 'Error to created Group'
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
          <div className=" w-64 flex justify-center text-lg text-center relative z-0 mb-6 group">
            <div>{brand ? 'Edit Groups' : 'Create New Groups'}</div>
            <img className="absolute right-0 top-0 cursor-pointer h-8 hover:scale-110 duration-150 " src={deleteicon} onClick={handleBackToMainPage} />
          </div>
          <div className="pb-4 flex flex-col gap-1" >
            <label htmlFor="name" className="text-slate-700">Name</label>
            <TextInput classNames="" className="w-full" {...form.getInputProps("name")} required/>
          </div>
          <Button type={"submit"}>Submit</Button>
        </form>
      </div>
    </>
  )
}
