import {Button, Input, PasswordInput, Switch} from "@mantine/core";
import {useForm} from "@mantine/form"
import {useEffect, useState} from "react";
import {BaseAPI, HTTP} from "~/repositories/base";
import {useParams} from "react-router-dom";
import {showNotification} from "@mantine/notifications";


export default function ({user}) {

  const form = useForm({
    initialValues: {
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      phone_number: user.phone_number,
      email: user.email,
      password: user.password,
      can_give_discount: user.can_give_discount,
      is_active: user.is_active
      // termsOfService: false,
    }
  })

  const handleFormSubmit = (values) => {
    // TODO: extract this notification to helper function
    HTTP.patch(`${BaseAPI}/users/${user.id}`, values).then(res => {
      showNotification({
        title: "Success",
        message: "User Updated"
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
        <Input.Wrapper label={"First Name"}>
          <Input required {...form.getInputProps('first_name')}/>
        </Input.Wrapper>
        <Input.Wrapper label={"Last Name"}>
          <Input required {...form.getInputProps('last_name')}/>
        </Input.Wrapper>
        <Input.Wrapper label={"User Name"}>
          <Input required {...form.getInputProps('username')}/>
        </Input.Wrapper>
        <Input.Wrapper label={"Phone Number"}>
          <Input required type={"tel"} {...form.getInputProps('phone_number')}/>
        </Input.Wrapper>
        <Input.Wrapper label={"Email Address"}>
          <Input type={"email"} {...form.getInputProps('email')}/>
        </Input.Wrapper>
        <PasswordInput required label={"Password"} {...form.getInputProps('password')}/>
        <Input.Wrapper label={"Discount ability"}>
          <Switch defaultChecked={user.can_give_discount} {...form.getInputProps('can_give_discount')}/>
        </Input.Wrapper>
        <Input.Wrapper label={"Active"}>
          <Switch defaultChecked={user.is_active} {...form.getInputProps('is_active')}/>
        </Input.Wrapper>
        <Button type={"submit"}>Submit</Button>
      </form>
    </>
  )
}
