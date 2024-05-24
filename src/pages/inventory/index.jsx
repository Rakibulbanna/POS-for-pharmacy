import { useEffect, useState, useRef } from "react";
import { Button, Input, NumberInput, Select, Switch } from "@mantine/core";
import { useMergedRef, useDebouncedValue, useResizeObserver } from "@mantine/hooks";
import { BaseAPI, HTTP } from "~/repositories/base";
import { showNotification } from "@mantine/notifications";
import { useAtom } from "jotai";
import {
  allAddedProducts
} from "@/store/inventory";
import Preview from "@/components/inventory/preview";
import { useReactToPrint } from "react-to-print";
import usePrint from "~/hooks/usePrint";
import PdfPreview from "@/components/inventory/pdfPreview";

export default function () {
  const [products, setProducts] = useState(null);
  const [addedProducts, setAddedProducts] = useAtom(allAddedProducts);

  const [ready, setReady] = useState(true)
  const [disabled, setDisabled] = useState(true)
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [searchText, setSearchText] = useState("")
  const [autoEntry, setAutoEntry] = useState(true);
  const [debouncedValue] = useDebouncedValue(searchText, 500);
  const [showPreview, setShowPreview] = useState(false);
  const [barcodeRender, setbarcodeRender] = useState(false);

  const [grandTotal, setGrandTotal] = useState({});

  const [rePrintData, setRePrintData] = useState("");

  const showPdf = useRef();
  const scanSelector = useRef();
  const clickAddButton = useRef();

  const [print] = usePrint();

  const [posReceiptSizeRef, rect] = useResizeObserver();
  const purchaseOrdersPrintComponent = useMergedRef(showPdf, posReceiptSizeRef)

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
    content: () => showPdf.current,
    print: doPrint
  });

  useEffect(() => {
    // if (supplierID) {
    // setDisabled(false)
    let url = `${BaseAPI}/products?per_page=10`;
    if (searchText) url += `&name=${searchText}`;

    HTTP.get(url).then(res => {
      const products = res.data.data
      const alteredProducts = products.map(prod => {
        return { ...prod, label: `${prod.name} ${prod.style_size ? prod.style_size : ''}`, value: prod.id }
      })
      setSuggestedProducts(() => alteredProducts)
    }).catch(err => {
      console.log(err)
    })
    // }
  }, [debouncedValue])

  useEffect(() => {
    if (debouncedValue) {
      handleSearch(debouncedValue)
    }
  }, [debouncedValue])


  const getProduct = async (barcode) => {
    const res = await HTTP.get(`${BaseAPI}/products?product_barcode=${barcode}`)
    return res.data.data
  }

  const handleSearch = async (barcode) => {

    const products = await getProduct(barcode)
    console.log({ products })
    if (products.length === 1) {
      const updateProduct = autoEntry ? { ...products[0], available_stock: 1 } : { ...products[0], available_stock: 0 };
      setProducts(() => updateProduct);
      autoEntry && setbarcodeRender(() => true)

    }
    if (products.length > 1) {
      showNotification({
        title: "Found more than one product",
        message: "Multiple Products founds using this product_barcode",
        styles: (theme) => ({
          root: {
            backgroundColor: theme.colors.yellow[6],
            borderColor: theme.colors.yellow[6],

            '&::before': { backgroundColor: theme.white },
          },

          title: { color: theme.white },
          description: { color: theme.white },
          closeButton: {
            color: theme.white,
            '&:hover': { backgroundColor: theme.colors.yellow[7] },
          },
        }),
      });
      // return ;
      // const alteredProducts = products.map(prod => {
      //   return ({ ...prod, label: `${prod.name} ${prod.style_size ? prod.style_size : ''}`, value: prod.id })
      // });
      // console.log({ alteredProducts });
      // setSuggestedProducts(() => alteredProducts);
    }

  }

  //for barcode auto add
  useEffect(() => {
    if (barcodeRender && products) {
      console.log({ "BARCODE": products })
      handleAdd();
      // clickAddButton.current.click();
      setbarcodeRender(() => false);
      scanSelector.current.value = ''
    }
  }, [products, barcodeRender]);
  // console.log({ products });


  const handleSelect = async (v) => {
    if (v) {
      const product = suggestedProducts.find(prod => prod.id === v);

      setProducts(() => ({ ...product, available_stock: autoEntry ? 1 : 0 }))
    } else {
      setProducts(() => null)
    }

    // setSuggestedProducts([])
  }

  const handleAdd = () => {

    if (addedProducts.length > 0) {
      const isAvailableAddedProducts = addedProducts.filter((value) => value.id === products.id);
      let filterAddedProducts = [];
      if (isAvailableAddedProducts.length > 0) {
        filterAddedProducts = addedProducts.map((value) => value.id === products.id ? ({ ...value, available_stock: value.available_stock + products.available_stock }) : value);
      }
      else {
        filterAddedProducts = [products, ...addedProducts]
      }
      setAddedProducts(() => filterAddedProducts);
    }
    else {
      setAddedProducts(() => [products]);
    }
    setProducts(() => null)
  }

  const handleRemoveproduct = (id) => {
    const filterAddedProducts = addedProducts.filter((value) => value.id !== id);
    setAddedProducts(() => filterAddedProducts);
    console.log({ filterAddedProducts })
    if (filterAddedProducts.length === 0) localStorage.setItem("inventory", JSON.stringify(filterAddedProducts));
  }

  const handleAvailableStockChange = (currStock) => {
    // console.log({ currStock })
    setProducts(value => ({ ...value, available_stock: currStock ? currStock : 0.00 }))
  }

  const handleSelectedProductPreview = () => {
    setShowPreview(true)
  }

  const handleSelectedProductsSubmit = () => {

    const customId = new Date().getTime();
    // console.log({ customId })

    HTTP.post(`${BaseAPI}/stock_ledger/${customId}`, addedProducts).then(res => {
      showNotification({
        title: "Success",
        message: "Category updated"
      });
      setAddedProducts(() => []);
      localStorage.setItem("inventory", JSON.stringify([]));
      handlePrint();
    }).catch((err) => {
      showNotification({
        title: "Error",
        message: "Updated Problems",
        color: 'red'
      });
    })



    // setSuggestedProducts(() => []);


  }

  useEffect(() => {

    if (addedProducts.length === 0) return;
    localStorage.setItem("inventory", JSON.stringify(addedProducts));

  }, [addedProducts]);

  // const handleCreateSession = () => {
  //   const session = new Date().getTime();
  //   console.log({ session });
  // }

  // const data = localStorage.getItem('inventory');
  // console.log({ data: JSON.parse(data) })
  // console.log({ searchText, products, addedProducts })
  // console.log({ autoEntry })

  console.log({ addedProducts });
  useEffect(() => {
    const total = {
      stock: 0,
      available_stock: 0,
      stock_difference: 0,
      cost_price: 0,
      MRP_price: 0,
      total_cost_price: 0,
      total_MRP_price: 0,
    };

    addedProducts.forEach(product => {
      total.stock += product.stock;
      total.available_stock += product.available_stock;
      total.stock_difference += product.available_stock - product.stock
      total.cost_price += product.cost_price;
      total.MRP_price += product.MRP_price;
      total.total_cost_price += product.cost_price * product.available_stock;
      total.total_MRP_price += product.MRP_price * product.available_stock;
    })
    console.log({ total });
    setGrandTotal(() => total);
  }, [addedProducts]);

  return (
    <>
      {
        !showPreview ?
          <>
            <div className="flex gap-2 mb-2">
              <div className="w-1/4 p-2 flex flex-col justify-center" style={{ border: '1px solid #cbd5e1' }}>
                {/* <div className="flex gap-4">
            <Input lebel="Session Id" />
            <Button onClick={handleCreateSession} >Create Session</Button>
          </div> */}

                {
                  // <Select
                  //   data={suggestedProducts}
                  //   searchable
                  //   // initiallyOpened
                  //   onSearchChange={v => setSearchText(v)}
                  //   onChange={handleSelect}
                  //   label="Scan Product"
                  //   // ref={scannerFocus}
                  //   styles={{ dropdown: { backgroundColor: "#f1f5f9" } }}
                  //   clearable
                  // />

                  // <div>
                  //   <lebel className="font-semibold">Scan Product</lebel>
                  //   <Input  placeholder="scan product barcode" clearable />
                  // </div>
                }
                {
                  <Select
                    ref={scanSelector}
                    data={suggestedProducts}
                    searchable
                    // initiallyOpened
                    onSearchChange={v => setSearchText(v)}
                    onChange={handleSelect}
                    label="Search Product"
                    // ref={scannerFocus}
                    styles={{ dropdown: { backgroundColor: "#f1f5f9" } }}
                    clearable
                  />
                }

              </div>
              <div className="w-3/4" style={{ border: '1px solid #cbd5e1' }}>
                {/* <div className="flex p-2 xt-base font-semibold justify-between gap-4 w-3/4">
          
          <div className="bg-slate-100 w-full relative top-2 text-center flex flex-col justify-center">Stock: {products?.stock}</div>
          <div className="bg-slate-100 w-full relative top-2 text-center flex flex-col justify-center">Category: {products?.category?.name}</div>
          <div className="bg-slate-100 w-full relative top-2 text-center flex flex-col justify-center">Color: {products?.color?.name}</div>
        </div> */}
                <div className="flex p-2 xt-base font-semibold justify-center gap-4 text-xs " >
                  <div style={{ border: '1px solid #cbd5e1' }} className="w-full p-1 text-center flex flex-col justify-center">Name: {products?.name}</div>
                  <div style={{ border: '1px solid #cbd5e1' }} className="w-full p-1 text-center flex flex-col justify-center">Stock Qty: {products?.stock}</div>
                  <div className=" w-1/3 flex flex-col justify-center gap-1">
                    <lebel>Auto Entry</lebel>
                    <Switch checked={autoEntry} onChange={(e) => setAutoEntry(e?.currentTarget?.checked)} lebel="Man" onLabel="ON" offLabel="OFF" />
                  </div>
                  <div style={{ border: '1px solid #cbd5e1' }} className="w-full p-1 flex text-center justify-center">
                    <lebel className='relative mt-2 pr-2 w-1/2 '>Available Stock</lebel>
                    <NumberInput
                      className="w-1/2"
                      disabled={products && !autoEntry ? false : true}
                      defaultValue={0.00}
                      value={products ? products?.available_stock : 0}
                      onChange={handleAvailableStockChange}
                      precision={2}
                    />
                  </div>

                </div>
                <div className="p-2">
                  <Button ref={clickAddButton} className=" w-full" disabled={products?.id && (!autoEntry || products?.available_stock) ? false : true} onClick={handleAdd}>Add</Button>
                </div>

              </div>
            </div>

            {/* show datas table 266px */}
            <div className="h-[calc(100vh-200px)] overflow-auto" style={{ border: '1px solid #cbd5e1' }}>
              <table className="w-full overflow-auto  text-xs text-left text-gray-500 ">
                <thead className="text-xs uppercase bg-gray-600 text-gray-200 sticky -top-1 left-0 z-10">
                  <tr>
                    <th scope="col" className="p-2">Id</th>
                    <th scope="col" className="p-2">Product Barcode</th>
                    <th scope="col" className="p-2">Product Name</th>
                    <th scope="col" className="p-2">Category Name</th>
                    <th scope="col" className="p-2">Group</th>
                    <th scope="col" className="p-2">CPU</th>
                    <th scope="col" className="p-2">RPU</th>
                    <th scope="col" className="p-2">Prev Stock</th>
                    <th scope="col" className="p-2">Available Stock</th>
                    <th scope="col" className="p-2">MORE/LESS Stock</th>
                    <th scope="col" className="p-2">Total CPU</th>
                    <th scope="col" className="p-2">Total RPU</th>
                    <th scope="col" className="p-2">ACTION</th>
                  </tr>
                </thead>
                <tbody className="">
                  {
                    addedProducts.length > 0 && addedProducts.map((item, index) => (
                      <tr key={item.id} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-300'} border-b border-gray-700 hover:bg-slate-200 duration-150 h-fit`}>
                        <th scope="row" className="pl-2 font-sm text-gray-900 whitespace-nowrap">
                          {item.id}
                        </th>
                        <td className="pl-2 px-6">{item.product_barcode}</td>
                        <td className="pl-2 px-6">{item.name}</td>
                        <td className="pl-2 px-6">{item.category.name}</td>
                        <td className="pl-2 px-6">{item.brand.name}</td>
                        <td className="pl-2 w-40">{item.cost_price}</td>
                        <td className="pl-2 w-40">{item.MRP_price}</td>
                        <td className="pl-2 w-40">{item.stock}</td>
                        <td className="pl-2 w-40">{item.available_stock}</td>
                        <td className="pl-2 w-40">{item.available_stock - item.stock}</td>
                        <td className="pl-2 w-40">{item.available_stock * item.cost_price}</td>
                        <td className="pl-2 w-40">{item.available_stock * item.MRP_price}</td>
                        <td className="pl-2 w-40"><Button color="red" size="xs" onClick={() => handleRemoveproduct(item.id)}>Remove</Button></td>
                      </tr>
                    ))

                  }
                </tbody>
                <tfoot className="sticky bottom-0 right-0 z-10 bg-slate-500 text-slate-50">
                  <td className="pl-2 px-6 py-2 text-right" colSpan={5}>Grand Total</td>
                  <td className="pl-2 px-6 py-2">{grandTotal?.cost_price}</td>
                  <td className="pl-2 px-6 py-2">{grandTotal?.MRP_price}</td>
                  <td className="pl-2 px-6 py-2">{grandTotal?.stock}</td>
                  <td className="pl-2 px-6 py-2">{grandTotal?.available_stock}</td>
                  <td className="pl-2 px-6 py-2">{grandTotal?.stock_difference}</td>
                  <td className="pl-2 px-6 py-2">{Number(grandTotal?.total_cost_price).toFixed(2)}</td>
                  <td className="pl-2 px-6 py-2">{Number(grandTotal?.total_MRP_price).toFixed(2)}</td>
                  <td></td>
                </tfoot>
              </table>
            </div>
            <div className="mt-2 flex gap-2">
              <Button fullWidth color={"yellow"} disabled={addedProducts.length > 0 ? false : true} onClick={handleSelectedProductsSubmit}>Submit</Button>
              <Button fullWidth disabled={addedProducts.length > 0 ? false : true} onClick={handleSelectedProductPreview}>Preview</Button>
            </div>
          </>
          :
          <div >
            <Preview grandTotal={grandTotal} addedProducts={addedProducts} setShowPreview={setShowPreview} />
          </div>
      }
      {
        <div className="hidden">
          <div ref={showPdf}>
            <PdfPreview addedProducts={addedProducts} />
          </div>
        </div>
      }
    </>
  )
}