import { Button, FileInput, Input, LoadingOverlay, Modal, NumberInput, Table, Text, TextInput } from "@mantine/core";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { BaseAPI, HTTP } from "~/repositories/base";
import { showNotification } from "@mantine/notifications";
import purchaseOrder from "~/src/images/purchase-order.svg";
import { DataTable } from "mantine-datatable";
import Barcode from "@/components/products/barcode";
import ReactToPrint from "react-to-print";
import DayWiseSale from "@/components/reports/day-wise-sale";
import { ipcRenderer } from "electron";
import { openConfirmModal } from "@mantine/modals";
import { useDebouncedValue } from "@mantine/hooks";
import { useAtom } from "jotai";
import { LoggedInUser } from "@/store/auth";
import { IconUpload } from "@tabler/icons";
import readXlsxFile from "read-excel-file";
import { CurrentPage, ProductSearchToken, Error_XML_PRODUCTS_UPLOAD_LIST } from "@/store/product";

import axios from "axios";
import { SelectedCardType } from "@/store/pos";

export default function () {

  const [products, setProducts] = useState([]);
  const [reRenderProducts, setReRenderProducts] = useState(false);

  const [paginationPerPage, setPaginationPerPage] = useState(10)
  const [paginationCurrentPage, setPaginationCurrentPage] = useAtom(CurrentPage)
  const [paginationTotal, setPaginationTotal] = useState(0)

  const [selectedRecords, onSelectedRecordsChange] = useState([])


  const [productSearchToken, setProductSearchToken] = useState(null)
  const [debouncedProductSearchToken] = useDebouncedValue(productSearchToken, 500);

 

  const [doRender, setDoRender] = useState(false);

  useEffect(() => {
    if (doRender) {
      HTTP.get(`${BaseAPI}/products/product_short_list?${debouncedProductSearchToken && `name=${debouncedProductSearchToken}&`}per_page=${paginationPerPage}`).then(res => {
        setProducts(res.data.data);
        setPaginationTotal(() => res.data.meta.total);
        // console.log({ de: res.data.data })
      }).catch(err => {
        console.log(err)
      });
    }
    else {
      setDoRender(() => true);
    }
  }, [debouncedProductSearchToken])

  useEffect(() => {
    let url = `${BaseAPI}/products/product_short_list?per_page=${paginationPerPage}`;
    url += `&page=${paginationCurrentPage}`;
    if (productSearchToken) {
      url += `&name=${productSearchToken}`
    }

    HTTP.get(url).then(res => {
      setProducts(() => res.data.data)
      setPaginationTotal(res.data.meta.total);
      // console.log({ re: res.data.data })
    }).catch(err => {
      console.log(err)
    })
  }, [reRenderProducts])

  const handleSearch = (v: any) => {
    HTTP.get(`${BaseAPI}/products/product_short_list?product_barcode=${v}`).then(res => {
      setProducts(res.data.data);
      setPaginationTotal(res.data.meta.total);
    })
  }

  const handlePaginationChange = (p: any) => {
    // console.log(p);
    let url = `${BaseAPI}/products/product_short_list?page=${p}&per_page=${paginationPerPage}`;
    url += `&name=${productSearchToken}`;
    HTTP.get(url).then(res => {
      // console.log(res.data.data)
      setProducts(res.data.data);
      setPaginationTotal(res.data.meta.total)
      setPaginationCurrentPage(p)
    }).catch(err => {
      console.log(err)
    })
  }


  return (
    <div>

      <div className="flex gap-6 mb-4 justify-between items-center" >
        <div className={"flex gap-4"}>
          
              < TextInput label="Scan Barcode" onChange={e => handleSearch(e.target.value)} />
              <TextInput label={"Product Search"} defaultValue={productSearchToken} onChange={e => setProductSearchToken(e.target.value)} />
          
        </div>
  

      </div>
     
        <DataTable
          striped
          columns={[
            {
              accessor: "id",
              title: "ID",
            },
            {
              accessor: "name",
              width: "20%",
            },
            {
              accessor: "style_size",
              title: "style size",
            },
            {
              accessor: "sale_Qty",
              title: "sale Qty",
            },
            {
              accessor: "product_barcode",
              title: "Barcode",
            },
            {
              accessor: "stock",
              title: "Stock",
            },
            {
              accessor: "received_Qty",
              title: "Pur-Receive Qty",
            },
            {
              accessor: "purchase_return_Qty",
              title: "Pur-RTN Qty",
            },
            {
              accessor: "damage_and_lost_Qty",
              title: "DML",
            }
          ]}
          records={products}
          page={paginationCurrentPage}
          onPageChange={handlePaginationChange}
          totalRecords={paginationTotal}
          recordsPerPage={paginationPerPage}
          selectedRecords={selectedRecords}
          onSelectedRecordsChange={onSelectedRecordsChange}
        />
      


    </div>
  )
}
