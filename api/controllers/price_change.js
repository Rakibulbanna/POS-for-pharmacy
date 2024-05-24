const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()



export function InsertMany(req, res) {
    // get products from json body
    req.body.products.forEach(async product => {
        // update the mrp price on product table

        // console.log({ "req": product })

        const data = {};

        if (product.new_sale_price) data["MRP_price"] = product.new_sale_price;
        // if (product.new_cost_price) data["cost_price"] = product.new_cost_price;
        if (product.new_stock) data["stock"] = product.new_stock;

        try {
            // await prisma.$transaction([

            await prisma.product.update({
                where: {
                    id: product.id
                },
                data: {
                    ...data,
                }
            })

            product.new_sale_price && await prisma.price_change.create({
                data: {
                    old_mrp_price: product.old_sale_price,
                    new_mrp_price: product.new_sale_price,
                    product_id: product.id
                }
            })

            product.new_stock && await prisma.stock_change.create({
                data: {
                    old_stock: product.old_stock,
                    new_stock: product.new_stock,
                    product_id: product.id
                }
            })
            // ])

        } catch (e) {
            console.log(e)
        }

    })

    res.status(200).json("ok")
}

export async function IndexPriceChanges(req, res) {
    const fromDate = req.query.from_date
    const toDate = req.query.to_date
    let fromQuery = {}
    let toQuery = {}

    // console.log("type of", typeof fromDate)
    if (fromDate) {
        fromQuery = { created_at: { gt: new Date(fromDate) } }
    }

    if (toDate) {
        toQuery = { created_at: { lt: new Date(new Date(toDate).setHours(23 + 6, 59, 59)) } }
    }
    return res.status(200).json(await prisma.price_change.findMany({
        include: {
            product: {
                include: {
                    supplier: true,
                }
            },
        },
        where: {
            AND: [
                fromQuery,
                toQuery,
            ]
        },
    }))
}

export async function IndexStockChanges(req, res) {
    const fromDate = req.query.from_date
    const toDate = req.query.to_date
    let fromQuery = {}
    let toQuery = {}

    // console.log("type of", typeof fromDate)
    if (fromDate) {
        fromQuery = { created_at: { gt: new Date(fromDate) } }
    }

    if (toDate) {
        toQuery = { created_at: { lt: new Date(new Date(toDate).setHours(23 + 6, 59, 59)) } }
    }

    return res.status(200).json(await prisma.stock_change.findMany({
        include: {
            product: {
                include: {
                    supplier: true,
                }
            },
        },
        where: {
            AND: [
                fromQuery,
                toQuery,
            ]
        },
    }))
}

