import { Flex, Header, Image, Text, ThemeIcon, Tooltip } from "@mantine/core"
import { Link, NavLink as RouterNavLink } from "react-router-dom";
import puchase_receive_icon from '~/public/puchase_receive.svg';
import pos_icon from '~/public/pos.svg';
import Purchase_return_icon from '~/public/Purchase_return.svg';
import DamageAndLoss_icon from '~/public/DamageAndLoss.svg';
import { useAtom } from "jotai";
import { LoggedInUser } from "@/store/auth";
import { FaLaptop } from 'react-icons/fa';
import { IconPhoto } from "@tabler/icons";
import { Setting } from "@/store/setting";

// const iconImageStyle = {
//   Height: '100px',
//   // maxWidth: '58px',
//   // padding: '10px'
//   // objectFit:'contain'
// }

export const GlobalHeader = () => {
  const [loggedInUser, setLoggedInUser] = useAtom(LoggedInUser);
  const [settings,] = useAtom(Setting);
  console.log({ settings })
  return (
    <Header position="right" height={60} p="xs" className=" bg-gray-100 z-50 pr-20">
      <Flex
        mih={50}
        gap="lg"
        justify="space-between"
        align="center"
        direction="row"
        wrap="wrap"
        pr={80}
        pl={14}
      >

        <Text size={20}> {settings?.company_name} </Text>
        <Flex gap={30}>
          <Tooltip label="Pos" color="blue">
            <RouterNavLink to="/" className={(loggedInUser?.role == 1 || loggedInUser?.permissions.includes("pos") ? "" : "hidden") + " no-underline"} end>
              {({ isActive }) => (
                <ThemeIcon className="hover:scale-110 hover:cursor-pointer duration-300" size="xl" variant={ isActive ? 'outline': 'white'} p={4}>
                  <Image src={pos_icon} />
                </ThemeIcon>
              )}
            </RouterNavLink>
          </Tooltip>

          <Tooltip label="Purchase Reciever" color="blue">
            <RouterNavLink to="/purchase-order-reciever" className={(loggedInUser?.role == 1 || loggedInUser?.permissions.includes("purchase_receive") ? "" : "hidden") + " no-underline"}>
              {({ isActive }) => (
                <ThemeIcon className="hover:scale-110 hover:cursor-pointer duration-300" size="xl" variant={ isActive ? 'outline': 'white'} p={4}>
                  <Image src={puchase_receive_icon} />
                </ThemeIcon>
              )}
            </RouterNavLink>
          </Tooltip>

          <Tooltip label="Purchase Return" color="blue">
            <RouterNavLink to={"/purchase-order/return"} className={(loggedInUser?.role == 1 || loggedInUser?.permissions.includes("supply_return") ? "" : "hidden") + " no-underline"}>
              {({ isActive }) => (
                <ThemeIcon className="hover:scale-110 hover:cursor-pointer duration-300" size="xl" variant={ isActive ? 'outline': 'white'} p={4}>
                  <Image src={Purchase_return_icon}/>
                </ThemeIcon>
              )}
            </RouterNavLink>
          </Tooltip>

          <Tooltip label="Damage And Lost" color="blue">
            <RouterNavLink to="/damage-lost" className={(loggedInUser?.role == 1 || loggedInUser?.permissions.includes("damage_and_lost") ? "" : "hidden") + " no-underline"}>
              {({ isActive }) => (
                <ThemeIcon className="hover:scale-110 hover:cursor-pointer duration-300" size="xl" variant={ isActive ? 'outline': 'white'} p={4} >
                  <Image src={DamageAndLoss_icon} />
                </ThemeIcon>
              )}
            </RouterNavLink>
          </Tooltip>
        </Flex>

        {/* <Tooltip label="Pos" color="blue">
          <RouterNavLink to="/" className={(loggedInUser?.role == 1 || loggedInUser?.permissions.includes("pos") ? "" : "hidden") + " no-underline"} end>
            {({ isActive }) => (
              <Image src={pos_icon} style={{
                ...iconImageStyle,
                // backgroundColor: isActive && 'outline'

              }}
              />
            )}
          </RouterNavLink>
        </Tooltip>

        <Tooltip label="Purchase Reciever">
          <RouterNavLink to="/purchase-order-reciever" className={(loggedInUser?.role == 1 || loggedInUser?.permissions.includes("purchase_receive") ? "" : "hidden") + " no-underline"}>
            {({ isActive }) => (

              <Image src={puchase_receive_icon} style={{
                ...iconImageStyle,
                backgroundColor: isActive && 'outline'

              }} />
            )}
          </RouterNavLink>
        </Tooltip>

        <Tooltip label="Purchase Return">
          <RouterNavLink to={"/purchase-order/return"} className={(loggedInUser?.role == 1 || loggedInUser?.permissions.includes("supply_return") ? "" : "hidden") + " no-underline"}>
            {({ isActive }) => (

              <Image src={Purchase_return_icon} style={{
                ...iconImageStyle,
                backgroundColor: isActive && 'outline'

              }} />
            )}
          </RouterNavLink>
        </Tooltip>

        <Tooltip label="Damage And Lost">
          <RouterNavLink to="/damage-lost" className={(loggedInUser?.role == 1 || loggedInUser?.permissions.includes("damage_and_lost") ? "" : "hidden") + " no-underline"}>
            {({ isActive }) => (
              <Image src={DamageAndLoss_icon} style={{
                ...iconImageStyle,
                backgroundColor: isActive && 'outline'

              }} />
            )}
          </RouterNavLink>
        </Tooltip> */}


      </Flex>
    </Header>
  )
}

