import Express from "express";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

interface Req_InvoiceWiseSale {

    query: {
        from_date: string;
        to_date: string;
        barcode: string;
    }

}

export const InvoiceWiseSale = async (req: Req_InvoiceWiseSale, res: Express.Response) => {
    const { from_date, to_date, offset, count }: any = req.query
    let fromQuery = {}
    let toQuery = {}

    if (from_date) fromQuery = { created_at: { gt: new Date(from_date) } }
    if (to_date) toQuery = { created_at: { lt: new Date(new Date(to_date).setHours(23 + 6, 59, 59)) } }

    let pagination = {}
    if (offset || count) pagination = { skip: parseInt(offset), take: parseInt(count) }

    const allSales = await prisma.pos_sale.findMany({
        ...pagination,
        where: {
            AND: [
                fromQuery,
                toQuery,
            ]
        },
        include: {
            pos_payments: true,
            products: {
                include: {
                    product: {
                        include: {
                            category: true,
                            supplier: true,
                            brand: true
                        }
                    },
                }
            },
            returns: {
                include: {
                    product: true,

                }
            },
            exchanged_products: {
                include: {
                    origin_sale: true,
                    product: true,
                    exchanging_sale: true,
                }
            },
            customer: true,
            user: true
        },
        orderBy: [
            {
                id: 'asc'
            }
        ]
    });

    if (req.query?.barcode) {
        const filterSales = allSales.length === 0 ? allSales : allSales.map((products) => {
            products.products = products.products?.filter((prod) => prod.product?.product_barcode === req.query.barcode);
            return products;
        }).filter(e => e.products.length > 0);

        return res.json({ data: filterSales })
    }
    return res.json({ data: allSales })
}

export const InvoiceWiseSaleCount = async (req: Req_InvoiceWiseSale, res: Express.Response) => {
    try {
        const { from_date, to_date }: any = req.query

        let where = {}

        if (from_date) where = { ...where, created_at: { gt: new Date(from_date) } }
        if (to_date) where = { ...where, created_at: { lt: new Date(new Date(to_date).setHours(23 + 6, 59, 59)) } }

        const allSales = await prisma.pos_sale.count({
            where
        })

        res.json({ count: allSales })
    }
    catch (err) {
        res.status(404).json({ "error": err.message })
    }
}

interface Req_ItemWiseSale {

    query: {
        from_date: string;
        to_date: string;
        barcode: string;
        supplier_id: string;
    }

}

export const ItemWiseSale = async (req: Req_ItemWiseSale, res: Express.Response) => {
    let fromDate = '2022-01-01';
    if (req.query?.from_date) fromDate = req.query.from_date;
    let toDate = '2099-01-01';
    if (req.query?.to_date) toDate = req.query.to_date;


    const fromDate_ = new Date(fromDate);
    const toDate_ = new Date(toDate);

    const result: any = await prisma.$queryRaw`
        select p.product_barcode, p.style_size, s.company_name, p.name as product_name, b.name as brand_name,s.id as supplier_id, 
            sum(ponps.quantity)::float as sqty, p.cost_price as cpu, p."MRP_price" as rpu, 
            sum(ponps.discount_amount) as discount_amount,
            sum(psr.return_amount) as return_amount,
            sum(CASE WHEN se.id is not null THEN (ponps.sale_amount * se.quantity) END) as exchange_amount, 
            sum(ponps.sale_amount) as sale_amount,
            (p.cost_price * sum(ponps.quantity)) as total_cpu,   (p."MRP_price" * sum(ponps.quantity)) as total_rpu
        from products_on_pos_sales as ponps
            join products as p on p.id = ponps.product_id
                join suppliers as s on s.id = p.supplier_id
                join brands as b on b.id = p.brand_id
            join pos_sales as ps on ps.id = ponps.pos_sale_id  
            left join pos_sale_returns as psr on psr.pos_sale_id = ponps.pos_sale_id and psr.product_id = ponps.product_id 
            left join sale_exchanges as se on se.origin_sale_id = ponps.pos_sale_id and se.product_id = ponps.product_id 
        WHERE ps.created_at BETWEEN ${fromDate_} AND ${toDate_} 
        group by ponps.product_id, p.product_barcode, p.style_size, s.company_name, p.name, b.name, p.cost_price, p."MRP_price",s.id `

    if (req.query?.barcode) {

        const filterResult = result.length === 0 ? result : result.filter((val) => val.product_barcode === req.query?.barcode);

        return res.json({ data: filterResult })
    }

    if (req.query?.supplier_id) {

        const filterResult = result.length === 0 ? result : result.filter((val) => val.supplier_id === Number(req.query?.supplier_id));

        return res.json({ data: filterResult })
    }


    return res.json({ data: result })
}

