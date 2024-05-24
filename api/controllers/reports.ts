import Express from "express";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export const DayWiseSale = async (req: Express.Request, res: Express.Response) => {
    let fromDate_ = "2020-01-01"
    if (!!req.body.from_date) {
        fromDate_ = req.body.from_date
    }
    let fromDate = new Date(new Date(fromDate_).setHours(new Date(fromDate_).getHours() - 0))


    let toDate_ = "2099-01-01"
    if (!!req.body.to_date) {
        toDate_ = req.body.to_date
    }
    let toDate = new Date(new Date(toDate_).setHours(new Date(fromDate_).getHours() + 23))


    let supplierIDQuery = " AND p.supplier_id != 0 "
    if (!!req.body.suppplier_id) {
        supplierIDQuery += " AND p.supplier_id = " + req.body.supplier_id
    }




    // const result = await prisma.$queryRaw(
    //     Prisma.sql`
    //         select sum(ps.total),  date_trunc('day', ps.created_at)
    //         from pos_sales as ps
    //             JOIN products_on_pos_sales as pops on pops.pos_sale_id = ps.id
    //             JOIN products as p on pops.product_id = p.id
    //         WHERE ps.created_at >= ${fromDate} and ps.created_at <= ${toDate} 

    //         ${supplierIDQuery}

    //         group by date_trunc('day', ps.created_at)
    //         order by date_trunc
    //     `
    // )

    // const result = await prisma.$queryRaw`
    //         select sum(ps.total),  date_trunc('day', ps.created_at)
    //         from pos_sales as ps
    //             JOIN products_on_pos_sales as pops on pops.pos_sale_id = ps.id
    //             JOIN products as p on pops.product_id = p.id
    //         WHERE ps.created_at >= ${fromDate} and ps.created_at <= ${toDate}
    //         ${supplierIDQuery}
    //         group by date_trunc('day', ps.created_at)
    //         order by date_trunc
    // `

    // return res.json({ data: result })

    if (!!!req.body.supplier_id) {
        const result = await getWithDate(req)
        return res.json({ data: result })
    }


}

async function getWithDate(req) {
    let fromDate_ = "2020-01-01"
    if (!!req.body?.from_date) {
        fromDate_ = req.body.from_date
    }
    let fromDate = new Date(new Date(fromDate_).setHours(new Date(fromDate_).getHours() - 0))


    let toDate_ = "2099-01-01"
    if (!!req.body.to_date) {
        toDate_ = req.body.to_date
    }
    let toDate = new Date(new Date(toDate_).setHours(new Date(fromDate_).getHours() + 23))


    const result = await prisma.$queryRaw(
        Prisma.sql`
            select sum(total),  date_trunc('day', created_at)
            from pos_sales
            WHERE created_at >= ${fromDate} and created_at <= ${toDate} 
            group by date_trunc('day', created_at)
            order by date_trunc
        `
    )

    return result
}

