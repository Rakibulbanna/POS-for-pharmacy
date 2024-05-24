import DamageLostReportDetails from "@/components/reports/damage-lost-report-details";
import { ipcRenderer } from "electron";
import { useRef, useState } from "react";
import ReactToPrint from "react-to-print";
import ReportFilter from "@/components/reports/filter";
import { Button } from "@mantine/core";
import { FaSitemap } from 'react-icons/fa';

export default function () {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const damageLostReportDetails = useRef();

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

  return <>
    <div>
      <ReportFilter onFromDate={v => setFromDate(v)} onToDate={v => setToDate(v)} />
    </div>
    <div className="col-start-1 col-end-4 flex flex-col gap-1">
      <div>Damage Lost:</div>
      <ReactToPrint
        content={() => damageLostReportDetails.current}
        trigger={() =>(
          <Button radius="xs" color="grape" className=" text-center h-40 w-60 min-w-fit leading-normal" uppercase>
              <div>
                  <FaSitemap className=" text-3xl text-pink-100 stroke-2" />
                  <br></br>
                  <span>Damage Lost Report <br></br> Details </span>
              </div>
          </Button>
      ) }
        print={passPrintToElectron}
      />
    </div>

    <div className="hidden">
      <div ref={damageLostReportDetails}>
        <DamageLostReportDetails fromDate={fromDate} toDate={toDate} />
      </div>
    </div>
  </>
}