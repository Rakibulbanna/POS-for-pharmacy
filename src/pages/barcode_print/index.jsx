import { useEffect, useState, useRef } from 'react';
import Products from '~/src/pages/products/index';
import { BaseAPI, HTTP } from "~/repositories/base";
import { Button, NumberInput, Select } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import Barcode from '@/components/products/barcode';
import ReactToPrint from 'react-to-print';
import moment from 'moment';


export default function () {
  const [purchaseReceives, setPurchaseReceives] = useState([]);
  const [selectPurchaseReceive, setSelectPurchaseReceive] = useState(null);
  const [purchaseReceiveProducts, setPurchaseReceiveProducts] = useState(null);


  const [selectedRecords, onSelectedRecordsChange] = useState([]);
   const [onlySelected,setOnlySelected]=useState([]);

  const [type, setType] = useState(1);

  const [comboPromotions, setComboPromotions] = useState([]);
  const [selectedComboRecords, onSelectedComboRecordsChange] = useState([])
  const barcode = useRef();
 
  //purchase receive
  useEffect(() => {
    HTTP.get(`${BaseAPI}/purchase_order?is_received=true`)
      .then(res => {
		  const customizedData = res.data.data?.map(value => ({ value: value.id, label: `${value.supplier?.first_name || ''} ${new Date(value.created_at).toLocaleDateString('ca')}-${value.id}` }));
        setPurchaseReceives(() => customizedData);

      })
      .catch(err => { console.log({ err }) })
  }, [])

  useEffect(() => {
    if (!selectPurchaseReceive) {
      setPurchaseReceiveProducts(() => null);
      return;
    }

    HTTP.get(`${BaseAPI}/purchase_order/${selectPurchaseReceive}/receive`)
      .then(res => {
        console.log(res.data);
        setPurchaseReceiveProducts(() => res.data.data?.map(product => ({ id: product.product_id, ...product })))
      })
      .catch(err => { console.log({ err }) })
  }, [selectPurchaseReceive])


  //combo promotion
  useEffect(() => {
    HTTP.get(`${BaseAPI}/promotions/combo`)
      .then(res => {
        const customizedData = res.data.data?.map(value => ({ value: value.id, label: `${value.name || ''} ${value.created_at}`, ...value }));
        setComboPromotions(() => customizedData);
      })
      .catch(err => { console.log({ err }) })
  }, [])
  const passPrintToElectron = (target) => {
    return new Promise(() => {
      let data = target.contentWindow.document.documentElement.outerHTML;
      let blob = new Blob([data], { type: 'text/html' });
      let url = URL.createObjectURL(blob);
      ipcRenderer.invoke("printComponent", url, "landscape").then(res => {
        console.log(res);
      }).catch(err => {
        console.log("error here");
        console.log(err);
      })
    });
  }
  
  
  // useEffect(() => {
  //   //setOnlySelected(selectedRecords?.map((v) => v.product))
  //   setOnlySelected(selectedRecords)
  //   console.log("selectedRecords__", selectedRecords)

  // }, [selectedRecords])
  return <>
    <Products
      showBarcode={true}
      showUploadXLSXFile={false}
      selectedReceiveRecords={selectedRecords?.map((v) => v.product)}
      selectedComboRecords={selectedComboRecords}
      printType={type}
      onlySelected={selectedRecords}
    >

      {
        type === 2 &&
        <div>

          <Select
            label="Select purchase Receive"
            data={purchaseReceives}
            onChange={(e) => {
              //console.log("selected__", e);
              setSelectPurchaseReceive(() => e);
              onSelectedRecordsChange([]);
            }}
            clearable
            searchable
          />
        </div>

      }
      {
        type === 3 && <div></div>
      }
      <div>
        <lebel className=" font-medium">Select Barcode Type:</lebel>
        <Button.Group
        >
          <Button onClick={() => setType(1)} variant={type === 1 ? `gradient` : 'default'} gradient={{ from: 'teal', to: 'blue', deg: 60 }}>Product</Button>
          <Button onClick={() => setType(2)} variant={type === 2 ? `` : 'default'} >Pur Receive</Button>
          <Button onClick={() => setType(3)} variant={type === 3 ? `gradient` : 'default'} gradient={{ from: 'blue', to: 'teal', deg: 60 }} value={3} >Combo Prom</Button>
        </Button.Group>
      </div>

    </Products>
    {
      type === 2 && <div>
        {/* <ReactToPrint
          content={() => barcode.current}
          trigger={() => <Button radius="sm" size="sm" uppercase onClick={() => {
            // selectedRecords?.map((v) => v.product)
            console.log("clicked this");
          }} >Target button</Button>}
          print={passPrintToElectron}
        />
        <div className='absolute right-0 bottom-0' ref={barcode}>
          <Barcode products={selectedRecords?.map((v) => v.product)}
            // multiply={()=>barcodeMultiply()} 
            multiply={1}

          />
        </div> */}
       
        <DataTable
          className=" h-[calc(100vh-110px)] overflow-auto"
          striped
          columns={[
            {
              accessor: "product_id",
              title: "ID",
            },
            {
              accessor: "product.name",
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
              accessor: "mrp_price",
              title: "RPU",
            },
            {
              accessor: "product.stock",
              title: "Stock",
            },
            {
              accessor: "quantity",
              title: "Purchased Quantity",
            }, {
              accessor: "bonus_quantity",
              title: "Bonus Quantity"
            },
            {
              accessor: "product.product_barcode",
              title: "Product Barcode",
            },
            // {
            //   accessor: "product.category.name",
            //   title: "Category Name",
            // },
            // {
            //   accessor: "product.supplier.company_name",
            //   title: "Supplier Name",
            // },
            // {
            //   accessor: "action",
            //   title: "Action",
            //   render: (record) => (
            //     <div className="w-fit h-fit flex flex-col gap-[1px] lg:flex-row justify-center">
            //       <Link to={`/products/edit/${record.id}`} className={loggedInUser?.role == 1 || loggedInUser?.permissions.includes("update_product") ? "" : " hidden"}>
            //         <Button size="xs" color={"cyan"}>Edit</Button>
            //       </Link>
            //       <Button size="xs" className={loggedInUser?.role == 1 || loggedInUser?.permissions.includes("delete_product") ? "" : " hidden h-fit"} onClick={() => openDeleteModal(record.id)} variant="outline" color={"red"} >Delete</Button>
            //     </div>
            //   )
            // },
          ]}
          records={purchaseReceiveProducts}
          // page={paginationCurrentPage}
          // onPageChange={handlePaginationChange}
          totalRecords={purchaseReceiveProducts?.length}
          // recordsPerPage={paginationPerPage}
          selectedRecords={selectedRecords}
          onSelectedRecordsChange={onSelectedRecordsChange}
        />


      </div>

    }

    {
      type === 3 &&
      <DataTable
        className=" h-[calc(100vh-110px)] overflow-auto"
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
            accessor: "barcode",
            width: "Barcode",
          },
          {
            accessor: "price",
            title: "Price",
          },
          // {
          //   accessor: "product.category.name",
          //   title: "Category Name",
          // },
          // {
          //   accessor: "product.supplier.company_name",
          //   title: "Supplier Name",
          // },
          // {
          //   accessor: "action",
          //   title: "Action",
          //   render: (record) => (
          //     <div className="w-fit h-fit flex flex-col gap-[1px] lg:flex-row justify-center">
          //       <Link to={`/products/edit/${record.id}`} className={loggedInUser?.role == 1 || loggedInUser?.permissions.includes("update_product") ? "" : " hidden"}>
          //         <Button size="xs" color={"cyan"}>Edit</Button>
          //       </Link>
          //       <Button size="xs" className={loggedInUser?.role == 1 || loggedInUser?.permissions.includes("delete_product") ? "" : " hidden h-fit"} onClick={() => openDeleteModal(record.id)} variant="outline" color={"red"} >Delete</Button>
          //     </div>
          //   )
          // },
        ]}
        records={comboPromotions}
        // page={paginationCurrentPage}
        // onPageChange={handlePaginationChange}
        totalRecords={comboPromotions?.length}
        // recordsPerPage={paginationPerPage}
        selectedRecords={selectedComboRecords}
        onSelectedRecordsChange={onSelectedComboRecordsChange}
      />
    }
   

  </>
}


