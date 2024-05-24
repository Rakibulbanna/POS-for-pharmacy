import {Prisma} from "./base";

export async function Store(values){
  try {
    const user =  await Prisma.user.create({
      data: {

      }
    })
  }catch (e){
    throw e
  }

}
