import Express, { request } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { AddPoint, SubtractPoint } from "../../internal/customer/customer";

const prisma = new PrismaClient()

export const Index = async (req: Express.Request, res: Express.Response) => {
  const onlyCustomers = req.query.only_customers
  let fromDate = req.query.from_date
  let toDate = req.query.to_date

  let query = {}

  if (onlyCustomers === "true") {
    query = {
      ...query, customer_id: {
        not: {
          equals: null
        }
      }
    }
  }

  if (!fromDate) {
    fromDate = "2022-01-01"
  }

  if (!toDate) {
    toDate = "2922-01-01"
  }

  query = {
    ...query, created_at: {
      gte: new Date(fromDate),
      lte: new Date(toDate),
    }
  }

  if (req.query.customer_id) {
    query = {
      ...query, customer: {
        customer_id: req.query.customer_id
      }
    }
  }
  if (req.query.phone_number) query = {
    ...query, customer: {
      phone_number: {
        contains: req.query.phone_number
      }
    }
  }


  const sales = await prisma.pos_sale.findMany({
    where: query,
    include: {
      products: {
        include: {
          product: true
        }
      },
      customer: true,
      pos_payments: true,
    },
    orderBy: [{ created_at: "asc" }],
  })
  return res.json({ data: sales })
}

