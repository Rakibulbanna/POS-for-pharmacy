import Express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()


export const CreateAccount = async (req: Express.Request, res: Express.Response) => {
  try {
    await prisma.account.create({
      data: {
        name: req.body.name
      }
    })

    return res.json({ data: "ok" })
  } catch (error) {
    return res.status(422).json({ data: "error" })
  }
}

export const IndexAccounts = async (req: Express.Request, res: Express.Response) => {
  let fromDate: any = '2022-01-01';
  if (req.query?.from_date) fromDate = req.query.from_date;
  let toDate: any = '2099-01-01';
  if (req.query?.to_date) toDate = req.query.to_date;


  const fromDate_ = new Date(fromDate);
  const toDate_ = new Date(toDate);

  const accounts = await prisma.account.findMany({
    include: {
      sub_accounts: {
        include: {
          vouchers: {
            where: {
              created_at: {
                gte: fromDate_,
                lte: toDate_
              }
            }
          }
        }
      },
    },
    // where: {
    //   created_at: {
    //     gte: fromDate_,
    //     lte: toDate_,
    // }
    // },
  })

  return res.json({ data: accounts })
}

export const UpdateAccount = async (req: Express.Request, res: Express.Response) => {
  console.log('params', req.params.id)
  try {
    const ID = parseInt(req.params.id)
    const { name } = req.body;
    await prisma.account.update({
      where: {
        id: ID
      },
      data: {
        name
      }
    })

    return res.json({ data: "ok" })
  } catch (error) {
    return res.status(422).json({ data: "error" })
  }
}

// export const ShowAccount = async (req: Express.Request, res: Express.Response) => {
//   try {
//     const ID = parseInt(req.params.id)
//     const customers = await prisma.account.findUniqueOrThrow({
//       where: {
//         id: ID
//       }
//     })
//     return res.json({ data: customers })
//   } catch (error) {
//     return res.status(422).json({ data: "error" })
//   }
// }

export const DeleteAccount = async (req: Express.Request, res: Express.Response) => {
  try {
    const ID = parseInt(req.params.id)
    await prisma.account.delete({
      where: {
        id: ID
      }
    })

    return res.json({ data: "ok" })
  } catch (error) {
    return res.status(422).json({ data: "error" })
  }
}


