import { Button, Table } from "@mantine/core";
import { useRef, useState } from "react";
import { BaseAPI, HTTP } from "~/repositories/base";
import HeaderInfo from "../HeaderInfo";
import { GiStockpiles } from "react-icons/gi";
import { Delay } from "~/lib/lib";
import ReactToPrint from "react-to-print";

export default function ({ fromDate, toDate, supplier, supplierList, passPrintToElectron }) {
    const [datas, setDatas] = useState([]);
    const [grandTotal, setGrandTotal] = useState({});

    const brandWise = useRef()

    const setDate = async () => {
        try {
            let url = `${BaseAPI}/reports/stock/brand-wise?`;

            if (fromDate) url += `fromDate=${fromDate}&`;
            if (toDate) url += `toDate=${toDate}`;
            if (supplier) {
                url += `&supplier_id=${supplier}`;
            }

            const res = await HTTP.get(url)

            setDatas(res.data.data);

            //calculate grand total
            const total = { total_cost_price: 0, total_mrp_price: 0, stock: 0 }
            for (const value of res.data.data) {
                total.stock += value.stock;
                total.total_cost_price += value.total_cost_price;
                total.total_mrp_price += value.total_mrp_price;
            };
            setGrandTotal(() => total);

        } catch (err) {
            console.log(err);
        }
        await Delay(10);
    }

    return (
        <>
            <ReactToPrint
                onBeforeGetContent={setDate}
                content={() => brandWise.current}
                trigger={() => (
                    <Button radius="xs" color="clew" className=" text-center h-40 w-60 min-w-fit leading-normal" uppercase>
                        <div>
                            <GiStockpiles className=" text-3xl text-pink-100 stroke-2" />
                            <br></br>
                            <span>Group Wise Stock <br></br> Report ( Current )</span>
                        </div>
                    </Button>
                )}
                print={passPrintToElectron}
            />
            <div className=" hidden">
                <div ref={brandWise}>
                    <div style={{ textAlign: 'center' }}>
                        <HeaderInfo title={'Group Wise Stock Report'} />
                        {
                            supplier && <h4>Suppiler Name: {supplierList.find(i => i.value == supplier)?.label}</h4>
                        }
                        <div style={{ position: 'relative', margin: 'auto', minwidth: '70%', borderRadius: '5px', padding: '2px', border: '1px solid #8c8c8c', marginTop: '20px', }}>
                            <table style={{ width: '100%', fontSize: '12px' }} >
                                <thead style={{ backgroundColor: 'black', color: '#EFEFEF' }} >
                                    <tr style={{ fontSize: '13px', textTransform: 'uppercase' }}>
                                        <th style={{ padding: '2px' }}>Group Name</th>
                                        <th style={{ padding: '2px 20px', textAlign: 'right' }}>Quantity</th>
                                        <th style={{ padding: '2px 20px', textAlign: 'right' }}>Total CPU</th>
                                        <th style={{ padding: '2px 20px', textAlign: 'right' }}>Total RPU</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {datas.length > 0 && datas.map((value, index) => (
                                        <tr key={index} style={index % 2 === 0 ? { backgroundColor: "#f8fafc", textAlign: 'right' } : { backgroundColor: "#e2e8f0", textAlign: 'right' }} >
                                            <td style={{ padding: '1px 20px', textAlign: "center" }}>{value.name}</td>
                                            <td style={{ padding: '1px 20px' }}>{value.stock}</td>
                                            <td style={{ padding: '1px 20px' }}>{value.total_cost_price?.toFixed(2)}</td>
                                            <td style={{ padding: '1px 20px' }}>{value.total_mrp_price?.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                    <tr style={{ fontWeight: '600', textAlign: 'right' }}>
                                        <td colSpan={1} style={{ padding: '1px 0', textAlign: "center" }}>Grand Total</td>
                                        <td style={{ padding: '1px 20px' }}>{grandTotal.stock?.toFixed(2)}</td>
                                        <td style={{ padding: '1px 20px' }}>{grandTotal.total_cost_price?.toFixed(2)}</td>
                                        <td style={{ padding: '1px 20px' }}>{grandTotal.total_mrp_price?.toFixed(2)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        {/* total salse amount */}
                        { }
                    </div>

                </div>
            </div>
        </>
    )
}