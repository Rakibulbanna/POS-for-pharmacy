import Express from 'express'
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const StoreUser = async (req: Express.Request, res: Express.Response) => {
  try {
    await prisma.user.create({
      data: {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        password: req.body.password,
        phone_number: req.body.phone_number,
        email: req.body.email,
        can_give_discount: req.body.can_give_discount,
        is_active: req.body.is_active,
        maximum_discount: req.body.maximum_discount,
      }
    })

  } catch (e) {
    console.log(e)
    return res.status(500).json({})
  }

  return res.send({data: "ok"})

}

export const UpdateUser = async (req: Express.Request, res: Express.Response) => {
  const id = parseInt(req.params.id)
  try {
    const updatedUser =  await prisma.user.update({
      where: {
        id: id
      },
      data: {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        password: req.body.password,
        phone_number: req.body.phone_number,
        email: req.body.email,
        can_give_discount: req.body.can_give_discount,
        is_active: req.body.is_active,
        maximum_discount: req.body.maximum_discount,
      }
    })

    return res.send({data: updatedUser})

  } catch (e) {
    console.log(e)
    return res.status(500).json({})
  }


}
