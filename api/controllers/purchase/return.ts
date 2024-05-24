import Express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export const Store = async (req: Express.Request, res: Express.Response) => {
  try {
    for (const item of req.body) {
      const product = await prisma.product.findUnique({
        where: {
          id: item.product_id
        }
      })

      if (!product) {
        return res.status(422).json({ data: "error" })
      }

      await prisma.purchase_return.create({
        data: {
          supplier_id: item.vendor_id,
          product_id: item.product_id,
          quantity: item.quantity,
          reason: item.reason,
          user_id: item.user_id,
          cost_price: product.cost_price,
          mrp_price: product.MRP_price,
        }
      })



      await prisma.product.update({
        where: {
          id: item.product_id
        },
        data: {
          stock: { decrement: item.quantity }
        }
      })

      const supplier = await prisma.supplier.findUnique({
        where: {
          id: parseInt(item.vendor_id)
        }
      })

      if (supplier) {
        await prisma.supplier.update({
          where: {
            id: supplier.id,
          },
          data: {
            due: supplier.due - (product.cost_price * item.quantity)
          }
        })
      }

      await prisma.saleable_product.update({
        where: { sale_barcode: item.sale_barcode },
        data: {
          no_of_product: { decrement: item.quantity }
        }
      })
    }
  } catch (e) {
    console.log(e);
    return res.status(422).json({ data: "error" })
  }

  return res.json({ data: "ok" })

}
