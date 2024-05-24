// TODO: extract user management api and logic to different source and link them to here

import RegisterRoutes from "./routes"


import { Index as PermissionIndex, AddPermission, DisconnectPermission } from "./controllers/permission"
import { BrandIndex, StoreBrand, UpdateBrand, ShowBrand, DeleteBrand } from "./controllers/brand";
import { IndexCategory, StoreCategory, UpdateCategory, ShowCategory, DeleteCategory } from "./controllers/category";
import {
  StoreSupplier,
  IndexSupplier,
  UpdateSupplier,
  ShowSupplier,
  DeleteSupplier,
  GetTotalSupplierPayable, GetTotalSupplierPaid
} from "./controllers/supplier";
import {
  Update as UpdateProduct,
  ShowProduct,
  IndexProduct,
  IndexProductShortList,
  DeleteProduct,
  LogDamage,
  IndexDamageAndLost,
  StoreProductMinimum,
  FillProductInfo,
  StoreProduct,
  DynamicSearch,
  IndexWithoutPagination,
  HardDelete as HardDeleteProduct,
  GetTotalCOGS,
  ListMultipleProductsWithSales,
  GetTotalDamageAndLost,
  DynamicSaleBarcodeSearch,
  IndexSaleableProduct,
  DynamicSaleBarcodeSearchReturn
} from "./controllers/product"
import { IndexPayModes } from "./controllers/pay_mode";
import { Login } from "./controllers/auth";
import { purchaseRouter } from "./routers/purchaseRouter";
import {
  StorePosSale,
  ShowPosSale,
  Index as IndexSales,
  GetTotalSaleWithoutCreditSale,
  GetTotalCreditSaleReceivableOfUser,
  PosSaleGetTotalCOGS, GetTotalCreditSale, GetTotalVatAmount
} from "./controllers/pos_sale"
import { StoreMembershipType, IndexMembershipTypes, ShowMembershipType, UpdateMembershipType, DeleteMembershipType } from "./controllers/membership_type";
import {
  StoreCustomer,
  IndexCustomers,
  ShowCustomer,
  UpdateCustomer,
  DeleteCustomer,
  POSSearch as CustomerPOSSearch,
  SearchByNameAndPhone,
  GetTotalCreditCollected
} from "./controllers/customer";
import {GetTotalReturnAmount, POSSaleReturn} from "./controllers/pos_sale_return";
import { Store as PurchaseReturnStore } from "./controllers/purchase/return"
import { StoreUser, UpdateUser } from "./controllers/user";
import { FlatDiscount } from "./controllers/promotions";
import { StoreFlatDiscount, Index as IndexFlatPromotion, IsProductActive as IsProductActiveOnFlat, UpdateFlatDiscount } from "./controllers/promotion/flat";
import { StoreBuyXGetX, Index as IndexBuyXGetX, CheckExists as CheckProductExistsOnBXGX, Show as ShowBXGX, AllBuyXGetXPromotion, UpdateBuyXGetX } from "./controllers/promotion/buy_x_get_x";
import { StoreComboPromotion, Index as IndexComboPromotion, GetOneByBarcode as GetOneComboByBarcode, IsProductActive as IsProductActiveOnCombo, UpdateComboPromotion } from "./controllers/promotion/combo";
import { DayWiseSale } from "./controllers/reports";
import { CreateColor, IndexColors, UpdateColor, ShowColor, DeleteColor } from "./controllers/color";
import { GetSettings, UpdateSettings } from "./controllers/setting";
import { ItemWiseStockReport, CategoryWiseStockReport, BrandWiseStockReport } from "./controllers/report/stock";
import { DashboardIndex } from "./controllers/dashboard";
import { CustomerWiseSummery, InvoiceWiseSale, ItemWiseSale, ItemWiseSaleDetails, CustomerWiseDetails as CustomerWiseSaleDetailsReport, CategoryWiseSale, InvoiceWiseSalePractice, InvoiceWiseSaleCount, UserWiseSummery } from "./controllers/report/sale";
import { GetAllReceived } from "./controllers/purchaseOrder";
import { DamageNLost } from "./controllers/report/base";
import { DueCollection } from "./controllers/report/customer";
import {
  PurchaseOnCategory,
  PurchaseOrderDetails,
  PurchaseOrderSummery,
  PurchaseReceiveDetails,
  PurchaseReceiveSummery, PurchaseReturnSummery
} from "./controllers/report/puchase";
import { BXGXDetails } from "./controllers/report/promotion";
import {GetExchangeAmount, GetTotalExchangeAmount} from "./controllers/sale/exchange";
import { CreateAccount, DeleteAccount, IndexAccounts, UpdateAccount } from "./controllers/purchase_management/accounts";
import {
  CreateVoucher,
  DeleteVoucher,
  GetTotalOfOwnersPayments, GetTotalOfVoucherCredit,
  IndexVouchers,
  UpdateVoucher
} from "./controllers/purchase_management/voucher";
import { CreateSupplierPayment, IndexSupplierPayments } from "./controllers/purchase_management/supplier_payment";
import { FileUploads, IndexFileToProduct } from "./controllers/products_file_upload";
import { CreateCustomerPayment, IndexCustomerPayments } from "./controllers/customer_payment";
import { GetAllStockLedger, GetStockLedger, StoreStockLedger } from "./controllers/stock_ledger";
import multer from "multer";
import { IndexPriceChanges, IndexStockChanges, InsertMany } from "./controllers/price_change"
import { CreateSubAccount, DeleteSubAccount, IndexSubAccounts, ShowSubAccount, UpdateSubAccount } from "./controllers/sub_account";
import { ExpiryProducts } from "./controllers/report/expiry_product";



