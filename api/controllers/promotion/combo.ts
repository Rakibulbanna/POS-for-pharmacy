import Express from "express";
import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";

const prisma = new PrismaClient()


export const StoreComboPromotion = async (req: Express.Request, res: Express.Response) => {
  // TODO: validate data

  try {
    // create combo promotion
    const combo = await prisma.combo_promotion.create({
      data: {
        name: req.body.name,
        effective_date: new Date(req.body.effective_date),
        expiry_date: new Date(req.body.expiry_date),
        barcode: "C" + Date.now().toString(),
        is_active: req.body.is_active,
        price: req.body.price,
      }
    })

    // link product
    for (const product of req.body.products) {
      await prisma.product_on_combo_promotion.create({
        data: {
          combo_promotion_id: combo.id,
          product_id: product.id,
          quantity: product.quantity,
        }
      })
    }

    return res.json({ data: "ok" })
  } catch (e) {
    return res.status(422).json({ data: "error" })
  }
}

export const UpdateComboPromotion = async (req: Express.Request, res: Express.Response) => {
  try {
    const updateData = {};

    if (req.query.effectiveDate) updateData['effective_date'] = new Date(req.query.effectiveDate);
    if (req.query.expiryDate) updateData['expiry_date'] = new Date(req.query.expiryDate);

    const response = await prisma.combo_promotion.update({
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
  const promotions = await prisma.combo_promotion.findMany({
    orderBy: { id: 'asc' }
  })

  return res.json({ data: promotions })
}


export async function GetOneByBarcode(req: Express.Request, res: Express.Response) {
  const barcode = req.params.barcode

  const combo = await prisma.combo_promotion.findFirstOrThrow({
    where: {
      barcode: barcode,
      effective_date: {
        lte: dayjs().toDate(),
      },
      expiry_date: {
        gte: dayjs().toDate(),
      },
      is_active: true,
    },
    include: {
      products: {
        include: {
          product: {
            include: {
              flat_promotions: {
                where: {
                  flat_promotion: {
                    effective_date: {
                      lte: dayjs().hour(6).minute(0).second(0).toDate(),
                    },
                    expiry_date: {
                      gte: dayjs().hour(6 + 23).minute(59).second(59).toDate(),
                    }
                  },
                  quantity: {
                    gt: 0,
                  }
                }
              },
              buy_x_get_x: {
                where: {
                  buy_x_get_x: {
                    effective_date: {
                      lte: dayjs().hour(6).minute(0).second(0).toDate(),
                    },
                    expiry_date: {
                      gte: dayjs().hour(6 + 23).minute(59).second(59).toDate(),
                    }
                  }
                }
              },
              category: true,
              color: true,
              supplier: true,
            }
          }
        }
      }
    }
  })

  return res.json({ data: combo })
}

export async function IsProductActive(req: Express.Request, res: Express.Response) {
  const PID = parseInt(req.params.product_id)

  const promotion = await prisma.combo_promotion.findFirst({
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
      is_active: true,
    }
  })

  if (promotion) {
    return res.json({ data: true })
  }

  return res.json({ data: false })
}

