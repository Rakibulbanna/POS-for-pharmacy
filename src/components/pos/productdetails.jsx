import { LoggedInUser } from "@/store/auth";
import {
  BXGXWatchProducts,
  ExchangeProducts,
  FinalDiscountAmount, FinalDiscountPercent, POSFreeProducts,
  POSProducts,
  ProductRepeatIDs,
  QuantityFocus,
  ScanFocus, WholeSaleView
} from "@/store/pos";
import { QuantityInFocus } from "@/store/pos_focus";
import { Button, NumberInput } from "@mantine/core";
import { useFocusTrap } from "@mantine/hooks";
import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { useNotification } from "~/hooks/useNotification";

export default function () {
  const [posProducts, setPosProducts] = useAtom(POSProducts)
  const [posFreeProduct,] = useAtom(POSFreeProducts)
  const [loggedInUser,] = useAtom(LoggedInUser)
  const [quantityFocus, setQuantityFocus] = useAtom(QuantityInFocus)
  const [discountAmount, setDiscountAmount] = useAtom(FinalDiscountAmount)
  const [discountPercent, setDiscountPercent] = useAtom(FinalDiscountPercent)
  const [productRepeatIDs, setProductRepeatIDs] = useAtom(ProductRepeatIDs)
  const [bxgxWatchProducts, setBXGXWatchProducts] = useAtom(BXGXWatchProducts)
  const [exchangeProducts, setExchangeProducts] = useAtom(ExchangeProducts)
  const [wholeSaleView] = useAtom(WholeSaleView)

  const quantityFocus_ = useFocusTrap(quantityFocus)
  const tempQuantityFocus = useRef()
  const [, useFocus] = useNotification()

  //handle update product
  function handleDeleteProduct(productID) {
    let newPosProducts = posProducts.filter((value) =>
      value.id !== productID
    )
    setDiscountPercent(() => {
      if (loggedInUser?.can_give_discount) return 0;
      const totalDiscountPercent = newPosProducts.reduce((prev, curr) => prev + curr.discount_percent, 0);

      const finalTotalPercent = newPosProducts.length > 0 ? totalDiscountPercent / newPosProducts.length : 0;

      return finalTotalPercent;

    });
    setDiscountAmount(newPosProducts.map(prod => prod.discount * prod.quantity).reduce((pv, cv) => pv + cv, 0));
    setPosProducts(() => newPosProducts)
  }

  const handleQuntityChange = (id, quantity) => {
    const newPosProducts = posProducts.map(prod => {
      if (prod.id === id) {
        return { ...prod, quantity: quantity }
      }
      return prod
    })

    let totalDiscountAmount = 0;
    let totalDiscountPercent = 0;

    if (loggedInUser?.can_give_discount) {
      console.log('provide discount')

      totalDiscountAmount = newPosProducts.reduce((prev, curr) => {
        const discount = curr.discount_before_line ? curr.discount * curr.quantity : curr.discount;
        return prev + discount;
      }, 0);


      // let any_discount_before_line = false;

      // const totalMRP = newPosProducts.reduce((prev, curr) => {
      //   const mrpPrice = curr.discount_before_line ? curr.MRP_price * curr.quantity : curr.MRP_price;
      //   if (curr.discount_before_line) any_discount_before_line = true;
      //   return prev + mrpPrice;
      // }, 0);

      // totalDiscountPercent = any_discount_before_line ? 0 : (totalDiscountAmount / totalMRP) * 100;

    }
    else {
      console.log('not provide')
      totalDiscountAmount = newPosProducts.reduce((prev, curr) => prev + (curr.discount * curr.quantity), 0);

      const totalMRP = newPosProducts.reduce((prev, curr) => prev + curr.MRP_price * curr.quantity, 0);
      totalDiscountPercent = (totalDiscountAmount / totalMRP) * 100;
    }

    setDiscountAmount(totalDiscountAmount)
    setDiscountPercent(totalDiscountPercent)
    // if (loggedInUser?.can_give_discount) setDiscountAmount(newPosProducts.map(prod => prod.discount).reduce((pv, cv) => pv + cv, 0));
    // else setDiscountAmount(() => newPosProducts.map(prod => prod.discount * prod.quantity).reduce((pv, cv) => pv + cv, 0))

    setPosProducts(newPosProducts)
    setBXGXWatchProducts(newPosProducts)

    // product repeat id
    let productIDsExcludingThisID = productRepeatIDs.filter(ID => ID !== id)
    for (let i = 0; i < quantity; i++) {
      productIDsExcludingThisID.push(id)
    }
    setProductRepeatIDs(productIDsExcludingThisID)
  }


  function handleDiscountPercentChange(id, percent) {
    const newPosProducts = posProducts.map(prod => {
      if (prod.id === id) {
        if (prod.discount_before_line > percent) {
          return prod
        }

        return {
          ...prod, discount: percent || 0, discount_percent: (percent / prod.MRP_price) * 100, discount_type: "manual"
        }
      }
      return prod
    })
    setPosProducts(newPosProducts)

    // calculate new discout amount and set
    let totalDiscountAmount = 0;
    let totalDiscountPercent = 0;

    if (loggedInUser?.can_give_discount) {

      // totalDiscountAmount = newPosProducts.reduce((prev, curr) => prev + curr.discount, 0);

      // const totalMRP = newPosProducts.reduce((prev, curr) => prev + curr.MRP_price, 0);
      // totalDiscountPercent = (totalDiscountAmount / totalMRP) * 100;
      totalDiscountAmount = newPosProducts.reduce((prev, curr) => {
        const discount = curr.discount_before_line ? curr.discount * curr.quantity : curr.discount;
        return prev + discount;
      }, 0);


      // let any_discount_before_line = false;

      // const totalMRP = newPosProducts.reduce((prev, curr) => {
      //   const mrpPrice = curr.discount_before_line ? curr.MRP_price * curr.quantity : curr.MRP_price;
      //   if (curr.discount_before_line) any_discount_before_line = true;
      //   return prev + mrpPrice;
      // }, 0);

      // totalDiscountPercent = any_discount_before_line ? 0 : (totalDiscountAmount / totalMRP) * 100;

    }
    else {
      console.log('not provide')
      totalDiscountAmount = newPosProducts.reduce((prev, curr) => prev + (curr.discount * curr.quantity), 0);

      const totalMRP = newPosProducts.reduce((prev, curr) => prev + curr.MRP_price * curr.quantity, 0);
      totalDiscountPercent = (totalDiscountAmount / totalMRP) * 100;
    }

    setDiscountAmount(totalDiscountAmount)
    setDiscountPercent(totalDiscountPercent)
  }

  const [scanFocus, setScanFocus] = useAtom(ScanFocus)
  function handleQuantitySet(e) {
    if (e.key === "Enter") {
      setTimeout(() => {
        useFocus("scanner")
      }, 10);
    }
  }

  const handleMRPPriceUpdate = (productID, price) => {
    const newPosProducts = posProducts.map(prod => {
      if (prod.id === productID) {
        return { ...prod, MRP_price: price }
      }
      return prod
    })

    setPosProducts(newPosProducts)
  }

  const productListView = (index, product) => {
    console.log("product__", product);
    return (
      <>
        <tr key={product.unique_id} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'} border-b  border-gray-700`}>
          <th className="px-2">{index + 1}</th>
          <td className="px-2">{product.product_barcode}</td>
          <td className="px-2 w-full">
            <strong>{`${product.name}${product?.brand ? ", " + product?.brand.name : ""}, ${product.style_size} `}</strong>
            <br />
            <span style={{ fontSize: '12px' }}>{product.vendor_company_name ? `Vendor : ${product.vendor_company_name}` : `Supplier : ${product?.supplier?.company_name}`}  </span>
          </td>
          <td className="px-2">
            <NumberInput size={'xs'} style={{ width: '100px' }}
              // if whole_sale_price is not given then price will be the MRP price
              value={wholeSaleView ? (product.whole_sale_price ? product.whole_sale_price : product.MRP_price) : product.MRP_price} onChange={v => handleMRPPriceUpdate(product.id, v)}
              precision={2}
              readOnly={true}
            />
          </td>
          <td className="px-2">
            <NumberInput
              onChange={(e) => handleQuntityChange(product.id, e || 0)}
              size="xs"
              style={{ width: '100px' }}

              value={product.quantity}
              ref={index + 1 === posProducts.length ? quantityFocus_ : tempQuantityFocus}
              onKeyUp={handleQuantitySet}
              precision={3}
              max={product.stock}
              min={0}
            />
          </td>

          <td className="px-2">
            <NumberInput

              size="xs"
              style={{ width: '100px' }}
              disabled
              value={product.quantity * (wholeSaleView ? (product.whole_sale_price ? product.whole_sale_price : product.MRP_price) : product.MRP_price)}
              ref={index + 1 === posProducts.length ? quantityFocus_ : tempQuantityFocus}

              precision={3}

            />
          </td>
          {/* <td className="py-4 px-6">
                  {product.cost_price}
                </td> */}
          <td className="px-2">
            <NumberInput
              hideControls
              size="xs"
              style={{ width: '100px' }}
              value={product.discount}
              onChange={(v) => handleDiscountPercentChange(product.id, v || 0)}
              min={product.discount_before_line}
              disabled={!loggedInUser?.can_give_discount || product.discount_before_line}
              max={product.MRP_price * (loggedInUser?.maximum_discount / 100)}
              precision={2}
            />
          </td>

          <td className="px-2">
            <Button onClick={() => handleDeleteProduct(product.id)} size='xs' color={"red"}> Delete</Button>
          </td>
        </tr>
      </>
    )
  }

  return (
    <>
      <div className="pr-2 overflow-auto h-[calc(100vh-160px)] ">
        <table className="w-full text-[12px] text-left">
          <thead className="uppercase bg-gray-700 text-gray-300 sticky top-0 left-0 z-10">
            <tr>
              <th className="py-1 px-2">SL</th>
              <th className="py-1 px-2">Barcode</th>
              <th style={{ maxWidth: '5px' }} className="py-2 px-2  ">Product Name</th>
              <th className="py-1 px-2">{wholeSaleView ? "WS Price" : "MRP Price(TK)"}</th>
              <th className="py-1 px-2">Quantity</th>
              <th className="py-1 px-2">Total {wholeSaleView ? "WS" : "MRP(TK)"}</th>
              <th className="py-1 px-2">{loggedInUser?.can_give_discount ? 'D. Amount' : 'Discount ( % )'}</th>
              <th className="py-1 px-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {posProducts.map((product, index) => (
              <>{productListView(index, product)}</>
            ))}
            {posFreeProduct.map((product, index) => (
              <>{productListView(index, product)}</>
            ))}

            {/* EXCHANGE PRODUCTS LIST */}
            {
              exchangeProducts.length > 0
              &&
              <>
                <tr>
                  <th colSpan={7} className="p-2">Exchange Products:</th>
                </tr>
                {
                  exchangeProducts.map((product, index) => (
                    <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'} border-b  border-gray-700`}>
                      <th className="px-2">{index + 1}</th>
                      <td className="px-2">{product.product_barcode}</td>
                      <td className="px-2 w-full">
                        {product.name}
                        <br />
                        {product.vendor_company_name || product?.supplier?.company_name}
                      </td>
                      <td className="px-2">
                        <NumberInput
                          disabled
                          size={'xs'}
                          style={{ width: '100px' }}
                          value={product.MRP_price}
                          onChange={v => handleMRPPriceUpdate(product.id, v)} />
                      </td>
                      <td className="px-2">
                        <NumberInput
                          disabled
                          onChange={(e) => handleQuntityChange(product.id, e)}
                          size="xs"
                          style={{ width: '100px' }}
                          value={product.quantity}
                          ref={index + 1 === posProducts.length ? quantityFocus_ : tempQuantityFocus}
                          onKeyUp={handleQuantitySet}
                          precision={2}
                        />
                      </td>
                      {/* <td className="py-4 px-6">
                                      {product.cost_price}
                                  </td> */}
                      < td className="px-2" >
                        <NumberInput
                          hideControls
                          size="xs"
                          style={{ width: '100px' }}
                          value={product.discount}
                          min={product.discount_before_line}
                          disabled={true}
                        />
                      </td>
                      <td className="px-2">
                        {/* <Button
                          onClick={() => handleDeleteProduct(product.id)}
                          size='xs'
                          color={"red"}
                        >
                          Delete
                        </Button> */}
                      </td>
                    </tr>

                  ))
                }
              </>
            }
            <tr></tr>
          </tbody>
        </table>
      </div >
    </>
  )
}


