import Express from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import dayjs from 'dayjs'
import { AnyNode } from "postcss";

const prisma = new PrismaClient()

interface Request {
    query: {
        per_page: string;
        page: string;
        for: string;
        name: string;
        product_barcode: string;
        category_id: string;
        supplier_id: string;
        brand_id: string;
    }
}

export const IndexProduct = async (req: Request, res: Express.Response) => {
    let perPage = 10
    if (req.query.per_page) {
        perPage = parseInt(req.query.per_page)
    }
    let query: any = { deleted_at: null }

    // if we need products for filling then we will pass the products that ready status is false0
    if (req.query.for !== "fill") {
        query = { ...query, is_ready: true }
    } else {
        query = { ...query, is_ready: false }
    }

    if (req.query.product_barcode) {
        query = { ...query, product_barcode: req.query.product_barcode }
    }

    if (req.query.name) {
        query = { ...query, name: { contains: req.query.name, mode: 'insensitive' } }
    }

    if (req.query.category_id) {
        query = { ...query, category_id: parseInt(req.query.category_id) }
    }

    if (req.query.supplier_id) {
        query = { ...query, supplier_id: parseInt(req.query.supplier_id) }
    }
    if (req.query.brand_id) {
        query = { ...query, brand_id: parseInt(req.query.brand_id) }
    }

    console.log({ query })
    let page = 1
    if (req.query.page) {
        page = parseInt(req.query.page)
    }

    const users = await prisma.product.findMany({
        where: query,
        include: {
            flat_promotions: true,
            category: true,
            color: true,
            supplier: true,
            brand: true
        },
        skip: (page - 1) * perPage,
        take: perPage,
    })

    const aggregate = await prisma.product.aggregate({
        where: query,
        _count: {
            id: true,
        }
    })

    res.status(200).json({ data: users, meta: { total: aggregate._count.id } })
}
export const IndexSaleableProduct = async (req: Request, res: Express.Response) => {
    let perPage = 20
    if (req.query.per_page) {
        perPage = parseInt(req.query.per_page)
    }
    let query: any = { deleted_at: null }

    // if we need products for filling then we will pass the products that ready status is false0
    if (req.query.for !== "fill") {
        query = { ...query, is_ready: true }
    } else {
        query = { ...query, is_ready: false }
    }

    if (req.query.product_barcode) {
        query = { ...query, product_barcode: req.query.product_barcode }
    }

    if (req.query.name) {
        query = { ...query, name: { contains: req.query.name, mode: 'insensitive' } }
    }

    if (req.query.category_id) {
        query = { ...query, category_id: parseInt(req.query.category_id) }
    }

    if (req.query.supplier_id) {
        query = { ...query, supplier_id: parseInt(req.query.supplier_id) }
    }
    if (req.query.brand_id) {
        query = { ...query, brand_id: parseInt(req.query.brand_id) }
    }

    let page = 1
    if (req.query.page) {
        page = parseInt(req.query.page)
    }

    const users = await prisma.product.findMany({
        where: query,
        include: {
            flat_promotions: true,
            category: true,
            color: true,
            supplier: true,
            brand: true,
            saleable_product: true,
        },
        skip: (page - 1) * perPage,
        take: perPage,
    })

    const aggregate = await prisma.product.aggregate({
        where: query,
        _count: {
            id: true,
        }
    })

    res.status(200).json({ data: users, meta: { total: aggregate._count.id } })
}
export const IndexProductShortList = async (req: Request, res: Express.Response) => {
    let perPage = 10
    if (req.query.per_page) {
        perPage = parseInt(req.query.per_page)
    }
    let query: any = {
        deleted_at: null,
    }
    let name;

    // if we need products for filling then we will pass the products that ready status is false0
    if (req.query.for !== "fill") {
        query = { ...query, is_ready: true }

    } else {
        query = { ...query, is_ready: false }

    }

    if (req.query.product_barcode) {
        query = { ...query, product_barcode: req.query.product_barcode }
    }

    if (req.query.name) {
        query = { ...query, name: { contains: req.query.name, mode: 'insensitive' } }
        name = req.query.name.toLowerCase()
    }

    if (req.query.category_id) {
        query = { ...query, category_id: parseInt(req.query.category_id) }
    }

    if (req.query.supplier_id) {
        query = { ...query, supplier_id: parseInt(req.query.supplier_id) }

    }
    if (req.query.brand_id) {
        query = { ...query, brand_id: parseInt(req.query.brand_id) }

    }
    let page = 1
    if (req.query.page) {
        page = parseInt(req.query.page)
    }

    // const users = await prisma.product.findMany({
    //     where: {
    //         deleted_at: null, is_ready: true
    //     },
    //     include: {
    //         flat_promotions: true,
    //         category: true,
    //         color: true,
    //         supplier: true,
    //         brand: true
    //     },
    //     skip: (page - 1) * perPage,
    //     take: perPage,
    // })


    const filtererdProducts: Array<any> = await prisma.$queryRaw`
    SELECT products.id,products.name,products.stock,products.style_size,products.product_barcode
    FROM products
    LEFT JOIN product_on_flat_promotion ON products.id = product_on_flat_promotion.product_id
    INNER JOIN categories ON products.category_id = categories.id
    LEFT JOIN colors ON products.color_id = colors.id
    LEFT JOIN suppliers ON products.supplier_id = suppliers.id
    LEFT JOIN brands ON products.brand_id = brands.id
  WHERE
  products.stock < products.re_order_quantity
  AND products.deleted_at IS null
  ${req.query.for !== "fill" ? Prisma.sql` AND products.is_ready IS TRUE` : Prisma.sql` AND products.is_ready IS FALSE`}
  ${req.query.product_barcode ? Prisma.sql` AND product_barcode=${req.query.product_barcode}` : Prisma.empty}
  ${req.query.name ? Prisma.sql` AND LOWER(products.name) LIKE LOWER(${`%${req.query.name}%`})` : Prisma.empty}
  ${req.query.category_id ? Prisma.sql` AND products.category_id = ${parseInt(req.query.category_id)}` : Prisma.empty}
  ${req.query.supplier_id ? Prisma.sql` AND products.supplier_id = ${parseInt(req.query.supplier_id)}` : Prisma.empty}
  ${req.query.brand_id ? Prisma.sql` AND products.brand_id = ${parseInt(req.query.brand_id)}` : Prisma.empty}
    LIMIT ${perPage}
    OFFSET ${(page - 1) * perPage}
  `

    for (const i of filtererdProducts) {
        const productSaleCount = await prisma.product_on_pos_sale.aggregate({
            where: {
                product_id: i.id
            },
            _sum: {
                quantity: true
            }
        })
        const productPurchaseReceive = await prisma.product_on_purchase_order.aggregate({
            where: {
                product_id: i.id,
                purchase_order: {
                    is_received: true
                }
            },
            _sum: {
                received_quantity: true
            }
        })
        const productPurchaseReturn = await prisma.purchase_return.aggregate({
            where: {
                product_id: i.id
            },
            _sum: {
                quantity: true
            }
        })
        const DML = await prisma.damage_and_lost.aggregate({
            where: {
                product_id: i.id
            },
            _sum: {
                quantity: true
            }
        })
        i['sale_Qty'] = productSaleCount?._sum?.quantity ? productSaleCount?._sum?.quantity : 0
        i['received_Qty'] = productPurchaseReceive?._sum?.received_quantity ? productPurchaseReceive?._sum?.received_quantity : 0
        i['purchase_return_Qty'] = productPurchaseReturn?._sum?.quantity ? productPurchaseReturn?._sum?.quantity : 0,
            i['damage_and_lost_Qty'] = DML?._sum?.quantity ? DML?._sum?.quantity : 0


    }
    const totalNumber = await prisma.$queryRaw`
   SELECT count(*) AS total 
   FROM products
   LEFT JOIN product_on_flat_promotion ON products.id = product_on_flat_promotion.product_id
   INNER JOIN categories ON products.category_id = categories.id
   LEFT JOIN colors ON products.color_id = colors.id
   LEFT JOIN suppliers ON products.supplier_id = suppliers.id
   LEFT JOIN brands ON products.brand_id = brands.id
 WHERE
 products.stock < products.re_order_quantity
 AND products.deleted_at IS null
 ${req.query.for !== "fill" ? Prisma.sql` AND products.is_ready IS TRUE` : Prisma.sql` AND products.is_ready IS FALSE`}
 ${req.query.product_barcode ? Prisma.sql` AND product_barcode=${req.query.product_barcode}` : Prisma.empty}
 ${req.query.name ? Prisma.sql` AND LOWER(products.name) LIKE LOWER(${`%${req.query.name}%`})` : Prisma.empty}
 ${req.query.category_id ? Prisma.sql` AND products.category_id = ${parseInt(req.query.category_id)}` : Prisma.empty}
 ${req.query.supplier_id ? Prisma.sql` AND products.supplier_id = ${parseInt(req.query.supplier_id)}` : Prisma.empty}
 ${req.query.brand_id ? Prisma.sql` AND products.brand_id = ${parseInt(req.query.brand_id)}` : Prisma.empty}
 `

    // console.log(typeof (totalNumber[0]?.total));

    res.status(200).json({ data: filtererdProducts, meta: { total: totalNumber && totalNumber?.length ? Number(totalNumber[0]?.total) : 0 } })
}

