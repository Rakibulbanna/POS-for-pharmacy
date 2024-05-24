import Express from "express";
import {Prisma, PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()


export async function BXGXDetails(req: Express.Request, res: Express.Response){
    const result = await prisma.$queryRaw(Prisma.sql`
        select id::int, name, product_id::int, product_name, count, type
        from (
                select bxgx.id::int, bxgx.name, pops.product_id::int, p.name as product_name, count(pops.product_id)::int, 'GET' as type
            from buy_x_get_x as bxgx
            left join products_on_pos_sales as pops on pops.offer_id = bxgx.id
            join products as p on p.id = pops.product_id

        where pops.mrp_price = 0 and pops.offer_type = 'BXGX'

        group by bxgx.id::int, pops.product_id::int, bxgx.name, p.name
        
        UNION
        
                select bxgx.id::int, bxgx.name, pops.product_id::int, p.name as product_name, count(pops.product_id)::int, 'BUY' as type
            from buy_x_get_x as bxgx
            left join products_on_pos_sales as pops on pops.offer_id = bxgx.id
            join products as p on p.id = pops.product_id

        where pops.mrp_price > 0 and pops.offer_type = 'BXGX'

        group by bxgx.id::int, pops.product_id::int, bxgx.name, p.name
        ) as result
        order by id::int, product_id::int, type
    `)

    return res.json({data: result})
}
