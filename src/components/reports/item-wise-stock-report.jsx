import ReportPage from "@/utility/reportPage";
import React, { useEffect, useState } from "react"
import { BaseAPI, HTTP } from "~/repositories/base"
import HeaderInfo from "./HeaderInfo";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import { Button } from "@mantine/core";
import { FaSitemap } from 'react-icons/fa';
import Loader from "@/utility/loader";
import { showNotification } from "@mantine/notifications";
import { Delay } from "~/lib/lib";

export default function ({ fromDate, toDate, supplier, supplierList, productBarcode, setting }) {

  const [isloading, setLoading] = useState(false)

  const filterDataName = ['product_barcode', 'name', 'style_size', 'stock', 'cost_price', 'MRP_price'];

  const filterProductList = (products) => {
    const filterProduct = products.map((value) => {
      const data = { id: value.id };
      for (let key in value) {
        if ('supplier' === key) data[key] = value[key]?.company_name;
        if (['category', 'brand'].includes(key)) data[key] = value[key]?.name;
        if (filterDataName.includes(key)) data[key] = value[key];
      }
      return data
    })

    return filterProduct;
  }

  const generateAndPrint = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        let url = `${BaseAPI}/reports/stock/item-wise?`;

        if (fromDate) url += `fromDate=${fromDate}&`;
        if (toDate) url += `toDate=${toDate}`;
        if (supplier) {
          url += `&supplier_id=${supplier}`;
        }
        if (productBarcode) url += `&product_barcode=${productBarcode}`
        //console.log(url);
        const res = await HTTP.get(url)
        let filterProduct = filterProductList(res.data.data)
        console.log(filterProduct);

        const doc = new jsPDF({
          orientation: 'landscape',
          unit: 'px',
          format: 'a4'
        })

        const columns = [
          { header: 'SL', dataKey: 'id' },
          { header: 'Barcode', dataKey: 'product_barcode' },
          { header: 'Product Name', dataKey: 'name' },
          { header: 'Supplier', dataKey: 'supplier' },
          { header: 'Category', dataKey: 'category' },
          { header: 'Group', dataKey: 'brand' },
          { header: 'Style', dataKey: 'style_size' },
          { header: 'Stock QTY', dataKey: 'stock' },
          { header: 'CPU', dataKey: 'cost_price' },
          { header: 'RPU', dataKey: 'MRP_price' },

          { header: 'CPU Value', dataKey: 'CPUValue' },
          { header: 'RPU Value', dataKey: 'RPUValue' },
        ]

        const parseCell = function (data) {
          if (data.row.section === 'body') {
            const column = columns[data.column.index];

            if (column.dataKey === 'CPUValue') {
              data.cell.text = ((data.row.raw.cost_price * data.row.raw.stock).toFixed(2)).toString()
            }
            else if (column.dataKey === 'RPUValue') {
              data.cell.text = ((data.row.raw.MRP_price * data.row.raw.stock).toFixed(2)).toString()
            }
          }
        };
        const footerRow = [
          "",
          "",
          "",
          "",
          "",
          "",
          "Grand Total",
          filterProduct.reduce((pv, cv) => pv + cv.stock, 0).toFixed(2),
          filterProduct.reduce((pv, cv) => pv + cv.cost_price, 0).toFixed(2),
          filterProduct.reduce((pv, cv) => pv + cv.MRP_price, 0).toFixed(2),
          filterProduct.reduce((pv, cv) => pv + (cv.cost_price * cv.stock), 0).toFixed(2),
          filterProduct.reduce((pv, cv) => pv + (cv.MRP_price * cv.stock), 0).toFixed(2),
        ];
        // console.log({ footerRow });
        doc.setFontSize(8)
        doc.text(`${setting?.company_name}\n${setting?.company_address} Mobile: ${setting?.company_phone_number}\n`, 320, 5, {
          align: 'center'
        })
        doc.setFont(undefined, 'bold')
        doc.setFontSize(11)
        doc.text(`Item Wise Stock Report\n ${supplier && `Suppiler Name: ${supplierList.find(i => i.value == supplier)?.label}\n`}`, 320, 20, {
          align: 'center',

        })
        autoTable(doc, {
          body: filterProduct,
          columns: columns,
          didParseCell: parseCell,
          styles: {
            fontSize: 7,
            cellWidth: 'auto',
            cellPadding: 2,
            halign: 'center',
            valign: 'middle',

          },
          bodyStyles: {
            // minCellHeight: 70,
            valign: 'middle',
            fontSize: 7,
            fontStyle: 'bold'
          },

          foot: [footerRow],
          footStyles: {
            fillColor: [217, 217, 217],
            textColor: [0, 0, 0]
          },
          headStyles: {
            fillColor: 'black',
            textColor: 'white',
          },
          showFoot: 'lastPage',
          showHead: 'firstPage'
        })

        doc.save('Item-wise-stock-report.pdf')
        resolve('Success')
      } catch (err) {
        reject(err)
      }
      await Delay(10)
    })


  }


  return (
    <>
      <Button onClick={() => {
        setLoading(true)
        generateAndPrint()
          .catch((err) => {
            showNotification({
              title: "Error",
              color: 'red',
              message: err.message
            })
          }).finally(() => setLoading(false))
      }} radius="xs" color="grape" className=" text-center h-40 w-60 min-w-fit leading-normal" uppercase>
        <div>
          <FaSitemap className=" text-3xl text-pink-100 stroke-2" />
          <br></br>
          <span>Item Wise Stock <br></br> Report ( Current )</span>
        </div>
      </Button>
      {isloading && < Loader />}


    </>
  )
}
