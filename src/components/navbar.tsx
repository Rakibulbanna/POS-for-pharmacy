
import { Link, NavLink as RouterNavLink } from "react-router-dom";
import { NavLink, Navbar as NBar, Button, ScrollArea, createStyles } from "@mantine/core";
import * as React from "react";
import useAuth from "~/hooks/useAuth"
import { useAtom } from "jotai";
import { IsLoggedIn, LoggedInUser } from "@/store/auth";
import { FaBeer, FaUsersCog, FaUsers } from 'react-icons/fa'
import { MdProductionQuantityLimits, MdOutlineDashboardCustomize, MdOutlineCategory } from 'react-icons/md';
import { TbShoppingCartDiscount, TbReportAnalytics, TbBrandShazam } from 'react-icons/tb';
import { AiOutlineSetting, AiOutlineBgColors, AiOutlineCreditCard } from 'react-icons/ai';
import { IoIosPeople } from 'react-icons/io';
import { BsFillFilePostFill } from 'react-icons/bs';
import { SiGoogletagmanager } from 'react-icons/si';
import { BiBarcode } from 'react-icons/bi';
import productManagement from '~/src/images/product-management.svg'

import Product_management from "@/nav_icons/product_management";
import Purchase_management from "@/nav_icons/purchase_management";
import { Setting as AtomSetting } from "@/store/setting";


const useStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor: theme.colors.gray[1],
    paddingBottom: 0,
    fontWeight: 6,

  },

  header: {
    padding: theme.spacing.md,
    paddingTop: 0,
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
      }`,
  },

  links: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
  },

  linksInner: {
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },

  footer: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
    borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
      }`,
  },
}));


