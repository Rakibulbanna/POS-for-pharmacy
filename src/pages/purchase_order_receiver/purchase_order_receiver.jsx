import { Modal, Select, Radio } from "@mantine/core";
import { useEffect, useState } from "react";
import { BaseAPI, HTTP } from "~/repositories/base";
import Purchase_order_modal from "@/components/purchase_order_receiver/purchase_order_modal";
import ProductOnPurchaseOrderList from "@/components/purchase_order/product_on_purchase_order_list";
import Direct_receive from "@/components/purchase_order_receiver/direct_receive";
import emptyData from "~/src/images/empty-data.svg";
import moment from "moment";

export default function () {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSupplierInfo, setSelectedSupplierInfo] = useState(false);
  const [purchaseProductList, setPurchaseProductList] = useState([]);
  //   const [totalPrice,setTotalPrice] = useState(0);
  const [disableButtonId, setDisableButtonId] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);

  const [selectedSupplierID, setSelectedSupplierID] = useState(null);
  const [selectedPurchaseOrderListID, setSelectedPurchaseOrderListID] = useState(null);
  const [receiveType, setReceiveType] = useState("direct_receive");

  const [productOnPurchaseOrderList, setProductOnPurchaseOrderList] = useState([]);

  useEffect(() => {
    HTTP.get(`${BaseAPI}/suppliers`).then(res => {
      const supps = res.data.data.map(supplier => {
        return {
          label: supplier.company_name,
          value: supplier.id
        }
      })
      setSuppliers(() => supps)
    }).catch(err => {
      console.log(err)
    })
  }, []);

  const handleSupplierChange = (id) => {
    console.log(id);
    setSelectedSupplierID(id);
    //when change supplier then reset
    const filterSupplier = suppliers.filter((supplier) => supplier.value === id);
    handlePurchaseProduct(filterSupplier[0])

    HTTP.get(`${BaseAPI}/purchase_order/${id}`).then(res => {
      // setProducts(res.data.data);
      // const data = suppliers[id];
      setPurchaseOrders(() => res.data.data);

      console.log(res.data.data)
      //when supplier change set null to the purchase list
    })
      .catch(err => {
        console.log(err);
      });
  }

  //purchase product list handler for supplier
  const handlePurchaseProduct = (supplierInfo, product = false) => {
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
    setSelectedSupplierInfo(false)
  }

  //handle delete product from to the list
  const handleDeletePurchaseProductFromList = (product) => {

    //delete product from purchase list
    const updatedPurchaseProductList = purchaseProductList.filter((value) => product.id !== value.id)
    setPurchaseProductList(updatedPurchaseProductList)

    //remove disable id
    const filterDisableButtonId = disableButtonId.filter((value) => value !== product.id)
    setDisableButtonId(filterDisableButtonId)
    console.log(product)
  }


  const handleUpdateProduct = (e) => {

    if (!e.id && purchaseProductList.length > 0) return;

    const updateProduct = purchaseProductList.map((value) => {
      if (value.id !== e.id) return value

      const keys = Object.keys(e);
      const updateProduct = { ...value, [keys[0]]: e[keys[0]] };
      return updateProduct;
    })
    setPurchaseProductList(updateProduct);
  }

  const handlePurchaseOrderChoice = (id) => {
    // get all of the middle table item for this purchase order
    HTTP.get(`${BaseAPI}/purchase_order/product-on-order-purchase?purchase_order_id=${id}`).then(res => {
      // console.log(res.data.data);
      setSelectedPurchaseOrderListID(() => id)
      const productOnPurchaseOrderList = res.data.data.map(productOnPurchaseOrder => {
        return {
          product_id: productOnPurchaseOrder.product_id,
          received_quantity: productOnPurchaseOrder.quantity,
          bonus_quantity: 0,
          wholesale_price: 0,
          purchase_order_id: productOnPurchaseOrder.purchase_order_id,
          product_name: productOnPurchaseOrder.product.name,
          style_size: productOnPurchaseOrder.product.style_size,
          cost_price: productOnPurchaseOrder.cost_price,
          mrp_price: productOnPurchaseOrder.mrp_price
        }
      })
      setProductOnPurchaseOrderList(productOnPurchaseOrderList);
    }).catch(err => {
      console.log(err)
    })
  }


  return (
    <>
      <div className="flex text-slate-700 w-full gap-8 justify-between justify-items-center">
        <div className="p-1 w-1/4">
          <div className="text-slate-700 text-sm font-semibold pb-1">Suppliers:</div>
          <Select size="md"
            placeholder={"Choose a supplier to start"}
            data={suppliers}
            onChange={v => handleSupplierChange(v)}
            searchable
            clearable
          />
        </div>
        {/* <div className="h-full w-1 border border-gray-700"></div> */}
        <div className="h-fit rounded-md p-1">
          <div className="text-slate-700 text-base font-semibold pb-1">Type:</div>
          <Radio.Group className="text-slate-600 pb-3 px-3 relative my-auto flex font-medium rounded" style={{ border: '1px solid #dbdbdb' }} value={receiveType} onChange={(v) => setReceiveType(v)}>
            <Radio value={"po_receive"} label={"Purchase Order Receive"} />
            <Radio value={"direct_receive"} label={"Direct Receive"} />
          </Radio.Group>
        </div>
      </div>

      {receiveType === "po_receive" ?
        <>
          <div className="my-10 text-slate-600">
            <div className=" text-base font-semibold text-gray-600">
              Purchase Order list:
              <span className="text-sky-600"> ( ID )</span>
            </div>

            <div className="flex flex-wrap gap-2 font-medium text-gray-300 text-lg mt-6">
              {purchaseOrders.length > 0 ?
                purchaseOrders?.map((product, index) => (
                  <div className="bg-gray-600 py-1 px-3 rounded cursor-pointer hover:bg-slate-700 duration-150" key={product.id} onClick={() => handlePurchaseOrderChoice(product.id)}>
                    {/* <span className="text-sky-300"> {product.id} </span> */} {moment(product.created_at).format('DD-MM-YYYY')}
                  </div>
                ))
                :
                <div className="w-fit p-4 text-base text-gray-400 text-center flex">
                  <div className=" bg-sky-100 pt-3 pb-2 px-3 w-fit rounded-full ">
                    <img className="h-6" src={emptyData} />
                  </div>
                  <span className="my-auto pl-2 font-base">Sorry! No Purchase Order list</span>
                </div>
              }
            </div>
          </div>

          <div>
            <div className="text-base font-semibold text-gray-600">Purchase Order Details:</div>
            <ProductOnPurchaseOrderList
              selectedPurchaseOrderListID={selectedPurchaseOrderListID}
              setPurchaseOrders={setPurchaseOrders}
              productOnPurchaseOrderList={productOnPurchaseOrderList}
              setProductOnPurchaseOrderList={setProductOnPurchaseOrderList}
              selectedSupplierID={selectedSupplierID}
            />
          </div>

        </>
        :
        receiveType !== "direct_receive" &&
        <div className="shadow w-fit p-4 font-medium text-2xl text-gray-300 text-center">
          <img className="h-6" src={emptyData} />
          Empty
        </div>

      }

      {
        receiveType === "direct_receive" &&
        <Direct_receive supplierID={selectedSupplierID} />
      }

      <Modal opened={modalOpen} onClose={() => setModalOpen(false)}>
        <Purchase_order_modal
          disableButtonId={disableButtonId}
          handlePurchaseProduct={handlePurchaseProduct}
          handleDeletePurchaseProductFromList={handleDeletePurchaseProductFromList}
        />
      </Modal>

    </>
  )
}
