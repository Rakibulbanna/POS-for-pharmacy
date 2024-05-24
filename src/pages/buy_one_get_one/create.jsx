import Create from "@/components/buy_one_get_one/create";
import { Button, Input } from "@mantine/core";
import { useEffect, useState, useRef } from "react";
import { BaseAPI, HTTP } from "~/repositories/base";
import purchaseOrder from "~/src/images/purchase-order.svg";
import Productdetails from "@/components/buy_one_get_one/scanProducts";
import AddProductList from "@/components/buy_one_get_one/AddProductList";
import { showNotification } from "@mantine/notifications";
import returnImg from "~/src/images/return-icon.svg";

export default function ({ setShowCreatePage }) {
  const [scanBuyProduct, setScanBuyProduct] = useState([]);
  const [scanGetProduct, setScanGetProduct] = useState([]);
  const [addedbuyOneGetOneProducts, setAddedbuyOneGetOneProducts] = useState([]);

  const buyScanRef = useRef();
  const getScanRef = useRef();

  //handle product scan buy description
  const handleScanBuyProduct = (product) => {

    if (scanBuyProduct.length === 0) return setScanBuyProduct(() => [product]);

    let isNewProduct = true;
    const updatescanBuyProduct = scanBuyProduct.length > 0 &&
      scanBuyProduct.map((value) => {
        if (value.id !== product.id) return value;
        isNewProduct = false;
        return { ...value, quantity: value.quantity + 1 }

      })

    if (isNewProduct) return setScanBuyProduct(() => [...updatescanBuyProduct, product])
    setScanBuyProduct(() => updatescanBuyProduct);
  }

  //handle product scan get description
  const handleScanGetProduct = (product) => {

    if (scanGetProduct.length === 0) return setScanGetProduct(() => [product]);

    let isNewProduct = true;
    const updatescanGetProduct = scanGetProduct.length > 0 &&
      scanGetProduct.map((value) => {
        if (value.id !== product.id) return value;
        isNewProduct = false;
        return { ...value, quantity: value.quantity + 1 }

      })

    if (isNewProduct) return setScanGetProduct(() => [...updatescanGetProduct, product])
    setScanGetProduct(() => updatescanGetProduct);

  }

  const handleScaneBuyProduct = (e, type) => {

    if (!e.target.value) return;

    HTTP.get(`${BaseAPI}/products?product_barcode=${e.target.value}`)
      .then(res => {


        if (res.data.data?.length > 0) {
          const product = res.data.data[0];
          product.quantity = 1;
          handleScanBuyProduct(product);
        }
      })
      .catch(err => {
        console.log(err)
      })
    setTimeout(() => {
      // console.log({ value: buyScanRef.current.value })
      buyScanRef.current.value = '';
    }, 1000)
  }

  const handleScaneGetProduct = (e) => {

    if (!e.target.value) return;

    HTTP.get(`${BaseAPI}/products?product_barcode=${e.target.value}`)
      .then(res => {
        if (res.data.data?.length > 0) {
          const product = res.data.data[0];
          product.quantity = 1;
          handleScanGetProduct(product);
        }
      })
      .catch(err => {
        console.log(err)
      });
    setTimeout(() => {
      if (getScanRef.current) getScanRef.current.value = '';
    }, 1000)
  }

  const handleAddProducts = async () => {
    for (let product of scanBuyProduct) {
      const res = await HTTP.get(`${BaseAPI}/promotions/bxgx/check-exists/${product.id}`)
      if (res.data.data) {
        showNotification({
          title: 'Already Used',
          message: 'One or more items already used ',
          color: 'red',
        });
        return;
      }
    };
    for (let product of scanGetProduct) {
      const res = await HTTP.get(`${BaseAPI}/promotions/bxgx/check-exists/${product.id}`)
      if (res.data.data) {
        showNotification({
          title: 'Already Used',
          message: 'One or more items already used ',
          color: 'red',
        });
        return;
      }

    }

    // if (isUsed) {
    //     showNotification({
    //         title: 'Already Used',
    //         message: 'One or more items already used ',
    //         color: 'red',
    //     });
    //     return;
    // }

    setAddedbuyOneGetOneProducts((value) => [...value, { buy_products: scanBuyProduct, get_products: scanGetProduct }]);
    setScanBuyProduct(() => []);
    setScanGetProduct(() => []);

  }

  return <div className="overflow-hidden h-[calc(100vh-32px)]">
    <div className=" text-gray-100 flex justify-between gap-10 pb-1">
      <div className="w-1/3">
        {/* <div></div> */}
        <div className="text-slate-700 text-sm font-semibold pb-1">Scan Buy Product:</div>
        <Input ref={buyScanRef} onChange={(e) => handleScaneBuyProduct(e, 'buy')} size="sm" placeholder="Scan buy product barcode" />
      </div>
      <div className="w-1/3">
        <div className="text-slate-700 text-sm font-semibold pb-1">Scan Get Product:</div>
        <Input ref={getScanRef} onChange={(e) => handleScaneGetProduct(e, 'get')} size="sm" placeholder="Scan get product barcode" />
      </div>
      <div className=" ">
        <img onClick={() => setShowCreatePage(() => false)} className=" bg-sky-500 hover:bg-sky-600 h-8 px-4 py-2 rounded-sm " src={returnImg} />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-1">
      <Productdetails className=' col-start-1 col-end-2' products={scanBuyProduct} setProducts={setScanBuyProduct} />
      <Productdetails className='col-start-2 col-end-3' products={scanGetProduct} setProducts={setScanGetProduct} />
    </div>
    <div className="my-1">
      <Button onClick={handleAddProducts} disabled={scanBuyProduct.length > 0 && scanGetProduct.length > 0 ? false : true} fullWidth > Add</Button>
    </div>
    {/* after add show buy one get one product */}
    <div className="">
      <AddProductList
        addedbuyOneGetOneProducts={addedbuyOneGetOneProducts}
      />
    </div>

    {
      <div>
        <Create
          addedbuyOneGetOneProducts={addedbuyOneGetOneProducts}
          setAddedbuyOneGetOneProducts={setAddedbuyOneGetOneProducts}
        />
      </div>
    }

  </div>
}