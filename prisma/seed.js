const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient();

async function seed() {

  // await prisma.permission.create({
  //   data: {
  //     title: "Can create new user",
  //     value: "create_user"
  //   }
  // })

  // await prisma.permission.create({
  //   data: {
  //     title: "See any single user",
  //     value: "show_user"
  //   }
  // })

  // await prisma.permission.create({
  //   data: {
  //     title: "Delete any user",
  //     value: "delete_user"
  //   }
  // })

  // await prisma.permission.create({
  //   data: {
  //     title: "List all users",
  //     value: "index_user"
  //   }
  // })

  // await prisma.permission.create({
  //   data: {
  //     title: "Update any user details",
  //     value: "update_user"
  //   }
  // })

  await prisma.permission.create({
    data: {
      title: "Product Management",
      value: "manage_product"
    }
  })

  await prisma.permission.create({
    data: {
      title: "Dashboard",
      value: "dashboard"
    }
  })
  await prisma.permission.create({
    data: {
      title: "User",
      value: "user"
    }
  })
  await prisma.permission.create({
    data: {
      title: "Permission",
      value: "permission"
    }
  })
  await prisma.permission.create({
    data: {
      title: "Barcode print",
      value: "barcode_print"
    }
  })
  await prisma.permission.create({
    data: {
      title: "Price change",
      value: "price_change"
    }
  })

  await prisma.permission.create({
    data: {
      title: "Supplier",
      value: "supplier"
    }
  })
  await prisma.permission.create({
    data: {
      title: "Categories",
      value: "categories"
    }
  })
  await prisma.permission.create({
    data: {
      title: "Brands",
      value: "brands"
    }
  })
  await prisma.permission.create({
    data: {
      title: "Color",
      value: "color"
    }
  })
  await prisma.permission.create({
    data: {
      title: "Product Entries",
      value: "product_entries"
    }
  })
  await prisma.permission.create({
    data: {
      title: "Products",
      value: "products"
    }
  })
  

  await prisma.permission.create({
    data: {
      title: "Update Product",
      value: "update_product"
    }
  })
  await prisma.permission.create({
    data: {
      title: "Delete Product",
      value: "delete_product"
    }
  })
  await prisma.permission.create({
    data: {
      title: "Purchase Order",
      value: "purchase_order"
    }
  })
  await prisma.permission.create({
    data: {
      title: "Purchase Receive",
      value: "purchase_receive"
    }
  })
  await prisma.permission.create({
    data: {
      title: "Supply Return",
      value: "supply_return"
    }
  })
  await prisma.permission.create({
    data: {
      title: "Access POS",
      value: "pos"
    }
  })
  await prisma.permission.create({
    data: {
      title: "Account Management",
      value: "manage_account"
    }
  })
  await prisma.permission.create({
    data: {
      title: "Damage And Lost",
      value: "damage_and_lost"
    }
  })
  await prisma.permission.create({
    data: {
      title: "Customers",
      value: "customers"
    }
  })
  await prisma.permission.create({
    data: {
      title: "Credit Collection",
      value: "credit_collection"
    }
  })
  await prisma.permission.create({
    data: {
      title: "Inventory",
      value: "inventory"
    }
  })
  await prisma.permission.create({
    data: {
      title: "Promotion",
      value: "promotion"
    }
  })
  await prisma.permission.create({
    data: {
      title: "Sales Report",
      value: "sale_report"
    }
  })
  await prisma.permission.create({
    data: {
      title: "Stocks Report",
      value: "stock_report"
    }
  })
  await prisma.permission.create({
    data: {
      title: "Purchase Report",
      value: "purchase_report"
    }
  })

  await prisma.permission.create({
    data: {
      title: "Create Product",
      value: "create_product"
    }
  })

  await prisma.permission.create({
    data: {
      title: "Promotion Report",
      value: "promotion_report"
    }
  })

  await prisma.permission.create({
    data: {
      title: "Price Change Report",
      value: "price_change_reports"
    }
  })

  await prisma.permission.create({
    data: {
      title: "Inventory Report",
      value: "inventory_report"
    }
  })

  await prisma.payment_mode.create({
    data: {
      method: "after_sale"
    }
  })
  await prisma.payment_mode.create({
    data: {
      method: "bill_to_bill"
    }
  })
  await prisma.payment_mode.create({
    data: {
      method: "cheque"
    }
  })

  await prisma.setting.create({
    data: {
      including_vat: false,
      company_name: "Elitbuzz Technologies"
    }
  })

  await prisma.user.create({
    data: {
      first_name: "Ridoy",
      last_name: "",
      username: "a",
      password: "a",
      role: 1,
    }
  })

  await prisma.supplier.create({
    data: {
      company_name: "Mashruf",
    }
  })

  await prisma.category.create({
    data: {
      name: "Laptop",
      floor_id: 12
    }
  })

  await prisma.brand.create({
    data: {
      name: "Walton"
    }
  })

  await prisma.color.create({
    data: {
      name: "Blue"
    }
  })

  // fixed accounts (head)
  const income =  await prisma.account.create({
    data: {
      name: "Income"
    }
  })

  await prisma.sub_account.create({
    data: {
      name: "Sale",
      balance_type: 2,
      account_id: income.id
    }
  })

  await prisma.sub_account.create({
    data: {
      name: "Other Income",
      balance_type: 2,
      account_id: income.id
    }
  })

  await prisma.sub_account.create({
    data: {
      name: "Account Receivable",
      balance_type: 2,
      account_id: income.id
    }
  })

  const expense =  await prisma.account.create({
    data: {
      name: "Expense"
    }
  })

  await prisma.sub_account.create({
    data: {
      name: "Salary",
      balance_type: 1,
      account_id: expense.id
    }
  })

  await prisma.sub_account.create({
    data: {
      name: "Bill",
      balance_type: 1,
      account_id: expense.id
    }
  })

  await prisma.sub_account.create({
    data: {
      name: "Supplier Payment",
      balance_type: 1,
      account_id: expense.id
    }
  })

  await prisma.sub_account.create({
    data: {
      name: "Other Expense",
      balance_type: 1,
      account_id: expense.id
    }
  })

  const equity =  await prisma.account.create({
    data: {
      name: "Equity"
    }
  })

  await prisma.sub_account.create({
    data: {
      name: "Owner Payment",
      balance_type: 1,
      account_id: equity.id
    }
  })

  const liability =  await prisma.account.create({
    data: {
      name: "Liability"
    }
  })

  await prisma.sub_account.create({
    data: {
      name: "Account Payable",
      balance_type: 1,
      account_id: liability.id
    }
  })
}

seed()
