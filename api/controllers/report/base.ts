import Express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export async function DamageNLost(req:Express.Request, res: Express.Response) {
    const fromDate: any = req.query.from_date
    const toDate: any = req.query.to_date
    let fromQuery = {}
    let toQuery = {}

    if (fromDate){
        fromQuery = {created_at: {gt: new Date(fromDate)}}
    }

    if (toDate){
        toQuery = {created_at: {lt: new Date(new Date(toDate).setHours(23+6,59,59))}}
    }
    const all  = await prisma.damage_and_lost.findMany({
        where: {
            AND: [
                fromQuery,
                toQuery,
            ]
        },
        include: {
            product: {
                include:{
                    supplier: true,
                    color: true,
                }
            }
        }
    })
    return res.json({data: all})
}

export function getFilters(fromDate = null, toDate = null, supplierID = null, categoryID = null, brandID = null, productID = null) {
    let query = ""
    if (fromDate) {
        query += `where `
    }
}