const express = require('express')


//Dot Env enable
require('dotenv').config();

const { PrismaClient } = require('@prisma/client')
const bodyParser = require('body-parser')
const cors = require('cors')

const prisma = new PrismaClient()

const App = express();
App.use(bodyParser.json()).use(cors())
App.use(bodyParser.urlencoded());


App.get("/users", async (req, res) => {
  console.log(req.query);
  const query = {
    where: { role: { gt: 1 } },
    include: { permissions: true }
  };

  if (req.query.role === '1') query.where.role = { gt: 0 };

  const users = await prisma.user.findMany({
    ...query
  });

  res.json({ "data": users })
})

App.post("/users", StoreUser)
App.patch("/users/:id", UpdateUser)

App.get("/users/:id", async (req, res) => {
  const id = req.params.id

  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      permissions: true
    }
  })

  res.json({ "data": user })
})

App.delete("/users/:id", async (req, res) => {
  const id = parseInt(req.params.id)

  const deleteUsers = await prisma.user.deleteMany({
    where: {
      id: id
    },
  })

  res.json({})
})


App.post("/login", Login)
App.get("/permissions", PermissionIndex)
App.post("/connect-permission", AddPermission)
App.patch("/disconnect-permission", DisconnectPermission)
App.get("/brands", BrandIndex)
App.post("/brands", StoreBrand)
App.patch("/brands/:id", UpdateBrand)
App.get("/brands/:id", ShowBrand)
App.delete("/brands/:id", DeleteBrand)

App.post("/colors", CreateColor)
App.get("/colors", IndexColors)
App.patch("/colors/:id", UpdateColor)
App.get("/colors/:id", ShowColor)
App.delete("/colors/:id", DeleteColor)

App.get("/categories", IndexCategory)
App.post("/categories", StoreCategory)
App.patch("/categories/:id", UpdateCategory)
App.get("/categories/:id", ShowCategory)
App.delete("/categories/:id", DeleteCategory)

App.get("/pay-modes", IndexPayModes)

App.get("/suppliers/get-total-supplier-paid", GetTotalSupplierPaid)
App.get("/suppliers/get-total-supplier-payable", GetTotalSupplierPayable)
App.post("/suppliers", StoreSupplier)
App.get("/suppliers", IndexSupplier)
App.get("/supplier/:id", ShowSupplier)
App.patch("/suppliers/:id", UpdateSupplier)
App.delete("/suppliers/:id", DeleteSupplier)

