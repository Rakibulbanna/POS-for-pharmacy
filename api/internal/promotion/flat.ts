import { Product } from "../product/product"

export type FlatPromotion = {
  ID?: number
  name: string
  effectiveDate: Date
  expiryDate: Date
  discInPercent: number
  descInAmount: number
  products: Product[]
}