export const StorePosSale = async (req: Express.Request, res: Express.Response) => {
  try {
    // TODO: validate data

    // get products for this sales from db
    let products: any = await prisma.product.findMany({
      where: {
        id: {
          in: req.body.products.map(prod => prod.id)
        }
      }
    })

    // populate sale quantity on products
    products = products.map(p => {
      let quantity = 0
      const found = req.body.products.find(prod => prod.id === p.id)
      if (found) {
        quantity = found.quantity
      }
      const returnValue = { ...p, quantity: quantity }
      if (found.vendor_id) returnValue['vendor_id'] = found.vendor_id;
      return returnValue;
    })

    // for (const product of products) {
    //   //vaendor product update sale count vendor wise 
    //   if (!product.vendor_id) continue ;
    //     const res_saleable_product:any = await prisma.saleable_product.findFirst({ where: { id: product.vendor_id }})
    //     if (product.quantity > (res_saleable_product?.no_of_product + res_saleable_product?.no_of_bonus_product)) throw new Error('not enough products available')
    //     await prisma.saleable_product.update({ where: { id: product.vendor_id }, data: { sale_count: { increment: product.quantity } } })
    // }

    // intercept products and update mrp price
    products = products.map(p => {
      const found = req.body.products.find(prod => prod.id === p.id)
      if (found) {
        return { ...p, MRP_price: found.MRP_price }
      }
      return p
    })

    // get total cost price of this sale
    const totalCostPrice = products.map(p => p.cost_price * p.quantity).reduce((pv, cv) => pv + cv, 0)

    // check if any product has fewer quantity
    products.forEach(product => {
      let requestedQuantiy = req.body.products.find(p => p.id === product.id)?.quantity
      if (product.stock < requestedQuantiy) {
        throw "not enough product"
      }
    })

    // get sub total
    // @ts-ignore
    const subTotal = products.map(prod => (req.body?.whole_sale ? (prod?.whole_sale_price ? prod?.whole_sale_price : prod?.MRP_price) : prod?.MRP_price) * req.body.products.find(p => p.id === prod.id).quantity).reduce((pv, cv) => pv + cv)




    // get discount amount from line discount
    // @ts-ignore
    products.map(prod => (15 / 100) * (req.body?.whole_sale ? (prod.whole_sale_price ? prod.whole_sale_price : prod?.MRP_price) : prod?.MRP_price) * req.body.products.find(p => p.id === prod.id).quantity)



    let discountAmount = req.body.products.map(prod => {
      if (prod.discount_type === "manual") return prod.discount
      return prod.discount * prod.quantity
    }).reduce((pv, cv) => pv + cv)


    if (req.body.should_apply_final_discount_amount) {
      discountAmount += req.body.final_discount_amount
    }

    // get discount amount from membership card (if any)
    if (req.body.customer_id) {
      // get customer
      const customer = await prisma.customer.findUniqueOrThrow({
        where: {
          id: req.body.customer_id
        },
        include: {
          membership_type: true,
        }
      })

      if (customer.membership_type) {
        const cardDiscountAmount = (customer.membership_type.discount / 100) * subTotal
        if (cardDiscountAmount > discountAmount) {
          discountAmount = cardDiscountAmount
        }
      }


    }

    // TODO: use with above discount
    if (req.body.final_discount_amount) {
      discountAmount = req.body.final_discount_amount
    }


    // calculate vat amount
    let vat = 0
    for (const product of req.body.products) {
      const prod = await prisma.product.findUniqueOrThrow({
        where: {
          id: product.id
        },
        include: {
          category: true
        }
      })

      const vatPercent = prod.category.vat_in_percent
      // @ts-ignore
      const vatAmount = (((vatPercent / 100) * (req.body?.whole_sale ? prod?.whole_sale_price : prod?.MRP_price))) * product.quantity
      vat += vatAmount
    }


    for (const product of products) {
      //vaendor product update sale count vendor wise 
      if (!product.vendor_id) continue;
      const res_saleable_product: any = await prisma.saleable_product.findFirst({ where: { id: product.vendor_id } })
      if (product.quantity > (res_saleable_product?.no_of_product + res_saleable_product?.no_of_bonus_product)) throw new Error('not enough products available')
      await prisma.saleable_product.update({ where: { id: product.vendor_id }, data: { sale_count: { increment: product.quantity } } })
    }

    for (const product_ of products) {
      console.log({ product_ })
      //vaendor product update sale count vendor wise 
      await prisma.product.update({ where: { id: product_.id }, data: { rate: product_.MRP_price } })
    }


    // console.log("xxxxxxxxxxxxxxxxxxxxxxxxxx__", req.body.products);


    // create sale
    const posSale = await prisma.pos_sale.create({
      data: {
        id: req.body.invoice_id.toString() || Date.now().toString(),
        sub_total: subTotal,
        is_wholesale: req.body?.whole_sale ? true : false,
        discount_amount: discountAmount,
        total: subTotal - discountAmount + vat,
        user_id: req.body.user_id,
        vat_amount: vat,
        paid_amount: req.body.paid_amount,
        return_amount: req.body.return_amount,
        total_cost_price: totalCostPrice,
      }
    })

    // store product on pos sale map table
    for (const product of req.body.products) {
      // check if there is final discount amount in request
      let discountAmount = 0
      if (req.body.final_discount_amount) {
        discountAmount = parseInt(req.body.final_discount_amount) / req.body.products.length
      } else {
        discountAmount = await getProductDiscountAmount(product)
      }
      // if yes then ignore all discount and only apply that discount with average

      // and if no then apply product specific discount
   

      const saleAmount = await storeProductOnPosSaleMiddleTable(product, posSale, discountAmount, req.body.whole_sale)
    }

    // now store payment info for this pos sale
    req.body.payments.forEach((payment: any) => {
      storePayment(payment, posSale)
    })


    // manage existing customer
    if (req.body.customer_id) {
      // update pos sale with customer id
      await prisma.pos_sale.update({
        where: {
          id: posSale.id,
        },
        data: {
          customer_id: req.body.customer_id,
        }
      })

      await addCustomerPoint(req.body.customer_id, subTotal - discountAmount)

      const payModeRedeem = req.body.payments.find(pay => pay.method === 3)
      if (payModeRedeem) {
        await subtractCustomerPoint(parseInt(req.body.customer_id), payModeRedeem.amount)
      }

      // check if customer paid via credit, if so then reduce the credit amount
      const payModeCredit = req.body.payments.find(pay => pay.method === 5)
      if (payModeCredit) {
        const customer = await prisma.customer.findUniqueOrThrow({
          where: {
            id: req.body.customer_id,
          }
        })

        await prisma.customer.update({
          where: {
            id: customer.id,
          },
          data: {
            credit_spend: customer.credit_spend + payModeCredit.amount
          }
        })
      }
    }


    // handle flat promotion products
    for (const product of req.body.products) {
      if (product.flat_promotions.length) {
        const productOnFlatPromotion = await prisma.product_on_flat_promotion.findFirstOrThrow({
          where: {
            flat_promotion_id: product.flat_promotions[0].flat_promotion_id,
            product_id: product.id,
          },
        })

        await prisma.product_on_flat_promotion.updateMany({
          where: {
            flat_promotion_id: product.flat_promotions[0].flat_promotion_id,
            product_id: product.id,
          },
          data: {
            quantity: productOnFlatPromotion.quantity - product.quantity,
          }
        })
      }
    }


    //handle exchanges
    if (req.body.exchanges?.length) {
      await storeExchanges(req.body.exchanges, posSale)
    }


    res.json({ data: posSale })
  } catch (e) {
    console.log(e.message)
    return res.status(500).json({ data: "error" })
  }
}