export const StoreProduct = async (req: Express.Request, res: Express.Response) => {
    try {
        const product = await prisma.product.findFirst({
            where: {
                product_barcode: req.body.product_barcode,
            }
        })
        if (product) {
            return res.status(422).json({ data: "Product Barcode not available" })
        }


        const existingProduct = await prisma.product.findUniqueOrThrow({
            where: {
                id: parseInt(req.body.product_id)
            }
        })
        console.log("existingProduct__", existingProduct)
        const prod = await prisma.product.create({
            data: {
                category_id: req.body.category_id,
                name: existingProduct.name,
                zone_id: existingProduct.zone_id,
                vat_in_percent: existingProduct.vat_in_percent,
                discount: existingProduct.discount,
                system_barcode: Date.now().toString(),
                style_size: req.body.style_size,
                color_id: req.body.color_id,
                product_barcode: req.body.product_barcode,
                minimum_order_quantity: req.body.minimum_order_quantity,
                maximum_order_quantity: req.body.maximum_order_quantity,
                re_order_quantity: req.body.re_order_quantity,
                whole_sale_price: req.body.whole_sale_price,
                product_expiry_date: req.body.product_expiry_date ? new Date(req.body.product_expiry_date) : null,
                batch_expiry_date: req.body.batch_expiry_date ? new Date(req.body.batch_expiry_date) : null,
                cost_price: req.body.cost_price,
                MRP_price: req.body.mrp_price,
                // stock: req.body.stock,
                brand_id: req.body.brand_id,
                supplier_id: req.body.supplier_id,
                // is_service: req.body.is_service,
                is_ready: true,
            }
        })
        return res.json({ data: prod })
    } catch (e) {
        console.log(e)
        return res.status(422).json({ data: "error" })
    }
}

