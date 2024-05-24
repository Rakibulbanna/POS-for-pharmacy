import { DateRangePicker } from "@mantine/dates";
import { Select, Button, Title, Tabs, Input } from "@mantine/core";
import DayWiseSale from "@/components/reports/day-wise-sale";
import ItemWiseSales from "@/components/reports/item-wise-sales";
import SalesFromStock from "@/components/reports/sales-from-stock";
import SalesStockReport from "@/components/reports/sales-stock-report";
import ShopWiseIemSells from "@/components/reports/shop-wise-item-sells";
import SupplierWiseGp from "@/components/reports/supplier-wise-gp";
import { useRef, useState } from "react";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import { ipcRenderer } from "electron";
import InvoiceWiseSalesSummaryReport from "@/components/reports/invoice-wise-sales-summary-report";
import InvoiceWiseSalesDetails from "@/components/reports/invoice-wise-sales-details";
import SupplierWiseSalesReport from "@/components/reports/supplier-wise-sales-report";
import GroupWiseSalesReport from "@/components/reports/group-wise-sales-report";
import CashierWiseSalesSummary from "@/components/reports/cashier-wise-sales-summary";
import CounterWiseSalesSummary from "@/components/reports/counter-wise-sales-summary";
import CustomerLedgerReport from "@/components/reports/customer-ledger-report";
import CustomerPointBalanceReport from "@/components/reports/customer-point-balance-report";
import DataWiseCustomerShoppingSummary from "@/components/reports/data-wise-customer-shopping-summary";
import SalesPersonWiseSalesDetailsReport from "@/components/reports/sales-person-wise-sales-details-report";
import CircularDiscountDetails from "@/components/reports/circular-discount-details";
import CircularDiscountSummary from "@/components/reports/circular-discount-summary";
import PurchaseOrderDetailsReport from "@/components/reports/purchase-order-details-report";
import PurchaseOrderSummaryReport from "@/components/reports/purchase-order-summary-report";
import PromotionDetails from "@/components/reports/promotion-details";
import PromotionSummary from "@/components/reports/promotionSummary";

import PackageDetails from "@/components/reports/package-details";
import SupplierReturnReportSummary from "@/components/reports/supplier-return-report-summary";
import SupplierReturnReportDetails from "@/components/reports/supplier-return-report-details";
import RequistionReportSummary from "@/components/reports/requistion-report-summary";
import DamageLostReportDetails from "@/components/reports/damage-lost-report-details";
import ReportFilter from "@/components/reports/filter";
import ItemWiseSaleDetails from "@/components/reports/sale/item_wise_details";
import Customer_wise_sale_summary from "@/components/reports/sale/customer_wise_sale_summary";
import Customer_wise_sale_details from "@/components/reports/sale/customer_wise_sale_details";
import Re_order_report from "@/components/reports/sale/re-order-report";
import { BaseAPI, HTTP } from "~/repositories/base"

import { FaSitemap } from 'react-icons/fa';
import Category_wise_sale from "@/components/reports/sale/category_wise_sale";
import Brand_wise_sale from "@/components/reports/sale/brand_wise_sale";
import Supplier_wise_sale from "@/components/reports/sale/supplier_wise_sale";
import SlowFastMoving from "@/components/reports/sale/slow_fast_moving";
import User_wise_sale_summary from "@/components/reports/sale/user_wise_sale_summary";