async function addCustomerPoint(customerID: number, amount: number) {
  const setting = await prisma.setting.findFirstOrThrow({})
  if (setting.point_system) {
    await AddPoint(customerID, amount)
  }
}
async function subtractCustomerPoint(customerID: number, amount: number) {
  const setting = await prisma.setting.findFirstOrThrow({})
  if (setting.point_system) {
    await SubtractPoint(customerID, amount)
  }
}

export async function ShowPosSale(req: Express.Request, res: Express.Response) {

  const sale = await prisma.pos_sale.findUniqueOrThrow({
    where: {
      id: req.params.id
    },
    include: {
      products: {
        include: {
          product: true
        }
      }
    }
  })

  return res.json({ data: sale })
}


export async function GetTotalSaleWithoutCreditSale(req: Express.Request, res: Express.Response) {

  let fromDate: any = '2022-01-01';
  if (req.query?.from_date) fromDate = req.query.from_date;
  let toDate: any = '2099-01-01';
  if (req.query?.to_date) toDate = req.query.to_date;


  const fromDate_ = new Date(fromDate);
  const toDate_ = new Date(toDate);

  const result = await prisma.pos_sale.aggregate({
    where: {
      AND: [
        {
          created_at: {
            gte: fromDate_,
            lte: toDate_
          }
        },
        {
          pos_payments: {
            some: {
              method: {
                not: {
                  equals: 5
                }
              }
            }
          }
        }
      ],
    },
    _sum: {
      total: true,
    }
  })

  return res.status(200).json(result)
}

export const GetTotalCreditSale = async (req: Express.Request, res: Express.Response) => {

  let fromDate: any = '2022-01-01';
  if (req.query?.from_date) fromDate = req.query.from_date;
  let toDate: any = '2099-01-01';
  if (req.query?.to_date) toDate = req.query.to_date;


  const fromDate_ = new Date(fromDate);
  const toDate_ = new Date(toDate);

  const result = await prisma.pos_sale.aggregate({
    where: {
      AND: [
        {
          created_at: {
            gte: fromDate_,
            lte: toDate_
          }
        },
        {
          pos_payments: {
            every: {
              method: {
                equals: 5,
              }
            }
          },
        }
      ]
    },
    _sum: {
      total: true,
    }
  })

  return res.status(200).json(result)
}

// this will return the total amount of credit sale that are still need to be collected
export const GetTotalCreditSaleReceivableOfUser = async (req: Express.Request, res: Express.Response) => {
  const result = await prisma.pos_payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      method: {
        equals: 5
      }
    }
  })

  const productPaymentResult = await prisma.customer_payment.aggregate({
    _sum: {
      amount: true
    }
  })

  const total = (result._sum.amount ?? 0) - (productPaymentResult._sum.amount ?? 0)

  res.json(total)
}

export const GetTotalVatAmount = async (req: Express.Request, res: Express.Response) => {
  const result = await prisma.pos_sale.aggregate({
    _sum: {
      vat_amount: true
    }
  })
  return res.json({ total: result._sum.vat_amount })
}

