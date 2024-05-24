const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

export const BrandIndex = async (req, res) => {
  const brands = await prisma.brand.findMany()
  res.json({ data: brands })
}

export const StoreBrand = async (req, res) => {

  const data = await prisma.brand.findFirst({
    where: {
      name: {
        equals: req.body.name,
        mode: 'insensitive',
      }
    }
  })

  if (!data) {
    await prisma.brand.create({
      data: {
        name: req.body.name
      }
    })
    res.json({})
  } else {
    res.status(409).json({ message: 'This brand has already been' })
  }
}

export const UpdateBrand = async (req, res) => {
  await prisma.brand.update({
    where: {
      id: parseInt(req.params.id)
    },
    data: {
      name: req.body.name
    }
  })

  res.json({})
}

export const ShowBrand = async (req, res) => {
  const id = req.params.id

  const brand = await prisma.brand.findUnique({
    where: {
      id: parseInt(id),
    },
  })

  res.json({ "data": brand })
}


export const DeleteBrand = async (req, res) => {
  const id = parseInt(req.params.id)

  const deleteUsers = await prisma.brand.deleteMany({
    where: {
      id: id
    },
  })

  res.json({})
}
