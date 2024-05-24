import Express from 'express'
import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient()

export const IndexPayModes = async (req: Express.Request, res: Express.Response) => {
  const payModes =  await prisma.payment_mode.findMany()
  res.json({data: payModes})
}
