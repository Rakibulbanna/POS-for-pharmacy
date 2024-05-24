import Receipt from "@/components/pos/receipt";
import { HTTPClient } from "@/lib/http";
import { Setting } from "@/store/setting";
import { Button, Input, Modal, NumberInput, Pagination, Select, Table, Text, TextInput } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useDisclosure, useMergedRef, useResizeObserver } from "@mantine/hooks";
import { IconArrowBarToLeft, IconArrowBarToRight, IconArrowLeft, IconArrowRight, IconGripHorizontal } from "@tabler/icons";
import { Table as ATable, Switch } from "antd";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import React, { useEffect, useRef, useState } from "react";
import { CSVLink } from "react-csv";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import { BaseAPI, HTTP } from "~/repositories/base";
import { ipcRenderer } from "electron";
import usePrint from "~/hooks/usePrint";

export default function Sales() {
  const httpClient = new HTTPClient()

  const [filters, setFilters] = useState({})
  const [groupBy, setGroupBy] = useState<any>("")
  const [details, setDetails] = useState(false)
  const [submitFlag, setSubmitFlag] = useState(false)

  const [sales, setSales] = useState([])
  const [customers, setCustomers] = useState([])

  async function getSales() {
    const [res, err] = await httpClient.GET("/pos-sales")
    if (err) {
      console.log(err);
      return
    }
    setSales(res.data)
  }
  async function getCustomerWiseSales() {
    let query = "?"
    if (filters.customer_id) query += `&customer_id=${filters.customer_id}`
    if (filters.phone_number) query += `&phone_number=${filters.phone_number}`
    if (filters.from_date) query += `&from_date=${filters.from_date}`
    if (filters.to_date) query += `&to_date=${filters.to_date}`

    // const [res, err] = await httpClient.GET("/reports/sales/customer-wise-summery" + query)
    const [res, err] = await httpClient.GET("/reports/sales/customer-wise-details" + query)
    if (err) {
      console.log(err);
      return
    }
    setCustomers(res.data)
  }

  function handleGroupBy(v: string) {
    setGroupBy(v)

    if (!!!v) {
      // set default sales data
      getSales()
    }
    if (v === "customer_wise") {
      // set customer wise data
      getCustomerWiseSales()
    }

  }

  function handleDateChange(date, type) {
    if (date === null) {
      type === "from" ? setFilters(filters => ({ ...filters, from_date: null })) : setFilters(filters => ({ ...filters, to_date: null }))
      return
    }
    type === "from" ? setFilters(filters => ({ ...filters, from_date: new Date(new Date(date).getTime() - 21600000) })) : setFilters(filters => ({ ...filters, to_date: new Date(new Date(date).getTime() + 86399999 - 21600000) }))
  }

  useEffect(() => {
    getSales()
  }, [])


  const handleSubmit = () => {
    if (groupBy == "customer_wise") {
      getCustomerWiseSales()
    }
    else {
      setSubmitFlag(true)
    }
  }

  return (
    <>
      <div className="flex items-center gap-8 mb-8">
        <Text className="w-24">Filter</Text>
        <DatePicker label="From Date" clearable onChange={(v) => handleDateChange(v, "from")} />
        <DatePicker label="To Date" clearable onChange={(v) => handleDateChange(v, "to")} />
        {groupBy === "customer_wise" && <TextInput label="Customer ID" onChange={e => setFilters(filters => ({ ...filters, customer_id: e.target.value }))} />}
        {groupBy === "customer_wise" && <TextInput label="Phone Number" onChange={e => setFilters(filters => ({ ...filters, phone_number: e.target.value }))} />}
        <Button className="self-end" onClick={handleSubmit}>Submit</Button>
      </div>
      <div className="flex items-center gap-8 mb-8">
        <Text className="w-24">Group By</Text>
        <Select data={[{ label: "Customer Wise", value: "customer_wise" }]}
          clearable onChange={handleGroupBy} />
      </div>
      {groupBy === "customer_wise" && <CustomerWiseSales customers={customers} />}

      {!!!groupBy && <>

        <div>
          <div>Invoice wise sales sales</div>
          <div>Show details:  <Switch checked={details} onChange={v => setDetails(v)} /> </div>
        </div>
        {!details ? <InvoiceWiseSalesSummery filters={filters} submitFlag={submitFlag} setSubmitFlag={setSubmitFlag} />
          : <InvoiceWiseSalesDetails />}

      </>}

    </>
  )
}

