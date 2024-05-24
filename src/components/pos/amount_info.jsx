import {
    AllDiscountAmount,
    ExchangeAmount,
    FinalDiscountAmount, FinalDiscountDisabled,
    FinalDiscountPercent,
    NetAmount, PayAmount, PaymentRedeemAmount,
    POSProducts, SelectedCustomer, ShouldApplyFinalDiscount,
    TotalPrice,
    VATAmount
} from "@/store/pos"
import { NumberInput } from "@mantine/core"
import XNumberInput from "./NumberInput"
import { useAtom } from "jotai"
import { useFocusTrap } from "@mantine/hooks"
import { useState } from "react"
import { Setting } from "@/store/setting";
import { LoggedInUser } from "@/store/auth";

export default function () {
  const [loggedInUser,] = useAtom(LoggedInUser);
  const [posProducts, setPosProducts] = useAtom(POSProducts)
  const [totalPrice] = useAtom(TotalPrice)
  const [vatAmount] = useAtom(VATAmount)
  const [payAmount] = useAtom(PayAmount)
  const [netAmount] = useAtom(NetAmount)
  const [exchangeAmount] = useAtom(ExchangeAmount)
  const [finalDiscountAmount, setFinalDiscountAmount] = useAtom(FinalDiscountAmount)
	const [shouldApplyFinalDiscount, setShouldApplyFinalDiscount] = useAtom(ShouldApplyFinalDiscount)
  const [finalDiscountPercent] = useAtom(FinalDiscountPercent)
  const [finalDiscountDisabled] = useAtom(FinalDiscountDisabled)
  const [, setAllDiscountAmount] = useAtom(AllDiscountAmount)
  const [setting] = useAtom(Setting)
  const [selectedCustomer,] = useAtom(SelectedCustomer)
  const [redeemAmount, setRedeemAmount] = useAtom(PaymentRedeemAmount)

  const [isDiscAmountInFocus, setIsDiscAmountInFocus] = useState(false)
  const discAmountRef = useFocusTrap(isDiscAmountInFocus)
  const handleKeyPressOnDiscPercent = (e) => {
    if (e.key === "Enter") {
      setIsDiscAmountInFocus(true)
      setIsVatAmountInFocus(false)
    }
  }

  const [isVatAmountInFocus, setIsVatAmountInFocus] = useState(false)
  const vatAmountRef = useFocusTrap(isVatAmountInFocus)
  const handleKeyPressOnDiscAmount = (e) => {
    if (e.key === "Enter") {
      setIsVatAmountInFocus(true)
      setIsDiscAmountInFocus(false)
    }
  }

  const [, setFinalDiscountPercent] = useAtom(FinalDiscountPercent)

  const handleAllDiscountChange = (v) => {
	  setShouldApplyFinalDiscount(true)
    setFinalDiscountAmount(v)
    setAllDiscountAmount(v);

    const totalMRP = posProducts.reduce((prev, curr) => prev + curr.MRP_price * curr.quantity, 0);
    const finalPercent = ((v / totalMRP) * 100)

    setFinalDiscountPercent(finalPercent);

  }

  const handleAllDiscountChangeInPercent = (v) => {
    const finalAmt = posProducts.reduce((prev, curr) => prev + (v / 100) * curr.MRP_price * curr.quantity, 0);
    setFinalDiscountAmount(finalAmt);
	setShouldApplyFinalDiscount(true)
  }

  return (
    <>
      <fieldset>
        <legend>Payable</legend>
        <table>
          <tbody>
            <tr>
              <td>Total Price:</td>
              <td><XNumberInput disabled={true} value={totalPrice} precision={2} /></td>
            </tr>
            {/*<tr>*/}
            {/*  <td>Disc (%):</td>*/}

            {/*  <td onKeyUp={handleKeyPressOnDiscPercent}><XNumberInput hideControls={true} /></td>*/}

            {/*</tr>*/}
            <tr>
              <td>Disc Amount:</td>
              <td onKeyUp={handleKeyPressOnDiscAmount}>
                <XNumberInput hideControls={true} ref={discAmountRef}
                  onChange={v => handleAllDiscountChange(v || 0)}
                  value={finalDiscountAmount}
                  disabled={!loggedInUser?.can_give_discount || finalDiscountDisabled}
                  precision={2}
                />
              </td>
            </tr>
            <tr>
              <td>Disc ( % ):</td>
              <td onKeyUp={handleKeyPressOnDiscAmount}>
                <XNumberInput hideControls={true} ref={discAmountRef}
                  onChange={v => handleAllDiscountChangeInPercent(v || 0)}
                  value={finalDiscountPercent}
                  disabled={!loggedInUser?.can_give_discount || finalDiscountDisabled}
                  precision={2}
                />
              </td>
            </tr>
            <tr>
              <td>VAT Amount:</td>
              <td><XNumberInput hideControls={true} value={vatAmount} ref={vatAmountRef} precision={2} /></td>
            </tr>
            <tr>
              <td>Exchange Amount:</td>
              <td><XNumberInput hideControls={true} disabled value={exchangeAmount} /></td>
            </tr>
            <tr className={setting.point_system ? "" : "hidden"}>
              <td>Redeem Amount:</td>
              <td><XNumberInput hideControls={true} onChange={v => setRedeemAmount(v)} disabled={!!!selectedCustomer} /></td>
            </tr>
            <tr>
              <td>Rounding:</td>
              <td><XNumberInput
                hideControls={true}
                value={totalPrice ? Number('.' + totalPrice?.toString()?.split('.')[1]?? 0) || 0 : 0}
                precision={2}
              /></td>
            </tr>
            <tr>
              <td>Net Amount:</td>
              <td><XNumberInput hideControls={true} value={netAmount} disabled styles={{ input: { "&:disabled": { color: "#000", opacity: 1 } } }} /></td>
            </tr>
          </tbody>
        </table>
      </fieldset>
    </>
  )
}