App.get("/damage-lost", IndexDamageAndLost)


App.get("/products/list-with-sales", ListMultipleProductsWithSales)
App.get("/products/get-total-cogs", GetTotalCOGS)
App.get("/products/index-without-pagination", IndexWithoutPagination)
// App.get("/products/with-pagination", IndexWithPagination)
App.get("/products/dynamic-search/:token", DynamicSearch)
App.get("/products/sale-barcode-dynamic-search/:token", DynamicSaleBarcodeSearch)
App.get("/products/sale-barcode-dynamic-search-return/:token", DynamicSaleBarcodeSearchReturn)
App.post("/products-minimum", StoreProductMinimum)
App.patch("/products/:id/fill-info", FillProductInfo)
App.post("/products", StoreProduct)

App.patch("/products/price-change", InsertMany)
App.get("/products/price-changes", IndexPriceChanges)
App.get("/products/stock-changes", IndexStockChanges)

App.get("/products/get-total-damage-and-lost", GetTotalDamageAndLost)
App.get("/products/product_short_list", IndexProductShortList)
App.get("/products/:id", ShowProduct)
App.patch("/products/:id", UpdateProduct)
App.get("/products", IndexProduct)
App.delete("/products/:id", DeleteProduct)
App.post("/products/:id/damage-lost", LogDamage)//new
App.delete("/products/:id/hard", HardDeleteProduct)

App.get("/saleable-products", IndexSaleableProduct)

App.get("/purchase-orders/all-received", GetAllReceived)

App.use("/purchase_order", purchaseRouter)

App.post("/purchase_return", PurchaseReturnStore)

App.get("/pos-sales/total-vat", GetTotalVatAmount)
App.get("/pos-sales/total-cogs", PosSaleGetTotalCOGS)
App.get("/pos-sales/get-total-sale-without-credit-sale", GetTotalSaleWithoutCreditSale)
App.get("/pos-sales/get-total-credit-sale", GetTotalCreditSale)
App.get("/pos-sales/get-total-credit-sale-receivable-of-users", GetTotalCreditSaleReceivableOfUser)
// App.get("/pos-sales/total-cogs", PosSaleGetTotalCOGS)
App.get("/pos-sales", IndexSales)
App.post("/pos-sales", StorePosSale)
App.get("/pos-sales/:id", ShowPosSale)

App.post("/get-exchange-amount", GetExchangeAmount)
App.get("/sales/total-exchange-amount", GetTotalExchangeAmount)
App.get("/sales/total-return-amount", GetTotalReturnAmount)

App.post("/membership-types", StoreMembershipType)
App.get("/membership-types/:id", ShowMembershipType)
App.patch("/membership-types/:id", UpdateMembershipType)
App.get("/membership-types", IndexMembershipTypes)
App.delete("/membership-types/:id", DeleteMembershipType)

App.get("/customers/get-total-credit-collected", GetTotalCreditCollected)
App.get("/customers/search-by-name-or-user", SearchByNameAndPhone)
App.get("/customers/pos-search/:token", CustomerPOSSearch)
App.post("/customers", StoreCustomer)
App.get("/customers/:id", ShowCustomer)
App.patch("/customers/:id", UpdateCustomer)
App.get("/customers", IndexCustomers)
App.delete("/customers/:id", DeleteCustomer)

App.post("/pos-sale-return", POSSaleReturn)//new

App.post("/promotions/flat-discount", StoreFlatDiscount)
App.patch("/promotions/flat-discount/:id", UpdateFlatDiscount)
App.get("/promotions/flat", IndexFlatPromotion)
App.get("/promotions/flat/is-product-active/:product_id", IsProductActiveOnFlat)
App.post("/promotions/bxgx", StoreBuyXGetX)
App.patch("/promotions/bxgx/:id", UpdateBuyXGetX)
App.get("/promotions/bxgx", IndexBuyXGetX)
App.get("/promotions/all/bxgx", AllBuyXGetXPromotion)
App.get("/promotions/bxgx/:id", ShowBXGX)
App.post("/promotions/combo", StoreComboPromotion)
App.patch("/promotions/combo/:id", UpdateComboPromotion)
App.get("/promotions/combo", IndexComboPromotion)
App.get("/promotions/combo/get-one-by-barcode/:barcode", GetOneComboByBarcode)
App.get("/promotions/combo/is-product-active/:product_id", IsProductActiveOnCombo)
App.get("/promotions/bxgx/check-exists/:product_id", CheckProductExistsOnBXGX)

