export type ProductOnPOSSale = {
    ID?: number
    POSSaleID: number
    ProductID: number
    // mrp price of product
    ProductPrice: number
    // discount after any discount. 0 if no discount
    discount: number
}
