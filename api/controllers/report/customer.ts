import Express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()


export async function DueCollection(req: Express.Request, res: Express.Response) {
    let query = {
        created_at:{}
    }
    if (req.query?.from_date) query.created_at['gte'] = req.query.from_date;
    if (req.query?.to_date) query.created_at['lt'] = req.query.to_date;

    if (req.query?.phone_number) query['phoneNumber'] = req.query.phone_number;
    
    console.log({ query });
    const customers = await prisma.customer.findMany({
        where: {
            credit_spend: {
                gt: 0
            },
            // created_at :{
            //     gte: fromDate,
            //     lt: toDate
            //   },

        },
        include: {
            membership_type: true
        },

    })

    return res.json({ data: customers })
}