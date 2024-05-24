import { LoggedInUser } from "@/store/auth";
import {
    ExchangeAmount,
    FinalDiscountAmount,
    NetAmount,
    PayAmount, Payments,
    ReturnAmount, SelectedCardType,
    TotalPrice,
    VATAmount,
    SelectedCustomer, WholeSaleView
} from "@/store/pos";
import { ipcRenderer } from "electron";
import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Setting } from "@/store/setting";
import { Table } from "@mantine/core";
import { ExchangeProducts } from '@/store/pos';

export default function ({ products, invoiceId }) {
// console.log({products});
    const [setting] = useAtom(Setting)
    // const products = posProducts.map(p => {
    //     return {
    //       id: p.id,
    //       quantity: p.quantity,
    //       discount: p.discount,
    //       price: p.MRP_price
    //     };

    //   });
    //   console.log({ products });
    //   setReciptProduct(() => products)

    const today = new Date();
    const [items, setItems] = useState([]);

    const [netAmount] = useAtom(NetAmount);
    const [totalPrice] = useAtom(TotalPrice);
    const [vatAmount] = useAtom(VATAmount);
    const [exchangeAmount] = useAtom(ExchangeAmount)
    const [selectedCustomer] = useAtom(SelectedCustomer)
    const [exchangeProducts, setExchangeProducts] = useAtom(ExchangeProducts)

    const [payAmount] = useAtom(PayAmount);
    const [returnAmount] = useAtom(ReturnAmount);
    const [loggedInUser] = useAtom(LoggedInUser)
    const [finalDiscountAmount] = useAtom(FinalDiscountAmount)
    const [payments] = useAtom(Payments)
    const [selectedCardType] = useAtom(SelectedCardType)
    const [wholeSaleView] = useAtom(WholeSaleView)
    const [payType, setPayType] = useState("")

    const posReceipt = useRef();

    useEffect(() => {
        let pay = []
        payments.forEach(payment => {
            if (payment.method === 1) {
                pay.push("Cash")
            }
            if (payment.method === 2) {
                pay.push(selectedCardType)
            }
            if (payment.method === 5) {
                pay.push("Credit")
            }
        })
        setPayType(pay.join(","))
    }, [payments])


    useEffect(() => {
        function handleData() {
            if (products.length === 0) return;
            const copyTotal = { quantity: 0, price: 0 };
            const updatedData = products.map((item) => {
                //total
                copyTotal.quantity = copyTotal['quantity'] + item.quantity;
                copyTotal.price = copyTotal['price'] + (item.quantity * item.MRP_price);

                //set total value for every item
                return {
                    id: item.id,
                    name: `${item.name} ${item.style_size ? item.style_size : ''} ${item.color?.name ? item.color.name : ''}`,
                    quantity: item.quantity,
                    product_barcode: item.product_barcode,
                    price: wholeSaleView ? item.whole_sale_price : item.MRP_price,
                    total: (item.quantity * (wholeSaleView ? item.whole_sale_price : item.MRP_price)) - (item.discount_before_line ? item.quantity * item.discount : item.discount),
                    discount: item.discount_before_line ? item.discount * item.quantity : item.discount
                }
            })
            setItems(() => updatedData);
        }
        handleData();

    }, [products]);

    return <div ref={posReceipt} style={{ textAlign: 'center', width: '340px', fontFamily: 'Tahoma', position: 'relative', margin: 'auto', letterSpacing: '0.1rem' }}>
        <div style={{ display: 'flex', padding: '10px', flexDirection: 'column', justifyContent: 'center', fontSize: '12px' }}>
            <div style={{ fontWeight: 'bold', fontSize: `${setting.pos_recipt_company_name_size}px` }}>{setting.company_name}</div>
            <div >{setting.company_address}</div>
            <div style={{ fontSize: `${setting.pos_recipt_phone_number_size}px` }}>Mobile: {setting.company_phone_number}</div>
            {!!setting.vat_number && <div>VAT Number: {setting.vat_number}</div>}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>{today.toLocaleDateString("en-GB")}</div>
                <div>{today.toLocaleTimeString()}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>ShopID: PM01</div>
                <div style={{ fontSize: `${setting.served_by_size}px` }}>ServedBy: {loggedInUser.first_name + " " + loggedInUser.last_name}</div>
            </div>


            {selectedCustomer &&
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>Cus. Name: {selectedCustomer?.first_name}</div>
                        <div>Mobile: {selectedCustomer?.phone_number}</div>
                    </div>

                </>
            }
            <div style={{ marginTop: '1px' }} >Invoice: {invoiceId}</div>
        </div>

        <table style={{ borderCollapse: 'separate', borderSpacing: '0 10px', borderTop: '1px solid black', fontSize: '12px', width: '100%', textAlign: 'right' }}>
            <thead style={{ borderBottom: '1px solid black', height: '20px', padding: '5px' }}>
                <tr style={{ padding: '5px' }}>
                    {/* <th style={{ textAlign: 'left' }}>#</th> */}
                    <th style={{ textAlign: 'left', paddingTop: "2px", paddingBottom: "2px" }}>Description</th>
                    <th>Price</th>
                    <th>QTY</th>
                    {
                        // loggedInUser.can_give_discount && 
                        <th>Disc </th>
                    }
                    <th style={{ paddingLeft: '2px' }}>Amt</th>
                </tr>
            </thead>
            <tbody>
                {items.map((value, index) => (
                    <>
                        <tr>
                            {/* <td style={{ textAlign: 'left' }}>{index + 1}</td> */}
                            <td style={{ textAlign: 'left' }}>{value.product_barcode}</td>
                            <td>{value?.price?.toFixed(2)}</td>
                            <td>{value?.quantity?.toFixed(3)}</td>
                            {
                                // loggedInUser.can_give_discount && 
                                <td>{Number(value.discount).toFixed(2)}</td>
                            }
                            <td>{value.total.toFixed(2)}</td>
                        </tr>
                        <tr style={{ textAlign: 'left' }}>
                            <td colSpan={'5'} style={{ textTransform: 'uppercase' }} >{value.name} {value.price > 0 ? "" : "(BXGX)"}</td>
                            {/* <td style={{backgroundColor:'plum'}}></td> */}
                        </tr>
                    </>
                ))}

                {
                    exchangeProducts.length > 0 &&
                    <>
                        <tr>
                            <td style={{ textAlign: "left", fontWeight: '800' }} colSpan={4}>Exchange Products:</td>
                        </tr>
                        {
                            exchangeProducts.map((value, index) => (
                                <>
                                    <tr>
                                        {/* <td style={{ textAlign: 'left' }}>{index + 1}</td> */}
                                        <td style={{ textAlign: 'left' }}>{value.product_barcode}</td>
                                        <td>{value.MRP_price}</td>
                                        <td>{value.quantity}</td>
                                        <td>{value.MRP_price * value.quantity}</td>
                                    </tr>
                                    <tr style={{ textAlign: 'left' }}>
                                        <td colSpan={'4'} style={{ textTransform: 'uppercase' }} >{value.name} {value.price > 0 ? "" : "(BXGX)"}</td>
                                        {/* <td style={{backgroundColor:'plum'}}></td> */}
                                    </tr>
                                </>
                            ))
                        }
                    </>
                }
            </tbody>
        </table>

        <div style={{ fontSize: '12px', padding: '1px 0', display: 'flex', justifyContent: "space-between", borderTop: '1px solid black', borderBottom: '1px solid black', fontWeight: '600' }}>
            <div>Total</div>
            <div>{totalPrice.toFixed(2)}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "space-between", fontSize: '12px', textAlign: 'center', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: "space-between" }}>
                <div>Discount: </div>
                <div>{finalDiscountAmount.toFixed(2)}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: "space-between" }}>
                <div>VAT:</div>
                <div>{vatAmount}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: "space-between" }}>
                <div>Exchange Amount: </div>
                <div>{exchangeAmount ? exchangeAmount : 0}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: "space-between" }}>
                <div>Less Adjustment:</div>
                <div>0</div>
            </div>
            {/* net amount */}
            <div style={{ borderTop: '1px solid black', fontWeight: '600', display: 'flex', justifyContent: "space-between", fontSize: "12px" }}>
                <div>Net Amount (TK): </div>
                <div>{Math.round(netAmount).toFixed(2).toLocaleString("en-US")}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: "space-between" }}>
                <div>Pay Type: </div>
                <div>{payType}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: "space-between" }}>
                <div>Paid Amount: </div>
                <div>{payAmount}</div>
            </div>

            <div style={{ display: 'flex', fontWeight: '500', justifyContent: "space-between" }}>
                <div>Changed Amount:</div>
                <div>{Math.round(returnAmount)}</div>
            </div>
            <div style={{ margin: '10px 0' }}>
                <div style={{ borderTop: '1px solid black', fontSize: `${setting.pos_recipt_note_size}px`, marginTop: "2px" }}>* {setting.invoice_note}. Any Query :{setting.company_phone_number}</div>
                <div style={{ paddingBottom: '1px' }}>Thanks for allowing us to serve you</div>
                {setting.show_point_balance_on_receipt && <div>customer point: {selectedCustomer ? selectedCustomer?.point + ((setting.point_ratio / 100) * (totalPrice - finalDiscountAmount)) : 0}</div>}

                <div style={{ borderTop: '1px solid black', fontSize: '11px', marginTop: "2px" }}>Software By Elitbuzz Technologies Ltd.</div>
                <div style={{ fontSize: '11px' }}>( 01844 471 520 )</div>
            </div>
        </div>



        {/* <div>
            <div>exchange products</div>
            {exchangeProducts.map(p => (
                <div key={p.id}>
                    {p.name} {p.MRP_price} hello
                </div>
            ))}
        </div> */}
    </div>
}


