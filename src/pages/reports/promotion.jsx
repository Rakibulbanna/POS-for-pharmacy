import ReactToPrint from "react-to-print"
import ItemWiseStockReport from "@/components/reports/item-wise-stock-report";
import PeriodicalStockReport from "@/components/reports/periodical-stock-report";
import { ipcRenderer } from "electron";
import { useRef, useState } from "react";
import { Button } from "@mantine/core";
import CategoryWise from "@/components/reports/stock/CategoryWise";
import CustomerWiseDueCollectionReport from "@/components/reports/customer/customer-wise-due-collection-report";
import CircularDiscountDetails from "@/components/reports/circular-discount-details";
import CircularDiscountSummary from "@/components/reports/circular-discount-summary";
import Buy_one_get_one_summary from "@/components/reports/promotion/buy_one_get_one_summary";
import Buy_one_get_one_details from "@/components/reports/promotion/buy_one_get_one_details";
import Combo_summary from "@/components/reports/promotion/combo_summary";
import Combo_details from "@/components/reports/promotion/combo_details";
import { FaSitemap } from 'react-icons/fa';
import { GiStoneWall } from 'react-icons/gi';
import { AiTwotoneApi } from 'react-icons/ai';
import { VscMultipleWindows } from 'react-icons/vsc';
import { FcComboChart } from 'react-icons/fc';
import ReportFilter from "@/components/reports/filter";

const Promotion = () => {
  const [fromDate, setFromDate] = useState(null)
  const [toDate, setToDate] = useState(null)

  const flatDiscountSummary = useRef();
  const flatDiscountDetails = useRef();
  const buyOneGetOneSummary = useRef();
  const buyOneGetOneDetails = useRef();
  const comboDiscountSummary = useRef();
  const comboDiscountDetails = useRef();



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

  const randomColor = () => {
    const color = ['grape', 'green', 'blue', 'pink', 'violet', 'indigo', 'cyan', 'teal', 'lime', 'orange'];
    const randomColor = color[Math.floor(Math.random() * color.length)];
    return randomColor;
  }

  return (
    <>
      <ReportFilter onFromDate={v => setFromDate(v)} onToDate={v => setToDate(v)} />

      <div className="py-1">Promotion Reports:</div>
      <div className="flex gap-4 flex-wrap">
        <ReactToPrint
          content={() => flatDiscountSummary.current}
          trigger={() => (
            <Button radius="xs" color="grape" className=" text-center h-40 w-60 leading-normal" uppercase>
              <div>
                <FaSitemap className=" text-3xl text-pink-100 stroke-2" />
                <br></br>
                <span>Flat Discount Summary</span>
              </div>
            </Button>
          )
          }
          print={passPrintToElectron}
        />
        <ReactToPrint
          content={() => flatDiscountDetails.current}
          trigger={() => (
            <Button radius="xs" color="green" className=" text-center h-40 w-60 leading-normal" uppercase>
              <div>
                <GiStoneWall className=" text-3xl text-pink-100 stroke-2" />
                <br></br>
                <span>Flat Discount Details</span>
              </div>
            </Button>
          )}
          print={passPrintToElectron}
        />

        <ReactToPrint
          content={() => buyOneGetOneSummary.current}
          trigger={() => (
            <Button radius="xs" color="blue" className=" text-center h-40 w-60 leading-normal" uppercase>
              <div>
                <AiTwotoneApi className=" text-3xl text-pink-100 stroke-2" />
                <br></br>
                <span>Buy One Get One Summary</span>
              </div>
            </Button>
          )}
          print={passPrintToElectron}
        />
        <ReactToPrint
          content={() => buyOneGetOneDetails.current}
          trigger={() => (
            <Button radius="xs" color="cyan" className=" text-center h-40 w-60 leading-normal" uppercase>
              <div>
                <VscMultipleWindows className=" text-3xl text-pink-100 " />
                <br></br>
                <span>Buy One Get One Details</span>
              </div>
            </Button>
          )}
          print={passPrintToElectron}
        />

        <ReactToPrint
          content={() => comboDiscountSummary.current}
          trigger={() => (
            <Button radius="xs" color="indigo" className=" text-center h-40 w-60 leading-normal" uppercase>
              <div>
                <FcComboChart className=" text-3xl text-pink-100 " />
                <br></br>
                <span>Combo Discount Summary</span>
              </div>
            </Button>
          )}
          print={passPrintToElectron}
        />
        {/* <ReactToPrint
          content={() => comboDiscountDetails.current}
          trigger={() => (
            <Button radius="xs" color="lime" className=" text-center h-40 w-60 leading-normal" uppercase>
              <div>
                <FaSitemap className=" text-3xl text-pink-100 stroke-2" />
                <br></br>
                <span>Combo Discount Details</span>
              </div>
            </Button>
          )}
          print={passPrintToElectron}
        /> */}
      </div>

      <div className="hidden">
        <div ref={flatDiscountSummary}>
          <CircularDiscountSummary fromDate={fromDate} toDate={toDate} />
        </div>
        <div ref={flatDiscountDetails}>
          <CircularDiscountDetails fromDate={fromDate} toDate={toDate} />
        </div>

        <div ref={buyOneGetOneSummary}>
          <Buy_one_get_one_summary fromDate={fromDate} toDate={toDate} />
        </div>
        <div ref={buyOneGetOneDetails}>
          <Buy_one_get_one_details fromDate={fromDate} toDate={toDate} />
        </div>

        <div ref={comboDiscountSummary}>
          <Combo_summary fromDate={fromDate} toDate={toDate} />
        </div>
        <div ref={comboDiscountDetails}>
          <Combo_details fromDate={fromDate} toDate={toDate} />
        </div>
      </div>
    </>
  )
}

export default Promotion