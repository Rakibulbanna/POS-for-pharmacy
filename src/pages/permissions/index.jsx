import { useEffect, useState } from "react";
import { BaseAPI, HTTP } from "~/repositories/base";
import { Select, Switch as MSwitch } from "@mantine/core";
import { Switch } from "@arco-design/web-react";
import EmptyNotification from "@/utility/emptyNotification";


export default function () {
  const [pageReady, setPageReady] = useState(false)
  const [users, setUsers] = useState([])
  const [permissions, setPermission] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)

  const setPermissions = async () => {
    let res = await HTTP.get(`${BaseAPI}/permissions`)
    setPermission(res.data.data)
  }


  const getAndSetUsers = async () => {
    const res = await HTTP.get(`${BaseAPI}/users`)
    setUsers(res.data.data)
  }

  const getDeps = async () => {
    let res = await HTTP.get(`${BaseAPI}/permissions`)
    setPermission(res.data.data)

    res = await HTTP.get(`${BaseAPI}/users`)
    setUsers(res.data.data)

    setTimeout(() => {
      setPageReady(true)
    }, 10)
  }

  useEffect(() => {
    getDeps()
  }, [])

  const updatePermission = async (permissionID, checked) => {
    // console.log(permissionID, checked)
    //after persist sync the selected user with backend
    // i know selected user id, permission id, checked
    if (checked) {
      // add permissions
      await HTTP.post(`${BaseAPI}/connect-permission`, {
        user_id: selectedUser.id,
        permission_id: permissionID
      })
    } else {
      await HTTP.patch(`${BaseAPI}/disconnect-permission`, {
        user_id: selectedUser.id,
        permission_id: permissionID
      })
    }

    // now get user by selected user and set it
    let res = await HTTP.get(`${BaseAPI}/users`)
    setUsers(res.data.data)

    res = await HTTP.get(`${BaseAPI}/users/${selectedUser.id}`)
    setSelectedUser(res.data.data)
  }

  const handleSelectedUserChange = (v) => {
    setSelectedUser(null);
    setTimeout(() => {
      setSelectedUser(users.find(user => user.id === v))
    }, 1)
  }

  const handleAllPermissionUpdate = async (event) => {
    // setPageReady(false)
    if (event.currentTarget.checked) {
      // turn on all permission for this user
      for (const permission of permissions) {
        await updatePermission(permission.id, true)
        // await setPermissions()
      }

    } else {
      // turn off all permission for this user
      for (const permission of permissions) {
        await updatePermission(permission.id, false)
        // window.location.reload()
      }
    }

    setSelectedUser(null)
    const res = await HTTP.get(`${BaseAPI}/users/${selectedUser.id}`)
    setSelectedUser(res.data.data)


  }

  return (
    <>
      {pageReady &&
        <div>
          <div className={"flex gap-4"}>
            <Select 
              label='Select user'
              data={users.map(user => ({ label: user.first_name + " " + user.last_name, value: user.id }))}
              searchable onChange={handleSelectedUserChange} 
            />
            <MSwitch label={"All Permission"} onChange={e => handleAllPermissionUpdate(e)}/>
          </div>
          <div>
            {!!selectedUser ? permissions.map(permission => (
              <div className={"flex items-center gap-10"} key={permission.id}>
                <h4>{permission.title}</h4>
                {/*<input type="checkbox" name="sale_product" id=""/>*/}
                {/*<Switch checked={selectedUser?.permissions?.find(p=>p.value === permission.value)} onChange={e=>updatePermission(permission.id, e.currentTarget.checked)}/>*/}
                {/*<Switch type={"round"} checked={selectedUser?.permissions?.find(p=>p.value === permission.value)} onChange={v=>updatePermission(permission.id, v)}/>*/}
                <Switch type={"round"} defaultChecked={selectedUser?.permissions?.find(p => p.value === permission.value)} onChange={v => updatePermission(permission.id, v)} />
              </div>
            ))
          :
          <div>
            <EmptyNotification value="user"/>
            </div>
          }
          </div>
        </div>
      }
    </>
  )
}
