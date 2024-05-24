import { useEffect, useState } from "react";
import { NumberInput, Pagination, Table } from "@mantine/core";
import { CustomLoader } from "@/reuse_components/CustomLoader";
import EmptyNotification from "@/reuse_components/emptyNotification";

const ReportPaginateTable = ({ isLoading = false, items, thead, tbodyShowKeys }) => {

  const [totalPage, setTotalPage] = useState(1);
  const [selectPage, setSelectPage] = useState(1);
  const [paginationPerPage, setPaginationPerPage] = useState(10);
  const [paginatedItems, setpaginatedItems] = useState([]);

  useEffect(() => {
    // console.log(selectPage *paginationPerPage - paginationPerPage , selectPage * paginationPerPage)
    const filteritems = items.filter((item, index) => index >= selectPage * paginationPerPage - paginationPerPage && index < selectPage * paginationPerPage)
    setpaginatedItems(() => filteritems)
  }, [items, selectPage, paginationPerPage]);

  useEffect(() => {
    const noOfPage = Math.ceil(items.length / paginationPerPage);
    setTotalPage(noOfPage)
  }, [paginationPerPage, items])

  return (
    <>
      <div style={{ border: "1px solid lightgray" }} className=" mt-4 border border-gray-600 sticky bottom-0 px-4 py-3 right-0 flex justify-between w-full bg-slate-50 ">
        <NumberInput value={paginationPerPage} onChange={(e) => setPaginationPerPage(e)} />
        <Pagination value={totalPage} onChange={(e) => setSelectPage(e)} total={totalPage} siblings={1} defaultValue={10} />
      </div>

      <div className=" overflow-y-auto ">
        <Table striped highlightOnHover withBorder withColumnBorders >
          <thead>
            <tr>
              {thead.map((value, index) => (
                <th key={index}>{value}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {
              paginatedItems.map(item => <tr key={item.id}>
                {tbodyShowKeys.map((value, index) => {
                  let showValue = item;
                  value.split('.').forEach(element => {
                    if (showValue) {
                      console.log(element,'  ',showValue[element]);
                      showValue = showValue[element]
                    }
                  });
                  return <td key={index}>{showValue}</td>
                })}
              </tr>
              )
            }
          </tbody>
        </Table>
      </div>

      {
        (!isLoading && paginatedItems.length === 0) && <EmptyNotification />
      }

      {
        isLoading &&
        <div className="w-full pt-40 flex justify-center ">
          <CustomLoader />
        </div>
      }

    </>
  )
}

export default ReportPaginateTable;