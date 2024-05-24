const { PrismaClient, Prisma } = require('@prisma/client')
const prisma = new PrismaClient()


export const Index = async (req, res) => {
  let fromDate = '2022-01-01';
  if (req.query?.from_date) fromDate = req.query.from_date;
  let toDate = '2099-01-01';
  if (req.query?.to_date) toDate = req.query.to_date;

  const fromDate_ = new Date(fromDate);
  const toDate_ = new Date(toDate);

  let query = {};


  let is_received = false;
  if (req.query.is_received === "true" || req.query.is_received === true) {
    is_received = true;
  }
  query = {
    ...query, is_received: is_received,
    created_at: {
      gte: fromDate_,
      lte: toDate_
    }
  }

  if (req.query.supplier_id) {
    query = { ...query, supplier_id: parseInt(req.query.supplier_id) }
  }

  // if (req.query.category_id){
  //   query = {...query, products: {
  //     some: {
  //       product: {
  //         category_id : {
  //           equals: parseInt(req.query.category_id)
  //         }
  //       }
  //     }
  //   }}
  // }

  const all = await prisma.purchase_order.findMany({
    where: query,
    include: {
      products: {
        include: {
          product: true
        }
      },
      supplier: true,
    }
  })
  return res.json({ data: all })
}

// practice
// export const practicetesting = async (req,res)=>{
//   try{

//     const data = await prisma.purchase_order.findMany({
//       select:{

//         products:{
//           // include:{
//           //   purchase_order:true

//           // }

//         }
//       }

//     })

//    return res.status(200).json(data)
//   }
//   catch(err){
//     console.log(err);
//   return res.status(500).json({err:err})
//   }
//   }

export const GetAllReceived = async (req, res) => {
  const all = await prisma.purchase_order.findMany({
    where: {
      is_received: true,
    },
    include: {
      products: {
        include: {
          product: true
        }
      },
      supplier: true,
    }
  })
  return res.json({ data: all })
}



export const createPurchaseOrder = async (req, res, next) => {
  try {
    // first create a new purchase order
    const purchaseOrder = await prisma.purchase_order.create({
      data: {
        supplier_id: req.body.supplier_id
      }
    })


    // now create purchase order on product
    req.body.products.forEach(async item => {

      await prisma.product_on_purchase_order.create({
        data: {
          product_id: item.id,
          purchase_order_id: purchaseOrder.id,
          cost_price: item.cost_price,
          mrp_price: item.MRP_price,
          quantity: item.quantity
        }
      })
    });

    res.status(200).json({
      message: 'success',
    })
  }
  catch (e) {
    console.log(e.message);

    if (e instanceof Prisma.PrismaClientValidationError) return res.status(500).json({ data: e.message });

    res.status(500).json({ data: e })
  }
}

export const getPurchaseOrder = async (req, res, next) => {
  try {
    const purchase_orders = await prisma.purchase_order.findMany({
      where: {
        supplier_id: parseInt(req.params.supplierId),
        is_received: false,
      },
    })
    res.status(200).json({
      data: purchase_orders
    })
  }
  catch (err) {
    console.log(err.message);
    res.status(404).json({
      errors: {
        message: err.message
      }
    })
  }
}

// update purchase order
async function updateProductOnPurchaseOrder(item, purchaseOrder) {
  const updatedData = await prisma.product_on_purchase_order.update({
    where: {
      product_id: item.id,
      purchase_order_id: purchaseOrder.id
    },
    data: {
      cost_price: item.cost_price,
      mrp_price: item.MRP_price,
      quantity: item.quantity,
      received_quantity: item.received_quantity,
      bonus_qunatity: item.bonus_qunatity,
      wholesale_price: item.wholesale_price

    }
  })
}

export const updatePurchaseOrder = async (req, res, next) => {

  // check if req.id is available or not
  try {
    const purchaseOrder = await prisma.purchase_order.findFirst({
      where: {
        id: req.body.id
      }
    })

    if (purchaseOrder) {
      // purchase order exists that menas it PO receive
      req.body.forEach(item => {
        updatePurchaseOrder(item, purchaseOrder)
      });
    } else {
      // it is a direct received
      res.status(404).json({
        errors: {
          message: "Purchase order can't create "
        }
      })

    }
    res.status(200).json({ data: "ok" })
  }

  catch (error) {
    console.log(error);
    res.json({ data: error.message })
  }
}

