import Express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()


export const CreateVoucher = async (req: Express.Request, res: Express.Response) => {
  try {
    await prisma.voucher.create({
      data: {
        payment_amount: req.body.payment_amount,
        payment_type: req.body.payment_type, // 1 = cash, 2=card, 3=check
        bank_name: req.body.bank_name,
        account_number: req.body.account_number,
        sub_account_id: req.body.sub_account_id,
        payment_note: req.body.payment_note,
      }
    })

    return res.json({ data: "ok" })
  } catch (error) {
    return res.status(422).json({ data: error.message })

  }
}

export const IndexVouchers = async (req: Express.Request, res: Express.Response) => {
  let fromDate;
  if (req.query?.from_date) fromDate = new Date(req.query.from_date);
  let toDate;
  if (req.query?.to_date) toDate = new Date(req.query.to_date);

  const vouchers = await prisma.voucher.findMany({
    where: {
      created_at: {
        gte: fromDate,
        lte: toDate,
      }
    },
    include: {
      sub_account: true
    }
  })

  return res.json({ data: vouchers })
}

export const UpdateVoucher = async (req: Express.Request, res: Express.Response) => {
  try {
    const ID = parseInt(req.params.id)
    await prisma.voucher.update({
      where: {
        id: ID
      },
      data: {
        payment_amount: req.body.payment_amount,
        payment_type: req.body.payment_type, // 1 = cash, 2=card, 3=check
        bank_name: req.body.bank_name,
        account_number: req.body.account_number,
        sub_account_id: req.body.sub_account_id,
        payment_note: req.body.payment_note,
      }
    })

    return res.json({ data: "ok" })
  } catch (error) {
    console.log(error);
    
    return res.status(422).json({ data: "error" })
  }
}

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

export const DeleteVoucher = async (req: Express.Request, res: Express.Response) => {
  try {
    const ID = parseInt(req.params.id)
    await prisma.voucher.delete({
      where: {
        id: ID
      }
    })

    return res.json({ data: "ok" })
  } catch (error) {
    return res.status(422).json({ data: "error" })
  }
}

export const GetTotalOfVoucherCredit = async (req: Express.Request, res: Express.Response) => {
  const result = await prisma.voucher.aggregate({
    _sum: {
      payment_amount: true,
    },
    where: {
      sub_account: {
        balance_type: {
          equals: 1
        }
      }
    }
  })

  res.json(result)
}

export const GetTotalOfOwnersPayments = async (req: Express.Request, res: Express.Response) => {
  const result = await prisma.voucher.aggregate({
    _sum: {
      payment_amount: true,
    },
    where: {
      sub_account_id: {
        equals: 8
      }
    }
  })

  res.json(result)
}