export const PosSaleGetTotalCOGS = async (req: Express.Request, res: Express.Response) => {

  let fromDate: any = '2022-01-01';
  if (req.query?.from_date) fromDate = req.query.from_date;
  let toDate: any = '2099-01-01';
  if (req.query?.to_date) toDate = req.query.to_date;


  const fromDate_ = new Date(fromDate);
  const toDate_ = new Date(toDate);

  const productsOnPosSale = await prisma.product_on_pos_sale.findMany({
    where: {
      pos_sale: {
        created_at: {
          gte: fromDate_,
          lte: toDate_
        }
      }
    },
    select: {
      cost_price: true,
      quantity: true,
    }
  })

  const totalCostValueOfSales = productsOnPosSale.reduce((pv, cv) => pv + (cv.cost_price * cv.quantity), 0)

  const totalExchange = await prisma.$queryRaw(Prisma.sql`select (pops.cost_price * se.quantity) as total
    from sale_exchanges as se
        join products_on_pos_sales as pops on pops.pos_sale_id = se.origin_sale_id and se.product_id = pops.product_id 
        WHERE se.created_at BETWEEN ${fromDate_} AND ${toDate_}
        `)

  let totalExchangeAmount = 0
  if (totalExchange?.length > 0) {
    totalExchangeAmount = totalExchange[0].total
  }

  const saleReturnAggregate = await prisma.pos_sale_return.aggregate({
    where: {
      created_at: {
        gte: fromDate_,
        lte: toDate_
      }
    },
    _sum: {
      return_amount: true
    }
  })

  // @ts-ignore
  return res.json({ total: totalCostValueOfSales - totalExchangeAmount - saleReturnAggregate._sum.return_amount })
}



const storeProductOnPosSaleMiddleTable = async (product: any, posSale: { id: any; created_at?: Date; }, discountAmount: number, wholeSale = false) => {
  // determine product price and discount here
  const existingProduct = await prisma.product.findUnique({
    where: {
      id: product.id
    },
    include: {
      buy_x_get_x: true
    }
  })
  console.log("___", posSale.id, typeof (posSale.id));

  let data = {
    product: { connect: { id: product.id } },
    quantity: product.quantity,
    pos_sale: {
      connect: {
        id: posSale.id
      }
    },
    product_price: wholeSale ? (product.whole_sale_price ? product.whole_sale_price : product.MRP_price) : product.MRP_price,
    discount_amount: discountAmount,
    sale_amount: ((wholeSale ? product.whole_sale_price : product.MRP_price) * product.quantity) - discountAmount,
    cost_price: existingProduct.cost_price,
    mrp_price: product.MRP_price,
  }

  // check if product is in bxgx
  if (existingProduct.buy_x_get_x.length) {
    data = {
      ...data,
      offer_type: "BXGX",
      offer_id: existingProduct.buy_x_get_x[0].buy_x_get_x_id
    }
  }

  await prisma.product_on_pos_sale.create({
    data: data,
  })

  // reduce from stock
  let quantity = product.quantity
  if (product.is_combo) {
    quantity = product.quantity_in_combo
  }
  await prisma.product.update({
    where: {
      id: product.id,
    },
    data: {
      stock: parseFloat((existingProduct?.stock - quantity).toFixed(4))
    }
  })



  return (existingProduct?.MRP_price * product.quantity) - discountAmount
}

const storePayment = async (payment: any, posSale: { id: any; created_at?: Date; }) => {
  let data = {
    pos_sale_id: posSale.id,
    method: payment.method,
    amount: payment.amount
  }

  if (payment.method == "2") {
    data = { ...data, via: payment.via }
  }

  await prisma.pos_payment.create({
    data: data
  })
}

const getProductDiscountAmount = async (product: any, finalDiscountAmount: number = 0) => {
  let finaldiscount = finalDiscountAmount // in amount

  if (product.discount > 0) {
    // finaldiscount = ((product.discount / 100) * product.MRP_price) * product.quantity
    finaldiscount = product.discount * product.quantity
  }

  // // check if product on flat promotion or not
  // existingProduct.flat_promotions.forEach(flat => {
  //   if (flat.flat_promotion.disc_in_percent) {
  //     // calculate discount amount
  //     let posibleDiscount = (flat.flat_promotion.disc_in_percent / 100) * existingProduct.MRP_price
  //     if (posibleDiscount > finaldiscount) {
  //       finaldiscount = posibleDiscount
  //     }
  //   }
  // })


  return finaldiscount
}

const storeExchanges = async (exchanges, posSale) => {
  for (const exchange of exchanges) {
    await prisma.sale_exchange.create({
      data: {
        origin_sale_id: exchange.origin_sale_id,
        product_id: exchange.product_id,
        quantity: exchange.quantity,
        exchanging_sale_id: posSale.id,
      }
    })

    const product = await prisma.product.findUniqueOrThrow({
      where: {
        id: exchange.product_id
      }
    })

    await prisma.product.update({
      where: {
        id: exchange.product_id,
      },
      data: {
        stock: product.stock + exchange.quantity
      }
    })
  }
}




