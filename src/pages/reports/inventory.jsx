import ReactToPrint from "react-to-print"
import ItemWiseStockReport from "@/components/reports/item-wise-stock-report";
import PeriodicalStockReport from "@/components/reports/periodical-stock-report";
import { ipcRenderer } from "electron";
import { useEffect, useRef, useState } from "react";
import { Button, Input, Select } from "@mantine/core";
import CategoryWise from "@/components/reports/stock/CategoryWise";
import { AiOutlineStock } from 'react-icons/ai';
import { GiStockpiles } from 'react-icons/gi';
import { FaSitemap } from 'react-icons/fa';
import InventoryReport from "@/components/reports/inventory/inventory-report";
import ReportFilter from "@/components/reports/filter";
import { BaseAPI, HTTP } from "~/repositories/base";
import moment from "moment";

const Inventory_Report = () => {

  const [allStockLedger, setAllStockLedger] = useState([]);
  const [selectedStockLedger, setSelectedStockLedger] = useState('');

  const inventoryReport = useRef();
  const periodicalStockReport = useRef();
  const categoryWise = useRef();

  const passPrintToElectron = (target) => {
    return new Promise(() => {
      let data = target.contentWindow.document.documentElement.outerHTML;
      let blob = new Blob([data], { type: 'text/html' });
      let url = URL.createObjectURL(blob);
      ipcRenderer.invoke("printComponent", url, "landscape").then(res => {
        console.log(res);
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

  const [fromDate, setFromDate] = useState(null)
  const [toDate, setToDate] = useState(null)

  useEffect(() => {
    let url = `${BaseAPI}/stock_ledger_id?`;
    if (fromDate) {
      // console.log({ fromDate });
      // const date = new Date(fromDate);
      // console.log({ ISO: date.toISOString() });
      // const momentDate = moment(fromDate).format('YYYY-MM-DD');
      // console.log({momentDate})
      url += `from_date=${fromDate}&`;
    }
    if (toDate) {
      // const momentDate = moment(toDate).format('YYYY-MM-DD');
      // const date = new Date(fromDate);
      url += `to_date=${toDate}`;
    }
    HTTP.get(url)
      .then(res => {
        if (res.data.data.length === 0) setAllStockLedger(() => []);
        else {
          // const filterData = res.data.data.map(value => (value.stock_ledger_id));
          setAllStockLedger(() => res.data.data);
        }
      })
      .catch(err => {
        setAllStockLedger(() => []);
        console.log(err);
      })
  }, [fromDate, toDate]);




  return (
    <>
      <div>
        <ReportFilter onFromDate={v => setFromDate(() => v)} onToDate={v => setToDate(() => v)} />
      </div>
      <div className="col-start-3 col-end-4 flex flex-col gap-1">
        <div className="py-1">Inventory Report:</div>
        <div className="flex flex-col gap-4">
          <div className="w-60">
            <Select
              label="Select Inventory Id"
              placeholder="Pick one"
              data={allStockLedger}
              onSearchChange={e => setSelectedStockLedger(() => e)}
              searchValue={selectedStockLedger}
              nothingFound="No options"
              clearable
              searchable
            />
          </div>

          <ReactToPrint
            content={() => inventoryReport.current}
            trigger={() => (
              <Button radius="xs" color="grape" className=" text-center h-40 w-60 min-w-fit leading-normal" uppercase>
                <div>
                  <FaSitemap className=" text-3xl text-pink-150 stroke-2" />
                  <br></br>
                  <span>Inventory Report</span>
                </div>
              </Button>
            )}
            print={passPrintToElectron}
          />
          {/* <ReactToPrint
            content={() => categoryWise.current}
            trigger={() => (
              <Button radius="xs" color="green" className=" text-center h-40 w-60 min-w-fit leading-normal" uppercase>
                <div>
                  <GiStockpiles className=" text-3xl text-pink-100 stroke-2" />
                  <br></br>
                  <span>Category Wise Stock <br></br> Report ( Current )</span>
                </div>
              </Button>
            )}
            print={passPrintToElectron}
          /> */}
          {/* <ReactToPrint
                    content={() => periodicalStockReport.current}
                    trigger={() => <Button variant="light" radius="xs" size="xs" uppercase>Periodical Stock Report</Button>}
                    print={passPrintToElectron}
                /> */}
        </div>
      </div>

      <div className="hidden">
        <div ref={inventoryReport}>
          <InventoryReport selectedStockLedger={selectedStockLedger} />
        </div>
      </div>

    </>
  )
}

export default Inventory_Report;