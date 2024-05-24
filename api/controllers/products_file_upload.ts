import Express, { query } from "express";
import { PrismaClient } from "@prisma/client";
import dayjs from 'dayjs'
import fs from 'fs';
import path from 'path';
// import readXlsxFile from "read-excel-file";
import { color } from "@mui/system";
import { idText } from "typescript";
import { Readable } from "stream";
import readXlsxFile from 'read-excel-file/node'
const prisma = new PrismaClient()

export const IndexFileToProduct = async (req: Express.Request, res: Express.Response) => {

  //Supplier Name 	Categories	Brand 	Colors	Product Name	Size	Product Barcode	CPU	RPU	Stock	Discount
  try {

    if (
      req.body[0][0]?.toLowerCase() !== 'supplier Name' &&
      req.body[0][1]?.toLowerCase() !== 'categories' &&
      req.body[0][2]?.toLowerCase() !== 'brand' &&
      req.body[0][3]?.toLowerCase() !== 'colors' &&
      req.body[0][4]?.toLowerCase() !== 'product name' &&
      req.body[0][5]?.toLowerCase() !== 'size' &&
      req.body[0][6]?.toLowerCase() !== 'product barcode' &&
      req.body[0][7]?.toLowerCase() !== 'cpu' &&
      req.body[0][8]?.toLowerCase() !== 'rpu' &&
      req.body[0][9]?.toLowerCase() !== 'stock'
    ) return res.status(500).json({ error: 'Provide Invalide Header' });


    let errorCreateTables: any = [];
    let no_of_success = 0
    for (const element of req.body) {

      // console.log(typeof element[6], element[6])
      // console.log(typeof element[7], element[7])
      // console.log(typeof element[9], element[9])
      if (
        element[0]?.toLowerCase() !== 'supplier name' &&
        element[1] &&
        element[4] &&
        element[6] &&
        element[7]
      ) {

        //check if stock is interger or float
        // if (element[9] && element[9] % 1 !== 0) {
        //   errorCreateTables.push(element);
        //   continue;
        // }

        //check products barcode already used or not
        let resAlreadyHaveProductBarcode = await prisma.product.findFirst({
          where: {
            product_barcode: String(element[6])
          }
        })
        if (resAlreadyHaveProductBarcode) {
          errorCreateTables.push(element);
          continue;
        }

        //supplier check
        let resSupplier: any = null;
        if (element[0]) {
          resSupplier = await prisma.supplier.findFirst({
            where: { first_name: element[0]?.toLowerCase() }
          },)
          if (resSupplier === null) {
            resSupplier = await prisma.supplier.create({
              data: {
                first_name: element[0]?.toLowerCase(),
                company_name: element[0]?.toLowerCase(),
                discount: 0,
              }
            })
          }
        }

        //category check
        let resCategory = await prisma.category.findFirst({
          where: { name: element[1]?.toLowerCase() }
        })
        if (resCategory === null) {
          resCategory = await prisma.category.create({
            data: {
              name: element[1]?.toLowerCase(),
              floor_id: 0,
              vat_in_percent: 0,
              discount_in_percent: 0,
            }
          })
        };
        // console.log({ resCategory })
        //brand check
        let resBrand: any = null;
        if (element[2]) {
          resBrand = await prisma.brand.findFirst({
            where: { name: element[2]?.toLowerCase() }
          })
          if (resBrand === null) {
            resBrand = await prisma.brand.create({
              data: {
                name: element[2]?.toLowerCase(),
              }
            })
          };
        }

        //color check
        let resColor: any = null;
        if (element[3]) {
          resColor = await prisma.color.findFirst({
            where: { name: element[3]?.toLowerCase() }
          })
          if (resColor === null) {
            resColor = await prisma.color.create({
              data: {
                name: element[3]?.toLowerCase(),
              }
            })
          };
        }

        //SupplierName 	Categories	Brand 	Colors	ProductName	Size	ProductBarcode	CPU	RPU	Stock	Discount

        const resData = await prisma.product.create({
          data: {

            supplier_id: resSupplier?.id || null,
            category_id: resCategory.id, //required
            brand_id: resBrand?.id || null,
            color_id: resColor?.id || null,

            name: element[4], //required
            style_size: String(element[5]) || null,
            product_barcode: String(element[6]),
            cost_price: element[7], //required
            MRP_price: element[8] || 0, //required
            stock: parseFloat(element[9].toFixed(4)) || 0, //required
            discount: element[10] || 0, //required

            system_barcode: Date.now().toString(), //required

            is_ready: true,
          }
        })
        no_of_success++;
      }
      else {
        // element[0].toLowerCase() !== 'supplier name' && 
        errorCreateTables.push(element);
      }
    }

    res.status(200).json({
      error_to_create_tables: errorCreateTables,
      no_of_success
    });
  }
  catch (err) {
    console.log(err.message);
    res.status(500).json({
      error: err.message
    })
  }
}

