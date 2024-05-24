import {useEffect, useState} from "react";
import {Select} from "@mantine/core";
import {useDebouncedValue} from "@mantine/hooks";
import {BaseAPI, HTTP} from "~/repositories/base";

const DirectScanner = ({supplierID, onProduct, onClear}) => {
    const [ready, setReady] = useState(true)
    const [disabled, setDisabled] = useState(true)
    const [suggestedProducts, setSuggestedProducts] = useState([])
    const [searchText, setSearchText] = useState("")
    const [debouncedValue] = useDebouncedValue(searchText, 500)

    useEffect(()=>{
        if (supplierID){
            setDisabled(false)
            HTTP.get(`${BaseAPI}/products/index-without-pagination?supplier_id=${supplierID}`).then(res=>{
                const products = res.data.data
                const alteredProducts = products.map(prod=>{
                    return {...prod, label: prod.name + `${prod.style_size ? ' ' + prod.style_size : ''} `+`${prod?.category?.name ? ' ' + prod?.category?.name : ''}`, value: prod.id}
                })
                setSuggestedProducts(alteredProducts)
            }).catch(err=>{
                console.log(err)
            })
        }
    },[supplierID])

    useEffect(()=>{
        if (debouncedValue){
            handleSearch(debouncedValue)
        }
    },[debouncedValue])

    const handleSearch = async (barcode) => {

        const products = await getProduct(barcode)

        if (products.length > 0){
            onProduct(products[0])
        }
        else getProducts(barcode)
    }

    const getProduct = async (barcode) => {
        const res = await HTTP.get(`${BaseAPI}/products?product_barcode=${barcode}`)
        return res.data.data
    }

    async function getProducts(search) {
        let url = `${BaseAPI}/products/index-without-pagination?name=${search}`
        
        const res = await HTTP.get(url)
        console.log(res.data.data)
        setSuggestedProducts(res.data.data.map(p => ({ ...p, label: p.name + `${p.style_size ? ' ' + p.style_size : ''} `+`${p?.category?.name ? ' ' + p?.category?.name : ''}`, value: p.id })))
    }

    const handleSelect = async (v) => {
        if (v){
            const product = suggestedProducts.find(prod => prod.id === v)
            onProduct(product)
        } else {
            onClear()
        }

        // setSuggestedProducts([])
    }

    return (
        <>
            {ready &&
                <Select disabled={disabled}
                        data={suggestedProducts}
                        searchable
                        // initiallyOpened
                        onSearchChange={v => setSearchText(v)}
                        onChange={handleSelect}
                        label="Search or Scan"
                        // ref={scannerFocus}
                        styles={{dropdown: {backgroundColor: "#c5cadb"}}}
                        clearable
                />
            }

            {!ready &&
                <Select data={[]} label="Search or Scan" />
            }
        </>
    )
}

export default DirectScanner