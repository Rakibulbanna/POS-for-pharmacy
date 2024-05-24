import Layout from "@/components/layout";
import Home from "@/pages";
import Permissions from "@/pages/permissions/index";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";

import User from "@/pages/users";
import Edit from "@/pages/users/_edit";
import Create from "@/pages/users/create";

import BrandEdit from "@/pages/brands/_edit";
import BrandCreate from "@/pages/brands/create";
import BrandIndex from "@/pages/brands/index";

import EditCategory from "@/pages/categories/_edit";
import CreateCategory from "@/pages/categories/create";
import IndexCategory from "@/pages/categories/index";

import EditSuppliers from "@/pages/suppliers/_edit";
import CreateSuppliers from "@/pages/suppliers/create";
import IndexSuppliers from "@/pages/suppliers/index";

import EditColors from "@/pages/colors/_edit";
import CreateColors from "@/pages/colors/create";
import IndexColors from "@/pages/colors/index";

import ProductEdit from "@/pages/products/_edit";
import ProductsCreate from "@/pages/products/create";
import ProductEntries from "@/pages/products/entry_list";
import Products from "@/pages/products/index";

import Pos from "@/pages/pos/index";
import PurchaseOrder from "@/pages/purchase_order";
import Customers from "./pages/customers";
import Purchase_order_receiver from "./pages/purchase_order_receiver/purchase_order_receiver";

import DamageLost from "@/pages/damage_lost/index";
import CreateFill from "@/pages/products/create-fill";
import CreateMinimum from "@/pages/products/create-minimum";
import SaleReports from "@/pages/reports/sale";
import Accounts_report from "./pages/accounts_report";
import BarcodePrint from "./pages/barcode_print/index";
import Buy_one_get_one from "./pages/buy_one_get_one";
import Chart_of_account from "./pages/chart_of_account";
import Combo_promotion from "./pages/combo_promotion";
import Credit_collection from "./pages/credit_collection";
import Flat_discount from "./pages/flat_discount/index";
import Inventory from "./pages/inventory";
import PriceChange from "./pages/price-change";
import PurchaseOrderReturn from "./pages/purchase_order_receiver/return";
import Customer from "./pages/reports/customer";
import Damage_and_lost from "./pages/reports/damage_and_lost";
import PriceChangeReport from "./pages/reports/price_change";
import Promotion from "./pages/reports/promotion";
import PurchaseReports from "./pages/reports/purchase";
import StockReport from "./pages/reports/stock";
import Settings from "./pages/settings";
import Supplier_payment from "./pages/supplier_payment";
import Voucher_entry from "./pages/voucher_entry";

// import { In as InventoryReport} from "./pages/reports/inventory";

import SubAccounts from "@/pages/chart_of_account/sub-accounts";
import Inventory_Report from "./pages/reports/inventory";
import Sales from "./pages/sales";
import Product_short_list from "./pages/product_short_list";
import ExpiryReport from "./pages/reports/expiry";

