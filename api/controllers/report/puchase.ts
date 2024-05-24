import { PurchaseOrder } from '@/pages/purchase_order';
import { Purchase_management } from '@/nav_icons/purchase_management';
import Express from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { log } from 'builder-util';

const prisma = new PrismaClient()

export async function PurchaseOrderSummery(req: Express.Request, res: Express.Response) {
    const purchaseOrders = await prisma.purchase_order.findMany({
        where: {
            is_received: false,
        },
        include: {
            products: {
                include: {
                    product: true
                }
            },
            supplier: true,
        }
    })

    return res.json({ data: purchaseOrders })
}

export async function PurchaseOrderDetails(req: Express.Request, res: Express.Response) {
    const purchaseOrders = await prisma.purchase_order.findMany({
        where: {
            is_received: false,
        },
        include: {
            products: {
                include: {
                    product: true
                }
            },
            supplier: true,
        }
    })

    return res.json({ data: purchaseOrders })
}

export async function PurchaseReceiveSummery(req: Express.Request, res: Express.Response) {
    const purchaseOrders = await prisma.purchase_order.findMany({
        where: {
            is_received: true,
        },
        include: {
            products: {
                include: {
                    product: true
                }
            },
            supplier: true,
        }
    })

    return res.json({ data: purchaseOrders })
}

export async function PurchaseReceiveDetails(req: Express.Request, res: Express.Response) {
    const purchaseOrders = await prisma.purchase_order.findMany({
        where: {
            is_received: true,
        },
        include: {
            products: {
                include: {
                    product: true
                }
            },
            supplier: true,
        }
    })

    return res.json({ data: purchaseOrders })
}

export async function PurchaseReturnSummery(req: Express.Request, res: Express.Response) {

    let fromDate = '2022-01-01';
    if (req.query?.from_date) fromDate = req.query.from_date;
    let toDate = '2099-01-01';
    if (req.query?.to_date) toDate = req.query.to_date;

    const fromDate_ = new Date(fromDate);
    const toDate_ = new Date(toDate);
    let query = {};
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
    console.log(query);

    const returns = await prisma.purchase_return.findMany({
        where: query,
        include: {
            supplier: true,
            product: true,
            user: true
        }
    })

    return res.json({ data: returns })
}
export async function PurchaseOnCategory(req: Express.Request, res: Express.Response) {
    try {
        let fromDate = '2022-01-01';
        if (req.query?.from_date) {
            fromDate = req.query.from_date;
        }
        let toDate = '2099-01-01';
        if (req.query?.to_date) {
            toDate = req.query.to_date;
        }

        const fromDate_ = new Date(fromDate);
        const toDate_ = new Date(toDate);


        let query = {
            purchase_orders: {
                some: {
                    purchase_order: {
                        is_received: true,
                        created_at: {
                            gte: fromDate_,
                            lte: toDate_
                        }
                    }
                }
            }
        };

        if (req.query.supplier_id) {
            query = { ...query, supplier_id: parseInt(req.query.supplier_id) }
        }

        const results = await prisma.category.findMany({
            select: {
                id: true,
                name: true,
                products: {
                    select: {
                        purchase_orders: {
                            where: {
                                purchase_order: {
                                    is_received: true,
                                    created_at: {
                                        gte: fromDate_,
                                        lte: toDate_
                                    }
                                }
                            },
                        }
                    }
                }
            }
        })

        if (results.length === 0) return res.json({ data: results });

        let data = results.map(prod => {
            const products = prod.products.filter((purchase) => purchase?.purchase_orders.length > 0)

            return ({ ...prod, products });

        });


        // for (let i of results) {

        //     const categoryInfo = await prisma.category.findUnique({
        //         where: {
        //             id: i.category_id
        //         }
        //     });
        //     data.push({ ...i, categoryInfo });
        // }


        // return res.json(data)
        return res.json(data)
    }
    catch (err) {
        return res.json("Server error")
    }

}



