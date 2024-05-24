import { atom } from "jotai";
import {useRef} from "react";

export const ScannerInFocus = atom(false)
export const QuantityInFocus = atom(false)
export const LineDiscountInFocus =atom(false)
export const CashInFocus = atom(false)
export const CardInFocus = atom(false)
export const SaveNPrintInFocus = atom(false)




export const CashAmountInputRef = atom(null)
export const CardAmountInputRef = atom(null)
export const SaveNPrintButtonRef = atom(null)
