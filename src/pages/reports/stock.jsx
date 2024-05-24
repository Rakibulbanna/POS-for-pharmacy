import ReactToPrint from "react-to-print"
import ItemWiseStockReport from "@/components/reports/item-wise-stock-report";
import PeriodicalStockReport from "@/components/reports/periodical-stock-report";
import { ipcRenderer } from "electron";
import { useRef, useState, useEffect } from "react";
import { Button, Input, Select } from "@mantine/core";
import CategoryWise from "@/components/reports/stock/CategoryWise";
import BrandWise from "@/components/reports/stock/BrandWise";
import { AiOutlineStock } from 'react-icons/ai';
import { GiStockpiles } from 'react-icons/gi';
import { FaSitemap } from 'react-icons/fa';
import ReportFilter from "@/components/reports/filter";
import { BaseAPI, HTTP } from "~/repositories/base";

const StockReport = () => {
    const [fromDate, setFromDate] = useState(null)
    const [toDate, setToDate] = useState(null)
    const [productBarcode, setProductBarcode] = useState(null);
    const itemWiseStockReport = useRef();
    const periodicalStockReport = useRef();



    const [supplier, setSupplier] = useState(null);
    const [supplierList, setSupplierList] = useState([]);
    const [setting, setSetting] = useState({})

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

    useEffect(() => {
        HTTP.get(`${BaseAPI}/suppliers`)
            .then((res) => {
                setSupplierList(res.data.data.map(i => {
                    return {
                        value: i.id,
                        label: i.company_name
                    }
                }))
            })
            .catch(err => console.log(err))

        HTTP.get(`${BaseAPI}/settings`).then(res => {
            setSetting(res.data.data);
        })
    }, [])

    return (
        <>
            {/* <ReportFilter onFromDate={v => setFromDate(v)} onToDate={v => setToDate(v)} /> */}
            <h4>Select supplier</h4>
            <Select
                className="mr-96"
                searchable
                clearable
                value={supplier}
                onChange={(e) => {
                    console.log(e)
                    setSupplier(e)
                }}
                data={supplierList}
            />
            <div className="col-start-3 col-end-4 flex flex-col gap-1">

                <div className="py-1">Stock Report:</div>

                <div className="flex gap-4">
                    <CategoryWise
                        passPrintToElectron={passPrintToElectron}
                        fromDate={fromDate} toDate={toDate}
                        supplier={supplier}
                        supplierList={supplierList}
                    />
                    <BrandWise fromDate={fromDate} toDate={toDate}
                        supplier={supplier}
                        supplierList={supplierList}
                        passPrintToElectron={passPrintToElectron}
                    />
                    {/* <ReactToPrint
                    content={() => periodicalStockReport.current}
                    trigger={() => <Button variant="light" radius="xs" size="xs" uppercase>Periodical Stock Report</Button>}
                    print={passPrintToElectron}
                /> */}
                </div>
                <div>
                    <lebel className>Single Item Wise</lebel>
                    <Input className="mr-96" onChange={(e) => setProductBarcode(e.target.value)} placeholder="scan barcode" /><br />
                    <ItemWiseStockReport
                        fromDate={fromDate} toDate={toDate}
                        productBarcode={productBarcode}
                        setting={setting}
                        supplier={supplier}
                        supplierList={supplierList}
                    />

                </div>
            </div>

            <div className="hidden">
                {/* <div ref={periodicalStockReport}>
                    <PeriodicalStockReport />
                </div> */}
            </div>

        </>
    )
}

export default StockReport