function InvoiceWiseSalesSummery({ filters, submitFlag, setSubmitFlag }: any) {
  const [sales, setSales] = useState([])
  const [paginateTotal, setPaginateTotal] = useState<number>(0)
  const [count, setCount] = useState<number>(10)

  useEffect(() => {
    if (filters && count && submitFlag) {
      let url = `${BaseAPI}/reports/invoice-wise-sale?offset=0&count=${count}`;
      if (filters.from_date) url += `&from_date=${filters.from_date}`
      if (filters.to_date) url += `&to_date=${filters.to_date}`
      getSales(url);
      let countUrl = `${BaseAPI}/reports/invoice-wise-sale/count?`;
      if (filters.from_date) countUrl += `&from_date=${filters.from_date}`
      if (filters.to_date) countUrl += `&to_date=${filters.to_date}`
      getCount(countUrl);
      setSubmitFlag(false)
    }

  }, [count, submitFlag])

  async function getCount(url: string) {
    try {
      const countRes: any = await HTTP.get(url);
      if (countRes.data?.count) setPaginateTotal(parseInt(countRes?.data?.count / count) + 1)
    }
    catch (err: any) {
      console.log({ err: err.message })
    }
  }

  async function getSales(url: string) {

    try {
      const res = await HTTP.get(url)
      setSales(res.data.data)
    } catch (e) {
      console.log(e)
    }
  }

  function getCASHAmount(sale: any) {
    const cashPay = sale.pos_payments.find((payment: any) => payment.method === 1)
    if (!cashPay) return 0;
    return cashPay.amount
  }
  function getCardAmount(sale: any) {
    let total = 0;
    sale.pos_payments.forEach((payment: any) => {
      if (payment.method === 2 || payment.method === 5) total += payment?.amount;
    })
    return total;
  }
  const getCardName = (sale: any) => {
    let payType: Array<string> = [];

    sale.pos_payments.forEach((payment: any) => {
      if (payment.method === 1) payType.push('CASH');
      if (payment.method === 2) payType.push(payment.via);
      if (payment.method === 3) payType.push('POINT/REDEEM');
      if (payment.method === 4) payType.push('EXCHANGE');
      if (payment.method === 5) payType.push('CREDIT');
    })

    return payType.join(', ');

  }

  const getExchangedProductsAmount = (sale: any) => {
    let amount = 0
    sale.exchanged_products.forEach((ep: any) => {
      const productOnPosSale = sale.products.find((p: any) => p.product_id === ep.product_id)
      if (productOnPosSale) {
        amount += productOnPosSale.sale_amount
      }
    })
    return amount
  }
  const getReturnAmount = (sale: any) => {
    return sale.returns.map((r: any) => r.return_amount).reduce((pv: any, cv: any) => pv + cv, 0)
  }
  const getProfit = (sale: any) => {

    const unReturnedProducts = sale.products.filter((p: any) => {
      const found = sale.returns.find((ret: any) => ret.pos_sale_id === p.pos_sale_id && ret.product_id === p.product_id);
      return !found;
    })

    const filterUnreturnExchange = unReturnedProducts.filter((p: any) => {
      const found = sale.exchanged_products.find((ex: any) => ex.origin_sale_id === p.pos_sale_id && ex.product_id === p.product_id);
      return !found;
    })

    return filterUnreturnExchange.map((p: any) => p.sale_amount - (p.cost_price * p.quantity)).reduce((p: any, c: any) => p + c, 0)
  }

  const total = (sale: any) => {

    const total = {
      quantity: 0,
    }
    sale.products.forEach((product: any) => { total['quantity'] += product.quantity })
    return <>
      <td>{total.quantity}</td>
      <td>{sale.total}</td>
      <td>{sale.discount_amount}</td>
      <td>{sale.vat_amount}</td>
      <td>{sale.total_cost_price}</td>
      <td>{sale.total}</td>
    </>
  }

  const handleChangePage = async (pageNumber: number) => {

    const offset = (pageNumber - 1) * count;

    let url = `${BaseAPI}/reports/invoice-wise-sale?offset=${offset}&count=${count}`;
    getSales(url);

  }

  return (
    <div >
      <div>details</div>
      <table
        style={{ overflow: 'auto', margin: 'auto', width: 'fit-content', fontSize: '12px', textAlign: 'right' }}
      >
        <thead style={{ backgroundColor: '#1f2937', color: '#f9fafb', textAlign: 'center' }}>
          <tr>
            <th style={{ padding: '1px' }}>Invoice No</th>
            <th style={{ padding: '4px 0px' }}>Date</th>
            <th style={{ padding: '1px' }}>Sales Man</th>
            <th style={{ padding: '1px' }}>Customer Name</th>
            <th style={{ padding: '1px' }}>CASH AMT.</th>
            <th style={{ padding: '1px' }}>CARD AMT.</th>
            <th style={{ padding: '1px' }}>CARD Name</th>
            <th style={{ padding: '1px' }}>RET AMT.</th>
            <th style={{ padding: '1px' }}>EX AMT.</th>
            <th style={{ padding: '1px' }}>PROFIT</th>
            <th style={{ padding: '1px' }}>PRINT</th>
          </tr>
        </thead>
        <tbody >
          {
            sales?.map((sale: any, index: number) => (
              sale.products.length > 0 &&
              <tr key={index} style={index % 2 === 0 ? { backgroundColor: '#e5e7eb', } : { backgroundColor: '#e5e7eb' }}>

                <SingleSale
                  key={index}
                  index={index}
                  sale={sale}
                  getCASHAmount={getCASHAmount}
                  getCardAmount={getCardAmount}
                  getReturnAmount={getReturnAmount}
                  getExchangedProductsAmount={getExchangedProductsAmount}
                  getProfit={getProfit}
                  getCardName={getCardName}
                />

              </tr>
            ))
          }

        </tbody>
      </table>
      <div className=" grid grid-cols-2 gap-2 justify-center pt-4">
        <NumberInput value={count} onChange={(e: number) => setCount(e)} min={1} className="w-20 relative left-0 " size="sm" />
        <Pagination
          total={paginateTotal}
          position="right"
          onChange={handleChangePage}
          withEdges
          nextIcon={IconArrowRight}
          previousIcon={IconArrowLeft}
          firstIcon={IconArrowBarToLeft}
          lastIcon={IconArrowBarToRight}
          dotsIcon={IconGripHorizontal}
        />
      </div>

    </div>
  )


}

