import Express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()
import dayjs from 'dayjs'

export const StoreBuyXGetX = async (req: Express.Request, res: Express.Response) => {
  // TODO: validate data

  try {
    // create bxgx
    const BXGX = await prisma.buy_x_get_x.create({
      data: {
        name: req.body.name,
        effective_date: new Date(req.body.effective_date),
        expiry_date: new Date(req.body.expiry_date),
      }
    })

    // link products
    let groupID = Date.now().toString()
    for (const pair of req.body.pairs) {
      for (const buyProduct of pair.buy_products) {
        await prisma.product_on_buy_x_get_x.create({
          data: {
            buy_x_get_x_id: BXGX.id,
            product_id: buyProduct.id,
            type: 1,
            quantity: buyProduct.quantity,
            group_id: groupID,
          }
        })
      }

      for (const getProduct of pair.get_products) {
        await prisma.product_on_buy_x_get_x.create({
          data: {
            buy_x_get_x_id: BXGX.id,
            product_id: getProduct.id,
            type: 2,
            quantity: getProduct.quantity,
            group_id: groupID,
          }
        })
      }

      groupID = Date.now().toString()
    }

    return res.json({ data: "ok" })
  } catch (e) {
    console.log(e)
    return res.status(422).json({ data: "error" })
  }
}
export const UpdateBuyXGetX = async (req: Express.Request, res: Express.Response) => {
  try {
    const updateData = {};

    if (req.query.effectiveDate) updateData['effective_date'] = new Date(req.query.effectiveDate);
    if (req.query.expiryDate) updateData['expiry_date'] = new Date(req.query.expiryDate);

    const response = await prisma.buy_x_get_x.update({
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

  let query = {
    created_at: { ...dateFilter }
  }

  if (req.query.active === 'true') {
    query = {
      ...query,
      effective_date: {
        lte: dayjs().toDate(),
      },
      expiry_date: {
        gte: dayjs().toDate(),
      },

    }
  }
  // console.log({ query })
  const promotions = await prisma.buy_x_get_x.findMany({
    where: query,
    include: {
      products: true,
    }
  })
  return res.json({ data: promotions })
}

export async function AllBuyXGetXPromotion(req: Express.Request, res: Express.Response) {
  // let dateFilter = {}

  // dateFilter['gte'] = req.query.fromDate ? new Date(req.query.fromDate) : undefined;
  // dateFilter['lt'] = req.query.toDate ? new Date(req.query.toDate) : undefined;

  // let query = {
  //   created_at: { ...dateFilter }
  // }

  // if (req.query.active === 'true') {
  //   query = {
  //     ...query,
  //     effective_date: {
  //       lte: dayjs().toDate(),
  //     },
  //     expiry_date: {
  //       gte: dayjs().toDate(),
  //     },

  //   }
  // }

  const promotions = await prisma.product_on_buy_x_get_x.findMany({
    where: {
      buy_x_get_x: {
        effective_date: {
          lte: dayjs().toDate(),
        },
        expiry_date: {
          gte: dayjs().toDate(),
        },
      }
    },
    include: {
      product: true,
      buy_x_get_x: true,
    }
  })
  return res.json({ data: promotions })
}

export async function CheckExists(req: Express.Request, res: Express.Response) {
  const productID = parseInt(req.params.product_id)

  const promotions = await prisma.buy_x_get_x.findMany({
    where: {
      effective_date: {
        lte: dayjs().toDate(),
      },
      expiry_date: {
        gte: dayjs().toDate(),
      },
      products: {
        some: {
          product_id: productID,
        }
      }
    }
  })

  if (promotions.length) {
    return res.json({ data: true })
  } else {
    return res.json({ data: false })
  }
}

export async function Show(req: Express.Request, res: Express.Response) {
  const ID = parseInt(req.params.id)

  const bxgx = await prisma.buy_x_get_x.findUniqueOrThrow({
    where: {
      id: ID
    },
    include: {
      products: true
    }
  })

  return res.json({ data: bxgx })
}
