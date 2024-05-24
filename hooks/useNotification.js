import { CardInFocus, CashInFocus, LineDiscountInFocus, QuantityInFocus, SaveNPrintInFocus, ScannerInFocus } from "@/store/pos_focus";
import { showNotification } from "@mantine/notifications"
import { IconX } from "@tabler/icons";
import { useAtom } from "jotai";

export const useNotification = () => {
  const [scannerInFocus, setScannerInFocus] = useAtom(ScannerInFocus)
  const [quantityInFocus, setQuantityInFocus] = useAtom(QuantityInFocus)
  const [lineDiscountInFocus, setLineDiscountInFocus] = useAtom(LineDiscountInFocus)
  const [cashInFocus, setCashInFocus] = useAtom(CashInFocus)
  const [cardInFocus, setCardInFocus] = useAtom(CardInFocus)
  const [saveNPrintInFocus, setSaveNPrintInFocus] = useAtom(SaveNPrintInFocus)


  const successNotification = (message) => {
    showNotification({
      title: "Success",
      message: message,
      color: "green",
      // icon: <IconX />,
    })
  }

  const setFocus = (on) => {
    if (on === "scanner") {
      setScannerInFocus(true)
    } else {
      setScannerInFocus(false)
    }

    if (on === "quantity") {
      setQuantityInFocus(true)
    } else {
      setQuantityInFocus(false)
    }

    if (on === "line_discount") {
      setLineDiscountInFocus(true)
    } else {
      setLineDiscountInFocus(false)
    }

    if (on === "cash") {
      setCashInFocus(true)
    } else {
      setCashInFocus(false)
    }

    if (on === "card") {
      setCardInFocus(true)
    } else {
      setCardInFocus(false)
    }

    if (on === "save_n_print") {
      setSaveNPrintInFocus(true)
    } else {
      setSaveNPrintInFocus(false)
    }
  }

  return [successNotification, setFocus]
}
