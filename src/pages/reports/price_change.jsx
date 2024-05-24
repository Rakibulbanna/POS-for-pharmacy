import ReportFilter from "@/components/reports/filter";
import { Button } from "@mantine/core";
import { useRef, useState } from "react";
import { FaSitemap } from "react-icons/fa";
import ReactToPrint from "react-to-print";
import PriceChangeReports from "@/components/reports/customer/price-change-report";
import { ipcRenderer } from "electron";

const PriceChangeReport = () => {

  const [fromDate, setFromDate] = useState(null)
  const [toDate, setToDate] = useState(null)

  const priceChangeReports = useRef();
  const stockChangeReports = useRef();

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

  return (
    <>

      <ReportFilter onFromDate={v => setFromDate(v)} onToDate={v => setToDate(v)} />
      <br />
      <div className="flex flex-wrap gap-4">
        <ReactToPrint
          content={() => priceChangeReports.current}
          trigger={() => (
            <Button radius="xs" color="violet" className=" text-center h-40 w-60 min-w-fit leading-normal" uppercase>
              <div>
                <FaSitemap className=" text-3xl text-pink-100 stroke-2" />
                <br></br>
                <span>Price Change<br></br>Reports</span>
              </div>
            </Button>
          )}
          print={passPrintToElectron}
        />

        <ReactToPrint
          content={() => stockChangeReports.current}
          trigger={() => (
            <Button radius="xs" color="violet" className=" text-center h-40 w-60 min-w-fit leading-normal" uppercase>
              <div>
                <FaSitemap className=" text-3xl text-pink-100 stroke-2" />
                <br></br>
                <span>Stock Change<br></br>Reports</span>
              </div>
            </Button>
          )}
          print={passPrintToElectron}
        />
      </div>
      <div className="hidden">
        <div ref={priceChangeReports}>
          <PriceChangeReports fromDate={fromDate} toDate={toDate} type="price-changes" />
        </div>
        <div ref={stockChangeReports}>
          <PriceChangeReports fromDate={fromDate} toDate={toDate} type="stock-changes" />
        </div>
      </div>
    </>

  );
};

export default PriceChangeReport;