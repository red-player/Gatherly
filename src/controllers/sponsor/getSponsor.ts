import { Prisma, PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import responses, { ResponseProps } from '../../responses';
import Joi from 'joi';

const prisma = new PrismaClient();

type ReqParamType = {};
type ReqBodyType = {};
type ResBodyType = {};
type ReqQueryParamType = {
    sponsorId ? : string
    isApproved ? : string
    q ?: string
    isActiveFalse ?: string
};
type BaseReqQueryParamType = { $schema: any };

type RequestType = Request<ReqParamType, ResBodyType, ReqBodyType, ReqQueryParamType & BaseReqQueryParamType>;
type ResponseType = Response;

const _schema = Joi.object({}).description(' ');

let response: ResponseProps;
const index = async (req: RequestType, res: ResponseType) => {
  try {
    const {} = req.params;
    const {} = req.body;
    const { $schema,isApproved,q,sponsorId ,isActiveFalse} = req.query;
    const user = req.user

    // Describe schema
    if ($schema === 'true') {
      response = responses.generate('success', {
        data: { $schema: _schema.describe() },
      });
      return;
    }

    // Schema validation
    const { error: schemaError } = _schema.validate(req.body);
    if (schemaError) {
      throw schemaError.details[0].message;
    }

    // Write your logic here

    if(user.userType !== "ADMIN") {
        throw new Error('YouAreNotPrivilegedToAccess')
    }

    let sponsor : any;

    const baseCondition : Prisma.sponsorWhereInput = {
        isActive: isActiveFalse === "true" ? false : true
    };

    const queryCondition = {
        ...baseCondition
    }

    if(isApproved){
        queryCondition.isApproved = isApproved === "true" ? true : false
    }

    if(q){
        if (queryCondition.User) {
            queryCondition.User.OR = [
                { firstName: { contains: q } },
                { lastName: { contains: q } }
            ];
        } else {
            queryCondition.User = {
                OR: [
                    { firstName: { contains: q } },
                    { lastName: { contains: q } }
                ]
            };
        }
    }

    sponsor = await prisma.sponsor.findMany({
        where : queryCondition,
        select :{
            id : true,
            address : true,city : true,email : true,phone : true,isApproved : true,state : true,
            zip : true,
        }
    })

    if(sponsorId){
        sponsor = await prisma.sponsor.findMany({
            where : {
                id : sponsorId
            },
            select :{
                id : true,
                address : true,city : true,email : true,phone : true,isApproved : true,state : true,
                zip : true,
            }
        })
    }

    response = responses.generate('success', {
      data: {sponsor},
    });
  } catch (error) {
    response = responses.generate('error', {
      error: error,
    });
  } finally {
    res.status(response.statusCode).send(response);
    await prisma.$disconnect();
  }
};

export default index;