import { Select, TextInput } from "@mantine/core"
import { useDebouncedState, useDebouncedValue } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { BaseAPI, HTTP } from "~/repositories/base";

const SearchNScan = ({ supplierID = null, onProduct, disable = false, reqQtyRef = null, selectedProduct = null, productScanRef = null }) => {
    const [value, setValue] = useState("")
    const [searchValue, setSearchValue] = useState('');
    const [debouncedValue] = useDebouncedValue(searchValue, 500)
    const [suggestedProducts, setSuggestedProducts] = useState([])

    function isBarcode(text) {
        // const regexp = new RegExp(/[0-9]{13}/g)
        // return regexp.test(text)
        return text
    }

    async function getProduct(barcode) {
        console.log("barcode__", barcode);
        if (barcode.trim().length === 0) {
            return new Promise((resolve, reject) => {
                reject('Input valid barcode');
            })
        }
        let url = `${BaseAPI}/products?product_barcode=${barcode}`
        if (supplierID) {
            url += `&supplier_id=${supplierID}`
        }
        return new Promise((resolve, reject) => {
            HTTP.get(url).then(res => {
                if (res.data.data.length) {
                    resolve(res.data.data[0])
                }
                reject("product not found")
            }).catch(err => {
                console.log(err);
                reject("product not found")
            })
        })

    }
    async function getProducts(search) {
        if (search.trim().length == 0) {
            setSuggestedProducts([])
            return;
        }

        // const temp = search.split(' ');
        // const style = temp[temp.length - 1];

        console.log("search__", search);
        let url = `${BaseAPI}/products/index-without-pagination?name=${search}`
        if (supplierID) {
            url += `&supplier_id=${supplierID}`
        }

        const res = await HTTP.get(url)
        console.log(res.data.data)
        setSuggestedProducts(res.data.data.map(p => ({
            ...p,
            label: p.name + `${p.style_size ? ' ' + p.style_size : ''} ` + `${p?.category?.name ? ' ' + p?.category?.name : ''}`,
            value: p.id
        })))
    }

    async function onSearchOrScan(value) {
        // if (isBarcode(value)) {
        const product = await getProduct(value).catch(err => { console.log(err) })
        console.log({ product })
        if (product) {
            onProduct(product)

            setSearchValue('')
            reqQtyRef.current.focus()
        }
        // else return
        // }

        getProducts(value)
    }
    const handleSearchProductOnKeyUp = (e) => { if (e.key === 'Enter' && selectedProduct) reqQtyRef.current.focus() }

    const handleSelect = async (v) => {
        const product = suggestedProducts.find(prod => prod.id === v)

        onProduct(product)

        setSearchValue('')
    }

    useEffect(() => {
        if (debouncedValue) {
            onSearchOrScan(debouncedValue)
        }
    }, [debouncedValue])

    useEffect(() => {
        if (supplierID) {
            getProducts("")
        } else {
            setSuggestedProducts([])
        }
    }, [supplierID])

    return (
        <>
            <Select
                label='Search ~ Scan'
                ref={productScanRef}
                searchable
                data={suggestedProducts}
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                onChange={handleSelect}
                styles={{ dropdown: { backgroundColor: "#c5cadb" } }}
                value={value}
                disabled={disable}
                onKeyUp={handleSearchProductOnKeyUp}
                filterDataOnExactSearchMatch={true}

            />
        </>
    )
}

export default SearchNScan