interface ReqFileUpload {
  file: {
    buffer: Buffer;
  }
}

interface Data {
  data: string[]
}

export const FileUploads = async (req: ReqFileUpload, res: Express.Response) => {
  //Supplier Name 	Categories	Brand 	Colors	Product Name	Size	Product Barcode	CPU	RPU	Stock	Discount
  try {
    const data: any = await readXlsxFile(Buffer.from(req.file?.buffer))

    if (
      data[0][0]?.toLowerCase() !== 'supplier name' &&
      data[0][1]?.toLowerCase() !== 'categories' &&
      data[0][2]?.toLowerCase() !== 'brand' &&
      data[0][3]?.toLowerCase() !== 'colors' &&
      data[0][4]?.toLowerCase() !== 'product name' &&
      data[0][5]?.toLowerCase() !== 'size' &&
      data[0][6]?.toLowerCase() !== 'product barcode' &&
      data[0][7]?.toLowerCase() !== 'cpu' &&
      data[0][8]?.toLowerCase() !== 'rpu' &&
      data[0][9]?.toLowerCase() !== 'stock' &&
      data[0][10]?.toLowerCase() !== 'vat'

    ) return res.status(500).json({ error: 'Provide Invalide Header' });


    let errorCreateTables: any = [];
    let no_of_success = 0
    for (const element of data) {

      if (
        element[0]?.toLowerCase() !== 'supplier name' &&
        element[1] &&
        element[4] &&
        element[6] &&
        element[7]
      ) {

        //check if stock is interger or float
        // if (element[9] && element[9] % 1 !== 0) {
        //   errorCreateTables.push(element);
        //   continue;
        // }

        //check products barcode already used or not
        let resAlreadyHaveProductBarcode = await prisma.product.findFirst({
          where: {
            product_barcode: String(element[6])
          }
        })
        if (resAlreadyHaveProductBarcode) {
          errorCreateTables.push(element);
          continue;
        }

        //supplier check
        let resSupplier: any = null;
        if (element[0]) {
          resSupplier = await prisma.supplier.findFirst({
            where: { first_name: element[0]?.toLowerCase() }
          },)
          if (resSupplier === null) {
            resSupplier = await prisma.supplier.create({
              data: {
                first_name: element[0]?.toLowerCase(),
                company_name: element[0]?.toLowerCase(),
                discount: 0,
              }
            })
          }
        }

        //category check
        let resCategory = await prisma.category.findFirst({
          where: { name: element[1]?.toLowerCase() }
        })
        if (resCategory === null) {
          resCategory = await prisma.category.create({
            data: {
              name: element[1]?.toLowerCase(),
              floor_id: 0,
              vat_in_percent: 0,
              discount_in_percent: 0,
            }
          })
        };

        //brand check
        let resBrand: any = null;
        if (element[2]) {
          resBrand = await prisma.brand.findFirst({
            where: { name: element[2]?.toLowerCase() }
          })
          if (resBrand === null) {
            resBrand = await prisma.brand.create({
              data: {
                name: element[2]?.toLowerCase(),
              }
            })
          };
        }

        //color check
        let resColor: any = null;
        if (element[3]) {
          resColor = await prisma.color.findFirst({
            where: { name: element[3]?.toLowerCase() }
          })
          if (resColor === null) {
            resColor = await prisma.color.create({
              data: {
                name: element[3]?.toLowerCase(),
              }
            })
          };
        }

        //SupplierName 	Categories	Brand 	Colors	ProductName	Size	ProductBarcode	CPU	RPU	Stock	Discount

        const dataValue = {
          supplier_id: resSupplier?.id || null,
          category_id: resCategory.id, //required
          brand_id: resBrand?.id || null,
          color_id: resColor?.id || null,

          name: element[4], //required
          style_size: String(element[5]) || null,
          // product_barcode: String(element[6]),
          cost_price: element[7], //required
          MRP_price: element[8] || 0, //required
          stock: parseFloat(element[9].toFixed(4)) || 0, //required
          // discount: element[10] || 0, //required

          system_barcode: Date.now().toString(), //required
          vat_in_percent: element[10] || 0,

        }

        const resData = await prisma.product.createMany({
          data: [
            {
              ...dataValue,
              product_barcode: String(element[6]),
              is_ready: true
            },
            {
              ...dataValue,
              stock: 0,
              system_barcode: (Date.now() + 1).toString(),
              is_ready: false
            }
          ]
        })
        no_of_success++;
      }
      else {
        // element[0].toLowerCase() !== 'supplier name' && 
        errorCreateTables.push(element);
      }
    }

    res.status(200).json({
      total_tables: data.length ? data.length - 1 : 0,
      error_to_create_tables: errorCreateTables,
      no_of_success
    });
  }
  catch (err) {

    console.log(err.message);
    res.status(500).json({
      error: err.message
    })
  }
}