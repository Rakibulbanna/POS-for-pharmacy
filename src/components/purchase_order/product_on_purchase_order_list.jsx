import { ActionIcon, Group, Input, Menu, NumberInput, Table } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Button } from "@mantine/core";
import { BaseAPI, HTTP } from "~/repositories/base";
import { useNotification } from "~/hooks/useNotification"
import { useRef, useState, useEffect } from "react";
import Purchase_order_receive_pdf from "./purchase_order_receive_pdf";
import { useReactToPrint } from "react-to-print";
import usePrint from "~/hooks/usePrint";
import { useMergedRef, useResizeObserver } from "@mantine/hooks";
import { IconChevronUp } from "@tabler/icons";
import purchaseOrder from "~/src/images/purchase-order.svg";
import { showNotification } from "@mantine/notifications";


export default function ({ productOnPurchaseOrderList = [], setProductOnPurchaseOrderList, setPurchaseOrders, selectedPurchaseOrderListID, selectedSupplierID }) {
  const { Target, Dropdown, Item } = Menu;
  const [successNotification] = useNotification();

  const purchaseOrderReceivePdf = useRef();

  const [posReceiptSizeRef, rect] = useResizeObserver();
  const purchaseOrdersPrintComponent = useMergedRef(purchaseOrderReceivePdf, posReceiptSizeRef)
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

  //for pdf
  const handlePrint = useReactToPrint({
    content: () => purchaseOrderReceivePdf.current,
    print: doPrint
  })

  //reprint
  const handleRePrint = () => {
    doPrint(rePrintData)
  }

  let form = useForm({
    initialValues: {
      product_on_purchase_order_list: productOnPurchaseOrderList
    }
  })


  useEffect(() => {
    if (productOnPurchaseOrderList.length > 0) {
      form.setValues({ product_on_purchase_order_list: productOnPurchaseOrderList })
    }
  }, [productOnPurchaseOrderList]);


  const handleReceive = () => {
    const due = form.values.product_on_purchase_order_list.reduce((prev, curr) => prev + (curr.cost_price * curr.received_quantity), 0)

    if (!selectedSupplierID) {
      showNotification({
        title: 'Please select a supplier',
        message: 'Hey you, missing provide supplier! 🤥',
        color: 'yellow'
      })
      return;
    }

    const totalValue = { ...form.values, due, supplier_id: selectedSupplierID }
    // console.log({totalValue,selectedSupplierID})

    // make a http call with this values
    HTTP.patch(`${BaseAPI}/purchase_order/${form.values.product_on_purchase_order_list[0]?.purchase_order_id}/po-receive`, totalValue).then(res => {
      successNotification("Purchase Order Received");
      handlePrint();
      setProductOnPurchaseOrderList(() => []);
      form.reset();
      //for remove purchase order list id 
      setPurchaseOrders((value) => value.filter((item) => item.id !== selectedPurchaseOrderListID))
    }).catch(err => {

    })
  }


  return (
    <>
      <div className="overflow-auto h-[calc(100vh-400px)]" style={{ border: '1px solid #ededed' }}>
        <table className="w-full text-sm text-left text-gray-500 ">
          <thead className="text-xs uppercase bg-gray-600 text-gray-200 sticky top-0 left-0 z-10">
            <tr>
              <th className="px-1 py-2">Id</th>
              <th className="px-1 py-2">Name</th>
              <th className="px-1 py-2">CPU</th>
              <th className="px-1 py-2">RPU</th>
              <th className="px-1 py-2">Receive Quantity</th>
              <th className="px-1 py-2">Bonus Quantity</th>
              <th className="px-1 py-2">Wholesale Price(TK)</th>
              <th className="px-1 py-2">Product Expiry Date</th>
              <th className="px-1 py-2">Batch Expiry Date</th>
              <th className="px-1 py-2">batch_no</th>
            </tr>
          </thead>

          <tbody>
            {form.values.product_on_purchase_order_list.map((item, index) => (
              <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-300'} border-b border-gray-700 hover:bg-slate-200 duration-150`}>
                <th scope="row" className=" px-1 font-medium text-gray-900 whitespace-nowrap">
                  {item.product_id}
                </th>
                <td className=" text-xs px-1 w-40">
                  {item.product_name + `${item.style_size ? ', ' + item.style_size : ''}`}
                </td>
                <td className=" px-1 w-36">
                  <NumberInput
                    size="xs"
                    min={0}
                    precision={2}
                    value={item.cost_price} {...form.getInputProps(`product_on_purchase_order_list.${index}.cost_price`)}
                  />
                </td>
                <td className=" px-1 w-36">
                  <NumberInput
                    size="xs"
                    min={0}
                    precision={2}
                    value={item.mrp_price} {...form.getInputProps(`product_on_purchase_order_list.${index}.mrp_price`)}
                  />
                </td>
                <td className=" px-1 w-36">
                  <NumberInput
                    size="xs"
                    min={0}
                    precision={2}
                    value={item.receive_quantity} {...form.getInputProps(`product_on_purchase_order_list.${index}.received_quantity`)}
                  />
                </td>
                <td className=" px-1 w-36">
                  <NumberInput
                    size="xs"
                    min={0}
                    precision={2}
                    value={item.bonus_quantity} {...form.getInputProps(`product_on_purchase_order_list.${index}.bonus_quantity`)}
                  />
                </td>
                <td className=" px-1 w-36">
                  <NumberInput
                    size="xs"
                    min={0}
                    precision={2}
                    value={item.wholesale_price} {...form.getInputProps(`product_on_purchase_order_list.${index}.wholesale_price`)}
                  />
                </td>
                <td className=" px-1 w-36">
                  <Input
                    size="xs"
                    type="date"
                    value={item.product_expiry_date} {...form.getInputProps(`product_on_purchase_order_list.${index}.product_expiry_date`)}
                  />
                </td>
                <td className=" px-1 w-36">
                  <Input
                    size="xs"
                    type="date"
                    value={item.batch_expiry_date} {...form.getInputProps(`product_on_purchase_order_list.${index}.batch_expiry_date`)}
                  />
                </td>
                <td className=" px-1 w-36">
                  <Input
                    size="xs"
                    type="number"
                    value={item.batch_no} {...form.getInputProps(`product_on_purchase_order_list.${index}.batch_no`)}
                  />
                </td>
              </tr>
            ))
            }
          </tbody>
        </table>
        {
          form.values.product_on_purchase_order_list?.length === 0 &&
          <div className="pt-20 p-10 w-full flex justify-center flex-col text-center">
            <div className="bg-sky-100 pt-6 pb-5 px-1 mx-auto border border-gray-500 rounded-full ">
              <img className=" h-10 fill-gray-400 " src={purchaseOrder} />
            </div>
            <div className="pt-6 font-semibold text-base text-gray-400">Sorry! No Purchase Order</div>
            <div className="pt-3 font-semibold text-base text-gray-500">Please try searching for something else</div>
          </div>

        }
      </div>


      {/* <Button className="w-full text-lg h-fit py-2 font-semibold uppercase" onClick={handleReceive}>Receive</Button> */}
      <div className="flex absolute right-10 bottom-4 ">
        <div className={'mr-16'}>Total Cost Value: {form.values.product_on_purchase_order_list.map(item=>item.cost_price * item.received_quantity).reduce((pv, cv) => pv + cv,0)}</div>
        <Button disabled={productOnPurchaseOrderList.length === 0} size="md" onClick={handleReceive}>Receive & Print</Button>
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
        <div ref={purchaseOrdersPrintComponent}>
          {
            productOnPurchaseOrderList &&
            <Purchase_order_receive_pdf form_updated_product={form.values.product_on_purchase_order_list} />
          }
        </div>
      </div>
    </>
  )
}
