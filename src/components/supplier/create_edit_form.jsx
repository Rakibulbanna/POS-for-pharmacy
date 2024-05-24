import { Checkbox, NumberInput, TextInput, Button, Switch } from "@mantine/core";
import { useForm } from "@mantine/form";
import { BaseAPI, HTTP } from "~/repositories/base";
import { showNotification } from "@mantine/notifications";
import deleteicon from "~/src/images/delete-icon.svg";
import { useNavigate } from "react-router-dom";


export default function ({ payModes = [], supplier = null }) {

  const navigate = useNavigate();

  let paymodesId = [];
  
  let form = useForm({
    initialValues: {
      first_name: "",
      last_name: "",
      company_name: "",
      address: "",
      phone_number: "",
      email_address: "",
      discount: 0,
      pay_mode_ids: [],
      is_vendor: false,
    }
  })

  if (supplier) {
    let updateSupplier = {}

    paymodesId = supplier?.pay_modes?.length > 0 ? supplier.pay_modes.map((value) => String(value.id)) : [];
    updateSupplier = { ...supplier, pay_mode_ids: paymodesId };
    delete updateSupplier.pay_modes;

    form = useForm({
      initialValues: updateSupplier
    })
  }

  const handleBackToMainPage = () => {
    navigate("/suppliers");
  }

  const handleSubmit = (values) => {
    if (supplier) {
      HTTP.patch(`${BaseAPI}/suppliers/${supplier.id}`, values).then(res => {
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
      HTTP.post(`${BaseAPI}/suppliers`, values).then(res => {
        console.log(res);
        showNotification({
          title: "Success",
          message: "Supplier created"
        })
        form.reset();
      }).catch(err => {
        console.log(err)
        showNotification({
          title: "Error",
          color: 'red',
          message: err?.response?.data?.message || 'Error to created Supplier'
        })
      })
    }
  }

  return (
    <>
      <div className=" absolute h-full w-full backdrop-blur top-0 left-0 flex justify-center justify-items-center ">
        <form
          onSubmit={form.onSubmit(values => handleSubmit(values))}
          className='z-50 flex flex-col gap-1 w-1/3 bg-slate-50 p-10 my-auto rounded-md shadow-md shadow-slate-700'
        >
          <div className=" flex justify-center text-lg  text-center relative z-0 mb-6 w-full group">
            <div>{supplier ? 'Edit Supplier' : 'Create New Supplier'}</div>
            <img className="absolute right-0 top-0 cursor-pointer h-8 hover:scale-110 duration-150 " src={deleteicon} onClick={handleBackToMainPage} />
          </div>
          {/* <div className="flex gap-4" > */}
          <div className="relative z-0 mb-6 w-full group">
            <TextInput {...form.getInputProps("first_name")} />
            <label htmlFor="first_name" className=" peer-focus:z-10 bg-white peer-focus:font-medium absolute text-sm sm:text-md lg:text-lg text-gray-500 dark:text-gray-400 duration-300 htmlForm -translate-y-6 scale-75 top-0 -z-10 origin-[0] peer-focus:left-6 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">First name</label>
          </div>
          {/* <div className="relative z-0 mb-6 w-full group">
              <TextInput {...form.getInputProps("last_name")} />
              <label htmlFor="last_name" className=" bg-white peer-focus:font-medium absolute text-sm sm:text-md lg:text-lg text-gray-500 dark:text-gray-400 duration-300 htmlForm -translate-y-6 scale-75 top-0 -z-10 peer-focus:z-10 origin-[0] peer-focus:left-6 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Last name</label>
            </div> */}
          {/* </div> */}
          <div className="relative z-0 mb-6 w-full group">
            <TextInput required {...form.getInputProps("company_name")} />
            <label htmlFor="phone_number" className="top-0 bg-white peer-focus:font-medium absolute text-sm sm:text-md lg:text-lg text-gray-500 dark:text-gray-400 duration-300 htmlForm -translate-y-6 scale-75 -z-10 peer-focus:z-10 origin-[0] peer-focus:left-6 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Company Name</label>
          </div>
          <div className="relative z-0 mb-6 w-full group">
            <TextInput {...form.getInputProps("address")} />
            <label htmlFor="phone_number" className="top-0 bg-white peer-focus:font-medium absolute text-sm sm:text-md lg:text-lg text-gray-500 dark:text-gray-400 duration-300 htmlForm -translate-y-6 scale-75 -z-10 peer-focus:z-10 origin-[0] peer-focus:left-6 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Address</label>
          </div>
          <div className="relative z-0 mb-6 w-full group">
            <TextInput  {...form.getInputProps("phone_number")} />
            <label htmlFor="phone_number" className="top-0 bg-white peer-focus:font-medium absolute text-sm sm:text-md lg:text-lg text-gray-500 dark:text-gray-400 duration-300 htmlForm -translate-y-6 scale-75 -z-10 peer-focus:z-10 origin-[0] peer-focus:left-6 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Phone Number</label>
          </div>
          <div className="relative z-0 mb-6 w-full group">
            <TextInput  {...form.getInputProps("email_address")} />
            <label htmlFor="email_address" className="top-0 bg-white peer-focus:font-medium absolute text-sm sm:text-md lg:text-lg text-gray-500 dark:text-gray-400 duration-300 htmlForm -translate-y-6 scale-75 -z-10 peer-focus:z-10 origin-[0] peer-focus:left-6 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email</label>
          </div>
          <div className="relative z-0 mb-6 w-full group">
            <label htmlFor="Payment_Mode" className="top-0 bg-white peer-focus:font-medium absolute text-sm sm:text-md lg:text-lg text-gray-500 dark:text-gray-400 duration-300 htmlForm -translate-y-6 scale-75 -z-10 peer-focus:z-10 origin-[0] peer-focus:left-6 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Payment Mode</label>
            <Checkbox.Group  {...form.getInputProps("pay_mode_ids")}>
              {payModes && payModes.map(payMode => (
                <Checkbox value={`${payMode.id}`} label={payMode.method} key={payMode.id} />
              ))}
            </Checkbox.Group>
          </div>
          <div className="relative z-0 mb-6 w-full group">
            <label htmlFor="is_vendor" className="top-0 bg-white peer-focus:font-medium absolute text-sm sm:text-md lg:text-lg text-gray-500 dark:text-gray-400 duration-300 htmlForm -translate-y-6 scale-75 -z-10 peer-focus:z-10 origin-[0] peer-focus:left-6 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Vendor</label>
            <Switch {...form.getInputProps("is_vendor")} defaultChecked={form.values.is_vendor} onLabel="YES" offLabel="NO" />
          </div>
          <div className="relative z-0 mb-6 w-full group">
            <NumberInput min={0} {...form.getInputProps("discount")} />
            <label htmlFor="Discount" className="top-0 bg-white peer-focus:font-medium absolute text-sm sm:text-md lg:text-lg text-gray-500 dark:text-gray-400 duration-300 htmlForm -translate-y-6 scale-75 -z-10 peer-focus:z-10 origin-[0] peer-focus:left-6 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Discount</label>
          </div>
          <Button type={"submit"}>Submit</Button>
        </form>
      </div>
    </>
  )
}