export const StoreProductMinimum = async (req: Express.Request, res: Express.Response) => {
    try {
        const prod = await prisma.product.create({
            data: {
                category_id: req.body.category_id,
                name: req.body.name,
                zone_id: req.body.zone_id,
                vat_in_percent: req.body.vat_in_percent,
                discount: req.body.discount,
                system_barcode: Date.now().toString()
            }
        })
        return res.json({ data: prod })
    } catch (e) {
        console.log(e)
        return res.status(422).json({ data: "error" })
    }
}

export const FillProductInfo = async (req: Express.Request, res: Express.Response) => {
    try {
        let product = await prisma.product.findFirst({
            where: {
                product_barcode: req.body.product_barcode,
            }
        })
        if (product) {
            return res.status(422).json({ data: "Product Barcode not available" })
        }

        const id = parseInt(req.params.id)

        //first find the product
        product = await prisma.product.findUnique({
            where: {
                id: id
            }
        })

        let systemBarcode = Date.now().toString();
        if (!product) {
            return res.status(404).json({ data: "product not found" })
        }
        if (product.system_barcode) {
            systemBarcode = product.system_barcode
        }

        const updatedProduct = await prisma.product.update({
            where: {
                id: id,
            },
            data: {
                style_size: req.body.style_size,
                color_id: req.body.color_id,
                system_barcode: systemBarcode,
                product_barcode: req.body.product_barcode,
                minimum_order_quantity: req.body.minimum_order_quantity,
                maximum_order_quantity: req.body.maximum_order_quantity,
                re_order_quantity: req.body.re_order_quantity,
                whole_sale_price: req.body.whole_sale_price,
                product_expiry_date: req.body.product_expiry_date ? new Date(req.body.product_expiry_date) : null,
                batch_expiry_date: req.body.batch_expiry_date ? new Date(req.body.batch_expiry_date) : null,
                cost_price: req.body.cost_price,
                MRP_price: req.body.mrp_price,
                stock: req.body.stock,
                brand_id: req.body.brand_id,
                supplier_id: req.body.supplier_id,
                is_service: req.body.is_service,
                is_ready: true,
            }
        })

        return res.json({ data: updatedProduct })
    } catch (e) {
        console.log(e);
        return res.status(422).json({ data: "error" })
    }

}

export const ShowProduct = async (req, res) => {
    const id = req.params.id

    const product = await prisma.product.findFirstOrThrow({
        where: {
            id: parseInt(id),
            deleted_at: null,
        },
        include: {
            flat_promotions: {
                where: {
                    flat_promotion: {
                        effective_date: {
                            lte: dayjs().hour(6).minute(0).second(0).toDate(),
                        },
                        expiry_date: {
                            gte: dayjs().hour(6 + 23).minute(59).second(59).toDate(),
                        }
                    },
                    quantity: {
                        gt: 0,
                    }
                }
            },
            buy_x_get_x: {
                where: {
                    buy_x_get_x: {
                        effective_date: {
                            lte: dayjs().hour(6).minute(0).second(0).toDate(),
                        },
                        expiry_date: {
                            gte: dayjs().hour(6 + 23).minute(59).second(59).toDate(),
                        }
                    }
                }
            },
            category: true,
            color: true,
            supplier: true,
        },
    })

    res.json({ "data": product })
}