const paymentMethod = [
  {
    name: 'Cash',
    value: 1
  },
  {
    name: 'Card',
    value: 2
  },
  {
    name: 'point/redeem',
    value: 3
  },
  {
    name: 'exchange',
    value: 4
  },
  {
    name: 'credit',
    value: 5
  }
]
const SingleSale = ({ sale, getCASHAmount, getCardAmount, getReturnAmount, getExchangedProductsAmount, getProfit, getCardName }: any) => {
  const receiptRef = useRef()
  const [posReceiptSizeRef, rect] = useResizeObserver()
  const [setting] = useAtom(Setting)
  const [items, setItems] = useState([]);
  const [print] = usePrint("receipt");
  const margedReceiptRef = useMergedRef(receiptRef, posReceiptSizeRef)
  const [opened, { open, close }] = useDisclosure(false);
  const doPrint = (target: any) => {

    const height = (rect.height * 0.264583333) * 1000
    return new Promise((resolve, reject) => {
      print(target, height).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }

  useEffect(() => {
    function handleData() {
      if (sale.products.length === 0) return;
      const copyTotal = { quantity: 0, price: 0 };
      const updatedData = sale.products.map((item) => {
        //total
        copyTotal.quantity = copyTotal['quantity'] + item.quantity;
        copyTotal.price = copyTotal['price'] + (item.quantity * item.MRP_price);

        //set total value for every item
        return {
          id: item.id,
          name: `${item.product.name} ${item.product.style_size ? item.product.style_size : ''} ${item?.product.color?.name ? item?.product?.color.name : ''}`,
          quantity: item.quantity,
          product_barcode: item.product.product_barcode,
          price: sale.is_wholesale ? item.whole_sale_price : item.MRP_price,
          total: (item.quantity * (sale.is_wholesale ? item.product.whole_sale_price : item.product.MRP_price)) - (item.discount_amount ? item.quantity * item.discount_amount : item.discount_amount),
          discount: item.discount_amount ? item.discount_amount * item.quantity : item.discount_amount
        }
      })
      setItems(updatedData);
    }
    handleData();

  }, [sale.products]);
  return (<React.Fragment>
    {/* <th key={p.id} 
      style={index % 2 === 0 ? { backgroundColor: '#e5e7eb', } : { backgroundColor: '#e5e7eb' }}>
      {pIndex === 0 && <>*/}
    <th style={{ padding: '1px', textAlign: 'center', }}>{sale.id}</th>
    <th style={{ padding: '1px', textAlign: 'center', }}>{dayjs(sale.created_at).format('MM-DD-YYYY hh:mm:ss ')}</th>
    <th style={{ padding: '1px', textAlign: 'center', }}>{sale.user?.first_name || ''}</th>
    <th style={{ padding: '1px', textAlign: 'center', }}>{sale.customer?.first_name || ''}</th>
    <th style={{ padding: '0 1px' }}>{getCASHAmount(sale).toFixed(2)}</th>

    <th style={{ padding: '0 1px' }}>{getCardAmount(sale).toFixed(2)}</th>
    <th style={{ padding: '0 1px' }}>{getCardName(sale)}</th>
    <th style={{ padding: '0 1px' }}>{getReturnAmount(sale)}</th>
    <th style={{ padding: '0 1px' }}>{getExchangedProductsAmount(sale)}</th>
    <th style={{ padding: '0 1px' }}>{getProfit(sale).toFixed(2)}</th>
    <th style={{ padding: '2px 5px' }}>
      <Button onClick={open}>preview</Button>
      {/* <Button size='xs' uppercase onClick={handlePrint}>
        print
      </Button> */}
    </th>


    {/*  </>}
  </th> */}
    <Modal opened={opened} onClose={close}>
      <div className="relative">
        <div className="absolute top-0 right-0">
          <ReactToPrint
            content={() => receiptRef.current}
            trigger={() => (
              <Button size='xs' uppercase >
                print
              </Button>
            )
            }
            print={doPrint}
          />
        </div>
<br />
<br />
        <div ref={margedReceiptRef}  style={{ textAlign: 'center', width: '340px', fontFamily: 'Tahoma', position: 'relative', margin: 'auto', letterSpacing: '0.1rem' }}>
          <div style={{ display: 'flex', padding: '10px', flexDirection: 'column', justifyContent: 'center', fontSize: '12px' }}>
            <div style={{ fontWeight: 'bold', fontSize: `${setting.pos_recipt_company_name_size}px` }}>{setting.company_name}</div>
            <div >{setting.company_address}</div>
            <div style={{ fontSize: `${setting.pos_recipt_phone_number_size}px` }}>Mobile: {setting.company_phone_number}</div>
            {!!setting.vat_number && <div>VAT Number: {setting.vat_number}</div>}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>{new Date(sale?.created_at)?.toLocaleDateString("en-GB")}</div>
              <div>{new Date(sale?.created_at)?.toLocaleTimeString()}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>ShopID: PM01</div>
              <div style={{ fontSize: `${setting.served_by_size}px` }}>ServedBy: {sale?.user?.first_name + " " + sale?.user?.last_name}</div>
            </div>


            {sale.customer &&
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>Cus. Name: {sale.customer?.first_name}</div>
                  <div>Mobile: {sale.customer?.phone_number}</div>
                </div>

              </>
            }
            <div style={{ marginTop: '1px' }} >Invoice: {sale.id}</div>
          </div>

          <table style={{ borderCollapse: 'separate', borderSpacing: '0 10px', borderTop: '1px solid black', fontSize: '12px', width: '100%', textAlign: 'right' }}>
            <thead style={{ borderBottom: '1px solid black', height: '20px', padding: '5px' }}>
              <tr style={{ padding: '5px' }}>
                {/* <th style={{ textAlign: 'left' }}>#</th> */}
                <th style={{ textAlign: 'left', paddingTop: "2px", paddingBottom: "2px" }}>Description</th>
                <th>Price</th>
                <th>QTY</th>
                {
                  // loggedInUser.can_give_discount && 
                  <th>Disc </th>
                }
                <th style={{ paddingLeft: '2px' }}>Amt</th>
              </tr>
            </thead>
            <tbody>
              {items.map((value, index) => {


                return (
                  <>
                    <tr>
                      {/* <td style={{ textAlign: 'left' }}>{index + 1}</td> */}
                      <td style={{ textAlign: 'left' }}>{value.product_barcode}</td>
                      <td>{value?.price?.toFixed(2)}</td>
                      <td>{value?.quantity?.toFixed(3)}</td>
                      {
                        // loggedInUser.can_give_discount && 
                        <td>{Number(value.discount).toFixed(2)}</td>
                      }
                      <td>{value.total.toFixed(2)}</td>
                    </tr>
                    <tr style={{ textAlign: 'left' }}>
                      <td colSpan={'5'} style={{ textTransform: 'uppercase' }} >{value.name} {value.price > 0 ? "" : "(BXGX)"}</td>
                      {/* <td style={{backgroundColor:'plum'}}></td> */}
                    </tr>
                  </>
                )
              }
              )}

              {
                sale?.exchanged_products?.length > 0 &&
                <>
                  <tr>
                    <td style={{ textAlign: "left", fontWeight: '800' }} colSpan={4}>Exchange Products:</td>
                  </tr>
                  {
                    sale?.exchanged_products?.map((value, index) => (
                      <>
                        <tr>
                          {/* <td style={{ textAlign: 'left' }}>{index + 1}</td> */}
                          <td style={{ textAlign: 'left' }}>{value.product_barcode}</td>
                          <td>{value.MRP_price}</td>
                          <td>{value.quantity}</td>
                          <td>{value.MRP_price * value.quantity}</td>
                        </tr>
                        <tr style={{ textAlign: 'left' }}>
                          <td colSpan={'4'} style={{ textTransform: 'uppercase' }} >{value.name} {value.price > 0 ? "" : "(BXGX)"}</td>
                          {/* <td style={{backgroundColor:'plum'}}></td> */}
                        </tr>
                      </>
                    ))
                  }
                </>
              }
            </tbody>
          </table>

          <div style={{ fontSize: '12px', padding: '1px 0', display: 'flex', justifyContent: "space-between", borderTop: '1px solid black', borderBottom: '1px solid black', fontWeight: '600' }}>
            <div>Total</div>
            <div>{sale?.sub_total?.toFixed(2)}</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "space-between", fontSize: '12px', textAlign: 'center', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: "space-between" }}>
              <div>Discount: </div>
              <div>{sale?.discount_amount?.toFixed(2)}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: "space-between" }}>
              <div>VAT:</div>
              <div>{sale?.vat_amount}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: "space-between" }}>
              <div>Exchange Amount: </div>
              <div>{sale?.return_amount ? sale?.return_amount : 0}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: "space-between" }}>
              <div>Less Adjustment:</div>
              <div>0</div>
            </div>
            {/* net amount */}
            <div style={{ borderTop: '1px solid black', fontWeight: '600', display: 'flex', justifyContent: "space-between", fontSize: "12px" }}>
              <div>Net Amount (TK): </div>
              <div>{Math.round(sale?.total).toFixed(2).toLocaleString("en-US")}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: "space-between" }}>
              <div>Pay Type: </div>
              <div>{paymentMethod.find(i => i.value == sale?.pos_payments?.method)?.name}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: "space-between" }}>
              <div>Paid Amount: </div>
              <div>{sale?.paid_amount}</div>
            </div>

            <div style={{ display: 'flex', fontWeight: '500', justifyContent: "space-between" }}>
              <div>Changed Amount:</div>
              <div>{Math.round(sale?.return_amount)}</div>
            </div>
            <div style={{ margin: '10px 0' }}>
              <div style={{ borderTop: '1px solid black', fontSize: `${setting.pos_recipt_note_size}px`, marginTop: "2px" }}>* {setting.invoice_note}. Any Query :{setting.company_phone_number}</div>
              <div style={{ paddingBottom: '1px' }}>Thanks for allowing us to serve you</div>
              {setting.show_point_balance_on_receipt && <div>customer point: {sale?.customer ? sale?.customer?.point + ((setting.point_ratio / 100) * (sale?.sub_total - sale?.discount_amount)) : 0}</div>}

              <div style={{ borderTop: '1px solid black', fontSize: '11px', marginTop: "2px" }}>Software By Elitbuzz Technologies Ltd.</div>
              <div style={{ fontSize: '11px' }}>( 01844 471 520 )</div>
            </div>
          </div>

        </div>
      </div>
    </Modal>


  </React.Fragment>
  )
}

