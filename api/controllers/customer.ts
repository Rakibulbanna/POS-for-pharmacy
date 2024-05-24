import Express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export const StoreCustomer = async (req: Express.Request, res: Express.Response) => {
  await prisma.customer.create({
    data: {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      phone_number: req.body.phone_number,
      address: req.body.address,
      email: req.body.email,
      customer_id: req.body.customer_id,
      membership_type_id: req.body.membership_type_id ?? null,
      credit_limit: Number(req.body.credit_limit) || 0,
    }
  })
  return res.json({ data: 'ok' })
}

export const IndexCustomers = async (req: Express.Request, res: Express.Response) => {
  const customers = await prisma.customer.findMany({
    include: { membership_type: true },
    orderBy : [
      {
        id : 'asc'
      }
    ]
  })
  return res.json({ data: customers })
}

export const SearchByNameAndPhone = async (req: Express.Request, res: Express.Response) => {
  const searchValue = req.query.token

  const customers = await prisma.customer.findMany({
    include: { membership_type: true },
    where: {
      OR: [
        {
          phone_number: {
            contains: searchValue,
            mode: "insensitive",
          }
        },
        {
          first_name: {
            contains: searchValue,
            mode: "insensitive",
          }
        },
        {
          last_name: {
            contains: searchValue,
            mode: "insensitive",
          }
        },
        {
          customer_id: {
            equals: searchValue,
          }
        }

      ]
    },
    orderBy : [
      {
        id : 'asc'
      }
    ]
  })
  return res.json({ customers })
}

export const ShowCustomer = async (req: Express.Request, res: Express.Response) => {
  const customer = await prisma.customer.findUnique({
    where: {
      id: parseInt(req.params.id)
    }
  })

  return res.json({ data: customer })
}

export const UpdateCustomer = async (req: Express.Request, res: Express.Response) => {
  await prisma.customer.update({
    where: {
      id: parseInt(req.params.id)
    },
    data: {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      phone_number: req.body.phone_number,
      address: req.body.address,
      email: req.body.email,
      customer_id: req.body.customer_id,
      membership_type_id: req.body.membership_type_id || null,
      credit_limit: Number(req.body.credit_limit) || 0,
    }
  })

  return res.json({ data: "ok" })
}

export const DeleteCustomer = async (req: Express.Request, res: Express.Response) => {
  await prisma.customer.delete({
    where: {
      id: parseInt(req.params.id)
    }
  })

  return res.json({ data: "ok" })
}

export const POSSearch = async (req: Express.Request, res: Express.Response) => {
  const searchValue = req.params.token

  const customers = await prisma.customer.findMany({
    where: {
      OR: [
        {
          phone_number: {
            equals: searchValue
          }
        },
        Number.isInteger(searchValue) ? {
          membership_type_id: {
            equals: parseInt(searchValue)
          }
        } : {},
        {
          customer_id: {
            equals: searchValue
          }
        }
      ]
    },

    include: { membership_type: true }
  })
  return res.json({ data: customers })
}

export const GetTotalCreditCollected = async (req: Express.Request, res: Express.Response) => {
  const cusPay = await prisma.customer_payment.aggregate({
    _sum: {
      amount: true
    }
  })

  return res.json({total: cusPay._sum.amount})
}
