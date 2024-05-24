import {
  ExchangeAmount,
  NetAmount,
  PayAmount,
  PaymentCardAmount,
  PaymentCashAmount,
  ReturnAmount, SelectedCardType,
  SelectedCustomer
} from "@/store/pos";
import {CardAmountInputRef, CardInFocus, CashAmountInputRef, CashInFocus, SaveNPrintButtonRef} from "@/store/pos_focus";
import {NumberInput, Select, Switch} from "@mantine/core";
import { useFocusTrap } from "@mantine/hooks";
import { useAtom } from "jotai";
import {useEffect, useRef, useState} from "react";
import { useNotification } from "~/hooks/useNotification";
import XNumberInput  from "./NumberInput"
import {Setting} from "@/store/setting";

export default function () {
  const [cardList, setCardList] = useState([
    {
      label: "Bkash",
      value: "BKASH"
    },
    {
      label: "Nagad",
      value: "NAGAD"
    },
    {
      label: "Visa",
      value: "VISA",
    },
    {
      label: "Master Card",
      value: "MASTER_CARD"
    }
  ])
  const [setting] = useAtom(Setting)

  const [cashAmount, setCashAmount] = useAtom(PaymentCashAmount)
  const [cardAmount, setCardAmount] = useAtom(PaymentCardAmount)
  const [selectedCardType, setSelectedCardType] = useAtom(SelectedCardType)

  const [selectedCustomer,] = useAtom(SelectedCustomer)

  const [payAmount] = useAtom(PayAmount)
  const [returnAmount] = useAtom(ReturnAmount)
  const [netAmount]  = useAtom(NetAmount)

  const [exchangeAmount,] = useAtom(ExchangeAmount)

  const [cashInFocus] = useAtom(CashInFocus)
  const [cardInFocus, ] = useAtom(CardInFocus)

  const cashFocusRef = useFocusTrap(cashInFocus)
  const cardFocusRef = useFocusTrap(cardInFocus)

  const [cashAmountInputRef, setCashAmountInputRef] = useAtom(CashAmountInputRef)
  const [cardAmountInputRef, setCardAmountInputRef] = useAtom(CardAmountInputRef)
  const [saveNPrintButtonRef,] =useAtom(SaveNPrintButtonRef)
  const cashInputRef = useRef(null)
  const cardInputRef = useRef(null)

  useEffect(()=>{

    // cashAmountInputRef
    // cashInputRef.current.focus()
    setCashAmountInputRef(cashInputRef)
    setCardAmountInputRef(cardInputRef)
  },[])

  const [, setFocus] = useNotification()

  const handleKeyPressOnCash = (e) =>{
    if (e.key === "Enter") {
      cardInputRef.current.focus()
    }
  }

  const handleKeyPressOnCard = (e) => {
    if (e.key === "Enter") {
      saveNPrintButtonRef.current.focus()
    }
  }

  useEffect(()=>{
    if (selectedCustomer){
      let exists =  cardList.find(card=> card.value === "CREDIT")
      if (!exists){
        if (setting?.enable_credit_module){
          setCardList([...cardList, {
            label: "Credit",
            value: "CREDIT",
          }])
        }

      }
    } else {
      const newCardList = cardList.filter(card=> card.value !== "CREDIT")
      setCardList(newCardList)
    }
  },[selectedCustomer])

  return (
    <>
      <fieldset>
        <legend>Payment</legend>
        <table>
        <tbody>
          <tr>
            {/* <td><Switch checked={!!cashAmount} readOnly /></td> */}
            <td>Cash</td>
            <td onKeyUp={handleKeyPressOnCash}><NumberInput value={cashAmount} onChange={v => setCashAmount(v)} hideControls ref={cashInputRef}/></td>
          </tr>
          <tr>
            {/* <td><Switch /></td> */}
            <td>Card</td>
            <td onKeyUp={handleKeyPressOnCard} className={"flex"}>
              <NumberInput value={cardAmount} hideControls onChange={v => setCardAmount(v)} ref={cardInputRef}/>
              <Select data={cardList} value={selectedCardType} onChange={v=>setSelectedCardType(v)} searchable clearable/>
            </td>
          </tr>



          {/* <tr>
            <td><Switch readOnly checked={!!exchangeAmount} /></td>
            <td>Exchange</td>
            <td><NumberInput disabled value={exchangeAmount} /></td>
          </tr> */}
          {/* <tr className={!!selectedCustomer ? "" : "invisible"}>
            <td><Switch readOnly checked={!!redeemAmount} /></td>
            <td>Redeem</td>
            <td><NumberInput value={redeemAmount} onChange={v => setRedeemAmount(v)} /></td>
          </tr> */}
          <tr>
            {/* <td></td> */}
            <td>Pay Amount</td>
            <td><XNumberInput value={payAmount} disabled={true}/></td>
          </tr>
          <tr>
            {/* <td></td> */}
            <td>Return Amount</td>
            <td><XNumberInput value={returnAmount} disabled={true}/></td>
          </tr>
        </tbody>
      </table>
      </fieldset>
      
    </>
  )
}
