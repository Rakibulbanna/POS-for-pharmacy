import Express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()


export const CreateColor = async (req: Express.Request, res: Express.Response) => {
  try {

      const data = await prisma.color.findFirst({
          where: {
              name: {
                  equals: req.body.name,
                  mode: 'insensitive',
              }
          }
      })

    if(!data) {
      await prisma.color.create({
      data: {
        name: req.body.name
      }
    })
    return res.json({ data: "ok" })
    }else{
      return res.status(409).json({ message: 'This colour has already been' })
    }


  } catch (error) {
    return res.status(422).json({ data: "error" })
  }

}

export const IndexColors = async (req: Express.Request, res: Express.Response) => {
  const colors = await prisma.color.findMany()

  return res.json({ data: colors })
}

export const UpdateColor = async (req: Express.Request, res: Express.Response) => {

  try {
    const ID = parseInt(req.params.id)
    await prisma.color.update({
      where: {
        id: ID
      },
      data: {
        name: req.body.name
      }
    })

    return res.json({ data: "ok" })
  } catch (error) {
    return res.status(422).json({ data: "error" })
  }
}

export const ShowColor = async (req: Express.Request, res: Express.Response) => {
  try {
    const ID = parseInt(req.params.id)
    const color = await prisma.color.findUniqueOrThrow({
      where: {
        id: ID
      }
    })

    return res.json({ data: color })
  } catch (error) {
    return res.status(422).json({ data: "error" })
  }
}

export const DeleteColor = async (req: Express.Request, res: Express.Response) => {
  try {
    const ID = parseInt(req.params.id)
    await prisma.color.delete({
      where: {
        id: ID
      }
    })

    return res.json({ data: "ok" })
  } catch (error) {
    return res.status(422).json({ data: "error" })
  }
}


