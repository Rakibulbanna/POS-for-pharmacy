import BarcodeScanner from "@/components/BarcodeScanner";
import Purchase_order_return_pdf from "@/components/purchase_return/purchase_order_return._pdf";
import { ActionIcon, Button, Input, Menu, NumberInput, Select, Table, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMergedRef, useResizeObserver } from "@mantine/hooks";
import { IconChevronUp } from "@tabler/icons";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { useNotification } from "~/hooks/useNotification";
import usePrint from "~/hooks/usePrint";
import { BaseAPI, HTTP } from "~/repositories/base";
import { useAtom } from "jotai";
import { LoggedInUser } from "@/store/auth";
import SaleableBarcodeScanner from "@/components/SaleableBarcodeScanner";

export default function () {
  const { Target, Dropdown, Item } = Menu;
  const [loggedInUser,] = useAtom(LoggedInUser);
  const [suppliers, setSuppliers] = useState([])
  const [returnableProducts, setReturnableProducts] = useState([])
  const [workingProduct, setWorkingProduct] = useState(null)

  const [returnQuantity, setReturnQuantity] = useState(0)

  const [selectedSupplierID, setSelectedSupplierID] = useState(null)
  const [reason, setReason] = useState("")

  const [successNotification] = useNotification();

  const [mrpPrice, setMrpPrice] = useState(0);
  const [costPrice, setCostPrice] = useState(0);

  const purchaseOrderReturnRef = useRef();

  const [posReceiptSizeRef, rect] = useResizeObserver();
  const purchaseOrdersReturnPrintComponent = useMergedRef(purchaseOrderReturnRef, posReceiptSizeRef)
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
    content: () => purchaseOrderReturnRef.current,
    print: doPrint
  })

  //reprint
  const handleRePrint = () => {
    doPrint(rePrintData)
  }

  const form = useForm({
    initialValues: {
      supplier_id: null,
      reason: "",
    }
  })

  useEffect(() => {
    HTTP.get(`${BaseAPI}/suppliers`).then(res => {
      const newSups = res.data.data.map(sup => {
        console.log({sup})
        return { ...sup, label: sup.company_name, value: sup.id }
      })
      setSuppliers(newSups)
    })
  }, [])

  // const getProducts = async (barcode) => {
  //   try {

  //     const res = await HTTP.get(`${BaseAPI}/products?product_barcode=${barcode}&supplier_id=${selectedSupplierID}`);
  //     return res.data.data
  //   } catch (error) {
  //     console.log(error);
  //     return []
  //   }
  // }

  // const handleBarcodeChange = async (e) => {
  //   const products = await getProducts(e.target.value)
  //   if (products.length > 0) {
  //     // setReturnableProducts([...returnableProducts, products[0]])
  //     setWorkingProduct(() => products[0])
  //   }
  // }

  const handleAddProduct = () => {
    if (workingProduct) {
      // check if returnable product already in here or not
      const found = returnableProducts.find(prod => prod.id === workingProduct.id)
      if (found) {
        const undateReturnableProducts = returnableProducts.map(prod => {
          if (prod.id === found.id) {
            return ({ ...prod, quantity: prod.quantity + returnQuantity })
          }
          return prod
        });

        setReturnableProducts(() => undateReturnableProducts)
      } else {
        setReturnableProducts([...returnableProducts, { ...workingProduct, MRP_price: mrpPrice, cost_price: costPrice, quantity: returnQuantity }])
      }
    }
    setWorkingProduct(() => null);
    setMrpPrice(() => 0);
    setCostPrice(() => 0);
    setReturnQuantity(() => 0)
  }

  useEffect(() => {
    if (!workingProduct) return

    setCostPrice(() => workingProduct?.cost_price);
    setMrpPrice(() => workingProduct?.MRP_price)
  }, [workingProduct])

  const handleDelete = (id) => {
    const newReturnableProducts = returnableProducts.filter(prod => prod.id !== id)
    setReturnableProducts(newReturnableProducts)
  }


  const handleSubmit = () => {
    const body = returnableProducts.map(prod => {
      console.log({prod})
      return {
        supplier_id: selectedSupplierID,
        product_id: prod.id,
        quantity: prod.quantity,
        reason: reason,
        user_id: loggedInUser?.id,
        sale_barcode: prod.sale_barcode,
        vendor_id: prod.vendor_id
      }
    })
    HTTP.post(`${BaseAPI}/purchase_return`, body).then(res => {
      successNotification("Success")
      setSelectedSupplierID(() => null)
      setReason("")
      setWorkingProduct(null)
      setReturnQuantity(0)
      setReturnableProducts(() => [])
      handlePrint();
    }).catch(err => {
      console.log(err);
    })
  }

  
  return (
    <div className=" w-full h-full">
      <div className="grid grid-cols-12 gap-2 p-1 font-semibold text-gray-700" style={{ border: '1px solid #dbdbdb' }}>
        <div className="col-start-1 col-end-3" >
          <Select data={suppliers}
            // label="Supplier"
            label="Vendor"
            value={selectedSupplierID}
            onChange={v => setSelectedSupplierID(v)}
            searchable
            clearable
            // placeholder="select a supplier"
            placeholder="select a vendor"
          />
          <div>
            {selectedSupplierID ?

              <SaleableBarcodeScanner
                selectedSupplierID={selectedSupplierID}
                lebel='Input Barcode'
                placeholder="scan barcode"
                getProduct={(p) => setWorkingProduct(p)} />
              :
              <>
                <lebel>Scan Sale Barcode</lebel>
                <Input
                  lebel='Input Barcode'
                  placeholder="scan barcode"
                  disabled
                />
              </>
            }
          </div>
        </div>

        <div className="col-start-3 col-end-8">
          <div>
            <TextInput className="w-full text-gray-700 cursor-none" type="number" label="Product Id" value={workingProduct ? workingProduct.id : ""} />
          </div>
          <div>
            <TextInput type="string" className="w-full cursor-none" label="Product Name" value={workingProduct ? workingProduct.name : ""} />
          </div>
        </div>

        <div className=" col-start-8 col-end-13 flex gap-2 ">
          <div className="w-full">
            <div>
              <label>RPU</label>
              <NumberInput precision={2} min={1} type="number" className="w-full" value={mrpPrice} onChange={v => setMrpPrice(() => v)} />
            </div>
            <div>
              <label>CPU</label>
              <NumberInput precision={2} min={1} className="w-full" value={costPrice} onChange={v => setCostPrice(() => v)} />
            </div>
          </div>
          <div className="w-full ">
            <TextInput className="w-full" label="Reason" value={reason} onChange={v => setReason(v.target.value)} />
            <NumberInput precision={2} className="w-full" label="Stock Quantity" disabled value={workingProduct?.stock} />
          </div>
          <div className="w-full flex flex-col justify-between">
            <NumberInput precision={2} className="w-full" label="Return Quantity" value={returnQuantity} onChange={v => setReturnQuantity(v)} />
            <Button disabled={!workingProduct || !returnQuantity} className="w-full" onClick={handleAddProduct}>ADD</Button>
          </div>
        </div>
      </div>

      <div className=" mt-3 h-[calc(100vh-270px)] overflow-auto w-full" style={{ border: '1px solid #dbdbdb' }}>
        <div className="h-fit min-h-full shadow-sm sm:rounded-sm">
          <Table>
            <thead className="text-xs uppercase  ">
              <tr className="">
                <th className="py-1 px-6 ">ID</th>
                <th className="py-1 px-6 ">Barcode</th>
                <th className="py-1 px-6 ">Description</th>
                <th className="py-1 px-6 ">RPU</th>
                <th className="py-1 px-6 ">CPU</th>
                <th className="py-1 px-6 ">Stock</th>
                <th className="py-1 px-6 ">Return Qty</th>
                <th className="py-1 px-6 ">Action</th>
              </tr>
            </thead>
            <tbody>
              {returnableProducts.map((product, index) => (
                <tr key={product.id} className={`${index % 2 === 0 ? 'bg-slate-100' : 'bg-slate-200'}`}>
                  <td className="py-0">{product.id}</td>
                  <td className="py-0">{product.product_barcode}</td>
                  <td className="py-0">{`${product.name} ${product?.style_size ? ', ' + product.style_size : ''}${product?.color?.name ? ', ' + product.color.name : ''}`}</td>
                  <td className="py-0">{product.MRP_price}</td>
                  <td className="py-0">{product.cost_price}</td>
                  <td className="py-0">{product.stock}</td>
                  <td className="py-0">{product.quantity}</td>
                  <td className="py-0"><Button onClick={() => handleDelete(product.id)}>Delete</Button></td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      <div className="flex my-8 px-20 w-full justify-end">
        <div className={'mr-16'}>Total Cost Price: {returnableProducts.map(prod=>prod.cost_price * prod.quantity).reduce((pv, cv) => pv+cv,0)}</div>
        <Button disabled={returnableProducts.length === 0 ? true : false} onClick={handleSubmit}> Submit & Print</Button>
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
        <div ref={purchaseOrderReturnRef}>
          <Purchase_order_return_pdf
            returnableProducts={returnableProducts}
          />
        </div>
      </div>

    </div >
  )
}
