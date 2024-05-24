const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

export const IndexCategory = async (req, res) => {
  const categories = await prisma.category.findMany()
  res.json({ data: categories })
}

export const StoreCategory = async (req, res) => {

  const data = await prisma.category.findFirst({
    where: {
      name: {
        equals: req.body.name,
        mode: 'insensitive',
      }
    }
  })

  if (!data) {
    await prisma.category.create({
      data: {
        name: req.body.name,
        floor_id: req.body.floor_id,
        vat_in_percent: req.body.vat_in_percent,
        discount_in_percent: req.body.discount_in_percent,
      }
    })
  } else {
    res.status(409).json({ message: 'This category has already been' })
  }

  res.json({})
}

export const UpdateCategory = async (req, res) => {
  await prisma.category.update({
    where: {
      id: parseInt(req.params.id)
    },
    data: {
      name: req.body.name,
      floor_id: req.body.floor_id,
      vat_in_percent: req.body.vat_in_percent,
      discount_in_percent: req.body.discount_in_percent,
    }
  })

  res.json({})
}

export const ShowCategory = async (req, res) => {
  const id = req.params.id

  const category = await prisma.category.findUnique({
    where: {
      id: parseInt(id),
    },
  })

  res.json({ "data": category })
}


export const DeleteCategory = async (req, res) => {
  const id = parseInt(req.params.id)

  const deleteUsers = await prisma.category.deleteMany({
    where: {
      id: id
    },
  })

  res.json({})
}
