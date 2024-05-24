import { Product } from "../product/product"
import { POSSaleExchange } from "../pos_sale_exchange/pos_sale_exchange";

export type POSSale = {
    ID: number;
    subTotal: number; // subtotal is total mrp amount of products that are in this sale
    discountType: number; //0=no discount, 1=line discount (per product) 2=memebership card discount
    discountInAmount: number; // total taka that given to this sale
    // exchanage amount. amount details can be found in pos_sale_exchanges table
    exchangeAmount: number;
    total: number; // subtotal-discountInAmount-exchangeAmount

    exchanges?: POSSaleExchange[]
    products: Product[]
}