export const GetProductOnPurchaseOrder = async (req, res) => {
  const all = await prisma.product_on_purchase_order.findMany({
    where: {
      purchase_order_id: parseInt(req.query.purchase_order_id),
    },
    include: {
      product: true
    }
  })
  return res.json({ data: all })
}



export const IndexPurchasReceive = async (req, res) => {
  try {
    const purchaseOrderID = parseInt(req.params.id)
    const data = await prisma.product_on_purchase_order.findMany({
      where: {
        purchase_order_id: purchaseOrderID
      },
      include: {
        product: {
          include: {
            category: true,
            supplier: true,
            brand: true,
            color: true,
          }
        }
      }
    });
    res.json({ data });
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
}


export const PurchaseReceive = async (req, res) => {
  try {
    // TODO: need input validation here
    const purchaseOrderID = parseInt(req.params.id)

    //aupdate suppiler table => due amount
    const data = await prisma.supplier.update({
      where: {
        id: parseInt(req.body.supplier_id)
      },
      data: { due: { increment: Number(req.body.due) } }
    });

    // update the product on purchase order table with proper info
    const productOnPurchaseOrderList = req.body.product_on_purchase_order_list

    productOnPurchaseOrderList.forEach(item => {
      updateProductOnPurchaseOrderNext(purchaseOrderID, item, req.body.supplier_id);
    })


    await prisma.purchase_order.update({
      where: {
        id: purchaseOrderID
      },
      data: {
        is_received: true,
        received_at: new Date(Date.now() + 6 * (60 * 60 * 1000))
      }
    })

  } catch (e) {
    return res.json({ data: e })
  }


  return res.json({ data: "ok" })
}


export const DirectReceive = async (req, res) => {
  try {
    const purchaseOrder = await prisma.purchase_order.create({
      data: {
        supplier_id: parseInt(req.body.supplier_id),
        is_received: true,
        received_at: new Date(Date.now() + 6 * (60 * 60 * 1000)),
        additional_cost: parseFloat(req.body.additional_cost),
        discount: parseInt(req.body.discount),
      }
    })

    //add suppiler due amount
    await prisma.supplier.update({
      where: {
        id: parseInt(req.body.supplier_id)
      },
      data: { due: { increment: Number(req.body.due) - parseInt(req.body.discount) } }
    });


    //for vendor wise pruchase create 
    const selectProductForVendorWisePurchaseReceived = [];

    const dateNow = Date.now();

    // grab the product_on_purchase_order_list
    // loop over the list and create
    req.body.product_on_purchase_order_list.forEach((item, index) => {

      const now = new Date(Date.now());
      let customize_product_expiry_date = new Date(item.product_expiry_date || Date.now());

      if (!item.product_expiry_date) customize_product_expiry_date.setYear(now.getFullYear() + 5);

      item.product_expiry_date = customize_product_expiry_date;

      createProductOnPurchaseOrder(item, purchaseOrder.id);
      selectProductForVendorWisePurchaseReceived.push({
        no_of_product: item.received_quantity,
        no_of_bonus_product: item.bonus_quantity,
        sale_count: 0,
        sale_barcode: String(dateNow + index + 1),
        product_id: item.id,
        vendor_id: Number(req.body.supplier_id),
        expiry_date: item.product_expiry_date,
      })
    })

    //entry vendor_wise_purchase_received
    createPurchaseVendorWisePurchaseReceived(selectProductForVendorWisePurchaseReceived);

    return res.json({ data: "ok" })
  } catch (err) {
    console.log(err.message)
    res.status(500).json({ data: 'error' })
  }
}


const updateProductOnPurchaseOrderNext = async (purchaseOrderID, productOnPurchaseOrder, supplier_id) => {
  const updated = await prisma.product_on_purchase_order.updateMany({
    where: {
      purchase_order_id: purchaseOrderID,
      product_id: productOnPurchaseOrder.product_id
    },
    data: {
      received_quantity: parseFloat(productOnPurchaseOrder.received_quantity),
      bonus_quantity: parseFloat(productOnPurchaseOrder.bonus_quantity),
      wholesale_price: parseFloat(productOnPurchaseOrder.wholesale_price)
    }
  })
  // first get the product
  const product = await prisma.product.findFirst({
    where: {
      id: productOnPurchaseOrder.product_id
    }
  });
  const now = new Date(Date.now());
  let customize_product_expiry_date = new Date(productOnPurchaseOrder.product_expiry_date || product.product_expiry_date || Date.now());

  if (!productOnPurchaseOrder.product_expiry_date && !product.product_expiry_date) customize_product_expiry_date.setYear(now.getFullYear() + 5);

  //for vendor wise pruchase create 
  const selectProductForVendorWisePurchaseReceived = [{
    no_of_product: productOnPurchaseOrder.received_quantity,
    no_of_bonus_product: productOnPurchaseOrder.bonus_quantity,
    sale_count: 0,
    sale_barcode: String(Date.now() + 1),
    product_id: product.id,
    vendor_id: Number(supplier_id),
    expiry_date: customize_product_expiry_date,
  }];

  //entry vendor_wise_purchase_received
  createPurchaseVendorWisePurchaseReceived(selectProductForVendorWisePurchaseReceived);


  const total_cpu_price = (product.cost_price * product.stock) + (productOnPurchaseOrder.cost_price * productOnPurchaseOrder.received_quantity);
  const avg = total_cpu_price / (product.stock + productOnPurchaseOrder.received_quantity);

  const totalStock = (product.stock + productOnPurchaseOrder.received_quantity + productOnPurchaseOrder.bonus_quantity).toFixed(3)

  const data = {
    stock: parseFloat(totalStock),
    cost_price: parseFloat(avg.toFixed(3)),
    MRP_price: productOnPurchaseOrder.MRP_price
  }

  // if (productOnPurchaseOrder.product_expiry_date) data['product_expiry_date'] = customize_product_expiry_date;
  if (productOnPurchaseOrder.batch_expiry_date) data['batch_expiry_date'] = new Date(productOnPurchaseOrder.batch_expiry_date);
  if (productOnPurchaseOrder?.batch_no?.length > 0) data['batch_no'] = productOnPurchaseOrder.batch_no;

  if (product) {
    await prisma.product.update({
      where: {
        id: productOnPurchaseOrder.product_id
      },
      data
    })
  }
}

const createProductOnPurchaseOrder = async (productOnPurchaseOrder, purchaseOrderID) => {
  await prisma.product_on_purchase_order.create({
    data: {
      purchase_order_id: purchaseOrderID,
      product_id: productOnPurchaseOrder.id,
      cost_price: productOnPurchaseOrder.cost_price,
      mrp_price: productOnPurchaseOrder.MRP_price,
      quantity: productOnPurchaseOrder.received_quantity,
      received_quantity: productOnPurchaseOrder.received_quantity,
      bonus_quantity: productOnPurchaseOrder.bonus_quantity,
      wholesale_price: productOnPurchaseOrder.whole_sale_price
    }
  })


  const product_ = await prisma.product.findUniqueOrThrow({
    where: {
      id: productOnPurchaseOrder.id
    }
  })

  const resproduct = await prisma.product.findFirst({
    where: {
      id: product_.id
    }
  })

  const total_cpu_price = (resproduct.cost_price * resproduct.stock) + (productOnPurchaseOrder.cost_price * productOnPurchaseOrder.received_quantity);
  const avg = total_cpu_price / (resproduct.stock + productOnPurchaseOrder.received_quantity);

  const data = {
    stock: product_.stock + productOnPurchaseOrder.received_quantity + productOnPurchaseOrder.bonus_quantity,
    cost_price: parseFloat(avg.toFixed(2)),
    MRP_price: productOnPurchaseOrder.MRP_price,
  }

  // if (productOnPurchaseOrder.product_expiry_date) data['product_expiry_date'] = new Date(productOnPurchaseOrder.product_expiry_date);
  if (productOnPurchaseOrder.batch_expiry_date) data['batch_expiry_date'] = new Date(productOnPurchaseOrder.batch_expiry_date);
  if (productOnPurchaseOrder?.batch_no?.length > 0) data['batch_no'] = productOnPurchaseOrder.batch_no;

  await prisma.product.update({
    where: {
      id: product_.id
    },
    data
  })
}


const createPurchaseVendorWisePurchaseReceived = async (data) => {
  await prisma.saleable_product.createMany({
    data: data
  })
}
