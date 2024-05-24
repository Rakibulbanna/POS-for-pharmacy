import { ExchangeAmount, ExchangeProducts, Exchanges } from "@/store/pos";
import { Button, Drawer, Modal, NumberInput, TextInput } from "@mantine/core";
import { useAtom } from "jotai";
import { DataTable } from "mantine-datatable";
import { useEffect, useState } from "react";
import { BaseAPI, HTTP } from "~/repositories/base";
import { showNotification } from "@mantine/notifications";


export default function ({ open, onClose }) {
  const [exchanges, setExchanges] = useAtom(Exchanges)
  const [posSale, setPosSale] = useState(null)
  const [exchangeProducts, setExchangeProducts] = useAtom(ExchangeProducts)

  const [records, setRecords] = useState([])
  const [selectedRecords, setSelectedRecords] = useState([])
  const [returnAmount, setReturnAmount] = useState(null)
  const [returnSuccess, setReturnSuccess] = useState(false)

  const handleScan = (e) => {
    const ID = e.currentTarget.value
    HTTP.get(`${BaseAPI}/pos-sales/${ID}`).then(res => {
      setPosSale(res.data.data)
      const records_ = res.data.data.products.map(product => {
        return {
          ...product.product,
          quantity: product.quantity,
        }
      })
      setRecords(records_)
    }).catch(err => {
      console.log(err);
    })
    setSelectedRecords([]) ; 
  }

  const handleReturnQuantityUpdate = (value, record) => {
    setSelectedRecords(selectedRecords.map(rec => {
      if (rec.id === record.id) {
        return {
          ...rec, quantity: value
        }
      }
      return rec
    }))
  }

  const handleReturn = () => {
    if (records.length) {
      const data = selectedRecords.map(record => {
        return {
          pos_sale_id: posSale.id,
          product_id: record.id,
          quantity: record.quantity,
        }
      })


      HTTP.post(`${BaseAPI}/pos-sale-return`, { items: data }).then(res => {
        setReturnAmount(res.data.data)
        setReturnSuccess(true)
      }).catch(err => {
        console.log({ err })
        showNotification({
          title: "Error",
          message: err.response.data.data,
          color: "red",
        })
      })
    }
  }


  const [exchangeAmount, setExchangeAmount] = useAtom(ExchangeAmount)


  const handleExchange = () => {
    const data = selectedRecords.map(record => {
      return {
        origin_sale_id: posSale.id,
        product_id: record.id,
        quantity: record.quantity,
      }
    })


    HTTP.post(`${BaseAPI}/get-exchange-amount`, { exchanges: data }).then(res => {
      setExchanges(data)

      setExchangeAmount(res.data.data)

      setExchangeProducts(selectedRecords)

      setTimeout(() => {
        handleClose()
      }, 5);

    }).catch(err => {
      if (err.response.data?.data) {
        showNotification({
          title: "Error",
          message: err.response.data.data
        })
        return
      }
      showNotification({
        title: "Error",
        message: err.response.data
      })
    })
  }


  const handleClose = () => {
    setRecords([])
    setSelectedRecords([])
    setReturnAmount(null)
    setReturnSuccess(false)
    onClose()
  }

  return (
    <>
      <Modal opened={open} onClose={handleClose} size="xl">
        {!returnSuccess &&
          <>
            <TextInput onChange={handleScan} />
            <DataTable
              striped
              columns={[
                {
                  accessor: "name",
                },
                {
                  accessor: "quantity",
                },
                {
                  accessor: "return_quantity",
                  title: "Return Quantity",
                  render: (record) => {
                    return (
                      <>
                        <NumberInput precision={2} onChange={(v) => handleReturnQuantityUpdate(v, record)} />
                      </>
                    )
                  }
                }
              ]}
              records={records}
              selectedRecords={selectedRecords}
              onSelectedRecordsChange={setSelectedRecords}
              className={"min-h-[250px]"}
            />
            <div className={"flex gap-4"}>
              <Button variant={"outline"} onClick={handleReturn}>Return</Button>
              <Button onClick={handleExchange}>Exchange</Button>
            </div>
          </>
        }

        {
          returnSuccess &&
          <>
            <div>Return Amount: {returnAmount}</div>
          </>
        }

      </Modal>
    </>
  )
}
