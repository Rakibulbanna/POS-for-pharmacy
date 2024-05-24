import { Select } from "@mantine/core"
import { useEffect, useState } from "react"
import { BaseAPI, HTTP } from "~/repositories/base"
import { useDebouncedValue, useFocusTrap } from "@mantine/hooks";

const BarcodeScanner = ({ getProduct, selectedSupplierID = 0 }) => {
  const [suggestedProducts, setSuggestedProducts] = useState([])
  const [blinkScan, setBlinkScan] = useState(true)

  const [barcodeText, setBarcodeText] = useState("")
  const [debouncedValue] = useDebouncedValue(barcodeText, 500)

  const [scannerInFocus, setScannerInFocus] = useState(true)

  const scannerFocus = useFocusTrap(scannerInFocus)

  useEffect(() => {
    if (debouncedValue) {
      setSuggestedProducts([])
      handleSearch(debouncedValue)
    }
  }, [debouncedValue])



  const getProducts = async (barcode) => {
    let url = `${BaseAPI}/products/dynamic-search/${barcode}?`;
    if (selectedSupplierID) url += `supplier_id=${selectedSupplierID}`;
    const res = await HTTP.get(url)
    return res.data.data
  }

  const blinkScanner = () => {
    setBlinkScan(false)

    setTimeout(() => {
      setBlinkScan(true)

    }, 1);
  }

  const handleSearch = async (v) => {

    let products = await getProducts(v)

    if (products.length > 1) {
      const alterdProducts = products.map(prod => {
        return { ...prod, label: prod.name + `${prod.style_size ? '-' + prod.style_size : ''} `, value: prod.id }
      })
      setSuggestedProducts(alterdProducts)

      blinkScanner()

    } else if (products.length === 1) {
      getProduct(products[0])

      blinkScanner()
    }
  }

  const handleSelect = async (v) => {
    const product = suggestedProducts.find(prod => prod.id === v)

    getProduct(product)
    setSuggestedProducts([])

    blinkScanner()

    setTimeout(() => {
      setScannerInFocus(false)
    }, 100)
  }


  return (
    <>
      {
        blinkScan &&
        <Select data={suggestedProducts} searchable initiallyOpened
          onSearchChange={v => setBarcodeText(v)}
          onChange={handleSelect}
          label="Scan Barcode"
          ref={scannerFocus}
          styles={{ dropdown: { backgroundColor: "#c5cadb" } }}
        />
      }

      {!blinkScan &&
        <Select data={[]} label="Scan Barcode" />
      }
    </>
  )
}

export default BarcodeScanner