export const Update = async (req, res) => {
    try {
        await prisma.product.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                color_id: req.body.color_id,
                name: req.body.name,
                style_size: req.body.style_size,
                product_barcode: req.body.product_barcode,
                minimum_order_quantity: req.body.minimum_order_quantity,
                maximum_order_quantity: req.body.maximum_order_quantity,
                re_order_quantity: req.body.re_order_quantity,
                whole_sale_price: req.body.whole_sale_price,
                product_expiry_date: new Date(req.body.product_expiry_date),
                batch_expiry_date: new Date(req.body.batch_expiry_date),
                cost_price: req.body.cost_price,
                MRP_price: req.body.mrp_price,
                brand_id: req.body.brand_id,
                category_id: req.body.category_id,
                supplier_id: req.body.supplier_id,
                discount: req.body.discount,
                zone_id: req.body.zone_id,
                vat_in_percent: req.body.vat_in_percent,
                is_ready: req.body.is_ready
            }
        })

        res.json({ data: "success" })
    } catch (e) {
        console.log(e)
        res.status(500).json({ data: e })
    }
}

export const DeleteProduct = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const product = await prisma.product.findUniqueOrThrow({
            where: {
                id: id,
            }
        })

        await prisma.product.update({
            where: {
                id: id
            },
            data: {
                deleted_at: new Date(),
                product_barcode: "",
                backup_product_barcode: product.product_barcode,
            }
        })
        res.json({})
    } catch (err) {
        res.json({
            error: err.message
        })
    }
}

export const HardDelete = async (req: Express.Request, res: Express.Response) => {
    const ID = parseInt(req.params.id)

    await prisma.product.delete({
        where: {
            id: ID
        }
    })

    return res.json({ data: "deleted" })
}

interface DamageRequest {
    params: { id: string };
    query: {
        quantity: string;
        status: string;
        reason: string;
    }
}

export const LogDamage = async (req: DamageRequest, res: Express.Response) => {
    try {
        const productID = parseInt(req.params.id)
        const quantity = parseFloat(req.query.quantity)
        // console.log({quantity})
        let status = 0
        if (req.query.status === 'damage') {
            status = 1
        }
        if (req.query.status === 'lost') {
            status = 2
        }

        const product: any = await prisma.product.findUnique({
            where: {
                id: productID
            }
        })

        if (product?.stock < quantity) {
            return res.status(500).json({ "data": "greater than quantity" })
        }

        await prisma.product.update({
            where: {
                id: productID
            },
            data: {
                stock: product.stock - quantity
            }
        })

        await prisma.damage_and_lost.create({
            data: {
                product_id: productID,
                quantity: quantity,
                status: status,
                reason: req.query.reason,
                cost: product.cost_price * quantity,
            }
        })

        return res.json({ data: "ok" })
    } catch (e) {
        console.log(e)
        return res.status(500).json({ data: "error" })
    }
}

export const GetTotalDamageAndLost = async (req: DamageRequest, res: Express.Response) => {

    let fromDate: any = '2022-01-01';
    if (req.query?.from_date) fromDate = req.query.from_date;
    let toDate: any = '2099-01-01';
    if (req.query?.to_date) toDate = req.query.to_date;

    const fromDate_ = new Date(fromDate);
    const toDate_ = new Date(toDate);

    const result = await prisma.damage_and_lost.aggregate({
        where: {
            created_at: {
                gte: fromDate_,
                lte: toDate_
            }
        },
        _sum: {
            cost: true
        }
    })

    return res.json(result)
}

export const IndexDamageAndLost = async (req, res) => {
    const damages = await prisma.damage_and_lost.findMany({ include: { product: true } })
    return res.json({ data: damages })
}

interface ReqDynamicSearch {
    params: { token: string };
    query: {
        per_page: string;
        supplier_id: string;
        hide_zero_stock: string;
    }

}

