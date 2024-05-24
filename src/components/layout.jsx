import Login from "@/components/login";
import NavbarContent from "@/components/navbar";
import { IsLoggedIn, LoggedInUser } from "@/store/auth";
import { Setting } from "@/store/setting";
import { Link, NavLink as RouterNavLink } from "react-router-dom";
import {
  ActionIcon,
  AppShell,
  Button,
  CopyButton,
  Header,
  Image,
  Input,
  InputBase,
  Loader,
  NavLink,
  Navbar,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { openContextModal } from "@mantine/modals";
import { IconCheck, IconCopy, IconShoppingCart } from "@tabler/icons";
import { useAtom } from "jotai";
import * as React from "react";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { BaseAPI, HTTP } from "~/repositories/base";

import puchase_receive_icon from '~/public/puchase_receive.svg';
import pos_icon from '~/public/pos.svg';
import Purchase_return_icon from '~/public/Purchase_return.svg';
import DamageAndLoss_icon from '~/public/DamageAndLoss.svg';
import { GlobalHeader } from "./globalHeader";
let jwt = require("jsonwebtoken");
const machineId = require("node-machine-id").machineIdSync();

const iconImageStyle = {
  maxHeight: '63px',
  maxWidth: '58px',
  padding: '10px'
}
const tableStyle = {
  border: '2px dashed black',
  borderCollapse: 'collapse',
};
export default function Layout() {
  const [isLoggedIn, setIsLoggedIn] = useAtom(IsLoggedIn);
  const [loggedInUser, setLoggedInUser] = useAtom(LoggedInUser);
  const [, setSetting] = useAtom(Setting);
  const licenceKey = React.useRef();

  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const handleSuccess = (user) => {
    // first alter user permission to get only permission values
    const permissions = user.permissions.map((permission) => permission.value);
    user.permissions = permissions;
    setLoggedInUser(user);
    setIsLoggedIn(true);

    navigate("/dashboard");
  };

  

  React.useEffect(() => {
    HTTP.get(`${BaseAPI}/settings`)
      .then((res) => {
        setSetting(res.data.data);
        // get mac address of this pc

        verifyJwt(res.data.data.licence_key, machineId, setIsReady);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false))
  }, []);

  const handleSubmitLicence = () => {

    verifyJwt([licenceKey.current.value], machineId, setIsReady);
    HTTP.patch(`${BaseAPI}/settings`, {
      licence_key: licenceKey.current.value,
    });

  };

  return (
    <>
      {isLoading ?
        <div className="h-screen w-screen flex justify-center">
          <Loader color="yellow" size="lg" variant="bars" />
        </div>
        :
        <>
          {isReady && (
            <div>
              {isLoggedIn ? (
                <AppShell
                  style={{ zIndex: -1 }}
                  navbar={
                    <Navbar
                      width={{ base: 240 }}
                      fixed={false}
                      position={{ top: 0, left: 0 }}
                      p="xs"
                    >
                      {<NavbarContent />}
                    </Navbar>
                  }
                  header={<GlobalHeader/>}
                >
                  {/* <div className=" flex justify-end pb-4 pr-16 sticky top-0 bg-white z-10 shadow mb-2 ml-1">
                    <div className=" grid grid-cols-4 gap-20 border-dashed border-2" >

                      <Tooltip label="Pos" color="blue">
                        <RouterNavLink to="/" className={(loggedInUser?.role == 1 || loggedInUser?.permissions.includes("pos") ? "" : "hidden") + " no-underline"} end>
                          {({ isActive }) => (
                            <Image src={pos_icon} style={{
                              ...iconImageStyle,
                              
                            }} />
                          )}
                        </RouterNavLink>
                      </Tooltip>

                      <Tooltip label="Purchase Reciever">
                        <RouterNavLink to="/purchase-order-reciever" className={(loggedInUser?.role == 1 || loggedInUser?.permissions.includes("purchase_receive") ? "" : "hidden") + " no-underline"}>
                          {({ isActive }) => (

                            <Image src={puchase_receive_icon} style={{
                              ...iconImageStyle,
                              backgroundColor: isActive && '#e6e6e6',

                            }} />
                          )}
                        </RouterNavLink>
                      </Tooltip>

                      <Tooltip label="Purchase Return">
                        <RouterNavLink to={"/purchase-order/return"} className={(loggedInUser?.role == 1 || loggedInUser?.permissions.includes("supply_return") ? "" : "hidden") + " no-underline"}>
                          {({ isActive }) => (

                            <Image src={Purchase_return_icon} style={{
                              ...iconImageStyle,
                              backgroundColor: isActive && '#e6e6e6',

                            }} />
                          )}
                        </RouterNavLink>
                      </Tooltip>

                      <Tooltip label="Damage And Lost">

                        <RouterNavLink to="/damage-lost" className={(loggedInUser?.role == 1 || loggedInUser?.permissions.includes("damage_and_lost") ? "" : "hidden") + " no-underline"}>
                          {({ isActive }) => (
                            <Image src={DamageAndLoss_icon} style={{
                              ...iconImageStyle,
                              backgroundColor: isActive && '#e6e6e6',

                            }} />
                          )}
                        </RouterNavLink>
                      </Tooltip>

                    </div>
                  </div> */}
                  <Outlet />
                </AppShell>
              ) : (
                <Login handleSuccess={handleSuccess} />
              )}
            </div>
          )}
          {!isReady && (
            <div className=" min-h-screen grid content-center">
              <div className=" m-auto">
                <div className=" text-center mb-4 text-yellow-600">
                  Licence not found or expired!
                </div>
                <div>
                  <div className="grid grid-cols-12 ">
                    <TextInput label="Machine Id" value={machineId} className=" col-span-11" />
                    <div className="pt-6">
                      <CopyButton className="text-center" value={machineId} timeout={2000}>
                        {({ copied, copy }) => (
                          <Tooltip
                            label={copied ? "Copied" : "Copy"}
                            withArrow
                            position="right"
                          >
                            <ActionIcon color={copied ? "teal" : "gray"} onClick={copy}>
                              {copied ? (
                                <IconCheck size="1rem" />
                              ) : (
                                <IconCopy size="1rem" />
                              )}
                            </ActionIcon>
                          </Tooltip>
                        )}
                      </CopyButton>
                    </div>
                  </div>
                </div>
                <div className=" w-96 flex flex-col gap-2">
                  <TextInput ref={licenceKey} label="Input Licence Key" />
                  <Button fullWidth onClick={handleSubmitLicence}>
                    Submit
                  </Button>
                  {/* <SetLicence /> */}
                </div>
              </div>
            </div>
          )}
        </>
      }
    </>
  );
}

const SetLicence = () => {
  return (
    <div className=" min-w-max m-auto px-6 flex flex-col gap-2">
      <TextInput label="Input Licence Key" />
      <Button fullWidth>Submit</Button>
      <SetLicence />
    </div>
  );
};

const verifyJwt = (licences, machineId, setIsReady, showModal) => {
  licences.forEach(licence => {
    jwt.verify(
      licence,
      "Jd&7dD45K@dkjfKH34JHsdf&&jkf7845DDFD#sdfDD" + machineId,
      function (err, decoded) {
        if (!err) {
          setIsReady(true);

          // get expire date and minus 15 days
          let expiryDate = new Date(parseInt(decoded.exp) * 1000);
          let correctDay = new Date(expiryDate).getDate() - 15;
          let checkDateInUnixEpoch = new Date(expiryDate).setDate(correctDay);

          // check if today > expire date
          if (new Date().getTime() > checkDateInUnixEpoch) {
            openContextModal({
              modal: "tokenExpiry",
              title: "Alert !!!",
              innerProps: {
                modalBody: "Your licence key will expire very soon",
              },
            });
          }
        }
      }
    );
  })
};
