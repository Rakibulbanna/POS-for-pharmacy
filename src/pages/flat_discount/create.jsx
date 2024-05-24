import AddBrandCategories from "@/components/flat_discount/addBrandCategories";
import AddScanProducts from "@/components/flat_discount/addScanProducts";
import Create from "@/components/flat_discount/create";
import Productdetails from "@/components/flat_discount/scanProducts";
import { Button, Input, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useRef, useState } from "react";
import { BaseAPI, HTTP } from "~/repositories/base";
import purchaseOrder from "~/src/images/purchase-order.svg";
import returnImg from "~/src/images/return-icon.svg";

export default function ({ setShowCreatePage }) { 
  const [searchProducts, setSearchProducts] = useState([]);
  const [scanProducts, setScanProducts] = useState([]);
  const [addProducts, setAddProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [scanValue, setScanValue] = useState('');
  const [brandValue, setBrandValue] = useState(0);
  const [categorieValue, setCategorieValue] = useState(0);

  const scanRef = useRef();

  const form = useForm({
    initialValues: {
      category: null
    }
  })

  useEffect(() => {
    if (brandValue || categorieValue) {


      let url = `${BaseAPI}/products?`
      if (scanValue) {
        url += `product_barcode=${scanValue}`
      }
      if (brandValue) {
        url += `brand_id=${brandValue}`
      }

      if (categorieValue) {
        url += `category_id=${categorieValue}`
      }

      HTTP.get(url).then(res => {
        setSearchProducts(() => res.data.data)
      }).catch(err => {
      })
    }

  }, [brandValue, categorieValue]);

  console.log({ searchProducts })

  //handle product description
  // const updateScanProducts = (product) => {

  //     if (searchProducts.length === 0) return setSearchProducts(() => [product]);

  //     let isNewProduct = true;
  //     const updateProductDescription = searchProducts.length > 0 &&
  //         searchProducts.map((value) => {
  //             if (value.id !== product.id) return value;
  //             isNewProduct = false;
  //             return value

  //         })

  //     if (isNewProduct) return setSearchProducts(() => [...updateProductDescription, product])
  //     setSearchProducts(() => updateProductDescription);
  // }


  const handleScaneProduct = (e) => {

    // setScanValue(() => e.target.value);
    // setBrandValue(() => 0);
    // setCategorieValue(() => 0);

    //setIsRerender((value)=>!value);
    setScanValue(() => e.target.value)
    HTTP.get(`${BaseAPI}/products?product_barcode=${e.target.value}`)
      .then(res => {
        setScanProducts(() => res.data.data);
        setBrandValue(() => 0);
        setCategorieValue(() => 0);
        setTimeout(() => {
          setScanValue(() => '')
        }, 1000);
        setSearchProducts(() => [])

      })
      .catch(err => {
        console.log(err)
      })
  }

  //get all supplier and category names
  const getSupplierAndCategories = async () => {
    try {
      let res = await HTTP.get(`${BaseAPI}/categories`)
      setCategories(() => res.data.data.map(cat => {
        return {
          label: cat.name,
          value: cat.id
        }
      }))

      res = await HTTP.get(`${BaseAPI}/brands`)
      setBrands(() => res.data.data.map(brand => {
        return {
          label: brand.name,
          value: brand.id
        }
      }))

    } catch (err) {
      console.log(err);
    }
  }

  //get all dependencies
  useEffect(() => {
    getSupplierAndCategories()
  }, []);

  //search all product by selected category
  const handleCategoryChange = (e) => {
    setScanValue(() => '');
    //set input field value
    setBrandValue(() => 0)
    setCategorieValue(() => e);
  }
  //search all product by selected Supplier
  const handleSupplierChange = (e) => {
    setScanValue(() => '');
    //set input field value
    setCategorieValue(() => 0)
    setBrandValue(() => e)
    // console.log({e})
  }


  return <div className="overflow-hidden h-[calc(100vh-35px)] px-1">
    <div className="h-full grid ">
      <div className="row-start-1 row-end-2 flex flex-col text-gray-100 text-md justify-start">
        <div className="flex justify-between mb-1">
          <div className="w-1/4">
            <div className="text-slate-700 text-[14px] font-semibold pb-1">Scan Product:</div>
            <Input
              ref={scanRef}
              size="sm"
              value={scanValue}
              onChange={handleScaneProduct}
              placeholder="scan product barcode"
            />
          </div>
          <div className="w-1/4 text-gray-600">
            <div className="text-slate-700 ext-[15px] font-semibold pb-1">Select Groups:</div>
            <Select
              size="sm"
              placeholder="Select a Group"
              value={brandValue}
              data={brands}
              onChange={handleSupplierChange}
              clearable
            />
          </div>
          <div className="w-1/4 text-gray-600">
            <div className="text-slate-700 ext-[14px] font-semibold pb-1">Select Category:</div>
            <Select
              size="sm"
              placeholder="Select a Category"
              value={categorieValue}
              data={categories}
              onChange={handleCategoryChange}
              clearable
            />
          </div>
          <div className="">
            <img onClick={() => setShowCreatePage(() => false)} className=" bg-sky-500 hover:bg-sky-600 h-8 px-4 py-2 rounded-sm " src={returnImg} />
          </div>

        </div>
        <div className=" col-start-1 col-end-3">
          {
            searchProducts.length === 0 &&
            <AddScanProducts
              addProducts={addProducts}
              setAddProducts={setAddProducts}
              scanProduct={scanProducts}
              setScanProducts={setScanProducts}
            />
          }
          {
            searchProducts.length > 0 &&
            <AddBrandCategories
              addProducts={addProducts}
              setAddProducts={setAddProducts}
              scanProduct={searchProducts}
              setScanProducts={setSearchProducts}
            />
          }
        </div>

        {/* <div className="flex rounded-md">
                    <div onClick={() => setShowReturnProduct((value) => !value)} className="rounded-md cursor-pointer bg-sky-500 px-4 py-2 hover:bg-sky-600 duration-150 active:translate-y-1 active:bg-sky-800 ">
                        {'Return Product'}
                    </div>
                </div> */}
      </div>

      <div className="">

        <Productdetails
          products={addProducts}
          setProducts={setAddProducts}
        />
        {/* :
                        <div className=" col-start-2 col-end-3 p-10 w-full flex justify-center flex-col text-center">
                            <div className="bg-sky-100 pt-6 pb-5 px-6 mx-auto border border-gray-500 rounded-full ">
                                <img className=" h-10 fill-gray-400 " src={purchaseOrder} />
                            </div>
                            <div className="pt-6 font-semibold text-base text-gray-400">Sorry! No Products Selected</div>
                            <div className="pt-3 font-semibold text-base text-gray-500">Please try searching for something else</div>
                        </div> */}

      </div>
      <div className="">
        <Create addProducts={addProducts} setAddProducts={setAddProducts} />
      </div>
    </div>
    {/* <Button className="absolute right-5">Submit</Button> */}
  </div>
}