export async function DynamicSearch(req: ReqDynamicSearch, res: Express.Response) {
    try {
        const searchValue = req.params.token

        let query: any = {
            deleted_at: null
        }

        let perPage = 100
        if (req.query.per_page) perPage = parseInt(req.query.per_page)

        if (req.query.supplier_id) query = { ...query, supplier_id: parseInt(req.query.supplier_id) }

        if (req.query.hide_zero_stock) query = { ...query, stock: { gt: 0 } }


        const products = await prisma.product.findMany({
            where: {
                OR: [
                    {
                        name: {
                            contains: searchValue,
                            mode: "insensitive",
                        }
                    },
                    {
                        product_barcode: {
                            contains: searchValue,
                        }
                    }
                ],
                AND: query,
            },
            include: {
                flat_promotions: {
                    where: {
                        flat_promotion: {
                            effective_date: {
                                lte: dayjs().hour(6).minute(0).second(0).toDate(),
                            },
                            expiry_date: {
                                gte: dayjs().hour(6 + 23).minute(59).second(59).toDate(),
                            }
                        },
                        quantity: {
                            gt: 0,
                        }
                    }
                },
                buy_x_get_x: {
                    where: {
                        buy_x_get_x: {
                            effective_date: {
                                lte: dayjs().hour(6).minute(0).second(0).toDate(),
                            },
                            expiry_date: {
                                gte: dayjs().hour(6 + 23).minute(59).second(59).toDate(),
                            }
                        }
                    }
                },
                category: true,
                color: true,
                supplier: true,
                brand: true,
            },
            take: perPage,
        })

        return res.json({ data: products })
    } catch (e) {
        console.log(e)
        return res.status(422).json({ data: "error" })
    }
}


