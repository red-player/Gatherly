import {  PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// export async function userActivityLog(userId:string) {
//     await prisma.userActivityLog.create({
//         data:{userId}
//     })
// }