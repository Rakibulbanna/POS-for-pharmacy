import { Image, Button, Tooltip, Select, TextInput, NumberInput, Menu, ActionIcon, Switch, Checkbox, Paper } from "@mantine/core";
import { showNotification } from "@mantine/notifications"
import { useEffect, useRef, useState } from "react"
import { BaseAPI, HTTP } from "~/repositories/base"
import Productdetails from "@/components/pos/productdetails";
import emptyImages from "../../images/empty-product.svg";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import Returnproduct from "@/components/pos/returnproduct";
import purchaseOrder from "~/src/images/purchase-order.svg";
import { IconChevronUp } from "@tabler/icons"
import { atom, useAtom } from "jotai";
import {
    ExchangeAmount,
    FinalDiscountAmount,
    ShouldApplyFinalDiscount,
    PayAmount,
    PaymentCardAmount,
    PaymentCashAmount,
    PaymentRedeemAmount,
    Payments,
    POSProducts,
    ReturnAmount,
    SelectedCardType,
    SelectedCustomer,
    Holds as AtomHolds,
    ProductRepeatIDs,
    BXGXWatchProducts,
    CustomerSearchValue,
    Exchanges,
    FinalDiscountDisabled, AllDiscountAmount, ExchangeProducts, WholeSaleView, POSFreeProducts, FinalDiscountPercent, POSSelectProduct, InvoicePrint, generatedInvoiceId
} from "@/store/pos";
import Payment_info from "@/components/pos/payment_info";
import Amount_info from "@/components/pos/amount_info";
import EmptyNotification from "@/utility/emptyNotification";
import { LoggedInUser } from "@/store/auth";
import Holds from "@/components/pos/holds";
import BarcodeScanner from "@/components/pos/barcode_scanner";
import Receipt from "@/components/pos/receipt";


import { useDebouncedState, useElementSize, useFocusTrap, useMergedRef, useResizeObserver } from "@mantine/hooks";
import { SaveNPrintButtonRef, SaveNPrintInFocus } from "@/store/pos_focus";

import XNumberInput from "@/components/pos/NumberInput";
import { NetAmount, TotalPrice, VATAmount } from "@/store/pos";
import usePrint from "~/hooks/usePrint";
import { Setting } from "@/store/setting";
import Customer from "@/components/pos/customer"
import CreateEditCustomerForm from "@/components/customers/createEditCustomerForm";
import { HTTPCall } from "~/lib/http";
import dayjs from "dayjs";
import SearchNScan from "@/components/SearchNScan";


