export type POSSaleReturn = {
    ID?: number
    // scan receipt to get sale_id
    POSSaleID: number
    // scan product to get product_id
    productID: Number
    // product_on_pos_sale table where pos_sale_id = POSSaleID and produc_id = productID; price-discount
    returnAmount: number
}