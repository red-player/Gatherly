import { Prisma, PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import responses, { ResponseProps } from '../../responses';
import Joi from 'joi';

const prisma = new PrismaClient();

type ReqParamType = {};
type ReqBodyType = {
    sponsorIds : string[]
    isApprove : boolean
};
type ResBodyType = {};
type ReqQueryParamType = {};
type BaseReqQueryParamType = { $schema: any };

type RequestType = Request<ReqParamType, ResBodyType, ReqBodyType, ReqQueryParamType & BaseReqQueryParamType>;
type ResponseType = Response;

const _schema = Joi.object({
    sponsorIds: Joi.array().items(Joi.string()).required().description(' '),
    isApprove : Joi.boolean().required()
}).description(' ');

let response: ResponseProps;
const index = async (req: RequestType, res: ResponseType) => {
  try {
    const {} = req.params;
    const {
        sponsorIds,
        isApprove
    } = req.body;
    const { $schema } = req.query;
    const user = req.user

    if(user.userType !== "ADMIN") {
        throw new Error('YouAreNotPrivilegedToAccess')
    }

    if(sponsorIds.length === 0) {
        throw new Error('ProvideUserIdToPerformThisAction')
    }

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

    const findIds = await prisma.sponsor.findMany({
        where :{
            // User :{
            //     id :{
            //         in : sponsorIds
            //     }
            // }
            id :{
                      in : sponsorIds
                  }
        }
    })

   const approve = findIds.map(async (i) => (
    await prisma.sponsor.update({
        where :{
            id : i.id
        },
        data :{
            isApproved : isApprove
        }
    })
    
   ))

   const sponsorUpdate = findIds.map(async (i) => (
    await prisma.user.update({
        where :{
            id : i.userId
        },
        data :{
            userType : "SPONSOR"
        }
    })
    
   ))
  //  console.log(approve)

   const s = sponsorIds.length > 1 ? "Users" : "User"

   const m = isApprove === true ? `The ${s} has been Approved` : `The ${s} Sponsors has been Cancelled`

    response = responses.generate('success', {
      data: {message : m },
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