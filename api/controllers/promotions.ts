import Express from "express";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()

export const FlatDiscount = async (req: Express.Request, res: Express.Response) => {
  try {
    const promotion = await prisma.promotion.create({
      data: {
        expiry_date: new Date(req.body.expiry_date),
        is_active: req.body.is_active,
        type: req.body.type,
        discount_in_percent: req.body.discount_in_percent,
      }
    })

    for (const product_id of req.body.product_ids) {
      await prisma.product_on_promotion.create({
        data: {
          product_id: product_id,
          promotion_id: promotion.id
        }
      })
    }

    return res.json({data: "ok"})
  }catch (e) {
    return res.status(422).json({data: "error"})
  }
}


