
import { PrismaClient } from "@prisma/client";
import {Simulate} from "react-dom/test-utils";

const prisma = new PrismaClient()

export async function AddPoint(customerID: number, amount: number) {
    const setting = await prisma.setting.findFirstOrThrow({})

    const ratio = setting.point_ratio/100
    const customerPoint = ratio * amount
    const customer = await prisma.customer.findFirstOrThrow({
        where: {
            id: customerID
        }
    })

    await prisma.customer.update({
        where: {
            id: customerID
        },
        data: {
            point: customer.point + customerPoint
        }
    })

    return customerPoint
}

export async function SubtractPoint(customerID:number, amount:number) {
    // get setting
    const setting = await prisma.setting.findFirstOrThrow({})
    const redeemRatio = setting.redeem_ratio/100

    const user = await prisma.customer.findFirstOrThrow({
        where: {
            id: customerID
        }
    })

    // check if user have those many poitn or not
    const pointToReduce =  amount/redeemRatio

    if (user.point - pointToReduce < 0){
        throw "customer don't have enough point"
    }


    await prisma.customer.update({
        where: {
            id: customerID,
        },
        data: {
            point: user.point - pointToReduce
        }
    })

    return pointToReduce

    // get how many amount they want to pay via redeem
}