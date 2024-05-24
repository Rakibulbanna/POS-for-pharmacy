import Express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()


export const POSSaleReturn = async (req: Express.Request, res: Express.Response) => {
  try {
    for (const item of req.body.items) {
      // first get how items of this product he purchases
      const productOnPosSale = await prisma.product_on_pos_sale.findFirstOrThrow({
        where: {
          pos_sale_id: item.pos_sale_id,
          product_id: item.product_id,
        }
      })
      const bought = productOnPosSale.quantity


      // then get how many he already returned
      const returns = await prisma.pos_sale_return.findMany({
        where: {
          pos_sale_id: item.pos_sale_id,
          product_id: item.product_id,
        }
      })
      const alreadyReturn = returns.map(r => r.quantity).reduce((pv, cv) => pv + cv, 0)

      // now get how many he want to return now
      const wantToReturn = item.quantity

      // then get how many he already exchanged
      const exchanges = await prisma.sale_exchange.findMany({
        where: {
          origin_sale_id: item.pos_sale_id,
          product_id: item.product_id,
        }
      });
      const alreadyExchange = exchanges.reduce((pv, cv) => pv + cv.quantity, 0)

      // console.log({ exchanges, alreadyExchange })

      // if already returned >= he bought then return error
      if (alreadyReturn >= bought) return res.status(500).json({ data: "already returned" });

      if ((alreadyReturn + wantToReturn) > bought) return res.status(500).json({ data: "already returned" });

      if (alreadyExchange >= bought) return res.status(500).json({ data: "already exchanged" });

      if ((alreadyExchange + wantToReturn) > bought) return res.status(500).json({ data: "already exchanged or return quantity larger then bought" });

    }

    let totalReturnAmount = 0
    for (const item of req.body.items) {



      const productOnPOSSale = await prisma.product_on_pos_sale.findFirst({
        where: {
          product_id: item.product_id,
          pos_sale_id: item.pos_sale_id
        }
      })

      if (!productOnPOSSale) {
        return res.status(500).json({ data: "not found" })
      }

      const returnAmount = (productOnPOSSale.product_price - productOnPOSSale.discount_amount) * item.quantity
      await prisma.pos_sale_return.create({
        data: {
          pos_sale_id: item.pos_sale_id,
          product_id: item.product_id,
          return_amount: returnAmount,
          quantity: item.quantity,
        }
      })
      totalReturnAmount = totalReturnAmount + returnAmount

      const product: any = await prisma.product.findUnique({
        where: {
          id: item.product_id
        }
      })

      await prisma.product.update({
        where: {
          id: item.product_id,
        },
        data: {
          stock: product.stock + item.quantity
        }
      })
    }



    return res.json({ data: totalReturnAmount })
  } catch (e) {
    console.log(e)
    return res.status(422).json({ data: "error" })
  }

}

export const GetTotalReturnAmount = async (req: Express.Request, res: Express.Response) => {

  let fromDate: any = '2022-01-01';
  if (req.query?.from_date) fromDate = req.query.from_date;
  let toDate: any = '2099-01-01';
  if (req.query?.to_date) toDate = req.query.to_date;


  const fromDate_ = new Date(fromDate);
  const toDate_ = new Date(toDate);

  const result = await prisma.pos_sale_return.aggregate({
    where: {
      created_at: {
        gte: fromDate_,
        lte: toDate_
      }
    },
    _sum: {
      return_amount: true
    },

  })
  return res.json({ total: result._sum.return_amount })
}