function InvoiceWiseSalesDetails({ }) {
  const [sales, setSales] = useState([])
  const [paginateTotal, setPaginateTotal] = useState<number>(0)
  const [count, setCount] = useState<number>(10)

  useEffect(() => {
    const url = `${BaseAPI}/reports/invoice-wise-sale?offset=0&count=${count}`;
    getSales(url);
    const countUrl = `${BaseAPI}/reports/invoice-wise-sale/count`;
    getCount(countUrl);
  }, [count])

  async function getCount(url: string) {
    try {
      const countRes: any = await HTTP.get(url);
      if (countRes.data?.count) setPaginateTotal(parseInt(countRes.data?.count / count) + 1)
    }
    catch (err) {
      console.log({ err: err.message })
    }
  }

  async function getSales(url: string) {



    // if (fromDate) url += `from_date=${fromDate}&`;
    // if (toDate) url += `to_date=${toDate}&`;
    // if (barcode) url += `barcode=${barcode}`;

    try {
      const res = await HTTP.get(url)

      setSales(res.data.data)

      // setPaginateTotal(countRes.data?.count > 1 ? countRes.data.count / 10 : 0)

      //total cash amount filter
      const filterTotalCASH = res.data.data.reduce((prev, curr) => {
        // console.log(curr.pos_payments[0].amount)
        return curr?.pos_payments[0]?.method === 1 ? prev + curr?.pos_payments[0]?.amount : prev + 0;
      }, 0)
      // setTotalCASHAmount(() => filterTotalCASH)

      //total cash amount filter
      const filterTotalCard = res.data.data.reduce((prev, curr) => {
        // console.log(curr.pos_payments[0].amount)
        return (curr?.pos_payments[0]?.method === 2 || curr?.pos_payments[0]?.method === 5) ? prev + curr?.pos_payments[0]?.amount : prev + 0;
      }, 0)
      // setTotalCardAmount(() => filterTotalCard)
    } catch (e) {
      console.log(e)
    }
  }

  function getCASHAmount(sale) {
    const cashPay = sale.pos_payments.find(payment => payment.method === 1)
    if (!cashPay) return 0;
    return cashPay.amount
  }
  function getCardAmount(sale) {
    let total = 0;
    sale.pos_payments.forEach(payment => {
      if (payment.method === 2 || payment.method === 5) total += payment?.amount;
    })
    return total;
  }
  const getCardName = (sale) => {
    let payType = [];

    sale.pos_payments.forEach(payment => {
      if (payment.method === 1) payType.push('CASH');
      if (payment.method === 2) payType.push(payment.via);
      if (payment.method === 3) payType.push('POINT/REDEEM');
      if (payment.method === 4) payType.push('EXCHANGE');
      if (payment.method === 5) payType.push('CREDIT');
    })

    return payType.join(', ');

  }

  const getExchangedProductsAmount = (sale) => {
    let amount = 0
    sale.exchanged_products.forEach(ep => {
      const productOnPosSale = sale.products.find(p => p.product_id === ep.product_id)
      if (productOnPosSale) {
        amount += productOnPosSale.sale_amount
      }
    })
    return amount
  }
  const getReturnAmount = (sale) => {
    return sale.returns.map(r => r.return_amount).reduce((pv, cv) => pv + cv, 0)
  }
  const getProfit = (sale) => {

    const unReturnedProducts = sale.products.filter(p => {
      const found = sale.returns.find(ret => ret.pos_sale_id === p.pos_sale_id && ret.product_id === p.product_id);
      return !found;
    })

    const filterUnreturnExchange = unReturnedProducts.filter(p => {
      const found = sale.exchanged_products.find(ex => ex.origin_sale_id === p.pos_sale_id && ex.product_id === p.product_id);
      return !found;
    })

    return filterUnreturnExchange.map(p => p.sale_amount - (p.cost_price * p.quantity)).reduce((p, c) => p + c, 0)
  }

  const total = (sale) => {

    const total = {
      quantity: 0,
    }
    sale.products.forEach(product => { total['quantity'] += product.quantity })
    return <>
      <td>{total.quantity}</td>
      <td>{sale.total}</td>
      <td>{sale.discount_amount}</td>
      <td>{sale.vat_amount}</td>
      <td>{sale.total_cost_price}</td>
      <td>{sale.total}</td>
    </>
  }



  const handleChangePage = async (pageNumber: number) => {

    const offset = (pageNumber - 1) * count;

    let url = `${BaseAPI}/reports/invoice-wise-sale?offset=${offset}&count=${count}`;
    getSales(url);

  }

  return (
    <>
      <div>details</div>
      <table style={{ overflow: 'auto', margin: 'auto', width: 'fit-content', fontSize: '12px', textAlign: 'right' }} >
        <thead style={{ backgroundColor: '#1f2937', color: '#f9fafb', textAlign: 'center' }}>
          <tr>
            <th style={{ padding: '1px' }}>Invoice No</th>
            <th style={{ padding: '4px 0px' }}>Date</th>
            <th style={{ padding: '1px' }}>Sales Man</th>
            <th style={{ padding: '1px' }}>Customer Name</th>
            <th style={{ padding: '1px' }}>CASH AMT.</th>
            <th style={{ padding: '1px' }}>CARD AMT.</th>
            <th style={{ padding: '1px' }}>CARD Name</th>
            <th style={{ padding: '1px' }}>RET AMT.</th>
            <th style={{ padding: '1px' }}>EX AMT.</th>
            <th style={{ padding: '1px' }}>PROFIT</th>
            <th style={{ padding: '1px' }}>Barcode</th>
            <th style={{ padding: '1px' }}>Product Name</th>
            <th style={{ padding: '1px' }}>SQTY</th>
            <th style={{ padding: '1px' }}>MRP</th>
            <th style={{ padding: '1px' }}>DIS</th>
            <th style={{ padding: '1px' }}>VAT</th>
            <th style={{ padding: '1px' }}>Total CPU</th>
            <th style={{ padding: '1px' }}>Total MRP</th>
          </tr>
        </thead>
        <tbody >
          {
            sales?.map((sale: any, index: number) => (
              sale.products.length > 0 &&
              <>
                <React.Fragment key={index}>
                  {sale.products?.map((p: any, pIndex: number) => (<tr key={p.id}
                    style={index % 2 === 0 ? { backgroundColor: '#e5e7eb', } : { backgroundColor: '#e5e7eb' }}>
                    {pIndex === 0 && <>
                      <th rowSpan={sale.products.length} style={{ padding: '1px', textAlign: 'center', }}>{sale.id}</th>
                      <th rowSpan={sale.products.length} style={{ padding: '1px', textAlign: 'center', }}>{dayjs(sale.created_at).format('MM-DD-YYYY hh:mm:ss ')}</th>
                      <th rowSpan={sale.products.length} style={{ padding: '1px', textAlign: 'center', }}>{sale.user?.first_name || ''}</th>
                      <th rowSpan={sale.products.length} style={{ padding: '1px', textAlign: 'center', }}>{sale.customer?.first_name || ''}</th>
                      <th rowSpan={sale.products.length} style={{ padding: '0 1px' }}>{getCASHAmount(sale).toFixed(2)}</th>
                      <th rowSpan={sale.products.length} style={{ padding: '0 1px' }}>{getCardAmount(sale).toFixed(2)}</th>
                      <th rowSpan={sale.products.length} style={{ padding: '0 1px' }}>{getCardName(sale)}</th>
                      <th rowSpan={sale.products.length} style={{ padding: '0 1px' }}>{getReturnAmount(sale)}</th>
                      <th rowSpan={sale.products.length} style={{ padding: '0 1px' }}>{getExchangedProductsAmount(sale)}</th>
                      <th rowSpan={sale.products.length} style={{ padding: '0 1px' }}>{getProfit(sale).toFixed(2)}</th>
                    </>}

                    <td>{p.product.product_barcode}</td>
                    <td>{p.product.name}</td>
                    <td>{p.quantity}</td>
                    <td>{p.mrp_price}</td>
                    <td>{p.discount_amount}</td>
                    <td>{p.product.vat_in_percent || 0}</td>
                    <td>{p.cost_price * p.quantity}</td>
                    <td>{p.mrp_price * p.quantity}</td>

                  </tr>)
                  )}
                </React.Fragment>
                <tr style={{ fontWeight: 700 }}>
                  <th colSpan={11} ></th>
                  <th> Total </th>
                  {total(sale)}
                </tr>
              </>
            ))
          }

        </tbody>
      </table>
      <div className=" grid grid-cols-2 gap-2 justify-center pt-4">
        <NumberInput value={count} onChange={(e: number) => setCount(e)} min={1} className="w-20 relative left-0 " size="sm" />
        <Pagination
          total={paginateTotal}
          position="right"
          onChange={handleChangePage}
          withEdges
          nextIcon={IconArrowRight}
          previousIcon={IconArrowLeft}
          firstIcon={IconArrowBarToLeft}
          lastIcon={IconArrowBarToRight}
          dotsIcon={IconGripHorizontal}
        />
      </div>
    </>
  )


}

