import { atom } from "jotai";

export const POSSelectProduct = atom(undefined)

export const POSProducts = atom([])
export const POSFreeProducts = atom([])

export const InvoicePrint = atom(true)

export const FinalDiscountPercent = atom(0)
export const FinalDiscountAmount = atom(0)
export const ShouldApplyFinalDiscount = atom(false)
export const AllDiscountAmount = atom(0)
export const FinalDiscountDisabled = atom(false)

export const PaymentCashAmount = atom(undefined)
export const PaymentCardAmount = atom(undefined)
export const PaymentRedeemAmount = atom(undefined)


export const SelectedCardType = atom(null)

// mrp price * amount of all selected product
export const TotalPrice = atom((get) => {
  const posProducts = get(POSProducts)
  const wholeSaleView = get(WholeSaleView)
  let total = 0
  posProducts.forEach(product => {
    total = total + ((wholeSaleView ? (product.whole_sale_price ? product.whole_sale_price : product.MRP_price) : product.MRP_price) * product.quantity)
  })
  return total
})


export const VATAmount = atom((get) => {
  const posProducts = get(POSProducts)

  let total = 0
  posProducts.forEach(prod => {
    const vatInPercent = prod.category?.vat_in_percent > prod.vat_in_percent ? prod.category.vat_in_percent : prod.vat_in_percent;

    const vatAmount = ((vatInPercent / 100) * prod.MRP_price) * prod.quantity
    total += vatAmount
  })

  return total
})

// NetAmount is the amount after vat and discount of total price
export const NetAmount = atom((get) => {
  const totalPrice = get(TotalPrice)
  const vatAmount = get(VATAmount)
  let exchangeAmount = get(ExchangeAmount)
  let finalDiscountAmount = get(FinalDiscountAmount)

  if (exchangeAmount === undefined) {
    exchangeAmount = 0
  }

  if (!finalDiscountAmount) finalDiscountAmount = 0


  return totalPrice + vatAmount - finalDiscountAmount - exchangeAmount
})




// payments will store the payments information when selling, this will be single place for payment information
export const Payments = atom((get) => {
  let payments = []

  const netAmount = get(NetAmount)
  const paymentCashAmount = get(PaymentCashAmount)
  const paymentCardAmount = get(PaymentCardAmount)
  const paymentRedeemAmount = get(PaymentRedeemAmount)
  const exchangeAmount = get(ExchangeAmount)
  const selectedCardType = get(SelectedCardType)
  const returnAmount = get(ReturnAmount)

  if (paymentCashAmount) {
    payments.push({
      method: 1,
      amount: paymentCashAmount - returnAmount
    })
  }

  if (paymentCardAmount) {
    if (selectedCardType === "CREDIT") {
      payments.push({
        method: 5,
        amount: paymentCardAmount,
        via: selectedCardType,
      })
    } else {
      payments.push({
        method: 2,
        amount: paymentCardAmount,
        via: selectedCardType,
      })
    }

  }

  if (paymentRedeemAmount) {
    payments.push({
      method: 3,
      amount: paymentRedeemAmount
    })
  }

  if (exchangeAmount) {
    payments.push({
      method: 4,
      amount: exchangeAmount,
    })
  }

  return payments
})

export const PayAmount = atom((get) => {
  const paymentCashAmount = get(PaymentCashAmount)
  const paymentCardAmount = get(PaymentCardAmount)
  const paymentRedeemAmount = get(PaymentRedeemAmount)
  const exchangeAmount = get(ExchangeAmount)

  if (paymentCashAmount === undefined && paymentCardAmount === undefined && paymentRedeemAmount === undefined && exchangeAmount === undefined) {
    return undefined
  }

  let total = 0
  if (paymentCashAmount !== undefined) {
    total += paymentCashAmount
  }

  if (paymentCardAmount !== undefined) {
    total += paymentCardAmount
  }

  if (paymentRedeemAmount !== undefined) {
    total += paymentRedeemAmount
  }



  // if (exchangeAmount !== undefined) {
  //   total += exchangeAmount
  // }

  return total
})

export const ReturnAmount = atom((get) => {
  // const paymentCashAmount = get(PaymentCashAmount)

  const payAmount = get(PayAmount)
  const totalPrice = get(TotalPrice)
  const netAmount = get(NetAmount)
  let exchangeAmount = get(ExchangeAmount)

  if (payAmount === undefined) {
    return undefined
  }
  if (exchangeAmount === undefined) {
    exchangeAmount = 0
  }

  return payAmount - netAmount
})

export const ExchangeProducts = atom([])


// customer
export const CustomerSearchValue = atom("")
export const SelectedCustomer = atom(null)


// focuses
export const ScanFocus = atom(true)
export const QuantityFocus = atom(false)


// holds
export const Holds = atom([])

export const ProductRepeatIDs = atom([])
export const generatedInvoiceId = atom(undefined)
export const BXGXWatchProducts = atom([])

export const Exchanges = atom([])
export const ExchangeAmount = atom(undefined)

export const WholeSaleView = atom(false)