export default function App() {
  return (
    <>
    
      <Routes>
        
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<Home />} />
          <Route path="users" element={<User />} />
          <Route path="brands" element={<BrandIndex />} />
          <Route path="brands/create" element={<BrandCreate />} />
          <Route path={"brands/edit/:id"} element={<BrandEdit />} />

          <Route path="categories" element={<IndexCategory />} />
          <Route path="categories/create" element={<CreateCategory />} />
          <Route path={"categories/edit/:id"} element={<EditCategory />} />

          <Route path="users/create" element={<Create />} />
          <Route path={"users/edit/:id"} element={<Edit />} />

          <Route path={"suppliers"} element={<IndexSuppliers />} />
          <Route path={"suppliers/create"} element={<CreateSuppliers />} />
          <Route path={"suppliers/edit/:id"} element={<EditSuppliers />} />

          <Route path={"colors"} element={<IndexColors />} />
          <Route path={"colors/create"} element={<CreateColors />} />
          <Route path={"colors/edit/:id"} element={<EditColors />} />

          <Route path="permissions" element={<Permissions />} />

          {/*products part  */}
          <Route path="/products" element={<Products />} />
          <Route path="/product_short_list" element={<Product_short_list />} />
          <Route path={"/product-entries"} element={<ProductEntries />} />
          <Route path="/product-entries/create" element={<CreateMinimum />} />
          <Route path="/products/fill-data" element={<CreateFill />} />

          <Route path="products/create" element={<ProductsCreate />} />

          <Route path={"/products/edit/:id"} element={<ProductEdit />} />
          <Route path={"/purchase-order"} element={<PurchaseOrder />} />
          {/* <Route path="products/create-minimum" element={<CreateMinimum />} />
          <Route path="products/create-fill" element={<CreateFill />} /> */}

          {/* pos */}
          <Route index element={<Pos />} />

          {/* Purchase order receiver */}
          <Route path={"purchase-order-reciever"} element={<Purchase_order_receiver />} />
          <Route path={"purchase-order/return"} element={<PurchaseOrderReturn />} />

          {/* CRUD Costomers with CRUD memberType */}
          <Route path={"customers"} element={<Customers />} />

          {/* damage and lost */}
          <Route path={"damage-lost"} element={<DamageLost />} />

          {/* flat discount */}
          <Route path={"flat_discount"} element={<Flat_discount />} />
          {/* buy one get one  */}
          <Route path={"buy_one_get_one"} element={<Buy_one_get_one />} />
          {/* combo promotion */}
          <Route path={"combo_promotion"} element={<Combo_promotion />} />

          <Route path={"reports/customer"} element={<Customer />} />
          <Route path={"reports/promotion"} element={<Promotion />} />
          <Route path={"reports/sales"} element={<SaleReports />} />
          <Route path={"reports/stocks"} element={<StockReport />} />
          <Route path={"reports/purchase"} element={<PurchaseReports />} />
          <Route path={"reports/damage_and_lost"} element={<Damage_and_lost />} />
          <Route path={"reports/inventory"} element={<Inventory_Report/>} />
          <Route path={"reports/price-change"} element={<PriceChangeReport/>}/>
          <Route path={"reports/expiry"} element={<ExpiryReport/>}/>

          <Route path={"account_management/chart_of_account"} element={<Chart_of_account />} />
          <Route path={"account_management/chart_of_account/sub-accounts"} element={<SubAccounts/>}/>
          <Route path={"account_management/voucher_entry"} element={<Voucher_entry />} />
          <Route path={"account_management/supplier_payment"} element={<Supplier_payment />} />
          <Route path={"account_management/accounts_report"} element={<Accounts_report />} />

          <Route path={"/credit_collection"} element={<Credit_collection />} />

          <Route path={"/inventory"} element={<Inventory />} />
          <Route path={"/price-change"} element={<PriceChange/>}/>
          <Route path={"/barcode-print"} element={<BarcodePrint/>}/>
          <Route path={"/sales"} element={<Sales/>}/>


          {/* Using path="*"" means "match anything", so this route
                acts like a catch-all for URLs that we don't have explicit
                routes for.
          */}
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </>
  );
}

function NoMatch() {
  const [data, setData] = useState(false)
  return (
    <div className=" duration-1000">
      <h2>Nothing to see here!</h2>

      {/*<Link to="/">Go to the home page</Link>*/}
      {/* <div className="cursor-pointer bg-purple-500 p-2 text-gray-50" onClick={() => setData((v) => !v)}>Dropdown</div>
      <div className={`${data ? 'h-0 ' : ''} box-border  duration-1000 overflow-hidden ease-in-out`}>
        <div className={`${data ? 'opacity-0 scale-0 ' : 'opacity-100 '} duration-500 flex flex-col ease-in-out`}>
          <a className="p-1 bg-purple-400 text-gray-50 mb-1">Hi</a>
          <a className="p-1 bg-purple-400 text-gray-50 mb-1">Hi</a>
          <a className="p-1 bg-purple-400 text-gray-50 mb-1">Hi</a>
          <a className="p-1 bg-purple-400 text-gray-50 mb-1">Hi</a>
        </div>
      </div>

      <div className={` ease-in-out duration-1000`}>Hello</div> */}

    </div>
  );
}