App.get("/reports/day-wise-sell", DayWiseSale)
App.get("/reports/stock/item-wise", ItemWiseStockReport)
App.get("/reports/stock/category-wise", CategoryWiseStockReport)
App.get("/reports/stock/brand-wise", BrandWiseStockReport)
App.get("/reports/invoice-wise-sale", InvoiceWiseSale)
App.get("/reports/invoice-wise-sale/count", InvoiceWiseSaleCount)

App.get("/reports/invoice-wise-sale/practice", InvoiceWiseSalePractice)


App.get("/reports/promotions/bxgx/details", BXGXDetails)

App.get("/reports/sales/customer-wise-summery", CustomerWiseSummery)
App.get("/reports/sales/customer-wise-details", CustomerWiseSaleDetailsReport)

App.get("/reports/sales/user-wise-summery", UserWiseSummery)

App.get("/reports/item-wise-sale-summery", ItemWiseSale)
App.get("/reports/item-wise-sale-details", ItemWiseSaleDetails)
App.get("/reports/damage-and-lost", DamageNLost)

App.get("/reports/customer-wise-due-collection", DueCollection)
App.get("/reports/expiry-products", ExpiryProducts)

App.get("/reports/purchases/order-summery", PurchaseOrderSummery)
App.get("/reports/purchases/order-details", PurchaseOrderDetails)
App.get("/reports/purchases/receive-summery", PurchaseReceiveSummery)
App.get("/reports/purchases/receive-details", PurchaseReceiveDetails)
App.get("/reports/purchases/return-summery", PurchaseReturnSummery)
App.get("/reports/purchases/category", PurchaseOnCategory)
App.get("/reports/category-wise-sale-summery", CategoryWiseSale)

App.get("/account-management/accounts", IndexAccounts);
App.post("/account-management/account", CreateAccount);
App.patch("/account-management/account/:id", UpdateAccount);
App.delete("/account-management/account/:id", DeleteAccount);

App.post("/account-management/sub-accounts", CreateSubAccount)
App.get("/account-management/sub-accounts", IndexSubAccounts)
App.delete("/account-management/sub-accounts/:id", DeleteSubAccount)
App.patch("/account-management/sub-accounts/:id", UpdateSubAccount)
App.get("/account-management/sub-accounts/:id", ShowSubAccount)

App.get("/account-management/vouchers/get-total-of-voucher-credit", GetTotalOfVoucherCredit)
App.get("/account-management/vouchers/get-total-of-owners-payments", GetTotalOfOwnersPayments)
App.get("/account-management/vouchers", IndexVouchers);
App.post("/account-management/voucher", CreateVoucher);
App.patch("/account-management/vouchers/:id", UpdateVoucher)
App.delete("/account-management/vouchers/:id", DeleteVoucher)

App.get("/account-management/supplier_payments", IndexSupplierPayments);
App.post("/account-management/supplier_payment", CreateSupplierPayment);

App.post("/customer_payment", CreateCustomerPayment);
App.get("/customer_payments", IndexCustomerPayments)

// App.post("/upload-file/products", IndexFileToProduct);
App.post("/upload-file/from_xml", multer().single('file'), FileUploads);

App.post("/stock_ledger/:id", StoreStockLedger);
App.get("/stock_ledger_id", GetAllStockLedger);
App.get("/stock_ledger/:id", GetStockLedger);


App.get("/settings", GetSettings)
App.patch("/settings", UpdateSettings)

App.get("/dashboard", DashboardIndex)


export default App


