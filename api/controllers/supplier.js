const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

export const StoreSupplier = async (req, res) => {
  let connectIDs = []

  // console.log(req.body.pay_mode_ids)

  req.body.pay_mode_ids.forEach(id => {
    connectIDs.push({ id: parseInt(id) })
  })

  const data = await prisma.supplier.findFirst({
    where: {
      company_name: {
        equals: req.body.company_name,
        mode: 'insensitive',
      }
    }
  })
  if (!data) {
    await prisma.supplier.create({
      data: {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        company_name: req.body.company_name,
        address: req.body.address,
        phone_number: req.body.phone_number,
        email_address: req.body.email_address,
        discount: parseFloat(req.body.discount),
        pay_modes: { connect: connectIDs },
        is_vendor:  typeof req.body.is_vendor === "boolean" ? req.body.is_vendor : undefined,
      }
    })
  } else {
    res.status(409).json({ message: "This company_name already taken" })
  }


  res.json({})
}

export const IndexSupplier = async (req, res) => {
  const query = { include: { pay_modes: true } }

  if (req.query.supplier_name) {
    query['where'] = { first_name: { contains: req.query.supplier_name, mode: 'insensitive', } };
    query["take"] = 20
  }

  const suppliers = await prisma.supplier.findMany({ ...query })

  res.json({ data: suppliers })
}

export const ShowSupplier = async (req, res) => {
  const id = req.params.id

  const supplier = await prisma.supplier.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      pay_modes: true
    }
  })

  res.json({ "data": supplier })
}

export const UpdateSupplier = async (req, res) => {
  
  await prisma.supplier.update({
    where: {
      id: parseInt(req.params.id)
    },
    data: {
      is_vendor: typeof req.body.is_vendor === "boolean" ? req.body.is_vendor : undefined,
      pay_modes: {
        set: []
      }
    }
  })

  let connectIDs = []

  req.body.pay_mode_ids.forEach(id => {
    // console.log({id})
    connectIDs.push({ id: parseInt(id) })
  })


  await prisma.supplier.update({
    where: {
      id: parseInt(req.params.id)
    },
    data: {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      company_name: req.body.company_name,
      address: req.body.address,
      phone_number: req.body.phone_number,
      email_address: req.body.email_address,
      discount: parseFloat(req.body.discount),
      pay_modes: { connect: connectIDs }
    }
  })


  res.json({})
}

export const DeleteSupplier = async (req, res) => {
  const id = parseInt(req.params.id)

  const deleteUsers = await prisma.supplier.deleteMany({
    where: {
      id: id
    },
  })

  res.json({})
}

export const GetTotalSupplierPayable = async (req, res) => {
  try {
    // const totalCostPrice = await prisma.product_on_purchase_order.aggregate({
    //   _sum: {
    //     cost_price: true
    //   },
    //   where: {
    //     purchase_order: {
    //       is_received: true,
    //     }
    //   }
    // })

    const result = await prisma.$queryRaw`select sum((popo.cost_price * popo.quantity) - pe.discount) as total
        from purchase_orders as pe
            join product_on_purchase_order as popo on pe.id = popo.purchase_order_id
        where pe.is_received = true`


    const totalPaid = await prisma.supplier_payment.aggregate({
      _sum: {
        payment_amount: true,
      }
    })

    // const totalReturn  = await prisma.purchase_return
    const totalReturn = await prisma.$queryRaw`select sum(cost_price * quantity) as total from purchase_returns`

    res.json(result[0].total - totalPaid._sum.payment_amount - totalReturn[0].total)
  } catch (e) {
    console.log(e)
    res.status(500).json(e)
  }

}

export const GetTotalSupplierPaid = async (req, res) => {
  const totalPaid = await prisma.supplier_payment.aggregate({
    _sum: {
      payment_amount: true
    }
  })


  return res.json({ total: totalPaid._sum.payment_amount })
}