export async function DynamicSaleBarcodeSearch(req: ReqDynamicSearch, res: Express.Response) {
    try {
        const searchValue = req.params.token

        let query: any = {
            deleted_at: null
        }


        let perPage = 100
        if (req.query.per_page) perPage = parseInt(req.query.per_page)

        if (req.query.supplier_id) query = { ...query, supplier_id: parseInt(req.query.supplier_id) }

        if (req.query.hide_zero_stock) query = { ...query, stock: { gt: 0 } }

        const where: any = {
            AND: [
                { sale_barcode: searchValue },
                { expiry_date: { gte: new Date(Date.now()) } },
                {
                    OR: [{ no_of_product: { gt: 0 } }, { no_of_bonus_product: { gt: 0 } }]
                }
            ]
        };

        if (req.query.supplier_id) where.AND.push({ vendor_id: Number(req.query.supplier_id) })
        // return res.json({error: 'provide supplier id'})

        let unique_id = 0;

        const saleable_product = await prisma.saleable_product.findFirst({
            where,
            include: {
                product: {
                    include: {
                        flat_promotions: {
                            where: {
                                flat_promotion: {
                                    effective_date: {
                                        lte: dayjs().hour(6).minute(0).second(0).toDate(),
                                    },
                                    expiry_date: {
                                        gte: dayjs().hour(6 + 23).minute(59).second(59).toDate(),
                                    }
                                },
                                quantity: {
                                    gt: 0,
                                }
                            }
                        },
                        buy_x_get_x: {
                            where: {
                                buy_x_get_x: {
                                    effective_date: {
                                        lte: dayjs().hour(6).minute(0).second(0).toDate(),
                                    },
                                    expiry_date: {
                                        gte: dayjs().hour(6 + 23).minute(59).second(59).toDate(),
                                    }
                                }
                            }
                        },
                        category: true,
                        color: true,
                        supplier: true,
                        brand: true,
                    },
                },
                vendor: true
            },
            take: perPage,
        })

        const resData = saleable_product?.product ? [{ ...saleable_product?.product, sale_barcode: searchValue, vendor_id: saleable_product.vendor_id, vendor_company_name: saleable_product.vendor.company_name, unique_id: unique_id + 1 }] : [];

        if (resData.length > 0) return res.json({ data: resData });

        const temp = searchValue.split(' ');
        const size = temp.length
        let tempStyle = {};
        if (size > 1) {
            let cnt = '';
            for (let i = 0; i < size - 1; i++) {
                cnt += temp[i]
            }
            tempStyle = {
                OR: [
                    {
                        name: {
                            contains: searchValue,
                            mode: "insensitive"
                        },
                    },
                    {
                        name: {
                            contains: cnt,
                            mode: "insensitive"
                        },
                        style_size: {
                            contains: temp[size - 1],
                            mode: "insensitive"
                        }
                    }
                ]

            }
        } else {
            tempStyle = {
                name: {
                    contains: searchValue,
                    mode: "insensitive"
                },
            }
        }

        query = { ...query, ...tempStyle }
        console.log( query,query?.OR );

        const products = await prisma.product.findMany({
            where: query,
            include: {
                flat_promotions: {
                    where: {
                        flat_promotion: {
                            effective_date: {
                                lte: dayjs().hour(6).minute(0).second(0).toDate(),
                            },
                            expiry_date: {
                                gte: dayjs().hour(6 + 23).minute(59).second(59).toDate(),
                            }
                        },
                        quantity: {
                            gt: 0,
                        }
                    }
                },
                buy_x_get_x: {
                    where: {
                        buy_x_get_x: {
                            effective_date: {
                                lte: dayjs().hour(6).minute(0).second(0).toDate(),
                            },
                            expiry_date: {
                                gte: dayjs().hour(6 + 23).minute(59).second(59).toDate(),
                            }
                        }
                    }
                },
                category: true,
                color: true,
                supplier: true,
                brand: true,
                saleable_product: {
                    where: {
                        AND: [
                            { expiry_date: { gte: new Date(Date.now()) } },
                            {
                                OR: [{ no_of_product: { gt: 0 } }, { no_of_bonus_product: { gt: 0 } }]
                            }
                        ]
                    },
                    include: {
                        vendor: true
                    }
                },
            },
            take: perPage,
        })

        const cusProducts: any = [];

        for (const product of products) {
            cusProducts.push({ ...product, unique_id: unique_id + 1 });
            unique_id += 1;

            if (product.saleable_product.length === 0) continue;

            const customizeProducts: any = [];
            for (const saleable_prod of product.saleable_product) {
                customizeProducts.push({ ...product, vendor_id: saleable_prod.vendor_id, vendor_company_name: saleable_prod.vendor.company_name, unique_id: unique_id + 1 })
                unique_id += 1;

            }
            cusProducts.push(...customizeProducts)
        }

        // const products = await prisma.product.findMany({
        //     where: {
        //         OR: [
        //             {
        //                 name: {
        //                     contains: searchValue,
        //                     mode: "insensitive",
        //                 }
        //             },
        //             {
        //                 product_barcode: {
        //                     contains: searchValue,
        //                 }
        //             },
        //         ],
        //         AND: query,
        //     },
        //     include: {
        //         flat_promotions: {
        //             where: {
        //                 flat_promotion: {
        //                     effective_date: {
        //                         lte: dayjs().hour(6).minute(0).second(0).toDate(),
        //                     },
        //                     expiry_date: {
        //                         gte: dayjs().hour(6 + 23).minute(59).second(59).toDate(),
        //                     }
        //                 },
        //                 quantity: {
        //                     gt: 0,
        //                 }
        //             }
        //         },
        //         buy_x_get_x: {
        //             where: {
        //                 buy_x_get_x: {
        //                     effective_date: {
        //                         lte: dayjs().hour(6).minute(0).second(0).toDate(),
        //                     },
        //                     expiry_date: {
        //                         gte: dayjs().hour(6 + 23).minute(59).second(59).toDate(),
        //                     }
        //                 }
        //             }
        //         },
        //         category: true,
        //         color: true,
        //         supplier: true,
        //         brand: true,
        //     },
        //     take: perPage,
        // })

        return res.json({ data: cusProducts })
    } catch (e) {
        console.log(e)
        return res.status(422).json({ data: "error" })
    }
}
export async function DynamicSaleBarcodeSearchReturn(req: ReqDynamicSearch, res: Express.Response) {
    try {

        let query: any = { deleted_at: null }
        let perPage = 100;

        const searchValue = req.params.token;
        const { per_page, supplier_id, hide_zero_stock } = req.query;

        if (per_page) perPage = parseInt(req.query.per_page)
        if (supplier_id) query = { ...query, supplier_id: parseInt(req.query.supplier_id) }
        if (hide_zero_stock) query = { ...query, stock: { gt: 0 } }

        const where: any = {
            AND: [
                {
                    OR: [
                        { sale_barcode: searchValue },
                        {
                            product: {
                                name: {
                                    contains: searchValue,
                                    mode: "insensitive",
                                },
                            },
                        }
                    ]
                },
                // { expiry_date: {gte: new Date(Date.now())} },
                { vendor_id: Number(supplier_id) },
                {
                    OR: [{ no_of_product: { gt: 0 } }, { no_of_bonus_product: { gt: 0 } }]
                }
            ]
        };

        // if (req.query.supplier_id) where.AND.push({ vendor_id: Number(req.query.supplier_id) })
        // return res.json({error: 'provide supplier id'})

        let unique_id = 0;

        const saleable_products = await prisma.saleable_product.findMany({
            where,
            include: {
                product: {
                    include: {
                        flat_promotions: {
                            where: {
                                flat_promotion: {
                                    effective_date: {
                                        lte: dayjs().hour(6).minute(0).second(0).toDate(),
                                    },
                                    expiry_date: {
                                        gte: dayjs().hour(6 + 23).minute(59).second(59).toDate(),
                                    }
                                },
                                quantity: {
                                    gt: 0,
                                }
                            }
                        },
                        buy_x_get_x: {
                            where: {
                                buy_x_get_x: {
                                    effective_date: {
                                        lte: dayjs().hour(6).minute(0).second(0).toDate(),
                                    },
                                    expiry_date: {
                                        gte: dayjs().hour(6 + 23).minute(59).second(59).toDate(),
                                    }
                                }
                            }
                        },
                        category: true,
                        color: true,
                        supplier: true,
                        brand: true,
                    },
                },
                vendor: true
            },
            take: perPage,
        })
        console.log({ saleable_products })
        const resSaleableProducts = saleable_products.length > 0 ?
            saleable_products?.map((saleable_product) => ({ ...saleable_product.product, sale_barcode: searchValue, vendor_id: saleable_product.vendor_id, vendor_company_name: saleable_product.vendor.company_name, unique_id: unique_id + 1 }))
            : [];
        // const resSaleableProduct = saleable_product?.product ? [{ ...saleable_product?.product, sale_barcode: searchValue, vendor_id: saleable_product.vendor_id, vendor_company_name: saleable_product.vendor.company_name, unique_id: unique_id + 1 }] : [];

        // if (resSaleableProduct.length > 0) 
        return res.json({ data: resSaleableProducts });


        const saleable_product_____ = await prisma.saleable_product.findMany({
            where: {
                vendor_id: Number(supplier_id),
                product: {
                    name: {
                        contains: searchValue,
                        mode: "insensitive",
                    },
                },
            },
            include: {
                product: {
                    include: {
                        flat_promotions: {
                            where: {
                                flat_promotion: {
                                    effective_date: {
                                        lte: dayjs().hour(6).minute(0).second(0).toDate(),
                                    },
                                    expiry_date: {
                                        gte: dayjs().hour(6 + 23).minute(59).second(59).toDate(),
                                    }
                                },
                                quantity: {
                                    gt: 0,
                                }
                            }
                        },
                        buy_x_get_x: {
                            where: {
                                buy_x_get_x: {
                                    effective_date: {
                                        lte: dayjs().hour(6).minute(0).second(0).toDate(),
                                    },
                                    expiry_date: {
                                        gte: dayjs().hour(6 + 23).minute(59).second(59).toDate(),
                                    }
                                }
                            }
                        },
                        category: true,
                        color: true,
                        supplier: true,
                        brand: true,
                    },
                }
            },
            take: perPage,
        })

        return res.json({ saleable_product_____ })

        const products = await prisma.product.findMany({
            where: {
                name: {
                    contains: searchValue,
                    mode: "insensitive",
                },
                AND: query,
            },
            include: {
                flat_promotions: {
                    where: {
                        flat_promotion: {
                            effective_date: {
                                lte: dayjs().hour(6).minute(0).second(0).toDate(),
                            },
                            expiry_date: {
                                gte: dayjs().hour(6 + 23).minute(59).second(59).toDate(),
                            }
                        },
                        quantity: {
                            gt: 0,
                        }
                    }
                },
                buy_x_get_x: {
                    where: {
                        buy_x_get_x: {
                            effective_date: {
                                lte: dayjs().hour(6).minute(0).second(0).toDate(),
                            },
                            expiry_date: {
                                gte: dayjs().hour(6 + 23).minute(59).second(59).toDate(),
                            }
                        }
                    }
                },
                category: true,
                color: true,
                supplier: true,
                brand: true,
                saleable_product: {
                    where: {
                        AND: [
                            { expiry_date: { gte: new Date(Date.now()) } },
                            {
                                OR: [{ no_of_product: { gt: 0 } }, { no_of_bonus_product: { gt: 0 } }]
                            }
                        ]
                    },
                    include: {
                        vendor: true
                    }
                },
            },
            take: perPage,
        })

        const cusProducts: any = [];

        for (const product of products) {
            cusProducts.push({ ...product, unique_id: unique_id + 1 });
            unique_id += 1;

            if (product.saleable_product.length === 0) continue;

            const customizeProducts: any = [];
            for (const saleable_prod of product.saleable_product) {
                customizeProducts.push({ ...product, vendor_id: saleable_prod.vendor_id, vendor_company_name: saleable_prod.vendor.company_name, unique_id: unique_id + 1 })
                unique_id += 1;

            }
            cusProducts.push(...customizeProducts)
        }

        // const products = await prisma.product.findMany({
        //     where: {
        //         OR: [
        //             {
        //                 name: {
        //                     contains: searchValue,
        //                     mode: "insensitive",
        //                 }
        //             },
        //             {
        //                 product_barcode: {
        //                     contains: searchValue,
        //                 }
        //             },
        //         ],
        //         AND: query,
        //     },
        //     include: {
        //         flat_promotions: {
        //             where: {
        //                 flat_promotion: {
        //                     effective_date: {
        //                         lte: dayjs().hour(6).minute(0).second(0).toDate(),
        //                     },
        //                     expiry_date: {
        //                         gte: dayjs().hour(6 + 23).minute(59).second(59).toDate(),
        //                     }
        //                 },
        //                 quantity: {
        //                     gt: 0,
        //                 }
        //             }
        //         },
        //         buy_x_get_x: {
        //             where: {
        //                 buy_x_get_x: {
        //                     effective_date: {
        //                         lte: dayjs().hour(6).minute(0).second(0).toDate(),
        //                     },
        //                     expiry_date: {
        //                         gte: dayjs().hour(6 + 23).minute(59).second(59).toDate(),
        //                     }
        //                 }
        //             }
        //         },
        //         category: true,
        //         color: true,
        //         supplier: true,
        //         brand: true,
        //     },
        //     take: perPage,
        // })

        return res.json({ data: cusProducts })
    } catch (e) {
        console.log(e)
        return res.status(422).json({ data: "error" })
    }
}