export default function () {

  const [itemWiseScanBarcode, setItemWiseScanBarcode] = useState('');
  const [invoiceWiseScanBarcode, setInvoiceWiseScanBarcode] = useState('');

  const [searchType, setSearchType] = useState(null);
  const [dropdownData, setdropDownData] = useState([]);


  const dayWiseSaleRef = useRef();
  const itemWiseSales = useRef();
  const itemWiseSaleDetails = useRef()

  const categoryWiseSaleRef = useRef();
  const brandWiseSaleRef = useRef();
  const supplierWiseSaleRef = useRef();

  const salesStockReport = useRef();
  const shopWiseIemSells = useRef();
  const salesFromStock = useRef();
  const supplierWiseGp = useRef();
  const supplierWiseSalesReport = useRef();


  const invoiceWiseSalesDetails = useRef();
  const groupWiseSalesReport = useRef();
  const cashierWiseSalesSummary = useRef();
  const counterWiseSalesSummary = useRef();

  const customerWiseSaleSummary = useRef();
  const customerWiseSaleDetails = useRef();

  const customerLedgerReport = useRef();
  const customerPointBalanceReport = useRef();
  const dataWiseCustomerShoppingSummary = useRef();

  const salesPersonWiseSalesDetailsReport = useRef();

  const circularDiscountDetails = useRef();
  const circularDiscountSummary = useRef()

  const purchaseOrderDetailsReport = useRef();
  const purchaseOrderSummaryReport = useRef();

  const promotionDetails = useRef();
  const promotionSummary = useRef();



  const packageDetails = useRef();

  const slowFastMovingItem = useRef();

  const supplierReturnReportSummary = useRef();
  const supplierReturnReportDetails = useRef();

  const requistionReportSummary = useRef();

  const damageLostReportDetails = useRef();

  const reOrderReport = useRef();
  
  const userWiseSaleSummaryReport = useRef();


  const passPrintToElectron = (target) => {
    return new Promise(() => {
      let data = target.contentWindow.document.documentElement.outerHTML;

      let blob = new Blob([data], { type: 'text/html' });
      let url = URL.createObjectURL(blob);

      ipcRenderer.invoke("printComponent", url, "landscape").then(res => {
      }).catch(err => {
        console.log(err);
      })
    });
  }

  const [fromDate, setFromDate] = useState(null)
  const [toDate, setToDate] = useState(null)

  const handleSearchValue = (e) => {
    if (searchType !== "barcode" && e) {
      let url = `${BaseAPI}/suppliers?supplier_name=${e}`;

      HTTP.get(url).then(res => {
        console.log({ data: res.data.data });
        if (res.data.data?.length > 0) setdropDownData(() => res.data.data.map(v => ({ value: String(v.id), label: v.first_name })))
      }).catch(err => {
        console.log(err);
      })
    }
  }

  return (
    <>
      <Filters onFromDateChange={setFromDate} onToDateChange={setToDate} />
      <div className="grid grid-cols-3 gap-1 mt-4 text-left justify-around ">
        <div className=" col-start-1 col-end-4 flex gap-4">
          <div>
            <div className="mb-2">
              <lebel className>Item Wise</lebel>
              <div className=" w-72 grid grid-cols-6">
                <Select
                  className="col-span-2"
                  placeholder="select"
                  onChange={(e) => setSearchType(e)}
                  data={["supplier", "barcode"]}
                  clearable
                />
                {
                  searchType === 'supplier' ?
                    <Select
                      className="col-span-4"
                      placeholder={`search ${searchType} `}
                      data={dropdownData}
                      onSearchChange={handleSearchValue}
                      onChange={(e) => setItemWiseScanBarcode(() => e)}
                      searchable
                      clearable
                    />
                    :
                    <Input
                      className="col-span-4"
                      onChange={(e) => setItemWiseScanBarcode(() => e.target.value)}
                      placeholder="scan barcode"
                      clearable
                    />
                }
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <div ref={itemWiseSales}>
            <ItemWiseSales fromDate={fromDate} toDate={toDate} searchType={searchType} barcode={itemWiseScanBarcode} />
          </div>
          <div ref={categoryWiseSaleRef}>
            <Category_wise_sale fromDate={fromDate} toDate={toDate} barcode={itemWiseScanBarcode} />
          </div>
          <div ref={brandWiseSaleRef}>
            <Brand_wise_sale fromDate={fromDate} toDate={toDate} barcode={itemWiseScanBarcode} />
          </div>
        </div>
      </div>
      <br />

      <div className="w-72">
        <lebel className="py-1">Invoice Wise Sales:</lebel>
        <Input onChange={(e) => setInvoiceWiseScanBarcode(e.target.value)} placeholder="scan barcode for details" />
      </div>
      <InvoiceWiseSalesSummaryReport fromDate={fromDate} toDate={toDate} />

      <div>Return </div>
      <div className=" col-start-1 col-end-4 flex gap-4">
        <ReactToPrint
          content={() => reOrderReport.current}
          trigger={() => (
            <Button radius="xs" color="cyan" className=" text-center h-40 w-72 min-w-fit leading-normal" uppercase>
              <div>
                <FaSitemap className=" text-3xl text-pink-100 stroke-2" />
                <br></br>
                <span>Re Order Report</span>
              </div>
            </Button>
          )}
          print={passPrintToElectron}
        />
      </div>

      <div>Slow/Fast Moving Items </div>
      <div className=" col-start-1 col-end-4 flex gap-4">
        <ReactToPrint
          content={() => slowFastMovingItem.current}
          trigger={() => (
            <Button radius="xs" color="cyan" className=" text-center h-40 w-72 min-w-fit leading-normal" uppercase>
              <div>
                <FaSitemap className=" text-3xl text-pink-100 stroke-2" />
                <br></br>
                <span>Slow Fast Moving Items</span>
              </div>
            </Button>
          )}
          print={passPrintToElectron}
        />
      </div>

      <div>User Wise Sale Summary Report</div>
      <div className=" col-start-1 col-end-4 flex gap-4">
        <ReactToPrint
          content={() => userWiseSaleSummaryReport.current}
          trigger={() => (
            <Button radius="xs" color="pink" className=" text-center h-40 w-72 min-w-fit leading-normal" uppercase>
              <div>
                <FaSitemap className=" text-3xl text-pink-100 stroke-2" />
                <br></br>
                <span>User Wise Sale Summary</span>
              </div>
            </Button>
          )}
          print={passPrintToElectron}
        />
      </div>




      <div className="hidden">
        <div ref={dayWiseSaleRef}>
          <DayWiseSale />
        </div>
        <div ref={shopWiseIemSells} >
          <ShopWiseIemSells />
        </div>





        <div ref={itemWiseSaleDetails}>
          <ItemWiseSaleDetails />
        </div>
        <div ref={salesStockReport}>
          <SalesStockReport />
        </div>
        <div ref={salesFromStock}>
          <SalesFromStock />
        </div>
        <div ref={supplierWiseGp}>
          <SupplierWiseGp />
        </div>
        <div ref={supplierWiseSalesReport}>
          <SupplierWiseSalesReport />
        </div>

        <div ref={invoiceWiseSalesDetails}>

        </div>
        <div ref={groupWiseSalesReport}>
          <GroupWiseSalesReport />
        </div>
        <div ref={cashierWiseSalesSummary}>
          <CashierWiseSalesSummary />
        </div>
        <div ref={counterWiseSalesSummary}>
          <CounterWiseSalesSummary />
        </div>


        <div ref={reOrderReport}>
          <Re_order_report />
        </div>

        <div ref={slowFastMovingItem}>
          <SlowFastMoving />
        </div>
        
        
        <div ref={userWiseSaleSummaryReport}>
          <User_wise_sale_summary />
        </div>





        <div ref={customerLedgerReport}>
          <CustomerLedgerReport />
        </div>
        <div ref={customerPointBalanceReport}>
          <CustomerPointBalanceReport />
        </div>
        <div ref={dataWiseCustomerShoppingSummary}>
          <DataWiseCustomerShoppingSummary />
        </div>
        <div ref={salesPersonWiseSalesDetailsReport}>
          <SalesPersonWiseSalesDetailsReport />
        </div>
        <div ref={circularDiscountDetails}>
          <CircularDiscountDetails />
        </div>
        <div ref={circularDiscountSummary}>
          <CircularDiscountSummary />
        </div>

        <div ref={purchaseOrderSummaryReport}>
          <PurchaseOrderSummaryReport />
        </div>
        <div ref={promotionDetails}>
          <PromotionDetails />
        </div>
        <div ref={promotionSummary}>
          <PromotionSummary />
        </div>

        <div ref={packageDetails}>
          <PackageDetails />
        </div>
        <div ref={supplierReturnReportSummary}>
          <SupplierReturnReportSummary />
        </div>
        <div ref={supplierReturnReportDetails}>
          <SupplierReturnReportDetails />
        </div>
        <div ref={requistionReportSummary}>
          <RequistionReportSummary />
        </div>
        <div ref={damageLostReportDetails}>
          <DamageLostReportDetails fromDate={fromDate} toDate={toDate} />
        </div>
      </div>
    </>
  )
}

const Filters = ({ onFromDateChange, onToDateChange }) => {
  const handleDateChange = (rangeValue) => {
    let fromDate = rangeValue[0]
    let toDate = rangeValue[1]

    if (fromDate) {
      fromDate = new Date(new Date(fromDate).getTime() - 21600000)
    }

    if (toDate) {
      toDate = new Date(new Date(toDate).getTime() - 21600000 + 86399999)
    }

    onFromDateChange(fromDate)
    onToDateChange(toDate)
  }
  return (
    <>
      <div className={'bg-amber-50 shadow-md rounded-xl p-4 flex justify-between items-center'}>
        <Title order={3}>Filters</Title>
        <DateRangePicker label={'Date Range'} amountOfMonths={2}
          allowSingleDateInRange={true}
          className={'w-1/4'}
          onChange={handleDateChange}
        />
        <Button size={'md'}>Filter</Button>
      </div>
    </>
  )
}
