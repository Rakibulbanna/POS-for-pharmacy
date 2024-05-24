import SearchNScan from "@/components/SearchNScan";
import { useEffect, useState } from "react";
import { Button, NumberInput, Table, TextInput } from "@mantine/core";
import { HTTPCall } from "~/lib/http";
import { showNotification } from "@mantine/notifications";
import { useAtom } from "jotai";
import { LoggedInUser } from "@/store/auth";

export default function PriceChange() {
    const [loggedInUser,] = useAtom(LoggedInUser)

    const [selectedProduct, setSelectedProduct] = useState(null)
    const [updatedProducts, setUpdatedProducts] = useState([])

    const [newRPU, setNewRPU] = useState(0)
    const [newCPU, setNewCPU] = useState(0)
    const [newStock, setNewStock] = useState(0)




    const onProductSelect = (product) => {
        setSelectedProduct(product)
    }

    const handleAddToTable = () => {
        const found = updatedProducts.find(p => selectedProduct.id === p.id)
        if (found) {
            showNotification({
                title: "Already Exists"
            })
            return
        }

        setUpdatedProducts([...updatedProducts, { ...selectedProduct, new_cpu: newCPU, new_rpu: newRPU, new_stock: newStock }])
        setSelectedProduct(null)

        setNewRPU(0)
        setNewCPU(0)
        setNewStock(0)
    }

    const handleSubmit = async () => {
        if (!updatedProducts.length) return

        let body = updatedProducts.map(prod => {
            const returnObj = { id: prod.id };
            if (prod.new_rpu > 0 && prod.MRP_price !== prod.new_rpu) {
                returnObj["old_sale_price"] = prod.MRP_price;
                returnObj["new_sale_price"] = prod.new_rpu;
            }
            if (prod.new_stock > 0 && prod.stock !== prod.new_stock) {
                returnObj["new_stock"] = prod.new_stock;
                returnObj["old_stock"] = prod.stock;
            }

            // console.log({returnObj})
            // let cpu = prod.cost_price
            // if (prod.new_cpu !== 0) cpu = prod.new_cpu


            // let rpu = prod.MRP_price
            // if (prod.new_rpu !== 0) rpu = prod.new_rpu

            // let stock = prod.stock
            // if (prod.new_stock !== 0) stock = prod.new_stock

            return returnObj;
        })
        console.log({ body });
        const [res, err] = await HTTPCall("/products/price-change", "PATCH", {
            products: body
        })
        console.log({ res })
        if (err) {
            return
        }

        // clear all
        setUpdatedProducts([])
        showNotification({
            title: "Success",
            message: "Updated"
        })

    }

    return (
        <div className={"flex flex-col gap-8"}>
            <div className={"border-2 border-black border-solid p-4 mb-8 flex flex-col gap-4"}>
                <div className={"flex gap-8"}>
                    <div><SearchNScan onProduct={onProductSelect} /></div>
                    <div className={"flex gap-4"}>
                        <TextInput label={"Product Name"} disabled={true} defaultValue={selectedProduct ? selectedProduct.name : ""} />
                        <TextInput label={"Sale Price"} disabled={true} defaultValue={selectedProduct ? selectedProduct.MRP_price : ""} />
                        <TextInput label={"Cost Price"} disabled={true} defaultValue={selectedProduct ? selectedProduct.cost_price : ""} />
                        <TextInput label={"Stock"} disabled={true} defaultValue={selectedProduct ? selectedProduct.stock : ""} />
                        {/*<NumberInput label={"Sale Price"} disabled={true} defaultValue={selectedProduct ? selectedProduct.MRP_price : 0}/>*/}
                    </div>
                </div>
                <div className={"flex gap-4"}>
                    <NumberInput label={"New RPU"} value={newRPU} onChange={setNewRPU} disabled={!!!selectedProduct} precision="2" />
                    {/* <NumberInput label={"New CPU"} value={newCPU} onChange={setNewCPU} disabled={!!!selectedProduct}/> */}
                    <NumberInput label={"New Stock"} value={newStock} onChange={setNewStock} disabled={!!!selectedProduct && loggedInUser?.role == 1} precision="3" />
                </div>
                <div>
                    <Button disabled={!!!selectedProduct || (!newRPU && !newStock) } onClick={handleAddToTable}>Add</Button>
                </div>
            </div>

            <div className={"p-4"}>
                <Table highlightOnHover striped withBorder>
                    <thead>
                        <tr>
                            <td>ID</td>
                            <td>Name</td>
                            <td>Supplier Name</td>
                            <td>Old RPU</td>
                            <td>New RPU</td>
                            <td>Old CPU</td>
                            <td>New CPU</td>
                            <td>Old Stock</td>
                            <td>New Stock</td>
                            <td>Action</td>
                        </tr>
                    </thead>
                    <tbody>
                        {updatedProducts.map(prod => (
                            <tr key={prod.id}>
                                <td>{prod.id}</td>
                                <td>{prod.name}</td>
                                <td>{prod.supplier.company_name}</td>
                                <td>{prod.MRP_price}</td>
                                <td>{prod.new_rpu === 0 ? prod.MRP_price : prod.new_rpu}</td>
                                <td>{prod.cost_price}</td>
                                <td>{prod.new_cpu === 0 ? prod.cost_price : prod.new_cpu}</td>
                                <td>{prod.stock}</td>
                                <td>{prod.new_stock === 0 ? prod.stock : prod.new_stock}</td>
                                <td><Button onClick={() => setUpdatedProducts(updatedProducts.filter(p => p.id !== prod.id))}>Remove</Button></td>
                            </tr>
                        ))}

                    </tbody>
                </Table>
            </div>

            <Button onClick={handleSubmit}>Submit</Button>

        </div>
    )
}