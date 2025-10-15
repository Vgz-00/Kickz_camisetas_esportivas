import { prisma } from "../db";
import { AdminInput } from "../schemas/adminSchema";

export const adminModel = {

    create: (data: AdminInput) => prisma.admin.create({data}),

    listAll: () => prisma.admin .findMany()  ,
    
    findByEmail: (email: string) => {
    return prisma.admin.findFirst({ where: { email } });
    },
    registrarLog(data: any) {
    return prisma.log.create({ data });
    },
} 