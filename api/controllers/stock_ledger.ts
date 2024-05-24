
const { Prisma, PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

export const StoreStockLedger = async (req: Express.Request, res: Express.Response) => {
  try {

    const resProducts = await prisma.product.findMany({
      where: {
        is_ready: true,
      },
      select: {
        id: true,
        stock: true,
        cost_price: true,
        MRP_price: true,
      }
    });

    const data = req.body;

    if (req.body.length === 0) return res.status(500);

    for (const { id, stock, cost_price, MRP_price } of resProducts) {

      const find = data.find((v) => v.id === id);

      if (find) {
        //update product stock
        await prisma.product.update({
          where: {
            id
          },
          data: {
            stock: find.available_stock
          }
        })
        //create a stock ledger
        await prisma.stock_ledger.create({
          data: {
            stock_ledger_id: req.params.id,
            previous_stock: stock,
            current_stock: find.available_stock,
            cost_price: find.cost_price,
            mrp_price: find.MRP_price,
            product_id: find.id
          }
        })
      }
      else {

        //update stock in product
        await prisma.product.update({
          where: {
            id
          },
          data: {
            stock: 0
          }
        })
        //create stock ledger 
        await prisma.stock_ledger.create({
          data: {
            stock_ledger_id: req.params.id,
            previous_stock: stock,
            current_stock: 0,
            cost_price: cost_price,
            mrp_price: MRP_price,
            product_id: id
          }
        })
      }
    }

    res.status(200).json({ data: "success" })
  }
  catch (err) {
    console.log(err.message)
    res.status(500).json({ error: err.message });
  }
}

export const GetAllStockLedger = async (req: Express.Request, res: Express.Response) => {
  try {
    // let query = `SELECT DISTINCT stock_ledger_id FROM stock_ledgers `;
    // console.log(Object.keys(req.query));
    // if (Object.keys(req.query).length > 0) {
    //   console.log({ query });
    //   if (req.query.from_date) query += `WHERE created_at BETWEEN ${req.query.from_date} AND `;
    //   if (req.query.to_date) query += `${req.query.to_date}`;
    // };
    // console.log({ query });
    //WHERE created_at BETWEEN '2022-11-22' AND '2022-11-24'

    const fromDate = req.query.from_date && new Date(req.query.from_date);
    const toDate = req.query.to_date && new Date(req.query.to_date);
    // console.log({ fromDate })

    if (Object.keys(req.query).length > 0) {
      const result = await prisma.stock_ledger.findMany({
        where: {
          created_at: {
            gte: fromDate,
            lt: toDate
          }
        }
      });

      const filterData = result.length > 0 ? result.map((value) => value.stock_ledger_id) : [];
      // console.log({filterData})
      const uniqueData = [...new Set(filterData)];
      // console.log({uniqueData});
      // const filterData = await await prisma.$queryRaw(Prisma.sql`SELECT DISTINCT stock_ledger_id FROM stock_ledgers WHERE stock_ledgers.created_at BETWEEN ${fromDate} AND ${toDate} `)
      res.status(200).json({ data: uniqueData })
    }
    else {
      const uniqueData = await prisma.$queryRaw`SELECT DISTINCT stock_ledger_id FROM stock_ledgers`;
      const filterData = uniqueData.length > 0 ? uniqueData.map((value) => value.stock_ledger_id) : [];
      // console.log({filterData})
      res.status(200).json({ data: filterData })

    }
  }

  catch (err) {
    console.log(err.message)
    res.status(500).json({ error: err.message });
  }
}

export const GetStockLedger = async (req: Express.Request, res: Express.Response) => {
  try {
    const filterData = await prisma.stock_ledger.findMany({
      where: { stock_ledger_id: req.params.id },
      include: {
        product: true
      }
    })
    res.status(200).json({ data: filterData })
  }

  catch (err) {
    console.log(err.message)
    res.status(500).json({ error: err.message });
  }
}