import EmptyNotification from '@/utility/emptyNotification';
import { Button, Input, NumberInput, Select } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { BaseAPI, HTTP } from '~/repositories/base';

export default function () {

  const [customers, setCustomers] = useState([]);
  const [reRenderCustomers, setReRenderCustomers] = useState(false);
  const [products, setProducts] = useState(null);
  const [selectedCustomerInfo, setSelectedCustomerInfo] = useState();
  const [selectedCustomer, setSelectedCustomer] = useState();
  const [selectedPaymentType, setSelectedPaymentType] = useState(null)
  const [amount, setAmount] = useState(0)
  const [extraPaymentInfo, setExtraPaymentInfo] = useState({
    bank_name: null,
    account_number: null
  });

  const ref = useRef(null);


  //get all customers
  useEffect(() => {
    HTTP.get(`${BaseAPI}/customers`).then(res => {
      // console.log(res.data.data)
      setCustomers(res.data.data.map(supp => {
        return {
          label: supp.first_name,//+ ' ' + supp.last_name,
          value: supp.id,
        }
      }))
    }).catch(err => {
      console.log(err);
    })
  }, [reRenderCustomers]);

  //get Products 
  const getSelectCustomerInfo = (v) => {
    if (!v) {
      setProducts(()=>null);
      return
    }
    HTTP.get(`${BaseAPI}/customers/${v}`).then(res => {

      setProducts(() => res.data.data)
    }).catch(err => {
      console.log(err);
    })
  }

  //handle select a supplier
  const handleSupplierChange = (v) => {
    setSelectedCustomer(() => v);
    getSelectCustomerInfo(v)
  }

  const handlePaymentSave = () => {
    let value = {};
    value.customer_id = selectedCustomer;
    value.payment_amount = amount;

    if (selectedPaymentType === "Cash") value.payment_type = 1;
    if (selectedPaymentType === "Card") value.payment_type = 2;
    if (selectedPaymentType === "Check") value.payment_type = 3;

    if (selectedPaymentType !== "Cash") {
      value.bank_name = extraPaymentInfo.bank_name;
      value.account_number = extraPaymentInfo.account_number;
    }

    //save in customer payment details
    HTTP.post(`${BaseAPI}/customer_payment`, value).then(res => {
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

      setReRenderCustomers((value) => !value)
    }).catch(err => {
      console.log(err)
      showNotification({
        title: "Error",
        message: ""
      })
    });

    //customer reselece
    setSelectedCustomer(() => null);
    setProducts(() => null);

  }

  // console.log({ products })

  return <>

    <div className="my-4 flex w-full gap-4 ">
      <Select
        ref={ref}
        classNames="w-full"
        label="Customers"
        placeholder='select a customer'
        data={customers}
        onChange={handleSupplierChange}
        value={selectedCustomer}
        searchable
        clearable
      />
      <div>
        <lebel className="font-semibold">Due</lebel>
        <NumberInput value={products?.credit_spend} disabled />
      </div>
    </div>

    <div className="my-4 flex w-full gap-4 ">
      <Select
        data={["Cash", "Card", "Check"]}
        label="Payment Type"
        placeholder='select payment type'
        value={selectedPaymentType}
        onChange={(v) => setSelectedPaymentType(() => v)}
        disabled={selectedCustomer ? false : true}
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