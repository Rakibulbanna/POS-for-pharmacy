import AllLostandDamageProducts from "@/components/damage_lost/allLostandDamageProducts";
import EntryLostAndDamage from "@/components/damage_lost/entryLostAndDamage";
import { Button, NumberInput, Select, TextInput, useMantineColorScheme, SegmentedControl, Group, Center, Box } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useEffect, useRef, useState } from "react"
import { BaseAPI, HTTP } from "~/repositories/base";
import { useNotification } from "~/hooks/useNotification";
import { useDebouncedValue } from "@mantine/hooks";
import { IconDentalBroken, IconSquareForbid } from '@tabler/icons';
import AddProductList from "@/components/damage_lost/AddProductList";


export default function () {
    const [status, setStatus] = useState(null);
    const [clearable, setClearable] = useState(false);

    console.log({ status })
    const [successNotification] = useNotification()
    const [productID, setProductID] = useState(null)
    const [productName, setProductName] = useState("")
    const [productStock, setProductStock] = useState("")
    const [quantity, setQuantity] = useState(null);
    const [cpu, setCpu] = useState(0);
    const [rpu, setRpu] = useState(0);
    const [reason, setReason] = useState("");
    const [damageAndLostProductRerender, setDamageAndLostProductRerender] = useState(false);

    const [products, setProducts] = useState(null);
    const [searchText, setSearchText] = useState("")
    const [autoEntry, setAutoEntry] = useState(true);
    const [debouncedValue] = useDebouncedValue(searchText, 500);
    const [suggestedProducts, setSuggestedProducts] = useState([]);
    const [barcodeRender, setbarcodeRender] = useState(false);

    const [addProducts, setAddProducts] = useState([]);

    const scanSelector = useRef(null);

    const [productDescription, setProductDescription] = useState([]);

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

    const handleSelect = async (v) => {
        if (v) {
            const product = suggestedProducts.find(prod => prod.id === v);

            setProducts(() => ({ ...product, available_stock: autoEntry ? 1 : 0 }))
        } else {
            setProducts(() => null)
        }

        // setSuggestedProducts([])
    }

    const getProduct = async (barcode) => {
        const res = await HTTP.get(`${BaseAPI}/products?product_barcode=${barcode}`)
        return res.data.data
    }

    const handleSearch = async (barcode) => {

        const products = await getProduct(barcode)
        if (products.length === 1) {
            const updateProduct = { ...products[0] };
            setProducts(() => updateProduct);
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

    const setProduct = (product) => {
        setProductID(product.id)
        setProductName(product.name)
        setProductStock(product.stock)
        setCpu(() => product.cost_price)
        setRpu(() => product.MRP_price)

    }


    const handleDamageNLost = async (id, quantity, status, reason) => {
        await HTTP.post(`${BaseAPI}/products/${id}/damage-lost?quantity=${quantity}&status=${status}&reason=${reason}`).then(res => {
            successNotification("Done")
            // setProductID(null)
            // setProductName('')
            // setReason("")
            // setQuantity(undefined)
            // setCpu(() => 0);
            // setRpu(() => 0);
            // setDamageAndLostProductRerender((value) => !value)
        }).catch(err => {
            console.log(err)
        })
    }

    const handleAdd = () => {

        const findProducts = addProducts.find((product => product.id === products.id && product.status === status));

        if (findProducts) {
            const filterProducts = addProducts.filter(product => product.tempId !== findProducts.tempId);

            setAddProducts(() => [{ ...findProducts, quantity: findProducts.quantity + quantity }, ...filterProducts]);
        }
        // if (findProducts) showNotification({
        //     title: 'Already added',
        //     message: 'Hey there, your code is awesome! 🤥',
        //     color:'yellow'
        //   }) ;
        else {
            const mapP = addProducts.map(product => product.tempId)
            const findMaxTemp = addProducts.length > 0 ? Math.max(...mapP) : 0;

            setAddProducts((prev) => [{ tempId: findMaxTemp + 1, ...products, quantity, status, reason }, ...prev]);
        }
        //update default values
        scanSelector.current.value = '';
        setClearable(true)
        setProducts(() => null);
        setQuantity();
        setStatus(() => null);
        setReason(() => "");
    }

    const handleRemove = (id) => {
        const filterProducts = addProducts.filter(product => product.id !== id);
        setAddProducts(() => filterProducts);
    }

    const handleSubmit = async () => {
        await addProducts.forEach(product => handleDamageNLost(product.id, product.quantity, product.status, product.reason));
        setAddProducts(() => [])
    }

    return (
        <>

            <div className="p-1 " style={{ border: '1px solid #cbd5e1' }}>
                <div className={"grid grid-cols-5 gap-4"}>

                    <Select
                        ref={scanSelector}
                        data={suggestedProducts}
                        searchable
                        clearable
                        onSearchChange={v => setSearchText(v)}
                        onChange={handleSelect}
                        label="Search Product"
                        // ref={scannerFocus}
                        styles={{ dropdown: { backgroundColor: "#f1f5f9" } }}
                    />
                    <TextInput label="Product Name" disabled value={products?.name || ''} />
                    <TextInput label="Product Stock" disabled value={products?.stock || 0} />
                    <TextInput label="CPU" disabled value={products?.cost_price || ''} />
                    <TextInput label="RPU" disabled value={products?.MRP_price || ''} />

                </div>

                <div className={"grid grid-cols-5 gap-4"}>

                    {/* <SearchNScan onProduct={setProduct} /> */}
                    <NumberInput disabled={!products} precision={2} max={products?.stock} label={"Quantity"} value={quantity} onChange={v => setQuantity(v)} />
                    <TextInput label={"Reason"} value={reason} onChange={e => setReason(e.target.value)} />

                    <Group fullWidth>
                        <SegmentedControl

                            value={status}
                            onChange={(value) => setStatus(value)}
                            color="blue"
                            className="mt-[20px] w-full"
                            data={[
                                {
                                    value: 'damage',
                                    label: (
                                        <Center>
                                            <IconDentalBroken size={16} stroke={1.5} />
                                            <Box ml={10}>Damage</Box>
                                        </Center>
                                    ),
                                },
                                {
                                    value: 'lost',
                                    label: (
                                        <Center>
                                            <IconSquareForbid size={16} stroke={1.5} />
                                            <Box ml={10}>Lost</Box>
                                        </Center>
                                    ),
                                },
                            ]}
                        />
                    </Group>
                    <Button
                        className="mt-[20px] col-span-2"
                        disabled={!quantity || !status}
                        onClick={handleAdd}
                    >
                        ADD
                    </Button>
                </div>
            </div>

            <AddProductList handleRemove={handleRemove} addProducts={addProducts} />

            <div className="pt-2 flex">
                <div className={'w-1/4'}>Total cost price: {addProducts.map(prod=>prod.cost_price*prod.quantity).reduce((pv, cv) => pv+cv, 0)}</div>
                <Button fullWidth disabled={!addProducts?.length} onClick={handleSubmit}> Submit</Button>
            </div>
        </>
    )
}