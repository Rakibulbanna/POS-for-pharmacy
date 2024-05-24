import AddScanProducts from "@/components/combo_promotion/addScanProducts";
import Create from "@/components/combo_promotion/create";
import Productdetails from "@/components/combo_promotion/scanProducts";
import { Input } from "@mantine/core";
import { useEffect, useState, useRef } from "react";
import { BaseAPI, HTTP } from "~/repositories/base";
import returnImg from "~/src/images/return-icon.svg";

export default function ({ setShowCreatePage }) {
    const [scanProduct, setScanProduct] = useState([]);
    const [addProducts, setAddProducts] = useState([]);
    
    const scanRef = useRef();

    //handle product description
    const handleScanProduct = (product) => {

        if (scanProduct.length === 0) return setScanProduct(() => [product]);

        let isNewProduct = true;
        const updateProductDescription = scanProduct.length > 0 &&
            scanProduct.map((value) => {
                if (value.id !== product.id) return value;
                isNewProduct = false;
                return { ...value, quantity: value.quantity + 1 }

            })

        if (isNewProduct) {
            setScanProduct(() => [...updateProductDescription, product]);
            return ;
        }
        setScanProduct(() => updateProductDescription)
    }


    const handleScaneProduct = (e) => {
        // console.log(e.target.value);
        if (!e.target.value) return;

        HTTP.get(`${BaseAPI}/products?product_barcode=${e.target.value}`)
            .then(res => {
                console.log(res.data.data);

                if (res.data.data?.length > 0) {
                    const product = res.data.data[0];
                    setScanProduct(()=>res.data.data)
                    // handleScanProduct(product);
                }

                // setTimeout(()=>{
                //     scanRef.current.value = ''
                // },1000)
            })
            .catch(err => {
                console.log(err)
            })
    }

    // useEffect(() => {
    //     console.log(scanProduct)
    // })

    return <div className=" overflow-hidden h-[calc(100vh-60px)]">
        <div className="h-full w-full grid grid-rows-12">
            <div className="row-start-1 row-end-2 text-gray-100 text-lg flex flex-col justify-start">
                <div className="p-1 flex justify-between">
                    <div>
                        <div className="text-slate-700 text-[14px] font-semibold pb-1">Scan Product:</div>
                        <Input ref={scanRef} onChange={handleScaneProduct} placeholder="scan product barcode" />
                    </div>
                    <div className=" ">
                        <img onClick={()=>setShowCreatePage(()=>false)} className=" bg-sky-500 hover:bg-sky-600 h-8 px-4 py-2 rounded-sm " src={returnImg} />
                    </div>
                </div>

                <div className='px-1'>
                    <AddScanProducts
                        addProducts={addProducts}
                        setAddProducts={setAddProducts}
                        scanProduct={scanProduct}
                        setScanProducts={setScanProduct}
                    />
                </div>
            </div>

            <div className="my-1 px-1">
                <Productdetails
                    products={addProducts}
                    setProducts={setAddProducts}
                />
            </div>

            <div >
                <Create 
                addProducts={addProducts}
                setAddProducts={setAddProducts} 
                />
            </div>

        </div>

    </div>
}