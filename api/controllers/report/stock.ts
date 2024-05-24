import Express from "express";
import { PrismaClient } from "@prisma/client";
import { loadConfigFromFile } from "vite";
import { Prisma } from '@prisma/client'
const prisma = new PrismaClient()


export async function ItemWiseStockReport(req: Express.Request, res: Express.Response) {

  // const query = {}
  // query['gte'] = req.query.fromDate ? new Date(req.query.fromDate) : undefined;
  // query['lt'] = req.query.toDate ? new Date(req.query.toDate) : undefined;

  // let findingQuery = {};

  // if (req.query.supplier_id) {
  //   findingQuery = {...findingQuery, supplier_id: parseInt(req.query.supplier_id)}
  // }

  const fromDate_ = req.query.fromDate ? new Date(req.query.fromDate) : undefined;
  const toDate_ = req.query.toDate ? new Date(req.query.toDate) : undefined;
  let query = {
    is_ready: true,
    deleted_at: null,
  };
  query = {
    ...query,
    created_at: {
      gte: fromDate_,
      lte: toDate_
    }
  }
  if (req.query.supplier_id) {
    query = { ...query, supplier_id: parseInt(req.query.supplier_id) }
  }
  if (req.query.product_barcode) {
    query = { ...query, product_barcode: req.query.product_barcode }
  }

  const products = await prisma.product.findMany({

    where: query,
    include: {
      category: true,
      brand: true,
      supplier: true
    }
  })

  return res.json({ data: products })
}

export async function CategoryWiseStockReport(req: Express.Request, res: Express.Response) {
  let fromDate = '2022-01-01';
  if (req.query?.from_date) fromDate = req.query.from_date;
  let toDate = '2099-01-01';
  if (req.query?.to_date) toDate = req.query.to_date;

  const fromDate_ = new Date(fromDate);
  const toDate_ = new Date(toDate);
  const supplier_id = req.query.supplier_id ? parseInt(req.query.supplier_id) : null;

  console.log("category filter supplier_id__", supplier_id)

  const result = await prisma.$queryRaw`
        select products.category_id,
        sum(products.stock)::float as stock,
        sum(products.stock * products.cost_price)::float as total_cost_price,
        sum(products.stock * products."MRP_price")::float as total_mrp_price,
        categories.name
        from products
            join categories on categories.id = products.category_id
        WHERE products.deleted_at is null AND products.is_ready is true ${req.query.supplier_id ?
      Prisma.sql`and products.supplier_id = ${supplier_id}`
      :
      Prisma.empty} and products.created_at BETWEEN ${fromDate_} AND ${toDate_}
        group by products.category_id, categories.name`

  return res.json({ data: result })
}

export async function BrandWiseStockReport(req: Express.Request, res: Express.Response) {
  let fromDate = '2022-01-01';
  if (req.query?.from_date) fromDate = req.query.from_date;
  let toDate = '2099-01-01';
  if (req.query?.to_date) toDate = req.query.to_date;

  const fromDate_ = new Date(fromDate);
  const toDate_ = new Date(toDate);

  const supplier_id = req.query.supplier_id ? parseInt(req.query.supplier_id) : null;

  console.log("Brand filter supplier_id__", supplier_id)

  const result = await prisma.$queryRaw`
  select products.brand_id,
  sum(products.stock)::float as stock,
  sum(products.stock * products.cost_price)::float as total_cost_price,
  sum(products.stock * products."MRP_price")::float as total_mrp_price,
  brands.name
  from products
     join brands on brands.id = products.brand_id
  WHERE products.deleted_at is null AND products.is_ready is true ${req.query.supplier_id ?
      Prisma.sql`and products.supplier_id = ${supplier_id}`
      :
      Prisma.empty} and products.created_at BETWEEN ${fromDate_} AND ${toDate_}
  group by products.brand_id, brands.name`

  return res.json({ data: result })
}

