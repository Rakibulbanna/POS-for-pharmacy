import { useEffect, useState } from "react";
import { NumberInput, Pagination, Table } from "@mantine/core"; import ReportFilter from "@/reuse_components/filter";
import { BaseAPI, HTTP } from "~/repositories/base";
import { CustomLoader } from "@/reuse_components/CustomLoader";
import EmptyNotification from "@/reuse_components/emptyNotification";
import ReportPaginateTable from "@/reuse_components/ReportPaginateTable";

const ExpiryReport = () => {

  const [expiryProducts, setExpiryProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPage, setTotalPage] = useState(1);
  const [selectPage, setSelectPage] = useState(1);
  const [paginationPerPage, setPaginationPerPage] = useState(10);
  const [showProducts, setShowProducts] = useState([]);


  const [fromDate, setFromDate] = useState(null)
  const [toDate, setToDate] = useState(null)

  const handleFilter = () => {
    setIsLoading(() => true);
    let url = `${BaseAPI}/reports/expiry-products?`;
    if (fromDate) url += `from_date=${fromDate}&`;
    if (toDate) url += `to_date=${toDate}`;

    HTTP.get(url)
      .then(res => {
        if (res.data.data.length > 0) {
          console.log(res.data.data.length / paginationPerPage)
          const noOfPage = Math.ceil(res.data.data.length / paginationPerPage);
          setTotalPage(noOfPage)
        }
        // else {
        // const filterData = res.data.data.map(value => (value.stock_ledger_id));
        console.log(res.data.data);
        setExpiryProducts(res.data.data || []);
        // setAllStockLedger(() => res.data.data);
        // }
      })
      .catch(err => {
        setExpiryProducts(() => []);
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      })
  }

  return (
    <>
      <div>
        <ReportFilter handleClick={handleFilter} onFromDate={v => setFromDate(() => v)} onToDate={v => setToDate(() => v)} />
      </div>

      <ReportPaginateTable
        isLoading={isLoading}
        items={expiryProducts}
        thead={['id', 'Barcode', 'Supplier', 'Product Name', 'Cpu', 'Rpu', 'Expiry Date', 'Stock']}
        tbodyShowKeys={['id','product_barcode','supplier.first_name','name','cost_price','MRP_price','product_expiry_date','stock']}
      />

    </>
  )
}

export default ExpiryReport;