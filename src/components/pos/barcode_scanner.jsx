import { LoggedInUser } from "@/store/auth";
import {
    BXGXWatchProducts,
    FinalDiscountAmount,
    FinalDiscountPercent,
    POSProducts,
    POSSelectProduct,
    ProductRepeatIDs,
} from "@/store/pos";
import { CashAmountInputRef } from "@/store/pos_focus";
import { Select } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { useAtom } from "jotai";
import { forwardRef, useEffect, useRef, useState } from "react";
import { BaseAPI, HTTP } from "~/repositories/base";

export default function ({ barcodeScannerValue, setBarcodeScannerValue, addToPosProducts, barcodeInputRef, qtyRef }) {
    const [suggestedProducts, setSuggestedProducts] = useState([])
    const [selectProduct, setSelectProduct] = useAtom(POSSelectProduct);

    const [loggedInUser,] = useAtom(LoggedInUser);
    const [posProducts, setPosProducts] = useAtom(POSProducts)
    const [discountAmount, setDiscountAmount] = useAtom(FinalDiscountAmount)
    const [discountPercent, setDiscountPercent] = useAtom(FinalDiscountPercent)
    const [productRepeatIDs, setProductRepeatIDs] = useAtom(ProductRepeatIDs)
    const [bxgxWatchProducts, setBXGXWatchProducts] = useAtom(BXGXWatchProducts)

    const [barcodeText, setBarcodeText] = useState("")
    const [debouncedValue] = useDebouncedValue(barcodeText, 100)

    console.log("suggestedProducts__", suggestedProducts);
    // helper functions
    function isComboBarcode(text) {
        const regexp = new RegExp(/C[0-9]{13}/g)
        return regexp.test(text)
    }

    useEffect(() => {
        barcodeInputRef.current.focus()
    }, [])


    const getProduct = async (barcode) => {
        const res = await HTTP.get(`${BaseAPI}/products/sale-barcode-dynamic-search/${barcode}?hide_zero_stock=true`)
        return res.data.data;
    }

    // const addToPosProducts = (product) => {
    //     const existingPosProduct = posProducts.find(prod => prod.id === product.id)
    //     if (existingPosProduct) {
    //         const newPosProducts = posProducts.map(prod => {
    //             if (prod.id === product.id) {
    //                 return {...prod, quantity: prod.quantity + 1}
    //             }
    //             return prod
    //         })

    //         setPosProducts((prods) => [...newPosProducts])
    //         setBXGXWatchProducts((prods) => [...newPosProducts])
    //     } else {
    //         setPosProducts((prods) => [...prods, {...product, quantity: 1}])
    //         setBXGXWatchProducts((prods) => [...prods, {...product, quantity: 1}])
    //     }

    //     setProductRepeatIDs([...productRepeatIDs, product.id])


    //     // update the disc amount on pos sale
    //     // let discAmount =  (product.discount/100) * product.MRP_price
    //     // if (discountAmount === undefined) discountAmount = 0

    //     //IF any discount available then make discount none

    //     setDiscountPercent(() => loggedInUser?.can_give_discount ? 0 : ( discountPercent + product.discount_percent) / (posProducts.length + 1))
    //     setDiscountAmount(discountAmount + product.discount)
    // }

    useEffect(() => {
        if (debouncedValue) {
            handleSearch(debouncedValue)
        }
    }, [debouncedValue])

    const handleSearch = async (v) => {
        if (!v) {
            return
        }

        let products
        if (isComboBarcode(v)) {
            const combo = await HTTP.get(`${BaseAPI}/promotions/combo/get-one-by-barcode/${v}`)
            products = combo.data.data.products.map(p => p.product)

            const avgPrice = combo.data.data.price / products.length

            products = products.map(p => {
                return {
                    ...p,
                    MRP_price: avgPrice,
                    is_combo: true,
                    quantity_in_combo: combo.data.data.products.find(prod => prod.product_id === p.id).quantity
                }
            })
        } else {
            // get product on this
            products = await getProduct(v)
        }


        // alter this products and add and update some data
        products = products.filter(product => {
            if (!product.vendor_id) {

                // if product is in flat promotion and if that promotion is better than it's own discount then
                // replace own discount with promotion discount
                if (product.flat_promotions.length) {
                    if (product.flat_promotions[0].disc_in_percent > product.discount) {
                        product.discount = product.flat_promotions[0].disc_in_percent
                    }
                }

                //handle product discount percent 
                product["discount_percent"] = product.discount > product.category?.discount_in_percent ? product.discount : product.category?.discount_in_percent;

                // convert product discounts percent to amount
                const productDiscount = (product.discount / 100) * product.MRP_price;
                const discountFromCategory = product.category?.discount_in_percent ? (product.category.discount_in_percent / 100) * product.MRP_price : 0;

                //getting discount from 
                product.discount = productDiscount > discountFromCategory ? productDiscount : discountFromCategory;

                // keep the current discount in a new state, coz discount state will be altered on line discount
                // this will be needed on restricting giving lower discount on line
                product.discount_before_line = product.discount


                // for barcode suggestion ui select data
                product.value = product.unique_id
                product.label = product.name

                return { ...product }
            }


        })

        if (isComboBarcode(v)) {
            products.forEach(p => addToPosProducts(p))
            return
        }

        // check if product length is more than 1
        if (products.length > 1) {
            // set all of the product to suggested products
            setSuggestedProducts(products.map(p => ({
                ...p,
                label: p.name + `${p.style_size ? ' ' + p.style_size : ''} `
            })), 'qtyInputRef')

            // setSuggestedProducts(products, 'qtyInputRef')
            return
        }

        // if (products.length === 1) {
        //     // addToPosProducts(products[0])
        //     setSelectProduct({ ...products[0], quantity: 1 }, 'qtyInputRef');
        //     qtyRef();
        //     setBarcodeText("")
        // }

        if (products.length === 0 && !isNaN(barcodeText)) {
            setBarcodeText("")
        }
    }

    const handleSelect = async (v) => {
        const product = suggestedProducts.find(prod => prod.unique_id === v);
        const ppp_ = posProducts.find(prod => prod.id === product.id);
        if (ppp_) product['rate'] = ppp_.MRP_price;
        setSelectProduct(product ? ({ ...product, quantity: 1, rate: product.rate || product.MRP_price }) : null)
        // addToPosProducts(product)
        setSuggestedProducts([]);
        setBarcodeScannerValue(v);
        // qtyRef();
    };


    const [cashAmountInputRef,] = useAtom(CashAmountInputRef)

    const handleKeyPressOnScanner = (e) => {
        if (e.key === 'Enter' && selectProduct) qtyRef()
        else if (e.key === "F1") cashAmountInputRef.current.focus()
    }
    return (
        <>
            <div>
                <Select
                    searchValue={barcodeText}
                    ref={barcodeInputRef}
                    data={suggestedProducts}
                    searchable
                    initiallyOpened
                    onKeyUp={handleKeyPressOnScanner}
                    onSearchChange={setBarcodeText}
                    onChange={handleSelect}
                    label="Scan Barcode"
                    value={barcodeScannerValue}
                    styles={{
                        dropdown: { backgroundColor: "#e7e7e7" },
                        item: {
                            paddingTop: "0px",
                            paddingBottom: "0px",
                            borderBottom: "1px solid gray",
                            borderRadius: '0px'
                        }
                    }}
                    itemComponent={forwardRef(({ name, supplier, vendor_company_name, style_size, ...others }, ref) => {
                        // console.log({ref})
                        return <>
                            <div ref={ref} id="1" {...others}>
                                <div
                                    className={"focus:bg-amber-500 "}>{name + `${style_size ? ' ' + style_size : ''} `}
                                </div>
                                <div style={{ fontSize: "11px" }}>{supplier?.company_name}</div>
                            </div>
                        </>
                    })}
                />
            </div>
        </>
    )
}

