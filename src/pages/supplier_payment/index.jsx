import EmptyNotification from '@/utility/emptyNotification';
import { Button, Input, NumberInput, Select } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BaseAPI, HTTP } from '~/repositories/base';

export default function () {

  const [suppliers, setSuppliers] = useState([]);
  const [allSuppliers, setAllSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState();
  const [selectedSupplierInfo, setSelectedSupplierInfo] = useState({});
  const [selectedPaymentType, setSelectedPaymentType] = useState(null)
  const [amount, setAmount] = useState(0)
  const [extraPaymentInfo, setExtraPaymentInfo] = useState({
    bank_name: null,
    account_number: null
  });


  //get all suppliers
  useEffect(() => {
    HTTP.get(`${BaseAPI}/suppliers`).then(res => {
      // console.log(res.data.data)
      setAllSuppliers(res.data.data);
      setSuppliers(res.data.data.map(supp => {
        return {
          label: supp.company_name,
          value: supp.id,
        }
      }))
    }).catch(err => {
      console.log(err);
    })
  }, []);

  //get Products 
  const handleGetProductsBySupplier = (v) => {
    const filterSelectedSupplier = allSuppliers.find((supplier) => supplier.id === v)
    setSelectedSupplierInfo(() => filterSelectedSupplier)
  }

  //handle select a supplier
  const handleSupplierChange = (v) => {
    setSelectedSupplier(() => v);
    handleGetProductsBySupplier(v);
  }

  const handlePaymentSave = () => {
    let value = {};
    value.supplier_id = selectedSupplier;
    value.payment_amount = amount;

    if (selectedPaymentType === "Cash") value.payment_type = 1;
    if (selectedPaymentType === "Card") value.payment_type = 2;
    if (selectedPaymentType === "Check") value.payment_type = 3;

    if (selectedPaymentType !== "Cash") {
      value.bank_name = extraPaymentInfo.bank_name;
      value.account_number = extraPaymentInfo.account_number;
    }

    HTTP.post(`${BaseAPI}/account-management/supplier_payment`, value).then(res => {
      showNotification({
        title: "Success",
        message: "Successfully Updated"
      });
      //reset values
      setSelectedPaymentType(() => null);
      setAmount(() => 0);
      setExtraPaymentInfo(() => ({
        bank_name: null,
        account_number: null
      }));
    }).catch(err => {
      console.log(err)
      showNotification({
        title: "Error",
        message: ""
      })
    })
  }

  return <>

    <div className="my-4 flex w-full gap-4 ">
      <Select
        classNames="w-full"
        label="Supplier"
        placeholder='select a supplier'
        data={suppliers}
        onChange={handleSupplierChange}
        searchable
        clearable
      />
      <div>
        <NumberInput
          label="Due"
          type="number"
          value={selectedSupplierInfo?.due ? selectedSupplierInfo.due : 0}
          disabled
        />
      </div>
    </div>

    <div className="my-4 flex w-full gap-4 ">
      <Select
        data={["Cash", "Card", "Check"]}
        label="Payment Type"
        placeholder='select payment type'
        value={selectedPaymentType}
        onChange={(v) => setSelectedPaymentType(() => v)}
        disabled={selectedSupplier ? false : true}
      />
      <NumberInput
        label="Amount"
        type="number"
        value={amount}
        onChange={(v) => setAmount(() => v)}
        disabled={selectedPaymentType ? false : true}
      />

      {(selectedPaymentType === "Card" || selectedPaymentType === "Check")
        &&
        <>
          <div className='w-1/4'>
            <lebel className="font-medium">Bank Name</lebel>
            <Input onChange={(e) => setExtraPaymentInfo((val) => ({ ...val, bank_name: e.target.value }))} />
          </div>

          <div className='w-1/4'>
            <lebel className="font-medium">Account Number</lebel>
            <Input
              type='string'
              onChange={(e) => setExtraPaymentInfo((val) => ({ ...val, account_number: e.target.value }))}
            />
          </div>
        </>
      }
    </div>

    <Button disabled={amount ? false : true} onClick={handlePaymentSave}>Save</Button>
  </>
}