interface Req_CategoryWiseSale {

    query: {
        from_date: string;
        to_date: string;
        query_name: string;
    }

}

export const CategoryWiseSale = async (req: Req_CategoryWiseSale, res: Express.Response) => {
    try {


        let fromDate = '2022-01-01';
        if (req.query?.from_date) fromDate = req.query.from_date;
        let toDate = '2099-01-01';
        if (req.query?.to_date) toDate = req.query.to_date;


        const fromDate_ = new Date(fromDate);
        const toDate_ = new Date(toDate);


        const all = await prisma[req.query.query_name].findMany({
            include: {
                products: {
                    select: {
                        pos_sales: {
                            where: {
                                pos_sale: {
                                    created_at: {
                                        gte: fromDate_,
                                        lte: toDate_,
                                    }
                                }
                            },
                            include: {
                                pos_sale: true,
                            }
                        }
                    }
                }
            }
        })

        res.status(200).json({ data: all });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const ItemWiseSaleDetails = async (req: Express.Request, res: Express.Response) => {
    const all = await prisma.product.findMany({
        include: {
            pos_sales: {
                include: {
                    pos_sale: true,
                }
            },
        }
    })

    return res.json({ data: all })
}

export const CustomerWiseSummery = async (req: Express.Request, res: Express.Response) => {
    let fromDate: any = '2022-01-01';
    if (req.query?.from_date) fromDate = req.query.from_date;
    let toDate: any = '2099-01-01';
    if (req.query?.to_date) toDate = req.query.to_date;


    const fromDate_ = new Date(fromDate);
    const toDate_ = new Date(toDate);


    let customerIdFilter = req.query.customer_id ? Prisma.sql`and c.customer_id = ${req.query.customer_id}` : Prisma.sql``
    let customerPhoneNumberFilter = req.query.phone_number ? Prisma.sql`and c.phone_number = ${req.query.phone_number}` : Prisma.sql``

    const result = await prisma.$queryRaw(Prisma.sql`
        select c.customer_id, usr.first_name as sales_man, pd.product_barcode, c.first_name, c.last_name, ps.total, ((ps.sub_total - ps.discount_amount) - sum(pops.cost_price)) as profit, ps.discount_amount, ps.vat_amount, ps.created_at
        from pos_sales as ps
            join products_on_pos_sales as pops on pops.pos_sale_id = ps.id
            join products as pd on pd.id = pops.product_id
            join users as usr on usr.id = ps.user_id
            join customers as c on c.id = ps.customer_id
        where ps.customer_id is not null ${customerIdFilter} ${customerPhoneNumberFilter} and ps.created_at  BETWEEN ${fromDate_} AND ${toDate_} 
        group by ps.customer_id, usr.first_name, pd.product_barcode , ps.sub_total, ps.discount_amount,ps.vat_amount, ps.total, ps.created_at, c.first_name, c.last_name, c.customer_id
    `)

    return res.json({ data: result })
}
export const UserWiseSummery = async (req: Express.Request, res: Express.Response) => {
    try {
        let fromDate: any = '2023-01-01';
        if (req.query?.from_date) fromDate = req.query.from_date;
        let toDate: any = '2099-01-01';
        if (req.query?.to_date) toDate = req.query.to_date;
        if (req.query?.to_date) toDate = req.query.to_date;


        const fromDate_ = new Date(fromDate);
        const toDate_ = new Date(toDate);


        const userIdFilter = req.query.user_id ? Prisma.sql`users.id = ${Number(req.query.user_id)}` : Prisma.sql``;
        const userPhoneNumberFilter = req.query.phone_number ?
            userIdFilter.values.length > 0 ? Prisma.sql`AND users.phone_number = ${req.query.phone_number}` : Prisma.sql`users.phone_number = ${req.query.phone_number}`
            :
            Prisma.sql``;
        const where = userIdFilter.values.length > 0 || userPhoneNumberFilter.values.length > 0 ? Prisma.sql`WHERE ` : Prisma.sql``;
        // console.log({ userIdFilter: userIdFilter.values, userPhoneNumberFilter, where })
        const result = await prisma.$queryRaw(Prisma.sql`

        SELECT
        users.id,
        pos_sales.id as p_S_id,
        users.first_name,
        pos_sales.total AS total,
        pos_sales.return_amount AS round_amount,
        pos_sales.sub_total AS mrp,
        SUM(pos_sale_returns.return_amount) AS total_return_amt,
        discount_amount AS total_dis_amt,
        vat_amount AS total_vat_amt,
        A.amt AS cash_amt,
        B.amt AS card_amt,
        C.amt AS point_redeem_amt,
        D.amt AS exchange_amt,
        E.amt AS credit_amt
        
        FROM users
        
        LEFT JOIN pos_sales ON users.id = pos_sales.user_id AND pos_sales.created_at BETWEEN ${fromDate_} AND ${toDate_}
        LEFT JOIN pos_sale_returns ON pos_sale_returns.pos_sale_id = pos_sales.id 
        LEFT JOIN sale_exchanges ON pos_sales.id = sale_exchanges.exchanging_sale_id 
        LEFT JOIN pos_payments ON pos_payments.pos_sale_id = pos_sales.id
        LEFT JOIN (
            SELECT pos_sale_id, via, method, SUM(amount) AS amt
            FROM pos_payments
            GROUP BY method, via, pos_sale_id
        ) AS A ON A.pos_sale_id = pos_sales.id
        AND A.method = 1
        LEFT JOIN (
            SELECT
              pos_sale_id, method, SUM(amount) AS amt
            FROM pos_payments
            GROUP BY method, pos_sale_id
          ) AS B ON B.pos_sale_id = pos_sales.id AND B.method = 2
        LEFT JOIN (
            SELECT
              pos_sale_id, method, SUM(amount) AS amt
            FROM pos_payments
            GROUP BY method, pos_sale_id
          ) AS C ON C.pos_sale_id = pos_sales.id AND C.method = 3
        LEFT JOIN (
            SELECT
            pos_sale_id, via, method, SUM(amount) AS amt
            FROM pos_payments
            GROUP BY method, via, pos_sale_id
        ) AS D ON D.pos_sale_id = pos_sales.id
            AND D.method = 4
        LEFT JOIN (
            SELECT
            pos_sale_id, via, method, SUM(amount) AS amt
            FROM pos_payments
            GROUP BY method, via, pos_sale_id
        ) AS E ON E.pos_sale_id = pos_sales.id
            AND E.method = 5

        ${where} ${userIdFilter} ${userPhoneNumberFilter} 

        GROUP BY pos_sales.id, users.id, A.amt, B.amt, C.amt, D.amt, E.amt
        ORDER BY users.id, pos_sales.id ASC

    `)
        return res.json({ data: result })
    }
    catch (err) {
        console.error({ err: err.message })
        return res.status(404).json({ error: err.message })
    }
}

export const InvoiceWiseSalePractice = async (req: Express.Request, res: Express.Response) => {

    const result = await prisma.$queryRaw(Prisma.sql`
    SELECT * from pos_sales
    JOIN sale_exchanges ON pos_sales.id = sale_exchanges.origin_sale_id
    JOIN products_on_pos_sales ON pos_sales.id = products_on_pos_sales.pos_sale_id AND sale_exchanges.product_id = products_on_pos_sales.product_id
    
    `)

    return res.json({ data: result })
}

export const CustomerWiseDetails = async (req: Express.Request, res: Express.Response) => {

    const { from_date, to_date, customer_id, phone_number }: any = req.query;

    let fromDate: any = '2022-01-01';
    if (from_date) fromDate = from_date;
    let toDate: any = '2099-01-01';
    if (to_date) toDate = to_date;

    // let customerIdFilter = req.query.customer_id 
    // let customerPhoneNumberFilter = req.query.phone_number ? Prisma.sql`and c.phone_number = ${req.query.phone_number}` : Prisma.sql``
    const customerFilter: any = { where: {} };
    if (customer_id) customerFilter.where["id"] = parseInt(customer_id);
    if (phone_number) customerFilter.where["phone_number"] = phone_number;

    const fromDate_ = new Date(fromDate);
    const toDate_ = new Date(toDate);

    const customers = await prisma.customer.findMany({
        ...customerFilter,
        include: {
            // customerFilter
            pos_sales: {
                where: {
                    created_at: {
                        gte: fromDate_,
                        lte: toDate_,
                    }
                },
                include: {
                    products: { include: { product: true } },
                    returns: {
                        include: {
                            product: true,

                        }
                    },
                    exchanged_products: {
                        include: {
                            origin_sale: true,
                            product: true,
                            exchanging_sale: true,
                        }
                    },
                    pos_payments: true,
                    user: true
                }
            },
        }
    })
    return res.json({ data: customers })
}