import { prisma } from "../db";
import { AdminInput } from "../schemas/adminSchema";

export const adminModel = {

    create: (data: AdminInput) => prisma.admin.create({data}),

    listAll: () => prisma.admin .findMany()  

} 