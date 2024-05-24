import Express from "express";
import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";

const prisma = new PrismaClient()

export const StoreFlatDiscount = async (req: Express.Request, res: Express.Response) => {
  // TODO: validate data
  // TODO: handle error
  // TODO: flat discount defenation has changed.

  // Create
  const flatPromotion = await prisma.flat_promotion.create({
    data: {
      name: req.body.name,
      effective_date: new Date(req.body.effective_date),
      expiry_date: new Date(req.body.expiry_date),
      //   disc_in_percent: req.body.disc_in_percent,
      //   disc_in_amount: req.body.disc_in_amount,
    }
  })

  // link product
  for (const product of req.body.products) {
    await prisma.product_on_flat_promotion.create({
      data: {
        product_id: product.id,
        flat_promotion_id: flatPromotion.id,
        disc_in_amount: product.disc_in_amount,
        disc_in_percent: Number(product.disc_in_percent),
        quantity: parseInt(product.request_quantity),
      }
    })
    // await prisma.product.update({
    //   where: {
    //     id: product_id,
    //   },
    //   data: {
    //     flat_promotion_id: flatPromotion.id
    //   }
    // })
  }

  return res.json({ data: "ok" })
}

export const UpdateFlatDiscount = async (req: Express.Request, res: Express.Response) => {
  try {
    const updateData = {};

    if (req.query.effectiveDate) updateData['effective_date'] = new Date(req.query.effectiveDate);
    if (req.query.expiryDate) updateData['expiry_date'] = new Date(req.query.expiryDate);

    const response = await prisma.flat_promotion.update({
      where: { id: Number(req.params.id) },
      data: { ...updateData }
    });

    res.status(200).json({
      message: 'Success'
    })
  }
  catch (err) {
    res.status(500).json({ data: "error" })
  }
}

export async function Index(req: Express.Request, res: Express.Response) {
  let dateFilter = {}

  dateFilter['gte'] = req.query.fromDate ? new Date(req.query.fromDate) : undefined;
  dateFilter['lt'] = req.query.toDate ? new Date(req.query.toDate) : undefined;

  const promotions = await prisma.flat_promotion.findMany({
    where: {
      created_at: { ...dateFilter }
    },
    include: {
      products: {
        include: {
          product: true,
        }
      },
    }
  })

  return res.json({ data: promotions })
}

export async function IsProductActive(req: Express.Request, res: Express.Response) {
  const PID = parseInt(req.params.product_id)

  const promotion = await prisma.flat_promotion.findFirst({
    where: {
      products: {
        some: {
          product_id: PID,
        }
      },
      effective_date: {
        lte: dayjs().toDate(),
      },
      expiry_date: {
        gte: dayjs().toDate(),
      },
    }
  })

  if (promotion) {
    return res.json({ data: true })
  }

  return res.json({ data: false })
}
