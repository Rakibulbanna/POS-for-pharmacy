import Express from "express";
import { PrismaClient } from "@prisma/client";
// import {AddPoint, SubtractPoint} from "../../internal/customer/customer";

const prisma = new PrismaClient()

export async function GetExchangeAmount(req: Express.Request, res: Express.Response) {

    try {
        for (const item of req.body.exchanges) {
            // first get how items of this product he purchases
            const productOnPosSale = await prisma.product_on_pos_sale.findFirstOrThrow({
                where: {
                    pos_sale_id: item.origin_sale_id,
                    product_id: item.product_id,
                }
            })
            const bought = productOnPosSale.quantity


            // then get how many he already returned
            const returns = await prisma.pos_sale_return.findMany({
                where: {
                    pos_sale_id: item.origin_sale_id,
                    product_id: item.product_id,
                }
            })
            const alreadyReturn = returns.map(r => r.quantity).reduce((pv, cv) => pv + cv, 0)

            // now get how many he want to return now
            const wantToReturn = item.quantity

            // if already returned >= he bought then return error
            if (alreadyReturn >= bought) {
                return res.status(500).json({ data: "already returned" })
            }

            if ((alreadyReturn + wantToReturn) > bought) {
                return res.status(500).json({ data: "already returned" })
            }
        }



        // get items for already exchanges records to check
        for (const exchange of req.body.exchanges) {
            const sale = await prisma.product_on_pos_sale.findFirstOrThrow({
                where: {
                    pos_sale_id: exchange.origin_sale_id,
                    product_id: exchange.product_id
                }
            })

            const pastExchanges = await prisma.sale_exchange.findMany({
                where: {
                    product_id: exchange.product_id,
                    origin_sale_id: exchange.origin_sale_id
                }
            })

            const alreadyExchanged = pastExchanges.map(pe => pe.quantity).reduce((pv, cv) => pv + cv, 0)

            if (sale.quantity < (alreadyExchanged + exchange.quantity)) {
                return res.status(422).json("some items are already exchanged")
            }
        }




        let amount = 0
        for (const exchange of req.body.exchanges) {
            const sale = await prisma.product_on_pos_sale.findFirstOrThrow({
                where: {
                    pos_sale_id: exchange.origin_sale_id,
                    product_id: exchange.product_id
                }
            })

            amount += (sale.sale_amount / sale.quantity) * parseFloat(exchange.quantity)
        }

        res.json({ data: amount })
    } catch (e) {
        console.log(e)
        res.status(500).json(e)
    }

}



export async function GetTotalExchangeAmount(req: Express.Request, res: Express.Response) {
    let fromDate: any = '2022-01-01';
    if (req.query?.from_date) fromDate = req.query.from_date;
    let toDate: any = '2099-01-01';
    if (req.query?.to_date) toDate = req.query.to_date;


    const fromDate_ = new Date(fromDate);
    const toDate_ = new Date(toDate);

    const result = await prisma.$queryRaw`SELECT sum(se.quantity * pops.mrp_price) as total
        FROM sale_exchanges as se
        join products_on_pos_sales as pops on pops.product_id = se.product_id and pops.pos_sale_id = se.origin_sale_id
        WHERE se.created_at BETWEEN ${fromDate_} AND ${toDate_}`

    if (!result) return res.json({ total: 0 })

    res.json({ total: result[0].total })
}