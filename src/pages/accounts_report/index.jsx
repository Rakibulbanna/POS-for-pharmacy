import DamageLostReportDetails from "@/components/reports/damage-lost-report-details";
import { ipcRenderer } from "electron";
import { useRef, useState } from "react";
import ReactToPrint from "react-to-print";
import ReportFilter from "@/components/reports/filter";
import { Button, Input, Select } from "@mantine/core";
import { FaSitemap } from 'react-icons/fa';
import Chart_of_account_report from "@/components/account_reports/chart_of_account_report";
import Voucher_payment_report from "@/components/account_reports/voucher_payment_report";
import Supplier_payment_report from "@/components/account_reports/supplier_payment_report";
import Balance_sheet_report from "@/components/account_reports/balance_sheet_report";
import Income_statement_report from "@/components/account_reports/income_statement_report";
import Profit_and_lost_report from "@/components/account_reports/profit_and_lost_report";
import balance_sheet_report from "@/components/account_reports/balance_sheet_report";

export default function () {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const [scanSupplierType, setScanSupplierType] = useState(null);
  const [scanSupplierValue, setScanSupplierValue] = useState(null);


  const chartOfAccount = useRef();
  const voucherPayment = useRef();
  const supplierPayment = useRef();
  const balanceSheet = useRef();
  const incomeStatement = useRef();
  const profitAndLost = useRef();


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

  // console.log({fromDate,toDate})
  // console.log({scanSupplierType,scanSupplierValue})

  return <>
    <div>
      <ReportFilter onFromDate={v => setFromDate(v)} onToDate={v => setToDate(v)} />
    </div>
    <div className="flex flex-wrap gap-4 mt-4 flex-col">
      <div>Supplier Payment</div>
      <div className="w-60 flex">
        <Select
          className="w-3/6 border"
          radius={0}
          placeholder="SELECT"
          onChange={(e) => setScanSupplierType(() => e)}
          data={['ID', 'NAME']}
        />
        <Input
          radius={0}
          placeholder="search"
          type={scanSupplierType === 'ID' ? 'number' : 'text'}
          onChange={(e) => setScanSupplierValue(() => e.target.value ? e.target.value : null)}
          disabled={scanSupplierType ? false : true}
        />
      </div>
      <ReactToPrint
        content={() => supplierPayment.current}
        trigger={() => (
          <Button radius="xs" color="violet" className=" text-center h-40 w-60 min-w-fit leading-normal" uppercase>
            <div>
              <FaSitemap className=" text-3xl text-pink-100 stroke-2" />
              <br></br>
              <span>Supplier Payment <br></br> Report </span>
            </div>
          </Button>
        )}
        print={passPrintToElectron}
      />
    </div>
    <div className="flex flex-wrap gap-4 mt-4">
      <ReactToPrint
        content={() => chartOfAccount.current}
        trigger={() => (
          <Button radius="xs" color="grape" className=" text-center h-40 w-60 min-w-fit leading-normal" uppercase>
            <div>
              <FaSitemap className=" text-3xl text-pink-100 stroke-2" />
              <br></br>
              <span>Chart Of Account <br></br> Report </span>
            </div>
          </Button>
        )}
        print={passPrintToElectron}
      />

      <ReactToPrint
        content={() => voucherPayment.current}
        trigger={() => (
          <Button radius="xs" color="blue" className=" text-center h-40 w-60 min-w-fit leading-normal" uppercase>
            <div>
              <FaSitemap className=" text-3xl text-pink-100 stroke-2" />
              <br></br>
              <span>Voucher Payment<br></br> Report </span>
            </div>
          </Button>
        )}
        print={passPrintToElectron}
      />

      <ReactToPrint
        content={() => balanceSheet.current}
        trigger={() => (
          <Button radius="xs" color="cyan" className=" text-center h-40 w-60 min-w-fit leading-normal" uppercase>
            <div>
              <FaSitemap className=" text-3xl text-pink-100 stroke-2" />
              <br></br>
              <span>Balance Sheet <br></br> Report </span>
            </div>
          </Button>
        )}
        print={passPrintToElectron}
      />

      <ReactToPrint
        content={() => incomeStatement.current}
        trigger={() => (
          <Button radius="xs" color="indigo" className=" text-center h-40 w-60 min-w-fit leading-normal" uppercase>
            <div>
              <FaSitemap className=" text-3xl text-pink-100 stroke-2" />
              <br></br>
              <span>Income Statement <br></br> Report </span>
            </div>
          </Button>
        )}
        print={passPrintToElectron}
      />

      <ReactToPrint
        content={() => profitAndLost.current}
        trigger={() => (
          <Button radius="xs" color="teal" className=" text-center h-40 w-60 min-w-fit leading-normal" uppercase>
            <div>
              <FaSitemap className=" text-3xl text-pink-100 stroke-2" />
              <br></br>
              <span>Profit And Loss <br></br> Report </span>
            </div>
          </Button>
        )}
        print={passPrintToElectron}
      />
    </div>



    <div className="hidden">

      <div ref={chartOfAccount}>
        <Chart_of_account_report fromDate={fromDate} toDate={toDate} />
      </div>

      <div ref={voucherPayment}>
        <Voucher_payment_report fromDate={fromDate} toDate={toDate} />
      </div>

      <div ref={supplierPayment}>
        <Supplier_payment_report fromDate={fromDate} toDate={toDate} scanSupplierType={scanSupplierType} scanSupplierValue={scanSupplierValue} />
      </div>

      <div ref={balanceSheet}>
        <Balance_sheet_report fromDate={fromDate} toDate={toDate} />
      </div>

      <div ref={incomeStatement}>
        <Income_statement_report fromDate={fromDate} toDate={toDate} />
      </div>

      <div ref={profitAndLost}>
        <Profit_and_lost_report fromDate={fromDate} toDate={toDate} />
      </div>

    </div>
  </>
}