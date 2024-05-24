import Express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()


export async function ExpiryProducts(req: Express.Request, res: Express.Response) {
  const { from_date, to_date }: any = req.query;
  let query: any = {};

  if (from_date) query['gte'] = new Date(from_date)
  else query['gte'] = new Date(Date.now());
  if (to_date) query['lte'] = new Date(to_date);

  // if (req.query?.phone_number) query['phoneNumber'] = req.query.phone_number;

  console.log({ query });

  // const customers = await prisma.product.findMany({
  //   where: {
  //     product_barcode: { not: null },
  //     deleted_at: null,
  //     product_expiry_date: query,
  //   },
  //   select: {
  //     id: true,
  //     supplier: { select: { first_name: true } },
  //     name: true,
  //     cost_price: true,
  //     MRP_price: true,
  //     product_barcode: true,
  //     product_expiry_date: true,
  //     stock: true
  //   },
  //   orderBy: {
  //     id: 'asc'
  //   }
  //   // orderBy:id,
  // })
  const customers = await prisma.saleable_product.findMany({
    where: {
      product: {
        product_barcode: { not: null },
        deleted_at: null,
      },
      expiry_date: query,
    },
    select: {
      product: {
        select: {
          id: true,
          supplier: { select: { first_name: true } },
          name: true,
          cost_price: true,
          MRP_price: true,
          product_barcode: true,
          stock: true
        }
      },
      expiry_date: true

    },
    orderBy: {
      id: 'asc'
    }
    // orderBy:id,
  })

  return res.json({ data: customers.map(i => ({ ...i.product, product_expiry_date: i.expiry_date })) })
}