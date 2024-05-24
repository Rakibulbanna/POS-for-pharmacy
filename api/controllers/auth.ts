import Express from "express";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()


export const Login = async (req: Express.Request, res: Express.Response) =>{
  const user = await prisma.user.findFirst({
    where: {
      username: req.body.username,
      password: req.body.password
    },
    include: {
      permissions: true
    }
  })

  if (user){
    return res.json({data: user})
  }


  return res.status(422).json({data: "Invalid credentials"})
}
