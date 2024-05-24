import { Button, Modal, Select, Table, NumberInput, TextInput, Menu, ActionIcon } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { BaseAPI, HTTP } from "~/repositories/base";
import { showNotification } from "@mantine/notifications";
import SearchNScan from "@/components/SearchNScan";
import Purchase_order_pdf from "@/components/purchase_order/purchase_order_pdf";
import usePrint from "~/hooks/usePrint";
import { useMergedRef, useResizeObserver } from "@mantine/hooks";
import { IconChevronUp } from "@tabler/icons";

export default function () {
  // const [modalOpen, setModalOpen] = useState(false);
  const { Target, Dropdown, Item } = Menu;

  const [selectedSupplierInfo, setSelectedSupplierInfo] = useState(false);
  const [purchaseProductList, setPurchaseProductList] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [disableButtonId, setDisableButtonId] = useState([]);

  const [suppliers, setSuppliers] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedSupplier, setSelectedSupplier] = useState(null)

  const [stockQuantity, setStockQuantiy] = useState(0)
  const [costPrice, setCostPrice] = useState(0)
  const [sellPrice, setSellPrice] = useState(0)
  const [requestQuantity, setRequestQuantity] = useState(null)

  const printComponentRef = useRef();
  const scanProductRef = useRef();
  const purchaseOrdersPrintRef = useRef();
  const reqQtyRef = useRef()
  const productScanRef = useRef()

  const [posReceiptSizeRef, rect] = useResizeObserver();
  const purchaseOrdersPrintComponent = useMergedRef(purchaseOrdersPrintRef, posReceiptSizeRef)
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
    content: () => purchaseOrdersPrintRef.current,
    print: doPrint
  })

  //reprint
  const handleRePrint = () => {
    doPrint(rePrintData)
  }

  useEffect(() => {
    HTTP.get(`${BaseAPI}/suppliers`).then(res => {
      setSuppliers(res.data.data.map(supp => {
        return {
          label: supp.company_name,
          value: supp.id,
        }
      }))
    }).catch(err => {
      console.log(err);
    })
  }, [])



  const handlePurchaseProduct = (supplierInfo, product = false) => {
    console.log(supplierInfo)
    //get supplier info
    supplierInfo && setSelectedSupplierInfo(() => supplierInfo);
    //get purchase product list
    if (product === null) return setPurchaseProductList([]);
    if (!!product) setPurchaseProductList((value) => [...value, product]);

    //disable button id get and set
    if (!!product) setDisableButtonId((value) => [...value, product.id])

  }

  //handle reset all
  const handleResetAll = () => {
    setPurchaseProductList([]);
    setDisableButtonId([]);
    setSelectedSupplierInfo(() => false)
  }

  //handle delete product from to the list
  const handleDeletePurchaseProductFromList = (product) => {

    //delete product from purchase list
    const updatedPurchaseProductList = purchaseProductList.filter((value) => product.id !== value.id)
    setPurchaseProductList(updatedPurchaseProductList)

    //remove disable id
    const filterDisableButtonId = disableButtonId.filter((value) => value !== product.id)
    setDisableButtonId(filterDisableButtonId)
  }

  //default total price clculate
  useEffect(() => {
    purchaseProductList.length > 0 &&
      setTotalPrice(() => purchaseProductList.reduce(
        (prev, curr) => {
          const quantity = curr.quantity ? curr.quantity : curr.minimum_order_quantity;
          return prev + curr.MRP_price * quantity;
        },
        0
      ))
  }, [purchaseProductList])

  const handleBarcodeChange = (e) => {
    // get single product
    HTTP.get(`${BaseAPI}/products?supplier_id=${selectedSupplier}&product_barcode=${e.currentTarget.value}`).then(res => {
      if (res.data.data.length > 0) {
        console.log(res.data.data);
        setPurchaseProductList(() => [0])
        setSelectedProduct(res.data.data[0])
        const product = res.data.data[0]
        // set quantity
        setStockQuantiy(product.stock)
        // set cost price
        setCostPrice(product.cost_price)
        // set sell price
        setSellPrice(product.MRP_price)
      }
    }).catch(err => {
      console.log(err);
    })
  }

  //handle update price, cost and quantity
  // const handleUpdateProduct = (e)=>{
  //   if(!e.id && purchaseProductList.length > 0 ) return ;

  //   const updateProduct = purchaseProductList.map((value)=>{
  //     if(value.id !== e.id) return value

  //     const keys = Object.keys(e);
  //     const updateProduct = {...value,[keys[0]] : e[keys[0]]};
  //     return updateProduct ;
  //   })
  //   setPurchaseProductList(updateProduct);
  // }

  // send to database
  const handleSendDatabase = () => {
    const updatepPurchaseProductList = purchaseProductList.map((value) => {
      if (value.quantity) return value;
      return { ...value, quantity: 1 }

    })
    console.log({ updatepPurchaseProductList })
    HTTP.post(`${BaseAPI}/purchase_order/`, {
      supplier_id: selectedSupplierInfo.value,
      products: updatepPurchaseProductList
    })
      .then(res => {
        showNotification({
          title: "Success",
          message: "Category updated"
        })
      }).catch(err => {
        console.log(err)
        showNotification({
          title: "Error",
          message: ""
        })
      })
  }

  const handleAdd = () => {

    // check if id is already availabel or not
    const found = purchaseProductList.find(p => p.id === selectedProduct.id)
    if (found) {
      const newPurchaseProductList = purchaseProductList.map(p => {
        if (p.id === selectedProduct.id) {
          return { ...p, quantity: p.quantity + requestQuantity }
        }
        return p
      })
      setRequestQuantity(null)
      setPurchaseProductList(newPurchaseProductList)

    } else {
      const obj = {
        id: selectedProduct.id,
        barcode: selectedProduct.product_barcode,
        description: `${selectedProduct.name}, ${selectedProduct.style_size ? `,${selectedProduct.style_size}` : ' '} ${selectedProduct?.color?.name ? `,${selectedProduct?.color?.name}` : ''}`,
        sell_price: sellPrice,
        quantity: requestQuantity,
        cost_price: costPrice,
      }

      setPurchaseProductList([...purchaseProductList, obj]);

      //set all default 
      setSelectedProduct(() => null)
      // set quantity
      setStockQuantiy(() => 0)
      // set cost price
      setCostPrice(() => 0)
      // set sell price
      setSellPrice(() => 0)
      //set deafult request quantity
      setRequestQuantity(null)

      //set scan bar default value
      if (scanProductRef.current?.value) scanProductRef.current.value = '';

    }
  }

  const handleRemove = (id) => {
    setPurchaseProductList(purchaseProductList.filter(p => p.id !== id))
  }

  const handleSave = () => {

    HTTP.post(`${BaseAPI}/purchase_order`, {
      supplier_id: selectedSupplier,
      products: purchaseProductList.map(product => {
        return {
          id: product.id,
          cost_price: product.cost_price,
          MRP_price: product.sell_price,
          quantity: product.quantity || 0,
        }
      })
    }).then(res => {
      showNotification({
        title: "Success",
        message: "Successfully updated"
      })
      // call print function
      handlePrint();

      setSelectedProduct(null)
      setPurchaseProductList([])
      setRequestQuantity(null)

    }).catch(err => {
      showNotification({
        title: "Success",
        message: err
      })
    })
  }

  // console.log({ purchaseProductList, selectedSupplier });

  const handleSupplierChange = (v) => {
    setSelectedSupplier(() => v);
    // console.log({ selectedSupplier, v });

    if (!v || selectedSupplier !== v) {

      //set all default 
      setSelectedProduct(() => null)
      // set quantity
      setStockQuantiy(() => 0)
      // set cost price
      setCostPrice(() => 0)
      // set sell price
      setSellPrice(() => 0)
      //set deafult request quantity
      setRequestQuantity(() => null);

      setPurchaseProductList(() => [])

      // scanProductRef.current.value = '';
    }
  }

  const setProduct = (product) => {
    // console.log(product)
    setSelectedProduct(product)
    setStockQuantiy(() => product.stock)
    setCostPrice(() => product.cost_price);
    setSellPrice(() => product.MRP_price)
    // setProductID(product.id)
    // setProductName(product.name)
    // setProductStock(product.stock)
  }
  const handleQtyKeyup = (e) => {
    if (e.key == 'Enter' && requestQuantity >= 1) {
      handleAdd();
      productScanRef.current.focus();
    }
  }

  return (
    <>
      <div className="relative h-[calc(100vh-60px)]">
        {/* <div className=" text-base font-semibold">Purchase order</div> */}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-start-1 col-end-4  rounded-sm" style={{ border: '1px solid #ededed' }}>
            <div className="p-1">
              <Select
                classNames="w-full"
                label="Supplier"
                data={suppliers}
                onChange={handleSupplierChange}
                searchable
                clearable
              />
            </div>
            {/* <TextInput ref={scanProductRef} className="w-full p-1" label="Barcode" onChange={handleBarcodeChange} disabled={!!!selectedSupplier} /> */}
            <div className="p-1" disabled>
              <SearchNScan selectedProduct={selectedProduct}
                onProduct={setProduct}
                disable={!selectedSupplier}
                reqQtyRef={reqQtyRef}
                productScanRef={productScanRef}
              />
            </div>
          </div>
          <div className="col-start-4 col-end-13 flex flex-col justify-between p-1 items-center rounded-sm" style={{ border: '1px solid #ededed' }}>
            <div className="flex justify-between w-full ">
              <NumberInput disabled label="Stock Quantity" value={stockQuantity} />
              <NumberInput precision={2} label="CPU" value={costPrice} onChange={v => setCostPrice(v)} />
              <NumberInput precision={2} label="RPU" value={sellPrice} onChange={v => setSellPrice(v)} />
              <NumberInput ref={reqQtyRef} onKeyUp={handleQtyKeyup} label="Req Quantity" value={requestQuantity} onChange={v => setRequestQuantity(v)} />
            </div>
            <Button className="w-full " disabled={!!!selectedProduct || !requestQuantity} onClick={handleAdd} size="sm">ADD</Button>
          </div>
        </div>

        {/* <div className="p-4 m-8" style={{ border: '1px solid #ededed' }} ref={printComponentRef}>
          {selectedSupplierInfo || selectedSupplier ?
            <div className="flex justify-between" style={{ paddingTop: '20px', paddingBottom: '15px' }}>
              <div>
                <div style={{ fontSize: "15px", fontWeight: 500 }}>Supplier Information:</div>
                <div style={{ textTransform: 'capitalize' }}><span style={{ fontWeight: '15px' }} >Name: </span> {selectedSupplierInfo ? selectedSupplierInfo.label : ''}</div>
              </div>
              <div>
                <Button onClick={handleSendDatabase} className={"ml-6"} variant="outline" color={"green"} >Send Database</Button>
              </div>
              <div>
                <Button onClick={handleResetAll} className={"ml-6"} variant="" color={"yellow"} >Reset</Button>
              </div>
            </div>
            :
            <div className="w-full flex justify-center flex-col text-center">
              <div className="bg-sky-100 pt-6 p-5 px-6 mx-auto border border-gray-500 rounded-full ">
                <img className=" h-4 fill-gray-400 " src={purchaseOrder} />
              </div>
              <div className="pt-3 font-semibold text-base text-gray-400">Sorry! No Supplier Selected</div>
            </div>
          }
        </div> */}
        <div className={"border-2 border-black border-dashed mt-8"} >
          <Table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Barcode</th>
                <th>Group</th>
                <th>Description</th>
                <th>CPU (TK)</th>
                <th>RPU (TK)</th>
                <th>Quantity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {
                purchaseProductList?.length > 0 && purchaseProductList.map((product, index) =>
                  <tr key={index}>
                    <td>{product.id}</td>
                    <td>{product.barcode}</td>
                    <td>{product.brand?.name}</td>
                    <td>{product.description}</td>
                    <td>{product.cost_price}</td>
                    <td>{product.sell_price}</td>
                    <td>{product.quantity}</td>
                    <td><Button size="xs" className="py-0" onClick={() => handleRemove(product.id)}>Remove</Button> </td>
                  </tr>
                )
              }
              {/* {
            purchaseProductList?.length > 0 &&
              <tr className="bg-gray-300">
                <td>Total :</td>
                <td></td>
                <td></td>
                <td></td>
                <td>{totalPrice}</td>
            </tr>
            } */}
            </tbody>
          </Table>
        </div>

        <div className="absolute bottom-0 left-0 right-0  flex justify-around pt-2">
          <div>
            No of item: {purchaseProductList.length}
          </div>
          <div>Total Quantity: {purchaseProductList.map(p => p.quantity).reduce((pv, cv) => pv + cv, 0)}</div>
          <div>Total Cost Price: {purchaseProductList.map(prod => prod.cost_price * prod.quantity).reduce((pv, cv) => pv + cv, 0)}</div>
          <div className="flex">
            <Button disabled={!!!purchaseProductList.length} size="md" className="px-8" onClick={handleSave}>Save & Print</Button>
            <Menu>
              <Target><ActionIcon variant={"filled"} className={"h-full"}><IconChevronUp /></ActionIcon></Target>
              <Dropdown>
                <Item>
                  <Button onClick={handleRePrint}>Re Print</Button>
                </Item>
              </Dropdown>
            </Menu>
          </div>
        </div>
      </div>

      {/* <Modal opened={modalOpen} onClose={() => setModalOpen(false)}>
        <ProductModal
          disableButtonId={disableButtonId}
          handlePurchaseProduct={handlePurchaseProduct}
          handleDeletePurchaseProductFromList={handleDeletePurchaseProductFromList}
        />
      </Modal> */}
      <div className="hidden">
        <div ref={purchaseOrdersPrintComponent}>
          {
            purchaseProductList.length > 0 &&
            <Purchase_order_pdf
              purchaseProductList={purchaseProductList}
            // returnableProducts={returnableProducts}
            />
          }
        </div>
      </div>
    </>
  )
}
