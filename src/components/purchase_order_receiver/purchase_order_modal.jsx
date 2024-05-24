import {Select, Table} from "@mantine/core";
import {useEffect, useState} from "react";
import {BaseAPI, HTTP} from "~/repositories/base";
import {Button} from "@arco-design/web-react";

export default function ({handlePurchaseProduct,disableButtonId,handleDeletePurchaseProductFromList}) {
  const [suppliers, setSuppliers] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);


  useEffect(() => {
    HTTP.get(`${BaseAPI}/suppliers`).then(res => {
      const supps = res.data.data.map(supplier => {
        return {
          label: supplier.first_name + " " + supplier.last_name,
          value: supplier.id
        }
      })
      setSuppliers(()=>supps)
    }).catch(err => {
      console.log(err)
    })
  }, []);

  const handleSupplierChange = (id) => {
    //when change supplier then reset
    const filterSupplier = suppliers.filter((supplier)=> supplier.value === id);
    handlePurchaseProduct(filterSupplier[0])

    HTTP.get(`${BaseAPI}/purchase_order/${id}`).then(res => {
      // setProducts(res.data.data);
      // const data = suppliers[id];
      setPurchaseOrders(res.data.data)
      //when supplier change set null to the purchase list
    })
    .catch(err => {
      console.log(err);
    });
  }

  return (
    <>
      <Select placeholder="Select supplier" data={suppliers} onChange={v => handleSupplierChange(v)}/>
      <Table>
        <thead>
        <tr>
          <th>ID</th>
          {/*<th>Name</th>*/}
          {/*<th>Action</th>*/}
        </tr>
        </thead>
        <tbody>
        {purchaseOrders?.map((product,index)=>(
          <tr key={product.id}>
            <td>{product.id}</td>
            {/*<td>{product.name}</td>*/}
            {/*<td >*/}
            {/*  <Button disabled={disableButtonId.includes(product.id) ? true : false } onClick={()=>handlePurchaseProduct(null,product)}>ADD</Button>*/}
            {/*  <Button className="ml-8" disabled={!disableButtonId.includes(product.id) ? true : false } onClick={()=>handleDeletePurchaseProductFromList(product)}>DELETE</Button>*/}
            {/*</td>*/}
          </tr>
        ))}
        </tbody>
      </Table>
    </>
  )
}
