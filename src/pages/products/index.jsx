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
import XmlErrorsProductsShow from "./xmlErrorsProductsShow";

export default function ({ showBarcode = false, showUploadXLSXFile = true, selectedReceiveRecords, selectedComboRecords, printType = 1, children, onlySelected }) {

  const [products, setProducts] = useState([]);
  const [reRenderProducts, setReRenderProducts] = useState(false);

  const [uploadFile, setUploadFile] = useState([]);

  const [paginationPerPage, setPaginationPerPage] = useState(10)
  const [paginationCurrentPage, setPaginationCurrentPage] = useAtom(CurrentPage)
  const [paginationTotal, setPaginationTotal] = useState(0)

  const [selectedRecords, onSelectedRecordsChange] = useState([])
  const [barcodeMultiply, setBarcodeMultiply] = useState(1)

  const [productSearchToken, setProductSearchToken] = useAtom(ProductSearchToken)
  const [debouncedProductSearchToken] = useDebouncedValue(productSearchToken, 500);

  const [loggedInUser,] = useAtom(LoggedInUser);
  const [error_XML_PRODUCTS_UPLOAD_LIST, Set_Error_XML_PRODUCTS_UPLOAD_LIST] = useAtom(Error_XML_PRODUCTS_UPLOAD_LIST);

  const barcode = useRef();
  const target = useRef();
  const fileRef = useRef();
  const fileButtonRef = useRef();


  const [doRender, setDoRender] = useState(false);
  //modal open or closing handle
  const [opened, setOpened] = useState(false);
  const [loadingFileUpload, setLoadingFileUpload] = useState(false);

  useEffect(() => {
    if (doRender) {
      HTTP.get(`${BaseAPI}/products?name=${debouncedProductSearchToken}&per_page=${paginationPerPage}`).then(res => {
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
    let url = `${BaseAPI}/products?per_page=${paginationPerPage}&`;
    url += `page=${paginationCurrentPage}&`;
    url += `name=${productSearchToken}`
    HTTP.get(url).then(res => {
      setProducts(() => res.data.data)
      setPaginationTotal(res.data.meta.total);
      // console.log({ re: res.data.data })
    }).catch(err => {
      console.log(err)
    })
  }, [reRenderProducts])

  // useEffect (() => {
  // //   // console.log(p);
  // let url = `${BaseAPI}/products?page=${paginationCurrentPage}&per_page=${paginationPerPage}`;
  //     url += `&name=${productSearchToken}`;
  //     HTTP.get(url).then(res => {
  //       console.log(res.data.data)
  //       setProducts(res.data.data)

  //     }).catch(err => {
  //       console.log(err)
  //     })

  // },[paginationCurrentPage])

  const handleSearch = (v) => {
    HTTP.get(`${BaseAPI}/products?product_barcode=${v}`).then(res => {
      setProducts(res.data.data);
      setPaginationTotal(res.data.meta.total);
    })
  }

  const handlePaginationChange = (p) => {
    // console.log(p);
    let url = `${BaseAPI}/products?page=${p}&per_page=${paginationPerPage}`;
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

  //delete table
  const handleDelete = (id) => {
    HTTP.delete(`${BaseAPI}/products/${id}`).then(async (res) => {
      showNotification({
        title: "Success",
        message: "product deleted"
      })

      await HTTP.get(`${BaseAPI}/products?per_page=${paginationPerPage}`).then(res => {
        setProducts(res.data.data)
      }).catch(err => { console.log({ err: err.message }) })
    }).catch(err => {
      console.log(err)
      showNotification({
        title: "Error",
        message: ""
      })
    })
  }

  const openDeleteModal = (id) =>
    openConfirmModal({
      title: 'Are You Sure!',
      centered: true,
      labels: { confirm: 'Delete', cancel: "No" },
      confirmProps: { color: 'red' },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => handleDelete(id),
    });

  const passPrintToElectron = (target) => {
    return new Promise(() => {
      let data = target.contentWindow.document.documentElement.outerHTML;

      let blob = new Blob([data], { type: 'text/html' });
      let url = URL.createObjectURL(blob);

      ipcRenderer.invoke("printComponent", url, "barcode").then(res => {
        console.log(res);
      }).catch(err => {
        console.log(err);
      })
    });
  }

  const uploadXmlData = async (filterRows, datas) => {
    await HTTP.post(`${BaseAPI}/upload-file/products`, filterRows)
      .then((res) => {
        // console.log({ ddddddddd: res.data.error_to_create_tables });
        Set_Error_XML_PRODUCTS_UPLOAD_LIST((value) => [...value, ...res.data.error_to_create_tables])
        showNotification({
          title: `${res.data.no_of_success} Table Uploaded Successfull`,
          message: 'Successfully uploaded',
        });
      })
      .catch((err) => {
        console.log({ err })
        showNotification({
          title: `Upload Failed`,
          message: err.message,
          color: 'red'
        });

      });

  }

  const handleFileUpload = async () => {
    // console.log({ fileRef: uploadFile })
    fileRef.current.disabled = true;
    fileButtonRef.current.disabled = true;

    const fileData = {}
    fileData.name = uploadFile.name
    fileData.path = uploadFile.path
    fileData.lastModified = uploadFile.lastModified
    fileData.size = uploadFile.size
    fileData.type = uploadFile.type
    // console.log(fileData);

    setLoadingFileUpload(true);

    //check file type 
    if (fileData.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      fileRef.current.disabled = false;
      fileButtonRef.current.disabled = false;
      setLoadingFileUpload(false);

      return showNotification({
        title: 'Upload Failed',
        message: 'Please provide ".XLSX" file! 🤥',
        color: 'red'
      })
    }

    // Supplier Name 	Categories	Group	Colors	Product Name	Size	Product Barcode	CPU	RPU	Stock

    await readXlsxFile(uploadFile).then(async (rows) => {
      // console.log({ rows })
      // const length = 500 ;
      // const tableLength = rows.length > length ? Math.ceil(rows.length / length) : 1;
      // let datas = 0;
      // for (let i = 1; i <= tableLength; i++) {
      //   const filterRows = tableLength === i ? rows.slice(datas, rows.length) : rows.slice(datas, datas + length);

      //   filterRows.unshift(rows[0]);

      //   console.log({ filterRows });
      //   console.log({ rows: rows[0] })
      //   //upload to database 
      //   await uploadXmlData(filterRows, datas);

      //   datas = datas + length;
      // }
      // //enable button
      // fileRef.current.disabled = false;
      // fileButtonRef.current.disabled = false;

      const bodyFormData = new FormData();
      bodyFormData.append('file', uploadFile);
      await axios({
        method: 'POST',
        url: `${BaseAPI}/upload-file/from_xml`,
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" }
      })
        .then(res => {
          // console.log({ res })
          if (res.status === 200 && res.data.no_of_success) {
            Set_Error_XML_PRODUCTS_UPLOAD_LIST((value) => [...value, ...res.data.error_to_create_tables])
            showNotification({
              title: `No of tables:${res.data.total_tables} --- Successfull Upload Tables:${res.data.no_of_success}`,
              message: 'Successfully uploaded',
              autoClose: false,
            });
          }
          else {
            Set_Error_XML_PRODUCTS_UPLOAD_LIST((value) => [...value, ...res.data.error_to_create_tables])
            showNotification({
              title: `No of tables:${res.data.total_tables} --- Successfull Upload Tables:${res.data.no_of_success}`,
              message: 'Getting Problem for uploaded',
              color: 'red',
              autoClose: false,
            });
          }
          setReRenderProducts((v) => !v)
        })
        .catch((err) => {
          console.log({ err });
          showNotification({
            title: `Upload Failed`,
            message: err.message,
            color: 'red',
            autoClose: false,
          });
        });
      fileRef.current.disabled = false;
      fileButtonRef.current.disabled = false;
      setLoadingFileUpload(false);
    })

  }

  // useEffect(()=>{
  //   const aa = onlySelected.map(i=>i?.quantity+i?.bonus_quantity)
  //   console.log(onlySelected,"aa__",aa)
  //   setBarcodeMultiply(aa[0]);
  // },[onlySelected])
  return (
    <div>
      <Modal opened={loadingFileUpload} >
        <LoadingOverlay visible={loadingFileUpload} overlayBlur={2} />
      </Modal>

      <div className="flex gap-6 mb-4 justify-between items-center" >
        <div className={"flex gap-4"}>
          {
            printType === 1 &&
            <>
              < TextInput label="Scan Barcode" onChange={e => handleSearch(e.target.value)} />
              <TextInput label={"Product Search"} defaultValue={productSearchToken} onChange={e => setProductSearchToken(e.target.value)} />
            </>
          }
        </div>
        {children && children}
        {
          showUploadXLSXFile &&
          <div className="flex gap-1 relative">
            <FileInput ref={fileRef} onChange={(e) => setUploadFile(() => e)} label="Upload to Database" placeholder="Your XLSX file" className="w-60" icon={<IconUpload size={14} />} />
            <Button ref={fileButtonRef} onClick={handleFileUpload} className="mt-5 border-none">Upload File</Button>
          </div>
        }
        {
          showBarcode &&
          <div>
            <div>
              <div className="flex mt-4 gap-4">
                <NumberInput hideControls className="w-12" value={barcodeMultiply} onChange={v => setBarcodeMultiply(v)} />
                <ReactToPrint
                  content={() => barcode.current}
                  trigger={() => <Button radius="sm" size="sm" uppercase>Print Barcode</Button>}
                  print={passPrintToElectron}
                />
              </div>
              {
                (onlySelected?.length > 0 && printType === 2) && <div className="grid place-content-center">
                  <br />
                  <ReactToPrint
                    content={() => target.current}
                    trigger={() => {
                      //console.log("new selected__",onlySelected);
                      return <Button radius="sm" size="sm" uppercase>Print Quantity Wise</Button>
                    }}
                    print={passPrintToElectron}
                  />
                </div>
              }
            </div>

          </div>

        }
      </div>
      {
        printType === 1 &&
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
              title: "Style/Size",
            },
            {
              accessor: "cost_price",
              title: "CPU",
            },
            {
              accessor: "MRP_price",
              title: "RPU",
            },
            {
              accessor: "stock",
              title: "Stock",
            },
            {
              accessor: "product_barcode",
              title: "Product Barcode",
            },
            {
              accessor: "category.name",
              title: "Category Name",
            },
            {
              accessor: "supplier.company_name",
              title: "Supplier Name",
            },
            {
              accessor: "action",
              title: "Action",
              render: (record) => (
                <div className="w-fit h-fit flex flex-col gap-[1px] lg:flex-row justify-center">
                  <Link to={`/products/edit/${record.id}`} className={loggedInUser?.role == 1 || loggedInUser?.permissions.includes("update_product") ? "" : " hidden"}>
                    <Button size="xs" color={"cyan"}>Edit</Button>
                  </Link>
                  <Button size="xs" className={loggedInUser?.role == 1 || loggedInUser?.permissions.includes("delete_product") ? "" : " hidden h-fit"} onClick={() => openDeleteModal(record.id)} variant="outline" color={"red"} >Delete</Button>
                </div>
              )
            },
          ]}
          records={products}
          page={paginationCurrentPage}
          onPageChange={handlePaginationChange}
          totalRecords={paginationTotal}
          recordsPerPage={paginationPerPage}
          selectedRecords={selectedRecords}
          onSelectedRecordsChange={onSelectedRecordsChange}
        />
      }
      {

        <div className="absolute top-0 left-0">
          <div ref={barcode}>
            {printType === 1 && <Barcode products={selectedRecords} multiply={barcodeMultiply} />}
            {printType === 2 && <Barcode products={selectedReceiveRecords} multiply={barcodeMultiply} />}
            {printType === 3 && <Barcode products={selectedComboRecords} multiply={barcodeMultiply} printType={printType} />}
          </div>
          <div ref={target}>
            {onlySelected?.length > 0 && <Barcode products={onlySelected} printType={2} />}
          </div>
        </div>
      }


      {
        error_XML_PRODUCTS_UPLOAD_LIST.length > 0 &&
        showUploadXLSXFile &&
        <Button
          onClick={() => setOpened(value => !value)}
          className="absolute mb-0 right-0"
        >
          Show Failed to Upload Product List
        </Button>
      }
      {/* modal to show erorrs products to upload */}
      <div>
        <XmlErrorsProductsShow
          opened={opened}
          setOpened={setOpened}
          error_XML_PRODUCTS_UPLOAD_LIST={error_XML_PRODUCTS_UPLOAD_LIST}
        />
      </div>
    </div>
  )
}
