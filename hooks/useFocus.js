import { CardInFocus, CashInFocus, LineDiscountInFocus, QuantityInFocus, SaveNPrintInFocus, ScannerInFocus } from "@/store/pos_focus";
import { showNotification } from "@mantine/notifications"
import { IconX } from "@tabler/icons";
import { useAtom } from "jotai";

export const useFocus = () => {
    const [scannerInFocus, setScannerInFocus] = useAtom(ScannerInFocus)
    const [quantityInFocus, setQuantityInFocus] = useAtom(QuantityInFocus)
    const [lineDiscountInFocus, setLineDiscountInFocus] = useAtom(LineDiscountInFocus)
    const [cashInFocus, setCashInFocus] = useAtom(CashInFocus)
    const [cardInFocus, setCardInFocus] = useAtom(CardInFocus)
    const [saveNPrintInFocus, setSaveNPrintInFocus] = useAtom(SaveNPrintInFocus)


    const resetFocus = ()=>{
        setScannerInFocus(false)
        setQuantityInFocus(false)
        setLineDiscountInFocus(false)
        setCashInFocus(false)
        setCardInFocus(false)
        setSaveNPrintInFocus(false)
    }

    return [resetFocus]
}
