import Express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()


export const CreateSupplierPayment = async (req: Express.Request, res: Express.Response) => {
  try {
    await prisma.supplier_payment.create({
      data: {
        payment_amount: req.body.payment_amount,
        payment_type: req.body.payment_type, // 1 = cash, 2=card, 3=check
        bank_name: req.body.bank_name,
        account_number: req.body.account_number,
        supplier_id: req.body.supplier_id
      }
    })

    const supplier = await prisma.supplier.findUnique({
      where: {
        id: req.body.supplier_id,
      }
    })

    await prisma.supplier.update({
      where: {
        id: req.body.supplier_id,
      },
      data: {
        due: supplier.due - req.body.payment_amount,
      }
    })

    return res.json({ data: "ok" })
  }
  catch (error) {
    return res.status(422).json({ data: error.message })

  }
}

export const IndexSupplierPayments = async (req: Express.Request, res: Express.Response) => {
  let type = req.query.type ? req.query.type : {};

  let fromDate;
  if (req.query?.from_date) fromDate = new Date(req.query.from_date);
  let toDate;
  if (req.query?.to_date) toDate = new Date(req.query.to_date);

  let query = {};

  query['created_at'] = {
    gte: fromDate,
    lt: toDate
  }

  if (type === 'ID') query.supplier_id = req.query.value && parseInt(req.query.value);

  if (type === 'NAME') query.supplier = req.query.value ? {
    OR: [
      { first_name: { contains: req.query.value && req.query.value, mode: 'insensitive' } },
      { last_name: { contains: req.query.value && req.query.value, mode: 'insensitive' } }
    ]
  } :
    undefined
    ;

  const supplier_payment = await prisma.supplier_payment.findMany({
    where: {
      ...query
    },
    include: {
      supplier: true,
    },

  })

  return res.json({ data: supplier_payment })
}

// export const UpdateVoucher = async (req: Express.Request, res: Express.Response) => {

//   try {
//     const ID = parseInt(req.params.id)
//     const { name } = req.body;
//     await prisma.voucher.update({
//       where: {
//         id: ID
//       },
//       data: {
//         name
//       }
//     })

//     return res.json({ data: "ok" })
//   } catch (error) {
//     return res.status(422).json({ data: "error" })
//   }
// }

// export const ShowVoucher = async (req: Express.Request, res: Express.Response) => {
//   try {
//     const ID = parseInt(req.params.id)
//     const voucher = await prisma.voucher.findUniqueOrThrow({
//       where: {
//         id: ID
//       }
//     })
//     return res.json({ data: voucher })
//   } catch (error) {
//     return res.status(422).json({ data: "error" })
//   }
// }

// export const DeleteVoucher = async (req: Express.Request, res: Express.Response) => {
//   try {
//     const ID = parseInt(req.params.id)
//     await prisma.voucher.delete({
//       where: {
//         id: ID
//       }
//     })

//     return res.json({ data: "ok" })
//   } catch (error) {
//     return res.status(422).json({ data: "error" })
//   }
// }