interface ReqIndexWithoutPagination {
    query: {
        for: string;
        name: string;
        supplier_id: string;
        category_id: string;
    }
}

export async function IndexWithoutPagination(req: ReqIndexWithoutPagination, res: Express.Response) {
    try {

        let query: any = { deleted_at: null }

        if (req.query.for !== "fill") {
            query = { ...query, is_ready: true }
        } else {
            query = { ...query, is_ready: false }
        }

        if (req.query.name) {
            const temp = req.query.name.split(' ');
            const size = temp.length
            let tempStyle = {};
            if (size > 1) {
                let cnt = '';
                for (let i = 0; i < size - 1; i++) {
                    cnt += temp[i]
                }
                tempStyle = {
                    OR: [
                        {
                            name: {
                                contains: req.query.name,
                                mode: "insensitive"
                            },
                        },
                        {
                            name: {
                                contains: cnt,
                                mode: "insensitive"
                            },
                            style_size: {
                                contains: temp[size - 1],
                                mode: "insensitive"
                            }
                        }
                    ]

                }
            } else {
                tempStyle = {
                    name: {
                        contains: req.query.name,
                        mode: "insensitive"
                    },
                }
            }

            query = { ...query, ...tempStyle }
        }
        if (req.query.supplier_id) {
            query = { ...query, supplier_id: parseInt(req.query.supplier_id) }
        }

        if (req.query.category_id) {
            query = { ...query, category_id: parseInt(req.query.category_id) }
        }
        console.log({ query });

        const products = await prisma.product.findMany({ where: query, include: { category: { select: { name: true } } } })
        return res.json({ data: products })
    } catch (e) {
        console.log(e)
        return res.status(500).json({ data: "error" })
    }

}

