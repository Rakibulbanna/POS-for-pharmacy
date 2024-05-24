import Express from "express";
import {Prisma, PrismaClient} from "@prisma/client";
import dayjs from "dayjs";

const prisma = new PrismaClient()


export const DashboardIndex = async (req: Express.Request, res: Express.Response) => {
  // get today sale
  const today = new Date()
  const firstHour = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`

  const todayAggrigate = await prisma.pos_sale.aggregate({
    _sum: {
      total: true
    },
    where: {
      created_at: {
        gte: new Date(firstHour)
        // gte: `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`
      }
    }
  })

  const thisMonth = `${today.getFullYear()}-${today.getMonth()+1}-01`

  const thisMonthAggrigate = await prisma.pos_sale.aggregate({
    _sum: {
      total: true
    },
    where: {
      created_at: {
        gte: new Date(thisMonth)
        // gte: `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`
      }
    }
  })

  const totalReturnOfToday = await getTotalReturnAmountAfter(dayjs().hour(1).minute(1).second(1).toDate())

  const totalReturnOfThisMonth = await getTotalReturnAmountAfter(dayjs().month(1).hour(1).minute(1).second(1).toDate())

  // get today's total return amount

  return res.json({
    data: {
      today_sale: todayAggrigate._sum.total - totalReturnOfToday[0].sum,
      this_month_sale: thisMonthAggrigate._sum.total  - totalReturnOfThisMonth[0].sum,
    }
  })

}

const getTotalReturnAmountAfter = async (date) => {
  return  await prisma.$queryRaw(Prisma.sql`
       select sum(pops.sale_amount * psr.quantity)
        from products_on_pos_sales as pops
            join pos_sales as ps on ps.id = pops.pos_sale_id
            join pos_sale_returns as psr on psr.pos_sale_id = pops.pos_sale_id and psr.product_id = pops.product_id
        where ps.created_at > ${date}
  `)
}
