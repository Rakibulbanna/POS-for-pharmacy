import ReactToPrint from "react-to-print"
import ItemWiseStockReport from "@/components/reports/item-wise-stock-report";
import PeriodicalStockReport from "@/components/reports/periodical-stock-report";
import { ipcRenderer } from "electron";
import { useRef, useState } from "react";
import { Button, Input, Select } from "@mantine/core";
import CategoryWise from "@/components/reports/stock/CategoryWise";
import CustomerWiseDueCollectionReport from "@/components/reports/customer/customer-wise-due-collection-report";
import CustomerCreditColectionReport from "@/components/reports/customer/customer-credit-colection-report";

import { FaSitemap } from 'react-icons/fa';
import Customer_wise_sale_summary from "@/components/reports/sale/customer_wise_sale_summary";
import Customer_wise_sale_details from "@/components/reports/sale/customer_wise_sale_details";
import ReportFilter from "@/components/reports/filter";

const Customer = () => {
  const [fromDate, setFromDate] = useState(null)
  const [toDate, setToDate] = useState(null)
  const [searchType, setSearchType] = useState({ label: "Id", value: "customer_id" })
  const [serchBarcode, setSerchBarcode] = useState(null)
    const [customerID, setCustomerID] = useState(null)
    const [customerPhoneNumber, setCustomerPhoneNumber] = useState(null)

  const customerWiseDueCollection = useRef();
  const customerCreditColection = useRef();

  const periodicalStockReport = useRef();
  const categoryWise = useRef();

  const customerWiseSaleSummary = useRef();
  const customerWiseSaleDetails = useRef();

  const passPrintToElectron = (target) => {
    return new Promise(() => {
      let data = target.contentWindow.document.documentElement.outerHTML;
      let blob = new Blob([data], { type: 'text/html' });
      let url = URL.createObjectURL(blob);
      ipcRenderer.invoke("printComponent", url, "landscape").then(res => {
        // console.log(res);
      }).catch(err => {
        console.log("error here");
        console.log(err);
      })
    });
  }

  const randomColor = () => {
    const color = ['grape', 'green', 'blue', 'pink', 'violet', 'indigo', 'cyan', 'teal', 'lime', 'orange'];
    const randomColor = color[Math.floor(Math.random() * color.length)];
    return randomColor;
  }


  return (
    <>
      <ReportFilter onFromDate={v => setFromDate(v)} onToDate={v => setToDate(v)} />

      <div className="mb-4">
        <div className="py-1">Customers Due Report:</div>
        <div className="flex flex-wrap gap-4">
          <ReactToPrint
            content={() => customerWiseDueCollection.current}
            trigger={() => (
              <Button radius="xs" color="teal" className=" text-center h-40 w-60 min-w-fit leading-normal" uppercase>
                <div>
                  <FaSitemap className=" text-3xl text-pink-100 stroke-2" />
                  <br></br>
                  <span>Customer Wise Due <br></br> Collection</span>
                </div>
              </Button>
            )}
            print={passPrintToElectron}
          />


        </div><br />
        <div>
          <div className="w-72 grid grid-cols-6 gap-2">
            <Select
              className="col-span-2"
              placeholder="select"
              onChange={(e) => setSearchType(e)}
              defaultValue={searchType}
              clearable
              data={[
                { label: "Id", value: "customer_id" },
                { label: "Name", value: "name" },
                { label: "Phone Number", value: "phone_number" }
              ]}
            />
            <Input
              className="col-span-4"
              onChange={(e) => setSerchBarcode(e.target.value)}
              placeholder="scan barcode"
            />

          </div> <br />
          <ReactToPrint
            content={() => customerCreditColection.current}
            trigger={() => (
              <Button radius="xs" color="grape" className=" text-center h-40 w-60 min-w-fit leading-normal" uppercase>
                <div>
                  <FaSitemap className=" text-3xl text-pink-100 stroke-2" />
                  <br></br>
                  <span>Customer Credit <br></br> Collection</span>
                </div>
              </Button>
            )}
            print={passPrintToElectron}
          />
        </div>

      </div>

        <div className="border-4 border-black">
            <div className={'flex gap-4 mb-4'}>
                <div>
                    <div>Customer ID</div>
                    <Input onChange={e => setCustomerID(e.target.value)}/>
                </div>
                <div>
                    <div>Customer Phone Number</div>
                    <Input onChange={e => setCustomerPhoneNumber(e.target.value)}/>
                </div>
            </div>
            <div className={'flex gap-4'}>
                <ReactToPrint
                    content={() => customerWiseSaleSummary.current}
                    trigger={() => (
                        <Button radius="xs" color="blue" className=" text-center h-40 w-60 min-w-fit leading-normal"
                                uppercase>
                            <div>
                                <FaSitemap className=" text-3xl text-pink-100 stroke-2"/>
                                <br></br>
                                <span>Customer Wise Sale <br></br> Summary Report</span>
                            </div>
                        </Button>
                    )}
                    print={passPrintToElectron}
                />

                <ReactToPrint
                    content={() => customerWiseSaleDetails.current}
                    trigger={() => (
                        <Button radius="xs" color="cyan" className=" text-center h-40 w-60 min-w-fit leading-normal"
                                uppercase>
                            <div>
                                <FaSitemap className=" text-3xl text-pink-100 stroke-2"/>
                                <br></br>
                                <span>Customer Wise Sale <br></br> Details Report</span>
                            </div>
                        </Button>
                    )}
                    print={passPrintToElectron}
                />
            </div>
        </div>


      <div className="hidden">
        <div ref={customerWiseDueCollection}>
          <CustomerWiseDueCollectionReport fromDate={fromDate} toDate={toDate} />
        </div>
        <div ref={customerCreditColection}>
          <CustomerCreditColectionReport searchType={searchType} serchBarcode={serchBarcode} fromDate={fromDate} toDate={toDate} />
        </div>

        {/* <div ref={periodicalStockReport}>
                    <PeriodicalStockReport />
                </div> */}
        {/* <div ref={categoryWise}>
          <CategoryWise />
        </div> */}
        <div ref={customerWiseSaleSummary}>
          <Customer_wise_sale_summary fromDate={fromDate} toDate={toDate} customerID={customerID} phoneNumber={customerPhoneNumber}/>
        </div>
        <div ref={customerWiseSaleDetails}>
          <Customer_wise_sale_details fromDate={fromDate} toDate={toDate} customerID={customerID} phoneNumber={customerPhoneNumber}/>
        </div>
      </div>
    </>
  )
}

export default Customer

