import { Setting } from '@/store/setting';
import { useAtom } from 'jotai';
import Barcode from 'react-jsbarcode';

export default function ({ products, multiply = 1, printType }) {
    console.log({products,multiply});
    const [setting,] = useAtom(Setting)
    const price = (product) => {
        if (printType === 3) {
            return product.price
        }

        if (setting.including_vat) {
            const vat = product.category?.vat_in_percent
            return ((vat / 100) * product.MRP_price) + product.MRP_price
        } else {
            return product.MRP_price
        }
    }

    const options = {
        width: 1,
        height: 25,
        format: "CODE128",
        displayValue: false,
        fontOptions: "",
        font: "monospace",
        textAlign: "center",
        textPosition: "bottom",
        textMargin: 0,
        fontSize: 10,
        background: "#ffffff",
        lineColor: "#000000",
        margin: 0,
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
    }

    return (
        <>
            {products?.map(product => (
                <>
                    {[...Array(printType ==2 ?product?.quantity+product?.bonus_quantity: multiply)].map((n) => (
                        <div key={"" + product.id + n} style={{ width: "38mm", overflow: "hidden", fontFamily: "Verdana", pageBreakAfter: "always" }}>
                            <div style={{ textAlign: "center" }} >
                            <span style={{ fontWeight: "bold", fontSize: "10px", display: "block", lineHeight: "100%", marginBottom: "2px", paddingTop: "5px" }}>{printType ==2 ? product.product.name :product.name}</span>
                                <div className=''>
                                    {
                                        printType === 3 ?
                                            <Barcode value={product.barcode} options={options} />
                                            : printType === 2 ?
                                            <Barcode value={product.product.product_barcode} options={options} />
                                            :
                                            <Barcode value={product.product_barcode} options={options} />
                                    }
                                </div>
                                <span style={{ fontWeight: "bold", fontSize: "10px", display: "block", lineHeight: "100%" }}>{printType ==2 ? product.product.product_barcode :product.product_barcode} <br /> {printType ==2 ? product.product.style_size:product.style_size}</span>
                                <div style={{
                                    fontSize: "10px",
                                    fontWeight: "bold"
                                }}>Price {price(product)} {!!setting.including_vat &&
                                    <span style={{ fontSize: "8px" }}>(Including VAT)</span>}</div>
                            </div>
                        </div>
                    ))}
                </>
            ))}
        </>
    )
}