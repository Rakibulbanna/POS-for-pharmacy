import { Button, Switch } from "@mantine/core"
import { useForm } from "@mantine/form"
import { useEffect, useState } from "react"
import { BaseAPI, HTTP } from "~/repositories/base"
import Setting from "@/components/setting"
import { Setting as AtomSetting } from "@/store/setting"
import { useAtom } from "jotai"

const Settings = () => {
  const [setting, setSetting] = useAtom(AtomSetting)

    useEffect(() => {
        HTTP.get(`${BaseAPI}/settings`).then(res => {
            setSetting(res.data.data)
        }).catch(err => {
            console.log(err);
        })
    }, [])


    return (
        <>
        <Setting />
        </>
    )
}

export default Settings
