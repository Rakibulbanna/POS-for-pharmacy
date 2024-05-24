import { Table } from "@mantine/core";
import { useEffect, useState } from "react";

const Other = () => {
    const today = new Date();
    const [total, setTotal] = useState({ quantity: 0, price: 0 });
    const [items, setItems] = useState([]);
    const [data,setData] = useState([{
        name: 'Laptops acer aspire 3',
        id: 565656,
        quantity: 5,
        price: 100
    }, {
        name: 'Laptops acer aspire 3',
        id: 546546546,
        quantity: 5,
        price: 100
    }, {
        name: 'Laptops acer aspire 3',
        id: 8346546,
        quantity: 5,
        price: 100
    }]);

    useEffect(() => {
        function handleData() {
            if (data.length === 0) return;
            const copyTotal = { ...total };
            const updatedData = data.map((item) => {
                //total 
                copyTotal.quantity = copyTotal['quantity'] + item.quantity;
                copyTotal.price = copyTotal['price'] + (item.quantity * item.price);
                
                //set total value for every item
                return { ...item, total: item.quantity * item.price }
            })
            setItems(() => updatedData);
            setTotal(()=>copyTotal)
        }

        handleData();

    }, [data])

    return (
        <div className="w-[272px]">
            <div className="p-5 flex flex-col gap-2 font-semibold text-center">
                <div className="text-[11px]">WE SERVE PEOPLE</div>
                <div className=" tracking-wider">Police Shopping Mall</div>
                <div className=" text-[11px]">Rajarbag Police Line, DPM.</div>
                <div className=" text-[11px]">Mobile: 01776912022</div>
                <div className="flex justify-between text-[12px]">
                    <div>{today.toLocaleDateString("en-US")}</div>
                    <div>{today.toLocaleTimeString()}</div>
                </div>
                <div className="flex justify-between text-[12px]">
                    <div>ShopID: PM01</div>
                    <div>ServedBy: MABIA</div>
                </div>
                <div className="text-[12px] tracking-wider">Invoice: 516544464665</div>
            </div>

            <Table className="w-full font-medium" style={{ borderTop: '1px solid black' }}>
                <thead className="text-xs" >
                    <tr>
                        <th>Items</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody style={{ border: 'none' }}>
                    {items.map((value, index) => (
                        <>
                            <tr style={{ border: 'none' }}>
                                <td colSpan="4">{value.name}</td>
                            </tr>
                            <tr className={index} >
                                <td>{value.id}</td>
                                <td>{value.quantity}</td>
                                <td>{value.price}</td>
                                <td>{value.quantity * value.price}</td>
                            </tr>
                        </>
                    ))}
                </tbody>
                <tfoot className=" text-xs" style={{ borderTop: '1px solid black' }}>
                    <tr >
                        <th>Total</th>
                        <th>{total?.quantity}</th>
                        <th></th>
                        <th>{total?.price}</th>
                    </tr>
                </tfoot>
            </Table>
            <div className=" flex flex-col gap-1 text-xs tracking-wide font-semibold">
                <div className="flex justify-between px-3">
                    <div>Discount: ( 0 % )</div>
                    <div>0</div>
                </div>
                <div className="flex justify-between px-3">
                    <div>VAT: ( 0 % )</div>
                    <div>0</div>
                </div>
                <div className="flex justify-between px-3">
                    <div>Less Adjustment:</div>
                    <div>0</div>
                </div>
                {/* net amount */}
                <div className="flex justify-between font-bold text-sm px-3" style={{ borderTop: '1px solid black' }}>
                    <div>Net Amount (TK): </div>
                    <div>{355555}</div>
                </div>
                <div className="flex justify-between px-3">
                    <div>Pay Type: </div>
                    <div>Cash</div>
                </div>
                <div className="flex justify-between font-bold text-sm px-3">
                    <div>Paid Amount: </div>
                    <div>765</div>
                </div>
                <div className="flex justify-between font-bold text-sm px-3">
                    <div>Changed Amount:</div>
                    <div>{800 - 756}</div>
                </div>
                <div className="text-center font-bold" style={{ borderTop: '1px solid black' }}>Sold items can not be return or exchange. Any Query :01654984984</div>
                <div className="text-center font-bold">Thanks for allowing us to serve you</div>
                <div className="text-center" style={{ borderTop: '1px solid black' }}>Software By EITBUZZ TEC. LTD.</div>
            </div>
        </div>
    )
}

export default Other

