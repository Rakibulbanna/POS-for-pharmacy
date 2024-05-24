import Express from "express";
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()


export const CreateSubAccount = async (req: Express.Request, res: Express.Response) => {
    try {
        const subAccount = await prisma.sub_account.create({
            data: {
                account_id: parseInt(req.body.account_id),
                name: req.body.name,
                balance_type: parseInt(req.body.balance_type)
            }
        })

        return res.status(200).json(subAccount)
    } catch (e) {
        console.log(e)
        return res.status(500).json(e)
    }
}

export const IndexSubAccounts = async (req: Express.Request, res: Express.Response) => {
    return res.status(200).json(await prisma.sub_account.findMany({
        include: {
            account: true,
        }
    }))
}

export const DeleteSubAccount = async (req: Express.Request, res: Express.Response) => {
    try {
        const ID = parseInt(req.params.id)
        await prisma.sub_account.delete({
            where: {
                id: ID
            }
        })
        return res.status(200).json("deleted")
    } catch (e) {
        return res.status(500).json(e)
    }
}

export const UpdateSubAccount = async (req: Express.Request, res: Express.Response) => {
    try {
        const ID  = parseInt(req.params.id)
        
        const subAccount = await prisma.sub_account.update({
            where: {
                id: ID
            },
            data: {
                account_id: parseInt(req.body.account_id),
                name: req.body.name,
                balance_type: parseInt(req.body.balance_type)
            }
        })

        return res.status(200).json(subAccount)
    } catch (e) {
        console.log(e);
        
        return res.status(500).json(e)
    }


}

export const ShowSubAccount = async (req: Express.Request, res: Express.Response) => {
    const ID = parseInt(req.params.id)

    const subAccount =  await prisma.sub_account.findUnique({
        where: {
            id: ID,
        }
    })

        res.status(200).json(subAccount)

}