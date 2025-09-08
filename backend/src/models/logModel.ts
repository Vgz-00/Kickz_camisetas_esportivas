import { Prisma } from "@prisma/client"
import { prisma } from "../db"
import { LogInput } from "../schemas/logSchema"


export const logModel = {

  create: (data: Prisma.LogitgUncheckedCreateInput) => prisma.log.create({ data }),
  
  listAll: () => prisma.log.findMany({ include: { cliente: true, admin: true } }) 

}