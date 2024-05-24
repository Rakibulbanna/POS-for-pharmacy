import { useForm } from "@mantine/form";
import { BaseAPI, HTTP } from "~/repositories/base";
import { Button, NumberInput, Switch, TextInput } from "@mantine/core"
import { useAtom } from "jotai";
import { Setting } from "@/store/setting";
import { showNotification } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { LoggedInUser } from "@/store/auth";

var jwt = require('jsonwebtoken');

export default function () {
  const [expiryDate, setExpiryDate] = useState("")
  const [setting, setSetting] = useAtom(Setting)
  const [loggedInUser] = useAtom(LoggedInUser)
  const form = useForm({
    initialValues: {
      including_vat: setting?.including_vat ?? false,
      company_name: setting?.company_name ?? "",
      company_address: setting?.company_address ?? "",
      company_phone_number: setting?.company_phone_number ?? "",
      // served_by: loggedInUser.first_name + " " + loggedInUser.last_name,
      point_system: setting?.point_system ?? false,
      point_ratio: setting?.point_ratio ?? 0,
      redeem_ratio: setting?.redeem_ratio ? setting.redeem_ratio / 100 : 0,
      licence_key: "",
      served_by_size: setting?.served_by_size ?? "",
      pos_recipt_company_name_size: setting?.pos_recipt_company_name_size ?? "",
      pos_recipt_phone_number_size: setting?.pos_recipt_phone_number_size ?? "",
      vat_number: setting?.vat_number ?? "",
      invoice_note: setting?.invoice_note ?? "",
      pos_recipt_note_size: setting?.pos_recipt_note_size ?? "",
      show_point_balance_on_receipt: setting?.show_point_balance_on_receipt ?? true,
      enable_account_module: setting?.enable_account_module ?? false,
      enable_credit_module: setting?.enable_credit_module ?? false,
    }
  })

  const handleSubmit = (values) => {
    const copyValue = { ...values };
    copyValue['redeem_ratio'] = values.redeem_ratio * 100;

    HTTP.patch(`${BaseAPI}/settings`, copyValue).then(res => {
      setSetting(() => res.data.data)
      showNotification({
        title: "Success",
        message: "Category updated"
      })
    }).catch(err => {
      showNotification({
        title: "Error",
        message: err
      })
    })
  }

  useEffect(() => {
    jwt.verify(setting?.licence_key, "Jd&7dD45K@dkjfKH34JHsdf&&jkf7845DDFD#sdfDD", function (err, decoded) {
      if (!err) {
        setExpiryDate(new Date(decoded.exp * 1000).toLocaleDateString("en-GB"))
      }
    })
  }, [setting])

  return (
    <>
      <div>Your licence will expire:  {expiryDate}</div>
      <form onSubmit={form.onSubmit(values => handleSubmit(values))} className={"flex flex-col gap-4"}>
        <div className={"flex gap-8"}>
          <TextInput label="Company Name" {...form.getInputProps("company_name")} className={"w-2/3"} />
          <TextInput label="Receipt Size" {...form.getInputProps("pos_recipt_company_name_size")} className={"w-1/3"} />
        </div>
        <div className={"flex gap-8"}>
          <TextInput label="Company Address" {...form.getInputProps("company_address")} className={"w-2/3"} />
          <TextInput label="VAT Number" {...form.getInputProps("vat_number")} className={"w-1/3"} />
        </div>
        <div className={"flex gap-8"}>
          <TextInput label="Served By"
            value={`${loggedInUser.first_name} ${loggedInUser.last_name}`}
            //{...form.getInputProps("served_by")} 
            className={"w-2/3"}
          />
          <TextInput label="Served By Size" {...form.getInputProps("served_by_size")} className={"w-1/3"} />
        </div>
        <div className={"flex gap-8"}>
          <TextInput label="Phone Number" {...form.getInputProps("company_phone_number")} className={"w-2/3"} />
          <TextInput label="Receipt Size" {...form.getInputProps("pos_recipt_phone_number_size")} className={"w-1/3"} />
        </div>
        <div className={"flex gap-8"}>
          <TextInput label="Invoice Note" {...form.getInputProps("invoice_note")} className={"w-2/3"} />
          <TextInput label="Note Size" {...form.getInputProps("pos_recipt_note_size")} className={"w-1/3"} />
        </div>
        <Switch label="Including VAT" defaultChecked={!!setting?.including_vat} {...form.getInputProps("including_vat")} />
        <Switch label="Point System" defaultChecked={!!setting?.point_system} {...form.getInputProps("point_system")} />
        <Switch label="Enable Account Module" defaultChecked={!!setting?.enable_account_module} {...form.getInputProps("enable_account_module")} />
        <Switch label="Enable Credit Module" defaultChecked={!!setting?.enable_credit_module} {...form.getInputProps("enable_credit_module")} />
        <Switch label="Show Customer Point Balance on Receipt" defaultChecked={!!setting?.show_point_balance_on_receipt} {...form.getInputProps("show_point_balance_on_receipt")} />

        <NumberInput label="Point Ratio (Per 100 Taka)" {...form.getInputProps("point_ratio")} />
        <NumberInput precision={2}  label="Redeem Ratio (Per 1mantine Point)" {...form.getInputProps("redeem_ratio")} />
        <TextInput type={"password"} label="Licence Key" {...form.getInputProps("licence_key")} />
        <Button type="submit">Update</Button>
      </form>
    </>
  )
}