export default function () {
    const { Target, Dropdown, Item } = Menu
    // less important states
    const [customers, setCustomers] = useState([])
    const [saveNPrintDisabled, setSaveNPrintDisabled] = useState(true)
    const [activeBXGXList, setActiveBXGXList] = useState([])
    const [bxgxWatchProducts, setBXGXWatchProducts] = useAtom(BXGXWatchProducts)
    const [isCustomerSearchReady, setIsCustomerSearchReady] = useState(true)
    const [finalDiscountDisabled, setFinalDiscountDisabled] = useAtom(FinalDiscountDisabled)

    const [invoicePrint, setInvoicePrint] = useAtom(InvoicePrint);

    const [productDescription, setProductDescription] = useState([]);
    const [returnModalOpen, setReturnModalOpen] = useState(false);
    const [holds, setHolds] = useAtom(AtomHolds)
    const [cantSaleReason, setCantSaleReason] = useState("")
    const [allDiscountAmount, setAllDiscountAmount] = useAtom(AllDiscountAmount)
    const [posFreeProducts, setPosFreeProducts] = useAtom(POSFreeProducts)

    const [selectedCardType, setSelectedCardType] = useAtom(SelectedCardType)
    const [selectedCustomer, setSelectedCustomer] = useAtom(SelectedCustomer)

    const [selectProduct, setSelectProduct] = useAtom(POSSelectProduct);

    const [posProducts, setPosProducts] = useAtom(POSProducts)
    const [loggedInUser,] = useAtom(LoggedInUser);
    const [, setPaymentCashAmount] = useAtom(PaymentCashAmount)
    const [, setPaymentCardAmount] = useAtom(PaymentCardAmount)
    const [, setPaymentRedeemAmount] = useAtom(PaymentRedeemAmount)
    const [exchangeAmount, setExchangeAmount] = useAtom(ExchangeAmount)
    const [payments] = useAtom(Payments);
    const [setting] = useAtom(Setting)
    const [totalPrice] = useAtom(TotalPrice)
    const [redeemAmount, setRedeemAmount] = useAtom(PaymentRedeemAmount)
    const [payAmount] = useAtom(PayAmount)
    const [netAmount] = useAtom(NetAmount)
    const [returnAmount] = useAtom(ReturnAmount)
    const [cardAmount] = useAtom(PaymentCardAmount)
    const [productRepeatIDs, setProductRepeatIDs] = useAtom(ProductRepeatIDs)
    const [customerSearchValue, setCustomerSearchValue] = useAtom(CustomerSearchValue)
    const [exchanges, setExchanges] = useAtom(Exchanges)
    const [exchangeProducts, setExchangeProducts] = useAtom(ExchangeProducts);
    const [wholeSaleView, setWholeSaleView] = useAtom(WholeSaleView)

    const [rePrintData, setRePrintData] = useState("");
    const [reRenderCustomers, setReRenderCustomers] = useState(false);

    const [NewInvoiceId, setNewInVoiceId] = useAtom(generatedInvoiceId);

    const [invoiceId, setInVoiceId] = useState(null);

    const [membersType, setMembersType] = useState([]);

    const [saveNPrintButtonRef, setSaveNPrintButtonRef] = useAtom(SaveNPrintButtonRef)

    const [discountAmount, setDiscountAmount] = useAtom(FinalDiscountAmount)
    const [discountPercent, setDiscountPercent] = useAtom(FinalDiscountPercent)

    const printComponentRef = useRef();
    const saveNPrintRef = useRef(null)
    const qtyRef = useRef();
    const rateRef = useRef();
    const barcodeInputRef = useRef(null)

    const [barcodeScannerValue, setBarcodeScannerValue] = useState(0);

    useEffect(() => {
        if (!NewInvoiceId) {
            setNewInVoiceId(Date.now())
        }
    }, [NewInvoiceId])



    useEffect(() => {
        setSaveNPrintButtonRef(saveNPrintRef)
    }, [saveNPrintRef])

    // ref for print pos Receipt component
    const posReceipt = useRef();

    useEffect(() => {
        HTTP.get(`${BaseAPI}/customers`).then(res => {
            setCustomers(() => res.data.data.map(cus => {
                return {
                    ...cus,
                    label: cus.first_name + " " + cus.last_name,
                    value: cus.id,
                }
            }))
        }).catch(err => {
            console.log(err);
        })

        HTTP.get(`${BaseAPI}/promotions/bxgx?active=true`).then(res => {
            setActiveBXGXList(res.data.data)
        }).catch(err => {
            console.log(err)
        })

    }, []);


    //get members types
    useEffect(() => {
        HTTP.get(`${BaseAPI}/membership-types`)
            .then(res => {
                setMembersType(() => res.data.data);
            })
            .catch(err => {
                console.log(err);
            })
    }, []);

    useEffect(() => {
        if (!!!posProducts.length) return

        setFreeGetProducts()
    }, [bxgxWatchProducts])

    const setFreeGetProducts = async () => {
        const freeProducts = []

        for (const product of posProducts) {
            for (const bxgx of activeBXGXList) {
                const buyProductInfo = bxgx.products.find(p => p.type === 1)
                if (buyProductInfo.product_id === product.id) {
                    if (Math.floor(product.quantity / buyProductInfo.quantity) !== 0) {
                        const getProductInfo = bxgx.products.find(p => p.type === 2)
                        const [res, err] = await HTTPCall(`/products/${getProductInfo.product_id}`)
                        if (err) return

                        freeProducts.push({
                            ...res.data.data,
                            // quantity: Math.floor(product.quantity / buyProductInfo.quantity),
                            quantity: getProductInfo.quantity * Math.floor(product.quantity / buyProductInfo.quantity),
                            MRP_price: 0
                        })
                    }
                }
            }
        }
        setPosFreeProducts(freeProducts)
    }


    const [finalDiscountAmount, setFinalDiscountAmount] = useAtom(FinalDiscountAmount)
    const [shouldApplyFinalDiscountAmount, setShouldApplyFinalDiscountAmount] = useAtom(ShouldApplyFinalDiscount)
    const [finalDiscountPercent, setFinalDiscountPercent] = useAtom(FinalDiscountPercent)

    useEffect(() => {

        let allOkay = true

        if (cardAmount && !selectedCardType) {
            allOkay = false
        }

        if (!posProducts.length) {
            allOkay = false
        }

        const totalCost = posProducts.map(p => {
            if (p.MRP_price === 0) {
                return 0
            }
            return p.cost_price * p.quantity
        }).reduce((pv, cv) => pv + cv, 0)
        let exchngAmount = 0
        if (exchangeAmount !== undefined) {
            exchngAmount = exchangeAmount
        }
        if ((!payAmount && !exchangeAmount) || (payAmount + exchngAmount < totalCost)) {
            allOkay = false
        }

        if (selectedCardType === "CREDIT") {
            let remainingCredit = selectedCustomer.credit_limit - selectedCustomer.credit_spend
            if (cardAmount > remainingCredit) {
                allOkay = false;
            }
        }


        // check if final discount is below the average of per product
        // get the avrg discount
        // if (allDiscountAmount){
        //   const avrg = allDiscountAmount/posProducts.length
        //   posProducts.forEach(p=>{
        //     const priceAfterDiscount = p.MRP_price - avrg
        //     if (priceAfterDiscount < p.cost_price){
        //       allOkay = false;
        //       setCantSaleReason("Bellow Cost Price")
        //     }
        //   })
        // }
        // for  each pos product if price after discount < cost price
        // block the sale


        if (allOkay) {
            setSaveNPrintDisabled(false)
            setCantSaleReason("")
        } else {
            setSaveNPrintDisabled(true)
        }


        // check if you can disable final discount
        posProducts.forEach(p => {
            if (p.discount) {
                setFinalDiscountDisabled(true)
            }
        })
    }, [posProducts, cardAmount, selectedCardType, payAmount, exchangeAmount, allDiscountAmount])

    const [print] = usePrint("receipt");


    const clearPOS = () => {
        barcodeInputRef.current.value = undefined;
        rateRef.current.value = undefined;
        qtyRef.current.value = undefined;
        setSelectProduct(undefined)
        setPaymentCashAmount(0)
        setPaymentCardAmount(undefined)
        setPaymentRedeemAmount(null)
        setExchangeAmount(undefined)

        setPosProducts([])
        setProductDescription([])
        setFinalDiscountAmount(0)
        setShouldApplyFinalDiscountAmount(false)
        setFinalDiscountPercent(0)
        setSelectedCustomer(null)
        setRedeemAmount(null)
        setSelectedCardType(null)
        setProductRepeatIDs([])
        setExchanges(() => [])
        setFinalDiscountDisabled(false)
        setAllDiscountAmount(0)

        setExchangeProducts(() => [])
        resetCustomerSearch()
    }

    function resetCustomerSearch() {
        setIsCustomerSearchReady(false)
        setTimeout(() => {
            setIsCustomerSearchReady(true)
        }, 1)
    }

    const [posReceiptSizeRef, rect] = useResizeObserver()

    const doPrint = (target) => {
        setRePrintData(target)

        const height = (rect.height * 0.264583333) * 1000
        return new Promise((resolve, reject) => {
            print(target, height).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    }
    const handlePrint = useReactToPrint({
        content: () => posReceipt.current,
        print: doPrint
    })

    const handlePosSale = async () => {
        if (posProducts.length > 0) {
            setSaveNPrintDisabled(true)
            try {
                const res = await posSale()
                showNotification({
                    title: "Success",
                    message: "Pos-sale created"
                })

                // setReRenderCustomers((value) => !value);
                setInVoiceId(res.data.data.id)
                setNewInVoiceId(Date.now())
                // print on here
                setTimeout(() => {
                    invoicePrint && handlePrint()
                }, 50)

                setSaveNPrintDisabled(false)

                setTimeout(() => {
                    setPosProducts([])
                    clearPOS()
                }, 200)

                setTimeout(() => {
                    setExchangeProducts(() => [])
                }, 500)
            } catch (e) {
                showNotification({
                    title: "Error",
                    message: err.response.data.data,
                    color: 'red'
                })
                // console.log(err.response.data.data)
                setSaveNPrintDisabled(false)
            }
        }
    }


    async function posSale() {

        //filter rounding amount
        const returnAmt = String(payAmount - netAmount).split('.');
        const filterReturnAmt = Number(returnAmt[0][0] == '-' ? '-.' + returnAmt[1] : '.' + returnAmt[1]).toFixed(2);
        const parseNumber = filterReturnAmt == "NaN" ? 0.00 : parseFloat(filterReturnAmt);

        return new Promise((resolve, reject) => {
            let data = {}
            if (allDiscountAmount) {
                data = { ...data, final_discount_amount: allDiscountAmount }
            }
            HTTP.post(`${BaseAPI}/pos-sales`, {
                ...data,
                invoice_id: NewInvoiceId,
                customer_id: selectedCustomer?.id,
                products: [...posProducts, ...posFreeProducts],
                payments,
                user_id: loggedInUser?.id,
                paid_amount: payAmount,
                return_amount: parseNumber,
                exchanges: exchanges,
                whole_sale: wholeSaleView,
                should_apply_final_discount_amount: shouldApplyFinalDiscountAmount,
                final_discount_amount: finalDiscountAmount,
            }).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    }

    const receiptRef = useMergedRef(posReceipt, posReceiptSizeRef)

    const addToHold = () => {
        if (posProducts.length < 1) return

        setHolds([...holds, {
            id: Date.now(),
            products: posProducts
        }])

        clearPOS()
    }

    const [saveNPrintFocus,] = useAtom(SaveNPrintInFocus)
    const saveNPrintFocusRef = useFocusTrap(saveNPrintFocus)

    const handleRePrint = () => {
        doPrint(rePrintData)
    }

    const showPointSection = () => {
        if (selectedCustomer?.id && setting.point_system) {
            return true;
        }
        return false;
    }

    const addToPosProducts = (product, reference) => {
        const existingPosProduct = posProducts.find(prod => prod.id === product.id)
        if (existingPosProduct) {
            const newPosProducts = posProducts.map(prod => {
                if (prod.id === product.id) {
                    return { ...prod, quantity: prod.quantity + product.quantity, MRP_price: product.MRP_price, rate: product.rate }
                }
                return prod
            })

            setPosProducts((prods) => [...newPosProducts])
            setBXGXWatchProducts((prods) => [...newPosProducts])
        } else {
            setPosProducts((prods) => [...prods, { ...product }])
            setBXGXWatchProducts((prods) => [...prods, { ...product }])
        }

        setProductRepeatIDs([...productRepeatIDs, product.id])


        // update the disc amount on pos sale
        // let discAmount =  (product.discount/100) * product.MRP_price
        // if (discountAmount === undefined) discountAmount = 0

        //IF any discount available then make discount none

        setDiscountPercent(() => loggedInUser?.can_give_discount ? 0 : (discountPercent + product.discount_percent) / (posProducts.length + 1))
        setDiscountAmount(discountAmount + product.discount)
        setSelectProduct(null);
        if (reference === 'qtyInputRef') {
            qtyRef.current.focus();
        };
        setBarcodeScannerValue(0)
    }

    const [showCreateCustomerForm, setShowCreateCustomerForm] = useState(false);

    const handleQtyOnKeyUp = (e) => { if (e.key === 'Enter') rateRef.current.focus() }
    const handleQtyChange = (value) => { selectProduct && setSelectProduct((product) => ({ ...product, quantity: value })) }
    const handleRateOnKeyUp = (e) => {
        if (e.key === 'Enter') {
            if (!selectProduct.stock) {
                return showNotification({
                    title: "Stock out !",
                    message: 'This product is out of stock',
                    color: 'red'
                })
            }
            selectProduct && selectProduct?.stock && addToPosProducts(({ ...selectProduct, MRP_price: selectProduct.rate }));
            // rateRef.current.value = 0;
            barcodeInputRef.current.value = undefined;
            barcodeInputRef.current.focus();
        }
    }
    const handleRateChange = (value) => { selectProduct && setSelectProduct((product) => ({ ...product, rate: value })) };

    const handleSendQty = () => { qtyRef.current.focus() }
    return (
        <>
            {
                showCreateCustomerForm &&
                <CreateEditCustomerForm
                    setShowForm={setShowCreateCustomerForm}
                    getMembersType={membersType}
                    setRerenderMemberType={setReRenderCustomers}
                />
            }
            <div className="h-[calc(100vh-35px)] ">
                <div className="">
                    {/* return part */}
                    <div className="flex justify-end">
                        {/* <div onClick={() => setReturnVisible(true)} className="rounded-md cursor-pointer bg-sky-500 px-4 py-2 hover:bg-sky-600 duration-150 active:translate-y-1 active:bg-sky-800 ">
                {'Return Product'}
              </div> */}
                    </div>
                </div>
                <div className="w-full flex">
                    <div className="w-9/12" style={{ borderRight: '1px solid #ebebeb' }}>
                        {/* scan part */}
                        <div className="flex p-1 gap-1">
                            <Paper p="xs" withBorder className=" bg-slate-100 grid grid-cols-3 gap-4 w-full ">

                                <BarcodeScanner
                                    barcodeScannerValue={barcodeScannerValue}
                                    setBarcodeScannerValue={setBarcodeScannerValue}
                                    addToPosProducts={addToPosProducts}
                                    barcodeInputRef={barcodeInputRef}
                                    qtyRef={handleSendQty}
                                />
                                {/* <SearchNScan
                                    selectedProduct={barcodeScannerValue}
                                    onProduct={setBarcodeScannerValue}
                                    reqQtyRef={qtyRef}
                                    productScanRef={barcodeInputRef}
                                /> */}
                                <NumberInput ref={qtyRef} onKeyUp={handleQtyOnKeyUp} label="Qty" value={selectProduct?.quantity || 0} onChange={handleQtyChange} min={1} max={selectProduct?.stock} precision={3} />
                                <NumberInput ref={rateRef} onKeyUp={handleRateOnKeyUp} label="Rate" value={selectProduct?.rate} onChange={handleRateChange} min={selectProduct?.cost_price || 0} precision={2} />
                                <TextInput required label="Invoice" value={NewInvoiceId || 0} disabled />
                                <TextInput label="Item Name" style={{ color: 'color' }} value={selectProduct?.name || ''} disabled />
                                <NumberInput label="Is Stock" value={selectProduct?.stock || 0} disabled />
                            </Paper>

                            <Paper p="md" className=" h-40 grid justify-between align-middle bg-slate-100 " withBorder>
                                <Switch size="md" label={"Whole Sale"} labelPosition="left" checked={wholeSaleView} onChange={(e) => setWholeSaleView(e.currentTarget.checked)} />
                                <div className="w-40 ">
                                    <div className=" text-[16px]">Rate: {selectProduct ? selectProduct?.MRP_price : undefined}</div>
                                </div>
                                <div className={` ${!selectProduct?.product_expiry_date || selectProduct?.product_expiry_date <= new Date(Date.now()) ? ' text-sky-600' : 'text-red-400'} font-semibold`}>
                                    Expire Date: {selectProduct?.product_expiry_date && dayjs(selectProduct.product_expiry_date).format('DD-MM-YYYY HH:mm:ss')}
                                </div>
                                <Checkbox labelPosition="left" label="Invoice Print" radius="xs" size="md" checked={invoicePrint} onClick={() => { setInvoicePrint((e) => !e) }} />
                            </Paper>
                            {/* </div> */}
                            {/* </div> */}
                        </div>
                        <div className="mt-4" ref={printComponentRef}>
                            {
                                posProducts.length > 0 || exchangeProducts.length > 0 ?
                                    <Productdetails />
                                    :
                                    <div className=" flex justify-center flex-col">
                                        <EmptyNotification />
                                    </div>
                            }
                        </div>
                    </div>

                    <div className="w-3/12 h-[88vh] overflow-auto pl-2">

                        {/* customer Select */}

                        <div className="pt-1">
                            {isCustomerSearchReady &&
                                <div className="inline-flex w-full gap-1">
                                    <Customer reRenderCustomers={reRenderCustomers} />
                                    <Button onClick={() => setShowCreateCustomerForm(true)}
                                        className="text-3xl pb-1 h-10 pt-0 px-2">+</Button>
                                </div>
                            }
                            {!isCustomerSearchReady &&
                                <div className="inline-flex w-full gap-1">
                                    <Customer reRenderCustomers={reRenderCustomers} />
                                    <Button onClick={() => setShowCreateCustomerForm(true)}
                                        className="w-full text-3xl pb-1 h-10 pt-0 px-2"
                                        style={{ border: "1px solid black" }}>+</Button>
                                </div>
                            }
                            {
                                selectedCustomer && setting?.enable_credit_module &&
                                <div className="mt-2">
                                    Available Credit : {selectedCustomer.credit_limit - selectedCustomer.credit_spend}
                                </div>
                            }
                        </div>

                        <div className={showPointSection() ? "" : "invisible"}>
                            <div className="flex justify-between my-1">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td className="">Available Point</td>
                                            <td className=" w-16"><XNumberInput
                                                value={selectedCustomer ? selectedCustomer.point : 0} disabled={true} /></td>
                                            <td className="">In Taka</td>
                                            <td className={" w-20"}><XNumberInput precision={2}
                                                value={(selectedCustomer ? selectedCustomer.point : 0) * (setting.redeem_ratio / 100)}
                                                disabled={true} /></td>
                                        </tr>
                                        <tr>
                                            <td className="">This Sale Point</td>
                                            <td className=" w-28"><XNumberInput precision={2}
                                                value={(setting.point_ratio / 100) * (totalPrice - finalDiscountAmount)}
                                                disabled={true} /></td>
                                        </tr>
                                    </tbody>

                                </table>
                                {/* <div>Available Point: {selectedCustomer?.point}</div> */}
                                {/* <div className="flex">
                  <NumberInput max={selectedCustomer?.point} />
                  <Button>Redeem</Button>
                </div> */}
                            </div>
                        </div>

                        <Amount_info />
                        <Payment_info />
                    </div>
                </div>

                <div className="absolute right-5 left-64 bottom-0 h-16 ">
                    <div className="flex justify-between">
                        <Holds holds={holds} setHolds={setHolds} setProducts={setProductDescription} />
                        <div className="flex gap-4">
                            <Button onClick={() => clearPOS()}>Clear</Button>
                            <Button onClick={addToHold}>Hold</Button>
                            <Button onClick={() => setReturnModalOpen(true)}>Return & Exchange</Button>
                            <div className={"flex"}>

                                <Button disabled={saveNPrintDisabled}
                                    radius="sm" size="md" color="yellow" uppercase
                                    ref={saveNPrintRef} onClick={handlePosSale}>Save </Button>

                                <Menu>
                                    <Target>
                                        <Tooltip label={cantSaleReason}>
                                            <ActionIcon variant={"filled"}
                                                className={"h-full"}><IconChevronUp /></ActionIcon>
                                        </Tooltip>
                                    </Target>
                                    <Dropdown>
                                        <Item>
                                            <Button onClick={handleRePrint}>Re Print</Button>
                                        </Item>
                                    </Dropdown>
                                </Menu>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Returnproduct open={returnModalOpen} onClose={() => setReturnModalOpen(false)} />
            <div
                className="fixed invisible "
            >
                <div ref={receiptRef}>
                    <Receipt
                        invoiceId={invoiceId}
                        products={[...posProducts, ...posFreeProducts]}
                    />
                </div>
            </div>
        </>

    )
}
