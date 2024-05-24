const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

export default function (app) {
  const app2 = app;
  app2.get("/permissions", async (req, res) => {
    const users = await prisma.permission.findMany()
    res.json({ data: users })
  })

  return app2
}
