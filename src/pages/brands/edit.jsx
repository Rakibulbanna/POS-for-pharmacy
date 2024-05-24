import {Button, Input} from "@mantine/core";
import {useForm} from "@mantine/form";
import {BaseAPI, HTTP} from "~/repositories/base";
import {showNotification} from "@mantine/notifications";

export default function ({brand}){
  const form = useForm({
    initialValues: {
      name: brand.name
    }
  })

  const handleFormSubmit = (values) => {
 // TODO: extract this notification to helper function
    HTTP.post(`${BaseAPI}/brands`, values).then(res => {
      showNotification({
        title: "Success",
        message: "Group created"
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
        <Input.Wrapper label={"Name"}>
          <Input required {...form.getInputProps('name')}/>
        </Input.Wrapper>
        <Button type={"submit"}>Submit</Button>
      </form>
    </>
  )
}
