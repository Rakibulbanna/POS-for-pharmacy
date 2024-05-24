const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

export const Index = async (req, res) =>{
  const users= await prisma.permission.findMany()
  res.json({data: users})
}

export const AddPermission = async (req, res) =>{
  await prisma.user.update({
    where: {
      id: parseInt(req.body.user_id)
    },
    data: {
      permissions: {
        connect: {id: parseInt(req.body.permission_id)}
      }
    }
  })

  res.json({})
}

export const DisconnectPermission = async (req, res) =>{
  await prisma.user.update({
    where: {
      id: parseInt(req.body.user_id)
    },
    data: {
      permissions: {
        disconnect: {id: parseInt(req.body.permission_id)}
      }
    }
  })

  res.json({})
}
