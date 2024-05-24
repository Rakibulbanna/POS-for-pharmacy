import { Button, Input, PasswordInput, Switch, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { BaseAPI, HTTP } from "~/repositories/base";
import { showNotification } from "@mantine/notifications";
import deleteicon from "~/src/images/delete-icon.svg";
import { useNavigate } from "react-router-dom";

export default function ({ editAccount = null,setEditAccount,setShowCreatePage,setRerender }) {

  const navigate = useNavigate();

  let form = useForm({
    initialValues: {
      name: null
    }
  })

  if(editAccount){
    form = useForm({
      initialValues: editAccount 
    })
  }

  const handleBackToMainPage = () => {
    setShowCreatePage(()=>false);
    setEditAccount(()=>null);
  }

  const handleFormSubmit = (values) => {
    if (editAccount) {
      HTTP.patch(`${BaseAPI}/account-management/account/${editAccount.id}`, values).then(res => {
        showNotification({
          title: "Success",
          message: "Successfully Updated"
        });
        //back to account main page
        handleBackToMainPage();
        setRerender((value)=>!value);
        
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
      HTTP.post(`${BaseAPI}/account-management/account`, values).then(res => {
        showNotification({
          title: "Success",
          message: "account created"
        });
        //reset form value
        form.reset();
        setRerender((value)=>!value)
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
          <div className=" w-64 flex justify-center text-lg text-center relative z-0 mb-6 group">
            <div>{editAccount ? 'Edit Account' : 'Create New Account'}</div>
            <img className="absolute right-0 top-0 cursor-pointer h-8 hover:scale-110 duration-150 " src={deleteicon} onClick={handleBackToMainPage} />
          </div>
          <div className="pb-4 flex flex-col gap-1" >
            <label htmlFor="name" className="text-slate-700">Name</label>
            <TextInput classNames="" className="w-full" {...form.getInputProps("name")} />
          </div>
          <Button type={"submit"}>Submit</Button>
        </form>
      </div>
    </>
  )
}
