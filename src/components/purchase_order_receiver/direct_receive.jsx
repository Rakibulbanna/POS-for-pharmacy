import { ActionIcon, Button, Input, Menu, NumberInput, Table, TextInput } from "@mantine/core";
import { BaseAPI, HTTP } from "~/repositories/base";
import emptyImages from "../../images/empty-product.svg";
import purchaseOrder from "~/src/images/purchase-order.svg";
import { useEffect, useRef, useState } from "react";
import EmptyNotification from "@/utility/emptyNotification";
import DirectPDF from "../purchase_receive/direct_pdf";
import { useAtom } from "jotai";
import { WorkingDirectReceiveAdditionalCost, WorkingDirectReceiveItems } from "@/store/purchase";
import { useReactToPrint } from "react-to-print";
import usePrint from "~/hooks/usePrint"
import DirectScanner from "@/components/purchase_receive/direct_scanner";
import { IconChevronUp } from "@tabler/icons";
import { useMergedRef, useResizeObserver } from "@mantine/hooks";
import moment from "moment";


export default function ({ supplierID }) {
  const { Target, Dropdown, Item } = Menu;

  const [discount, setDiscount] = useState(0)
  const [supplier, setSupplier] = useState({})
  const [scanProduct, setScanProduct] = useState(null);
  const [totalProduct, setTotalProduct] = useState([]);

  const [costPrice, setCostPrice] = useState(0)
  const [mrpPrice, setMrpPrice] = useState(0)
  const [receivedQuantity, setReceivedQuantity] = useState(0)
  const [bonusQuantity, setBonusQuantity] = useState(0)
  const [wholesalePrice, setWholesalePrice] = useState(0)

  const [productExpiryDate, setProductExpiryDate] = useState();
  const [batchExpiryDate, setBatchExpiryDate] = useState();
  const [batchNo, setBatchNo] = useState();

  const [additionalCost, setAdditionalCost] = useState(0)

  const [workingDirectReceiveItems, setWorkingDirectReceiveItems] = useAtom(WorkingDirectReceiveItems)
  const [workingDirectReceiveAdditionalCost, setWorkingDirectReceiveAdditionalCost] = useAtom(WorkingDirectReceiveAdditionalCost)

  const scanProductRef = useRef();
  const directPDFRef = useRef();

  const [posReceiptSizeRef, rect] = useResizeObserver();
  const purchaseOrdersPrintComponent = useMergedRef(directPDFRef, posReceiptSizeRef)
  const [rePrintData, setRePrintData] = useState("");



  const [print] = usePrint();

  const doPrint = (target) => {
    setRePrintData(target)

    const height = (rect.height * 0.264583333) * 1000;
    return new Promise((resolve, reject) => {
      print(target, height).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }

  const handlePrint = useReactToPrint({
    content: () => directPDFRef.current,
    print: doPrint
  });

  const handleRePrint = () => {
    doPrint(rePrintData)
  }

  useEffect(() => {
    if (supplierID) {
      HTTP.get(`${BaseAPI}/supplier/${supplierID}`).then(res => {
        setSupplier(res.data.data)
      }).catch(err => {
        console.log(err);
      })
    }
  }, [supplierID]);


  useEffect(() => {
    setWorkingDirectReceiveItems(() => [])
  }, [])


  const handleReceive = () => {
    console.log({supplierID})
    const due = totalProduct.reduce((prev, curr) => prev + (curr.cost_price * curr.received_quantity), 0);
    // console.log({due});
    // make a http call with this values
    HTTP.post(`${BaseAPI}/purchase_order/direct-receive`, { product_on_purchase_order_list: totalProduct, supplier_id: supplierID, additional_cost: additionalCost, due, discount }).then(res => {
      setTotalProduct([]);
      setAdditionalCost(0);


      handlePrint();

      setTimeout(() => {
        setWorkingDirectReceiveItems([])
        setWorkingDirectReceiveAdditionalCost(0)
        setDiscount(0)

      }, 500);
    }).catch(err => {

    })
  }

  // this will execute whenever you want to scan a new product either by on change rapidly or on submit by key enter press

  const handleProductScan = (product) => {
    setScanProduct(() => product);
    setCostPrice(() => product.cost_price);
    setMrpPrice(() => product.MRP_price ? product.MRP_price : 0);
    setReceivedQuantity(() => product.received_quantity ? product.received_quantity : 0);
    setBonusQuantity(() => product.bonus_quantity ? product.bonus_quantity : 0);
    setWholesalePrice(() => product.whole_sale_price ? product.whole_sale_price : 0);
  }

  const handleAddUpdateProductValue = () => {

    // this will store the working information to atom
    const found = workingDirectReceiveItems.find(item => item.product_id === scanProduct.id)


    if (!found) {
      setWorkingDirectReceiveItems([...workingDirectReceiveItems, {
        product_id: scanProduct.id,
        product_name: scanProduct.name,
        cpu: costPrice,
        rpu: mrpPrice,
        receive_quantity: receivedQuantity,
        bonus_quantity: bonusQuantity,
        wholesale_price: wholesalePrice,
        product_expiry_date: productExpiryDate,
        batch_expiry_date: batchExpiryDate,
        batch_no: batchNo,
        style_size: scanProduct.style_size,
      }])
    }


    if (totalProduct.length > 0) {

      const foundProd = totalProduct.find(prod => prod.id === scanProduct.id)
      const obj = {
        id: scanProduct.id,
        name: scanProduct.name,
        style_size: scanProduct.style_size,
        cost_price: costPrice,
        MRP_price: mrpPrice,
        received_quantity: receivedQuantity,
        bonus_quantity: bonusQuantity,
        whole_sale_price: wholesalePrice,
        product_expiry_date: productExpiryDate,
        batch_expiry_date: batchExpiryDate,
        batch_no: batchNo
      }

      if (foundProd) {
        const updateTotalProducts = totalProduct.map((item) => {

          if (item.id !== scanProduct.id) return ({ ...item });

          else return ({
            ...item,
            cost_price: costPrice,
            MRP_price: mrpPrice,
            received_quantity: item.received_quantity + receivedQuantity,
            bonus_quantity: item.bonus_quantity + bonusQuantity,
            whole_sale_price: item.whole_sale_price + wholesalePrice,
          });

        })

        setTotalProduct(() => updateTotalProducts)
      }

      else setTotalProduct([...totalProduct, { ...obj }]);

    }
    else {

      // copyTotalPrice
      setTotalProduct(() => [
        {
          id: scanProduct.id,
          name: scanProduct.name,
          style_size: scanProduct.style_size,
          cost_price: costPrice,
          MRP_price: mrpPrice,
          received_quantity: receivedQuantity,
          bonus_quantity: bonusQuantity,
          whole_sale_price: wholesalePrice,
          product_expiry_date: productExpiryDate,
          batch_expiry_date: batchExpiryDate,
          batch_no: batchNo
        }
      ])
    }

    //set all input value default
    setScanProduct(() => 0);
    setCostPrice(() => 0);
    setMrpPrice(() => 0);
    setReceivedQuantity(() => 0);
    setBonusQuantity(() => 0);
    setWholesalePrice(() => 0);
    setBatchNo(() => '');

    //set scan bar default value
    if (scanProductRef.current?.value) scanProductRef.current.value = '';
  }

  const reset = () => {
    setScanProduct(() => 0);
    setCostPrice(() => 0);
    setMrpPrice(() => 0);
    setReceivedQuantity(() => 0);
    setBonusQuantity(() => 0);
    setWholesalePrice(() => 0);
    setDiscount(0)
  }

  //remove item from total products
  const handleRemoveproduct = (id) => {
    setTotalProduct((value) => value.filter((item) => item.id !== id));
    setWorkingDirectReceiveItems((value) => value.filter((item) => item.product_id !== id))
  }

  const updateAdditionalCost = (v) => {
    setWorkingDirectReceiveAdditionalCost(v)
    setAdditionalCost(v)
  }


  return (
    <>
      <div className="flex flex-col justify-between gap-4 p-1 mb-2 rounded-sm" style={{ border: '1px solid #ededed' }}>
        <div className="flex ">
          <div className="my-1 p-1 font-semibold text-xl w-1/6">
            {/*<div className="text-slate-700 text-sm font-semibold pb-1">Product Barcode:</div>*/}
            <DirectScanner supplierID={supplierID} onProduct={handleProductScan} onClear={reset} />
            {/*<Input disabled={!!!supplierID} ref={scanProductRef} size="md" className=" border-sky-600" placeholder={"Scan product"} onChange={handleProductScan} />*/}
          </div>
          <div className="flex p-2 text-xs font-semibold justify-between gap-2 w-5/6">
            <div className="bg-slate-100 w-full relative top-2 text-center flex flex-col justify-center">Name: {scanProduct?.name}</div>
            <div className="bg-slate-100 w-full relative top-2 text-center flex flex-col justify-center">Stock: {scanProduct?.stock}</div>
            <div className="bg-slate-100 w-full relative top-2 text-center flex flex-col justify-center">Category: {scanProduct?.category?.name}</div>
            <div className="bg-slate-100 w-full relative top-2 text-center flex flex-col justify-center">Color: {scanProduct?.color?.name}</div>
            <div className="bg-slate-100 w-full relative top-2 text-center flex flex-col justify-center">Style/Size: {scanProduct?.style_size}</div>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2" >
          <NumberInput disabled={!!!scanProduct} precision={2} label="CPU" value={costPrice} onChange={(value) => setCostPrice(value)} />
          <NumberInput disabled={!!!scanProduct} precision={2} label="RPU" value={mrpPrice} onChange={(value) => setMrpPrice(value)} />
          <NumberInput disabled={!!!scanProduct} precision={2} label="Received Quantity" value={receivedQuantity} onChange={(value) => setReceivedQuantity(value)} />
          <NumberInput disabled={!!!scanProduct} precision={2} label="Bonus Quantity" value={bonusQuantity} onChange={(value) => setBonusQuantity(value)} />
          <NumberInput disabled={!!!scanProduct} precision={2} label="Wholesale Price" value={wholesalePrice} onChange={(value) => setWholesalePrice(value)} />

        </div>

        <div className="grid grid-cols-5 gap-2">
          <div>
            <lebel className="font-medium">Product Expiry Date</lebel>
            <Input type="date" label="" value={productExpiryDate} onChange={v => setProductExpiryDate(v.target.value)} />
          </div>
          <div>
            <lebel className="font-medium">Batch Expiry Date</lebel>
            <Input type="date" label="" value={batchExpiryDate} onChange={v => setBatchExpiryDate(v.target.value)} />
          </div>
          <div>
            <lebel className="font-medium">Batch No</lebel>
            <Input type="number" label="" value={batchNo} onChange={v => setBatchNo(v.target.value)} />
          </div>
          <Button className="col-span-2 w-full mt-[21px]" disabled={!!!scanProduct || !receivedQuantity} onClick={handleAddUpdateProductValue} size="sm">ADD</Button>
        </div>
      </div>

      <div className="h-[calc(100vh-450px)] overflow-auto" style={{ border: '1px solid #ededed' }}>
        <table className="w-full text-sm text-left text-gray-500 ">
          <thead className="text-xs uppercase bg-gray-600 text-gray-200 sticky top-0 left-0 z-10">
            <tr>
              <th scope="col" className="p-2">Id</th>
              <th scope="col" className="p-2">Group</th>
              <th scope="col" className="p-2">Product Name</th>
              <th scope="col" className="p-2">CPU</th>
              <th scope="col" className="p-2">RPU</th>
              <th scope="col" className="p-2">Receive Quantity</th>
              <th scope="col" className="p-2">Bonus Quantity</th>
              <th scope="col" className="p-2">Wholesale Price(TK)</th>
              <th scope="col" className="p-2">Product Expiry Date</th>
              <th scope="col" className="p-2">Batch Expiry Date</th>
              <th scope="col" className="p-2">Action</th>
            </tr>
          </thead>
          <tbody >
            {totalProduct.length > 0 && totalProduct.map((item, index) => {

              return (
                <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-300'} border-b border-gray-700 hover:bg-slate-200 duration-150`}>
                  <th scope="row" className="pl-2 font-medium text-gray-900 whitespace-nowrap">
                    {item.id}
                  </th>
                  <td className="pl-2 px-6">{`${item.brand?.name || ''}`}</td>
                  <td className="pl-2 px-6  w-52">{item.name + `${item.style_size ? ', ' + item.style_size : ''}`}</td>
                  <td className="pl-2 ">{item.cost_price}</td>
                  <td className="pl-2 ">{item.MRP_price}</td>
                  <td className="pl-2 w-20">{item.received_quantity}</td>
                  <td className="pl-2 w-20">{item.bonus_quantity}</td>
                  <td className="pl-2 w-20">{item.whole_sale_price}</td>
                  <td className="pl-2 w-32">{item.product_expiry_date && moment(item.product_expiry_date).format('DD-MM-YYYY')}</td>
                  <td className="pl-2 w-32">{item.batch_expiry_date && moment(item.batch_expiry_date).format('DD-MM-YYYY')}</td>
                  <td className="pl-2 w-20"><Button color="yellow" size="xs" onClick={() => handleRemoveproduct(item.id)}>Remove</Button></td>
                </tr>
              )
            })

            }
          </tbody>
        </table>
        {
          totalProduct.length === 0 &&
          <div className=" pt-10 p-10 w-full flex justify-center flex-col text-center">
            <div className="bg-sky-100 pt-6 pb-5 px-6 mx-auto border border-gray-500 rounded-full ">
              <img className=" h-10 fill-gray-400 " src={purchaseOrder} />
            </div>
            <div className="pt-6 font-semibold text-base text-gray-400">Sorry! No Products found</div>
            <div className="p-2-semibold text-base text-gray-500">Please scan valid products barcode</div>
          </div>
        }
      </div>


      <div className="flex gap-16 justify-end">
        <div>Total Cost Value: {totalProduct.map(prod=>prod.cost_price * prod.received_quantity).reduce((pv,cv) => pv+cv,0) + additionalCost - discount}</div>
        <div className={'flex'}>
          <div>Discount:</div>
          <NumberInput value={discount} onChange={setDiscount}/>
        </div>
        <div className="flex">
          <div>Additional Cost:</div>
          <NumberInput value={additionalCost} onChange={v => updateAdditionalCost(v)} />
        </div>

      </div>


      <div className="flex absolute right-10 bottom-4" >
        <Button disabled={totalProduct.length === 0} size="md" onClick={handleReceive}>Receive</Button>
        <Menu>
          <Target><ActionIcon variant={"filled"} className={"h-full"}><IconChevronUp /></ActionIcon></Target>
          <Dropdown>
            <Item>
              <Button onClick={handleRePrint}>Re Print</Button>
            </Item>
          </Dropdown>
        </Menu>
      </div>

      <div className="hidden">
        <div ref={directPDFRef}>
          <DirectPDF supplierName={supplier.first_name + " " + supplier.last_name} companyName={supplier.company_name} />
        </div>
      </div>
    </>
  )
}
