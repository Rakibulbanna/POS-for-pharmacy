import Express from "express";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()

export const StoreMembershipType = async (req: Express.Request, res: Express.Response) => {
  await prisma.membership_type.create({
    data: {
      name: req.body.name,
      discount: parseFloat(req.body.discount)
    }
  })

  return res.json({data: 'ok'})
}

export const IndexMembershipTypes = async (req: Express.Request, res: Express.Response) => {
  const membershipTypes = await prisma.membership_type.findMany()
  return res.json({data: membershipTypes})
}

export const ShowMembershipType  = async (req: Express.Request, res: Express.Response) => {
  const membershipType = await prisma.membership_type.findUnique({
    where: {
      id: parseInt(req.params.id)
    }
  })

  return res.json({data: membershipType})
}

export const UpdateMembershipType = async (req: Express.Request, res: Express.Response) => {
  await prisma.membership_type.update({
    where: {
      id: parseInt(req.params.id)
    },
    data: {
      name: req.body.name,
      discount: parseFloat(req.body.discount)
    }
  })

  return res.json({data: "ok"})
}

export const DeleteMembershipType = async (req: Express.Request, res: Express.Response) => {
  await prisma.membership_type.delete({
    where:{
      id: parseInt(req.params.id)
    }
  })

  return res.json({data: "ok"})
}