interface ReqIndexWithPagination {
    query: {
        per_page: string,
        name: string,

    }
}

export async function IndexWithPagination(req: ReqIndexWithPagination, res: Express.Response) {
    try {
        let query = { deleted_at: null, perPage: 10 };


        if (req.query.per_page) {
            query['perPage'] = parseInt(req.query.per_page);
        }

        if (req.query.name) {
            query['name'] = { contains: req.query.name, mode: "insensitive" }
        }
        console.log({ query });
        const products = await prisma.product.findMany({ where: query });
        return res.json({ data: products });

    }
    catch (e) {
        console.log(e)
        res.status(500).json({ data: "error" })
    }
}

export async function GetTotalCOGS(req: Express.Request, res: Express.Response) {
    const result = await prisma.$queryRaw`select sum(cost_price * stock) from products`
    return res.status(200).json(result)
}

export const ListMultipleProductsWithSales = async (req: Express.Request, res: Express.Response) => {
    try {
        // @ts-ignore
        const fromDate = new Date(req.query.from_date)
        // @ts-ignore
        const toDate = new Date(req.query.to_date)
        const products = await prisma.product.findMany({
            where: {
                is_ready: {
                    equals: true,
                },
            },
            select: {
                id: true,
                slow_fast_quantity: true,
                product_barcode: true,
                supplier: true,
                name: true,
                brand: true,
                category: true,
                stock: true,
                cost_price: true,
                MRP_price: true,
                pos_sales: {
                    where: {
                        pos_sale: {
                            created_at: {
                                gte: fromDate,
                                lte: toDate,
                            }
                        }
                    }
                }
            }
        })

        return res.json(products)
    } catch (e) {
        return res.status(500).json(e)
    }

}