export default function Navbar() {
  const [, setIsLoggedIn] = useAtom(IsLoggedIn)
  const [loggedInUser,] = useAtom<any>(LoggedInUser)
  const [setting, setSetting] = useAtom(AtomSetting)


  const { classes } = useStyles();

  const handleLogout = () => {
    setIsLoggedIn(false)
  }
  return (
    <>
      <NBar.Section grow component={ScrollArea} className={classes.navbar}>

        <>
          <RouterNavLink to="/dashboard" className={"no-underline " + (loggedInUser?.role == 1 || loggedInUser?.permissions.includes("dashboard") ? "" : "hidden")}>
            {({ isActive }) => (
              <NavLink icon={<MdOutlineDashboardCustomize />} label={"Dashboard"} active={isActive} />
            )}
          </RouterNavLink>
          <RouterNavLink to="/users" className={(loggedInUser?.role == 1 || loggedInUser?.permissions.includes("user") ? "" : "hidden") + " no-underline"}>
            {({ isActive }) => (
              <NavLink icon={<FaUsers />} label={"Users"} active={isActive} />
            )}
          </RouterNavLink>
          <RouterNavLink to="/permissions" className={(loggedInUser?.role == 1 || loggedInUser?.permissions.includes("permission") ? "" : "hidden") + " no-underline"}>
            {({ isActive }) => (
              <NavLink icon={<FaUsersCog />} label={"Permissions"} active={isActive} />
            )}
          </RouterNavLink>

          <NavLink icon={<Product_management />} label="Product Management" className={loggedInUser?.role == 1 || loggedInUser?.permissions.includes("manage_product") ? "" : "hidden"}>
            <div>
              <RouterNavLink to="/suppliers" className={loggedInUser?.role == 1 || loggedInUser?.permissions.includes("supplier") ? "" : "hidden"}>
                {({ isActive }) => (
                  <NavLink label={"Suppliers"} active={isActive} />
                )}
              </RouterNavLink>
            </div>

            <div className={loggedInUser?.role == 1 || loggedInUser?.permissions.includes("categories") ? "" : "hidden"}>
              <RouterNavLink to="/categories" className={"no-underline"}>
                {({ isActive }) => (
                  <NavLink label={"Categories"} active={isActive} />
                )}
              </RouterNavLink>
            </div>

            <div className={loggedInUser?.role == 1 || loggedInUser?.permissions.includes("brands") ? "" : "hidden"}>
              <RouterNavLink to="/brands" className={"no-underline"}>
                {({ isActive }) => (
                  <NavLink label={"Group"} active={isActive} />
                )}
              </RouterNavLink>
            </div>


            <div className={loggedInUser?.role == 1 || loggedInUser?.permissions.includes("color") ? "" : "hidden"}>
              <RouterNavLink to="/colors" className={"no-underline"}>
                {({ isActive }) => (
                  <NavLink label={"Colors"} active={isActive} />
                )}
              </RouterNavLink>
            </div>


            <div className={loggedInUser?.role == 1 || loggedInUser?.permissions.includes("product_entries") ? "" : "hidden"}>
              <RouterNavLink to="/product-entries" className={"no-underline"}>
                {({ isActive }) => (
                  <NavLink label={"Product Entry"} active={isActive} />
                )}
              </RouterNavLink>
            </div>

            <div className={loggedInUser?.role == 1 || loggedInUser?.permissions.includes("create_product") ? "" : "hidden"}>
              <RouterNavLink to="/products/fill-data" className={"no-underline"}>
                {({ isActive }) => (
                  <NavLink label={"Products"} active={isActive} />
                )}
              </RouterNavLink>
            </div>

            <div className={loggedInUser?.role == 1 || loggedInUser?.permissions.includes("products") ? "" : "hidden"}>
              <RouterNavLink to="/products" className={"no-underline"} end>
                {({ isActive }) => (
                  <NavLink label={"Product List"} active={isActive} />
                )}
              </RouterNavLink>
            </div>
            <div className={loggedInUser?.role == 1 || loggedInUser?.permissions.includes("products") ? "" : "hidden"}>
              <RouterNavLink to="/product_short_list" className={"no-underline"} end>
                {({ isActive }) => (
                  <NavLink label={"Product shot list"} active={isActive} />
                )}
              </RouterNavLink>
            </div>
          </NavLink>

          <NavLink icon={<Purchase_management />} label="Purchase Mangement" >
            <RouterNavLink to="/purchase-order" className={(loggedInUser?.role == 1 || loggedInUser?.permissions.includes("purchase_order") ? "" : "hidden") + " no-underline"}>
              {({ isActive }) => (
                <NavLink label={"Purchase Order"} active={isActive} />
              )}
            </RouterNavLink>
            <RouterNavLink to="/purchase-order-reciever" className={(loggedInUser?.role == 1 || loggedInUser?.permissions.includes("purchase_receive") ? "" : "hidden") + " no-underline"}>
              {({ isActive }) => (
                <NavLink label={"Purchase Reciever"} active={isActive} />
              )}
            </RouterNavLink>
            <RouterNavLink to={"/purchase-order/return"} className={(loggedInUser?.role == 1 || loggedInUser?.permissions.includes("supply_return") ? "" : "hidden") + " no-underline"}>
              {({ isActive }) => (
                <NavLink label={"Return"} active={isActive} />
              )}
            </RouterNavLink>
          </NavLink>

          {/* Account Management */}
          {!!setting?.enable_account_module &&
            <NavLink icon={<SiGoogletagmanager />} label={"Account Management"} className={(loggedInUser?.role == 1 || loggedInUser?.permissions.includes("manage_account") ? "" : "hidden")}>

              <RouterNavLink to="/account_management/chart_of_account" className={" no-underline"}>
                {({ isActive }) => (
                  <NavLink label={"Chart Of Account"} active={isActive} />
                )}
              </RouterNavLink>
              <RouterNavLink to="/account_management/voucher_entry" className={" no-underline"}>
                {({ isActive }) => (
                  <NavLink label={"Voucher Entry"} active={isActive} />
                )}
              </RouterNavLink>
              <RouterNavLink to="/account_management/supplier_payment" className={" no-underline"}>
                {({ isActive }) => (
                  <NavLink label={"Supplier Payment"} active={isActive} />
                )}
              </RouterNavLink>
              <RouterNavLink to="/account_management/accounts_report" className={" no-underline"}>
                {({ isActive }) => (
                  <NavLink label={"Accounts Report"} active={isActive} />
                )}
              </RouterNavLink>
            </NavLink>
          }

          <RouterNavLink to="/barcode-print" className={(loggedInUser?.role == 1 || loggedInUser?.permissions.includes("barcode_print") ? "" : "hidden") + " no-underline"}>
            {({ isActive }) => (
              <NavLink icon={<BiBarcode />} label={"Barcode Print"} active={isActive} />
            )}
          </RouterNavLink>

          <RouterNavLink to="/customers" className={(loggedInUser?.role == 1 || loggedInUser?.permissions.includes("customers") ? "" : "hidden") + " no-underline"}>
            {({ isActive }) => (
              <NavLink icon={<IoIosPeople />} label={"Customers"} active={isActive} />
            )}
          </RouterNavLink>

          <RouterNavLink to="/damage-lost" className={(loggedInUser?.role == 1 || loggedInUser?.permissions.includes("damage_and_lost") ? "" : "hidden") + " no-underline"}>
            {({ isActive }) => (
              <NavLink icon={<MdProductionQuantityLimits />} label={"Damage & Lost"} active={isActive} />
            )}
          </RouterNavLink>


          {!!setting?.enable_credit_module &&
            <RouterNavLink to="/credit_collection" className={(loggedInUser?.role == 1 || loggedInUser?.permissions.includes("credit_collection") ? "" : "hidden") + " no-underline"}>
              {({ isActive }) => (
                <NavLink icon={<AiOutlineCreditCard />} label={"Credit Collection"} active={isActive} />
              )}
            </RouterNavLink>
          }




          <RouterNavLink to="/inventory" className={(loggedInUser?.role == 1 || loggedInUser?.permissions.includes("inventory") ? "" : "hidden") + " no-underline"}>
            {({ isActive }) => (
              <NavLink icon={<TbReportAnalytics />} label={"Inventory"} active={isActive} />
            )}
          </RouterNavLink>



          <NavLink icon={<TbShoppingCartDiscount />} label="Promotion" className={(loggedInUser?.role == 1 || loggedInUser?.permissions.includes("promotion") ? "" : "hidden") + " no-underline"}>

            <RouterNavLink to="/flat_discount" className={"no-underline"}>
              {({ isActive }) => (
                <NavLink label={"Flat Discount"} active={isActive} />
              )}
            </RouterNavLink>
            <RouterNavLink to="/buy_one_get_one" className={"no-underline"}>
              {({ isActive }) => (
                <NavLink label={"Buy One Get One"} active={isActive} />
              )}
            </RouterNavLink>
            <RouterNavLink to="/combo_promotion" className={"no-underline"}>
              {({ isActive }) => (
                <NavLink label={"Combo Promotion"} active={isActive} />
              )}
            </RouterNavLink>



          </NavLink>

          <NavLink icon={<TbReportAnalytics />} label={"Reports"}>
            <RouterNavLink to="/reports/sales" className={(loggedInUser?.role == 1 || loggedInUser?.permissions.includes("sale_report") ? "" : "hidden") + " no-underline"}>
              {({ isActive }) => (
                <NavLink label={"Sales Reports"} active={isActive} />
              )}
            </RouterNavLink>
            <RouterNavLink to="/reports/stocks" className={(loggedInUser?.role == 1 || loggedInUser?.permissions.includes("stock_report") ? "" : "hidden") + " no-underline"}>
              {({ isActive }) => (
                <NavLink label={"Stocks Reports"} active={isActive} />
              )}
            </RouterNavLink>
            <RouterNavLink to="/reports/purchase" className={(loggedInUser?.role == 1 || loggedInUser?.permissions.includes("purchase_report") ? "" : "hidden") + " no-underline"}>
              {({ isActive }) => (
                <NavLink label={"Purchase Reports"} active={isActive} />
              )}
            </RouterNavLink>
            <RouterNavLink to="/reports/customer" className={(loggedInUser?.role == 1 || loggedInUser?.permissions.includes("purchase_report") ? "" : "hidden") + " no-underline"}>
              {({ isActive }) => (
                <NavLink label={"Customer Reports"} active={isActive} />
              )}
            </RouterNavLink>
            <RouterNavLink to="/reports/promotion" className={(loggedInUser?.role == 1 || loggedInUser?.permissions.includes("promotion_report") ? "" : "hidden") + " no-underline"}>
              {({ isActive }) => (
                <NavLink label={"Promotion Reports"} active={isActive} />
              )}
            </RouterNavLink>
            <RouterNavLink to="/reports/damage_and_lost" className={(loggedInUser?.role == 1 || loggedInUser?.permissions.includes("damage_and_lost") ? "" : "hidden") + " no-underline"}>
              {({ isActive }) => (
                <NavLink label={"Damage And Lost"} active={isActive} />
              )}
            </RouterNavLink>
            <RouterNavLink to="/reports/inventory" className={(loggedInUser?.role == 1 || loggedInUser?.permissions.includes("inventory_report") ? "" : "hidden") + " no-underline"}>
              {({ isActive }) => (
                <NavLink label={"Inventory Reports"} active={isActive} />
              )}
            </RouterNavLink>
            <RouterNavLink to="/reports/price-change" className={(loggedInUser?.role == 1 || loggedInUser?.permissions.includes("price_change_reports") ? "" : "hidden") + " no-underline"}>
              {({ isActive }) => (
                <NavLink label={"Price Change Reports"} active={isActive} />
              )}
            </RouterNavLink>
            <RouterNavLink to="/reports/expiry" className={(loggedInUser?.role == 1 || loggedInUser?.permissions.includes("price_change_reports") ? "" : "hidden") + " no-underline"}>
              {({ isActive }) => (
                <NavLink label={"Expiry Reports"} active={isActive} />
              )}
            </RouterNavLink>
          </NavLink>

          <RouterNavLink to={"/price-change"} className={(loggedInUser?.role == 1 || loggedInUser?.permissions.includes("price_change") ?  "" : "hidden") + " no-underline"}>
            {({ isActive }) => (
              <NavLink icon={<AiOutlineSetting />} label="Price Change" active={isActive} />
            )}
          </RouterNavLink>

          {/* <RouterNavLink to="/other" className={"no-underline"}>
            {({ isActive }) => (
              <NavLink label={"Other"} active={isActive} />
            )}
          </RouterNavLink> */}

          <RouterNavLink to={"/settings"} className={(loggedInUser?.role == 1 ? "" : "hidden") + " no-underline"}>
            {({ isActive }) => (
              <NavLink icon={<AiOutlineSetting />} label="Settings" active={isActive} />
            )}
          </RouterNavLink>
        </>




        <RouterNavLink to="/" className={(loggedInUser?.role == 1 || loggedInUser?.permissions.includes("pos") ? "" : "hidden") + " no-underline"} end>
          {({ isActive }) => (
            <NavLink icon={<BsFillFilePostFill />} label={"Pos"} active={isActive} />
          )}
        </RouterNavLink>
        <RouterNavLink to="/sales" className={(loggedInUser?.role == 1 || loggedInUser?.permissions.includes("view_sales") ? "" : "hidden") + " no-underline"} end>
          {({ isActive }) => (
            <NavLink icon={<BsFillFilePostFill />} label={"Sales"} active={isActive} />
          )}
        </RouterNavLink>


      </NBar.Section>
      <NBar.Section style={{ padding: '5px' }} className={classes.navbar}>
        <Button onClick={handleLogout}>Log out</Button>
      </NBar.Section>
    </>
  )
}
