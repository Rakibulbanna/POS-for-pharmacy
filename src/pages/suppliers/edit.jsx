import {Button, Input} from "@mantine/core";
import {useForm} from "@mantine/form";
import {BaseAPI, HTTP} from "~/repositories/base";
import {showNotification} from "@mantine/notifications";

export default function ({brand}){
  
  //get all keys of object
  const parameterArray = Object.keys(brand);

  const copyBrand = {...brand};


  const forInitialValues = {};
  parameterArray.forEach((key)=>{
    forInitialValues[key] = copyBrand[key];
  })
  
  const form = useForm({
    initialValues: brand
  });


  const handleFormSubmit = (values) => {
// TODO: extract this notification to helper function
    HTTP.patch(`${BaseAPI}/suppliers/${brand.id}`, values).then(res => {
      showNotification({
        title: "Success",
        message: "Group updated"
      })
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
      <form onSubmit={form.onSubmit(handleFormSubmit)} className={"flex flex-col gap-6"}>
        {
          parameterArray.map((key)=>
          key !== 'id' && 
          <Input.Wrapper label={key} key={key}>
            <Input required {...form.getInputProps(key)}/>
          </Input.Wrapper>
          
          )
        }
        <Button type={"submit"}>Submit</Button>
      </form>
    </>
  )
}
