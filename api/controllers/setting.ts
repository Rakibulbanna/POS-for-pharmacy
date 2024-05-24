import Express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export const GetSettings = async (req: Express.Request, res: Express.Response) => {
  const settings = await prisma.setting.findFirst()
  return res.json({ data: settings })
}

export const UpdateSettings = async (req: Express.Request, res: Express.Response) => {
  try {
    const settings = await prisma.setting.findFirst()
    if (settings) {
      const licences = [...settings.licence_key]
      if (req.body.licence_key) licences.push(req.body.licence_key)
      await prisma.setting.updateMany({
        data: {
          including_vat: req.body.including_vat,
          company_name: req.body.company_name,
          company_address: req.body.company_address,
          company_phone_number: req.body.company_phone_number,
          point_system: req.body.point_system,
          point_ratio: req.body.point_ratio,
          redeem_ratio: req.body.redeem_ratio,
          licence_key: licences,
          served_by_size: req.body.served_by_size,
          pos_recipt_company_name_size: req.body.pos_recipt_company_name_size,
          pos_recipt_phone_number_size: req.body.pos_recipt_phone_number_size,
          vat_number: req.body.vat_number,
          invoice_note: req.body.invoice_note,
          pos_recipt_note_size: req.body.pos_recipt_note_size,
          show_point_balance_on_receipt: req.body.show_point_balance_on_receipt,
          enable_account_module: req.body.enable_account_module,
          enable_credit_module: req.body.enable_credit_module,
        }
      })
    } else {
      await prisma.setting.create({
        data: {
          including_vat: req.body.including_vat,
          company_name: req.body.company_name,
          company_address: req.body.company_address,
          company_phone_number: req.body.company_phone_number,
          point_system: req.body.point_system,
          point_ratio: req.body.point_ratio,
          redeem_ratio: req.body.redeem_ratio,
          licence_key: [req.body.licence_key],
          pos_recipt_company_name_size: req.body.pos_recipt_company_name_size,
          pos_recipt_phone_number_size: req.body.pos_recipt_phone_number_size,
          vat_number: req.body.vat_number,
          invoice_note: req.body.invoice_note,
          pos_recipt_note_size: req.body.pos_recipt_note_size,
          show_point_balance_on_receipt: req.body.show_point_balance_on_receipt,
          enable_account_module: req.body.enable_account_module,
          enable_credit_module: req.body.enable_credit_module,
        }
      })
    }
    // updateIncludingVat(req)
    const newSetting = await prisma.setting.findFirst()
    return res.json({ data: newSetting })
  } catch (error) {
    console.log(error);
    return res.status(422).json({ data: "error" })
  }
}

const updateIncludingVat = async (req) => {
  try {
    const includingVat = await prisma.setting.findFirst({
      where: {
        key: "including_vat"
      }
    })

    if (includingVat) {
      await prisma.setting.update({
        where: {
          id: includingVat.id
        },
        data: {
          value: req.body.including_vat ? "1" : "0"
        }
      })
    } else {
      await prisma.setting.create({
        data: {
          key: "including_vat",
          value: req.body.including_vat ? "1" : "0"
        }
      })
    }
  } catch (error) {
    throw error;
  }

}
