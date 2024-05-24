import Express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()


export const CreateCustomerPayment = async (req: Express.Request, res: Express.Response) => {
  try {
    const customer = await prisma.customer.findUniqueOrThrow({
      where: {
        id: req.body.customer_id,
      }
    })

    await prisma.customer_payment.create({
      data: {
        amount: req.body.payment_amount,
        pay_method: req.body.payment_type, // 1 = cash, 2=card, 3=check
        // bank_name: req.body.bank_name,
        // account_number: req.body.account_number,
        customer_id: req.body.customer_id,
        remaining_amount: customer.credit_spend - req.body.payment_amount,
      }
    })

    await prisma.customer.update({
      where: { id: req.body.customer_id },
      data: { credit_spend: { increment: -Number(req.body.payment_amount) } }
    });

    return res.json({ data: "ok" })
  }
  catch (error) {
    return res.status(422).json({ data: error.message })

  }
}

export const IndexCustomerPayments = async (req: Express.Request, res: Express.Response) => {
  const fromDate = req.query.from_date
  const toDate = req.query.to_date
  let fromQuery = {}
  let toQuery = {}
  let filterQuery = {};
  
  if (req.query.customer_id) {
    filterQuery = { ...filterQuery, customer_id: req.query.customer_id }
  } 
  if (req.query.name) {
    filterQuery = {
      ...filterQuery, OR: [
        {
          first_name: {
            equals: req.query.name,
            mode: 'insensitive'
          }
        },
        {
          last_name: {
            equals: req.query.name,
            mode: 'insensitive'
          }
        }]
    }
  } 
  if (req.query.phone_number) {
    filterQuery = { ...filterQuery, phone_number: req.query.phone_number }
  }
  // console.log("type of", typeof fromDate)
  if (fromDate) {
    fromQuery = { created_at: { gt: new Date(fromDate) } }
  }

  if (toDate) {
    toQuery = { created_at: { lt: new Date(new Date(toDate).setHours(23 + 6, 59, 59)) } }
  }

  res.status(200).json(await prisma.customer_payment.findMany({
    include: {
      customer: true
    },
    where: {
      customer: filterQuery,
      AND: [
        fromQuery,
        toQuery,
      ]
    },
    orderBy: {
      created_at:'asc'
    }
  }))
}