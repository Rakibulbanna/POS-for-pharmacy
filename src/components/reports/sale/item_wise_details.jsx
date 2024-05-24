import {useEffect, useState} from "react";
import {BaseAPI, HTTP} from "~/repositories/base";

const ItemWiseDetails = () => {
    const [items, setItems] = useState([])
    useEffect(()=>{
        HTTP.get(`${BaseAPI}/reports/item-wise-sale-details`).then(res=>{
            setItems(res.data.data)
        }).catch(err=>{
            console.log(err)
        })
    },[])
    return (
        <>
            {items.map(item=>(
                <div key={item.id}>
                    <h4>{item.name}</h4>
                    <table>
                        <thead>
                        <tr>
                            <th>Quantity</th>
                            <th>Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        {item.pos_sales.map(sale=>(
                            <tr key={sale.id}>
                                <td>{sale.quantity}</td>
                                <td>{new Date(sale.pos_sale.created_at).toLocaleDateString('en-GB')} {new Date(sale.pos_sale.created_at).toLocaleTimeString()}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </>
    )
}

export default ItemWiseDetails