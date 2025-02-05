import { Prisma, PrismaClient } from "@prisma/client";

export type GetReqQueryParamType = {
  offset?: string;
  limit?: string;
};

export interface IException {
  statusCode: number;
  code: string;
  message: string;
}

export interface IExceptionGroup {
  [key: string]: IException;
}

export type IPrismaClientTransaction = Omit<PrismaClient<Prisma.PrismaClientOptions, never>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"> ;