function CustomerWiseSales({ customers }: any) {
  console.log({ customers });
  const [excelFile, setExcelFile] = useState([])

  useEffect(() => {

    const customData: any = [];
    customers?.map((customer: any) => {

      customData.push({
        'Customer Name': customer.first_name
      });
      customer.pos_sales.forEach((sale: any) => {
        const data = {
          'Invoice No': sale.id,
          Date: sale.created_at,
          'Sales Man': sale.user?.first_name || '',
          'Cash Amount': getCASHAmount(sale),
          'Card Amount': getCardAmount(sale),
          'Card Name': getCardName(sale),
          'Ret Amount': getReturnAmount(sale),
          'Exchange Amount': getExchangedProductsAmount(sale),
          'Profit': getProfit(sale),
        };
        const filterProduct = sale.products.map((product: any) => ({
          'Barcode': product.product.product_barcode,
          'Product Name': product.product.name,
          'SQTY': product.quantity,
          'Discount Amount': product.discount_amount,
          'MRP': product.mrp_price,
        })
        );

        filterProduct[0] = { ...data, ...filterProduct[0] }
        // console.log({filterProduct});
        customData.push(...filterProduct);

      })
    })
    console.log({ customData })
    if (customData) setExcelFile(customData)
  }, [customers])

  console.log({ excelFile })

  const columns = [
    {
      title: "Customer ID",
      dataIndex: "customer_id",
      key: "customer_id"
    },
    {
      title: "Customer Name",
      key: "customer_name",
      render: (text, record, index) => (<><div>{record.first_name} {record.last_name || ""}</div></>)
    },
    {
      title: "Total",
      key: "total",
      render: (text, record, index) => (<><div>{record.total.toFixed(2)}</div></>)
    },
    {
      title: "Discount Amount",
      key: "discount_amount",
      render: (text, record, index) => (<><div>{record.discount_amount.toFixed(2)}</div></>)
    },
    {
      title: "Profit",
      key: "profit",
      render: (text, record, index) => (<><div>{record.profit.toFixed(2)}</div></>)
    },
  ];

  function getCASHAmount(sale: any) {
    const cashPay = sale.pos_payments.find(payment => payment.method === 1)
    if (!cashPay) return 0;
    return cashPay.amount
  }
  function getCardAmount(sale: any) {
    let total = 0;
    sale.pos_payments.forEach(payment => {
      if (payment.method === 2 || payment.method === 5) total += payment?.amount;
    })
    return total;
  }
  const getCardName = (sale: any) => {
    let payType = [];

    sale.pos_payments.forEach(payment => {
      if (payment.method === 1) payType.push('CASH');
      if (payment.method === 2) payType.push(payment.via);
      if (payment.method === 3) payType.push('POINT/REDEEM');
      if (payment.method === 4) payType.push('EXCHANGE');
      if (payment.method === 5) payType.push('CREDIT');
    })

    return payType.join(', ');

  }

  const getExchangedProductsAmount = (sale: any) => {
    let amount = 0
    sale.exchanged_products.forEach(ep => {
      const productOnPosSale = sale.products.find(p => p.product_id === ep.product_id)
      if (productOnPosSale) {
        amount += productOnPosSale.sale_amount
      }
    })
    return amount
  }
  const getReturnAmount = (sale: any) => {
    return sale.returns.map(r => r.return_amount).reduce((pv, cv) => pv + cv, 0)
  }
  const getProfit = (sale: any) => {

    const unReturnedProducts = sale.products.filter(p => {
      const found = sale.returns.find(ret => ret.pos_sale_id === p.pos_sale_id && ret.product_id === p.product_id);
      return !found;
    })

    const filterUnreturnExchange = unReturnedProducts.filter(p => {
      const found = sale.exchanged_products.find(ex => ex.origin_sale_id === p.pos_sale_id && ex.product_id === p.product_id);
      return !found;
    })

    return filterUnreturnExchange.map(p => p.sale_amount - (p.cost_price * p.quantity)).reduce((p, c) => p + c, 0)
  }

  const total = (pos_sales: any) => {
    const initial = { quantity: 0, discount_amount: 0, vat_amount: 0, mrp_price: 0, sub_total: 0 };

    pos_sales.forEach((element: any) => {
      element.products.forEach((product: any) => {
        initial.quantity += product.quantity
        initial.mrp_price += product.mrp_price
        initial.discount_amount += product.discount_amount
        initial.vat_amount += product.vat_amount || 0
      })
      initial.sub_total += element.sub_total
      initial.sub_total += element.sub_total
    });

    return <>
      <td>{initial.quantity}</td>
      <td>{initial.mrp_price}</td>
      <td>{initial.discount_amount}</td>
      {/* <td>{initial.vat_amount}</td> */}
      <td></td>
      <td>{initial.sub_total}</td>
    </>
  }

  // const headers = [
  //   { label: 'First Name', key: 'details.firstName' },
  //   { label: 'Last Name', key: 'details.lastName' },
  //   { label: 'Job', key: 'job' },
  // ];

  // const data = [
  //   {name :'Mehedi Hasan'},
  //   {firstName: 'Ahmed', lastName: 'Tomi' , job: 'manager'},
  //   { firstName: 'John', lastName: 'Jones' , job: 'developer'},
  // ];


  return (
    <>
      <div className="flex justify-end">
        <Button>
          <CSVLink data={excelFile} className="text-white" filename="customer_wise_sales">
            Excel
          </CSVLink>
        </Button>
      </div>

      {/* <ATable columns={columns} dataSource={customers} /> */}
      <>
        <div>details</div>
        <table style={{ overflow: 'auto', margin: 'auto', width: 'fit-content', fontSize: '12px', textAlign: 'right' }} >
          <thead style={{ backgroundColor: '#1f2937', color: '#f9fafb', textAlign: 'center' }}>
            <tr>
              <th style={{ padding: '1px' }}>Invoice No</th>
              <th style={{ padding: '4px 0px' }}>Date</th>
              <th style={{ padding: '1px' }}>Sales Man</th>
              <th style={{ padding: '1px' }}>CASH AMT.</th>
              <th style={{ padding: '1px' }}>CARD AMT.</th>
              <th style={{ padding: '1px' }}>CARD Name</th>
              <th style={{ padding: '1px' }}>RET AMT.</th>
              <th style={{ padding: '1px' }}>EX AMT.</th>
              <th style={{ padding: '1px' }}>PROFIT</th>
              <th style={{ padding: '1px' }}>Barcode</th>
              <th style={{ padding: '1px' }}>Product Name</th>
              <th style={{ padding: '1px' }}>SQTY</th>
              <th style={{ padding: '1px' }}>MRP</th>
              <th style={{ padding: '1px' }}>DIS</th>
              <th style={{ padding: '1px' }}>VAT</th>
              <th style={{ padding: '1px' }}>Total MRP</th>
            </tr>
          </thead>
          <tbody >
            {
              customers?.map((customer: any, index: number) => (
                <React.Fragment key={index}>
                  <tr>
                    <th colSpan={16} style={{ textAlign: "left" }}>Customer Name: {customer.first_name}</th>
                    {/* <th colSpan={8}>Created At: {dayjs(customer.created_at).format('MM-DD-YYYY hh:mm:ss ')}</th> */}
                  </tr>
                  {customer.pos_sales?.map((sale: any) => (
                    <>

                      <React.Fragment key={index}>
                        {sale.products?.map((p: any, pIndex: number) => (<tr key={p.id}
                          style={index % 2 === 0 ? { backgroundColor: '#e5e7eb', } : { backgroundColor: '#e5e7eb' }}>
                          {pIndex === 0 && <>
                            <th rowSpan={sale.products.length} style={{ padding: '1px', textAlign: 'center', }}>{sale.id}</th>
                            <th rowSpan={sale.products.length} style={{ padding: '1px', textAlign: 'center', }}>{dayjs(sale.created_at).format('MM-DD-YYYY hh:mm:ss ')}</th>
                            <th rowSpan={sale.products.length} style={{ padding: '1px', textAlign: 'center', }}>{sale.user?.first_name || ''}</th>
                            <th rowSpan={sale.products.length} style={{ padding: '0 1px' }}>{getCASHAmount(sale).toFixed(2)}</th>
                            <th rowSpan={sale.products.length} style={{ padding: '0 1px' }}>{getCardAmount(sale).toFixed(2)}</th>
                            <th rowSpan={sale.products.length} style={{ padding: '0 1px' }}>{getCardName(sale)}</th>
                            <th rowSpan={sale.products.length} style={{ padding: '0 1px' }}>{getReturnAmount(sale)}</th>
                            <th rowSpan={sale.products.length} style={{ padding: '0 1px' }}>{getExchangedProductsAmount(sale)}</th>
                            <th rowSpan={sale.products.length} style={{ padding: '0 1px' }}>{getProfit(sale).toFixed(2)}</th>
                          </>}

                          <td>{p.product?.product_barcode}</td>
                          <td>{p.product.name}</td>
                          <td>{p.quantity}</td>
                          <td>{p.mrp_price}</td>
                          <td>{p.discount_amount}</td>
                          <td>{p.product.vat_in_percent || 0}</td>
                          <td>{p.mrp_price * p.quantity}</td>

                        </tr>)
                        )}
                      </React.Fragment>

                    </>


                  ))}
                  <tr style={{ fontWeight: 700 }}>
                    <th colSpan={10} ></th>
                    <th> Total </th>
                    {total(customer.pos_sales)}
                  </tr>
                </React.Fragment>
              )
              )
            }

            {/* GRAND TOTAL */}
            {/* <tr style={{background:'lightgray'}}>
              <th colSpan={4}>Grand Total:</th>
              <th style={{ padding: '0 1px' }}> {totalCASHAmount.toFixed(2)}</th>
              <th style={{ padding: '0 1px' }}> {totalCardAmount.toFixed(2)}</th>
              <th></th>
              <th>{sales.map(s => getReturnAmount(s)).reduce((pv, cv) => pv + cv, 0)}</th>
              <th>{sales.map(s => getExchangedProductsAmount(s)).reduce((pv, cv) => pv + cv, 0).toFixed(2)}</th>
              <th style={{ padding: '0 1px' }}>{getGrandProfit().toFixed(2)}</th>
              <th></th>
              <th></th>
              <th style={{ padding: '0 1px' }}>{grandTotalQuantity}</th>
              <th style={{ padding: '0 1px' }}>{sales.reduce((prev, curr) => prev + curr.sub_total, 0).toFixed(2)}</th>
              <th style={{ padding: '0 1px' }}>{sales.reduce((prev, curr) => prev + curr.discount_amount, 0).toFixed(2)}</th>
              <th style={{ padding: '0 1px' }}>{sales.reduce((prev, curr) => prev + curr.vat_amount, 0).toFixed(2)}</th> */}
            {/* <th style={{ padding: '0 1px' }}> {getGrandRoundingAmount.toFixed(2)}</th> */}
            {/* <th style={{ padding: '0 1px' }}>{getGrandTotalCPU()}</th>
              <th style={{ padding: '0 1px' }}>{getGrandTotalRPU()}</th>
          </tr> */}
          </tbody>
        </table>
      </>
    </>
  )
}

