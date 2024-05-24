import Summary from "@/components/reports/purchase/summary"
import { Button, Select, Switch } from "@mantine/core";
import { ipcRenderer } from "electron";
import { useRef, useState, useEffect } from "react";
import ReactToPrint from "react-to-print";
import PurchaseOrderDetailsReport from "@/components/reports/purchase-order-details-report";
import ReportFilter from "@/components/reports/filter";
import PurchaseOrderSummaryReport from "@/components/reports/purchase-order-summary-report";
import Purchases_orders_details_reports from "@/components/reports/purchase/purchases_orders_details_reports";
import Purchases_return_summary from "@/components/reports/purchase/purchases_return_summary";
import Purchases_return_details from "@/components/reports/purchase/purchases_return_details";
import Category_wise_purchase_reports from "@/components/reports/purchase/category_wise_purchase_reports";
import { FaSitemap } from 'react-icons/fa';
import { BaseAPI, HTTP } from "~/repositories/base";

export default function () {

    const summaryReceived = useRef();
    const summary = useRef();
    const purchaseOrderDetailsReceivedReport = useRef();
    const purchaseOrderDetailsReport = useRef();

    const purchasesOrderSummary = useRef();
    const purchasesOrderDetails = useRef();
    const purchasesReceiveSummary = useRef();
    const purchasesReceiveDetails = useRef();
    const purchasesReturnSummary = useRef();
    const purchasesReturnDetails = useRef();
    const categoryWisePurchase = useRef();

    const [fromDate, setFromDate] = useState(null)
    const [toDate, setToDate] = useState(null)

    const [supplier, setSupplier] = useState(null);
    const [supplierList, setSupplierList] = useState([]);

    // const [category, setCategory] = useState(null);
    // const [categoryList, setCategoryList] = useState([]);


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
    }, [])
    return (
        <>
            <div className="mb-4">
                <ReportFilter onFromDate={v => setFromDate(v)} onToDate={v => setToDate(v)} />

                <h4>Select supplier</h4>
                <Select
                    className="mr-96"
                    searchable
                    clearable
                    value={supplier}
                    onChange={(e) => {
                        setSupplier(e)
                    }}
                    data={supplierList}
                />
            </div>

            <div className="flex gap-4 flex-wrap">
                <ReactToPrint
                    content={() => summary.current}
                    trigger={() => (
                        <Button radius="xs" color="grape" className=" text-center h-40 w-64 min-w-fit leading-normal" uppercase>
                            <div>
                                <FaSitemap className=" text-3xl text-pink-100 stroke-2" />
                                <br></br>
                                <span>Purchase Order Summary <br></br> Reports</span>
                            </div>
                        </Button>
                    )}
                    print={passPrintToElectron}
                />
                <ReactToPrint
                    content={() => purchaseOrderDetailsReport.current}
                    trigger={() => (
                        <Button radius="xs" color="green" className=" text-center h-40 w-64 min-w-fit leading-normal" uppercase>
                            <div>
                                <FaSitemap className=" text-3xl text-pink-100 stroke-2" />
                                <br></br>
                                <span>Purchase Order Details <br></br> Reports</span>
                            </div>
                        </Button>
                    )}
                    print={passPrintToElectron}
                />

                <ReactToPrint
                    content={() => summaryReceived.current}
                    trigger={() => (
                        <Button radius="xs" color="blue" className=" text-center h-40 w-64 min-w-fit leading-normal" uppercase>
                            <div>
                                <FaSitemap className=" text-3xl text-pink-100 stroke-2" />
                                <br></br>
                                <span>Purchase Received Summary<br></br> Reports</span>
                            </div>
                        </Button>
                    )}
                    print={passPrintToElectron}
                />
                <ReactToPrint
                    content={() => purchaseOrderDetailsReceivedReport.current}
                    trigger={() => (
                        <Button radius="xs" color="cyan" className=" text-center h-40 w-64 min-w-fit leading-normal" uppercase>
                            <div>
                                <FaSitemap className=" text-3xl text-pink-100 stroke-2" />
                                <br></br>
                                <span>Purchase Received Details <br></br> Reports</span>
                            </div>
                        </Button>
                    )}
                    print={passPrintToElectron}
                />
                {/* <ReactToPrint
                    content={() => purchasesOrderSummary.current}
                    trigger={() => <Button fullWidth radius="xs" my="sm" size="md" uppercase>Purchases Order Summary Reports</Button>}
                    print={passPrintToElectron}
                />
                <ReactToPrint
                    content={() => purchasesOrderDetails.current}
                    trigger={() => <Button fullWidth radius="xs" my="sm" size="md" uppercase>Purchases Order Details Reports</Button>}
                    print={passPrintToElectron}
                />
                <ReactToPrint
                    content={() => purchasesReceiveSummary.current}
                    trigger={() => <Button fullWidth radius="xs" my="sm" size="md" uppercase>Purchases Received Summary Reports</Button>}
                    print={passPrintToElectron}
                />
                <ReactToPrint
                    content={() => purchasesReceiveDetails.current}
                    trigger={() => <Button fullWidth radius="xs" my="sm" size="md" uppercase>Purchases Received Details Reports</Button>}
                    print={passPrintToElectron}
                /> */}
                <ReactToPrint
                    content={() => purchasesReturnSummary.current}
                    trigger={() => (
                        <Button radius="xs" color="indigo" className=" text-center h-40 w-64 min-w-fit leading-normal" uppercase>
                            <div>
                                <FaSitemap className=" text-3xl text-pink-100 stroke-2" />
                                <br></br>
                                <span>Purchases Return Summary <br></br> Reports</span>
                            </div>
                        </Button>
                    )}
                    print={passPrintToElectron}
                />
                <ReactToPrint
                    content={() => purchasesReturnDetails.current}
                    trigger={() => (
                        <Button radius="xs" color="lime" className=" text-center h-40 w-64 min-w-fit leading-normal" uppercase>
                            <div>
                                <FaSitemap className=" text-3xl text-pink-100 stroke-2" />
                                <br></br>
                                <span>Purchases Return Details <br></br> Reports</span>
                            </div>
                        </Button>
                    )}
                    print={passPrintToElectron}
                />
                <ReactToPrint
                    content={() => categoryWisePurchase.current}
                    trigger={() => (
                        <Button radius="xs" color="green" className=" text-center h-40 w-64 min-w-fit leading-normal" uppercase>
                            <div>
                                <FaSitemap className=" text-3xl text-pink-100 stroke-2" />
                                <br></br>
                                <span>Category wise Purchases <br></br> Reports</span>
                            </div>
                        </Button>
                    )}
                    print={passPrintToElectron}
                />
            </div>

            <div className="hidden">
                <div ref={summary}>
                    <Summary fromDate={fromDate} toDate={toDate} isReceived={false}
                        supplier={supplier}
                    //category={category}
                    />
                </div>

                <div ref={summaryReceived}>
                    <Summary fromDate={fromDate} toDate={toDate} isReceived={true}
                        supplier={supplier}
                    //category={category}
                    />
                </div>

                <div ref={purchaseOrderDetailsReceivedReport}>
                    <PurchaseOrderDetailsReport fromDate={fromDate} toDate={toDate} isReceived={true}
                        supplier={supplier}
                    // category={category}
                    />
                </div>
                <div ref={purchaseOrderDetailsReport}>
                    <PurchaseOrderDetailsReport fromDate={fromDate} toDate={toDate} isReceived={false}
                        supplier={supplier}
                    // category={category} 
                    />
                </div>

                {/* <div ref={purchasesOrderSummary}>
                    <PurchaseOrderSummaryReport />
                </div>
                <div ref={purchasesOrderDetails}>
                    <Purchases_orders_details_reports />
                </div>
                <div ref={purchasesReceiveSummary}>
                    <PurchaseOrderDetailsReport fromDate={fromDate} toDate={toDate} isReceived={false} />
                </div>
                <div ref={purchasesReceiveDetails}>
                    <PurchaseOrderDetailsReport fromDate={fromDate} toDate={toDate} isReceived={false} />
                </div> */}
                <div ref={purchasesReturnSummary} >
                    <Purchases_return_summary
                        supplierList={supplierList}
                        supplier={supplier}
                        fromDate={fromDate} toDate={toDate} />
                </div>
                <div ref={purchasesReturnDetails}>
                    <Purchases_return_details
                        supplierList={supplierList}
                        supplier={supplier}
                        fromDate={fromDate} toDate={toDate} />
                </div>
                <div ref={categoryWisePurchase}>
                    <Category_wise_purchase_reports
                        supplierList={supplierList}
                        supplier={supplier}
                        fromDate={fromDate} toDate={toDate} />
                </div>
            </div>
        </>
    )
}


