import { Prisma, PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import responses, { ResponseProps } from '../../responses';
import Joi from 'joi';

const prisma = new PrismaClient();

type ReqParamType = {};
type ReqBodyType = {
    eventCategory :{
        id : string,
        isActive : boolean
    }[]
};
type ResBodyType = {};
type ReqQueryParamType = {};
type BaseReqQueryParamType = { $schema: any };

type RequestType = Request<ReqParamType, ResBodyType, ReqBodyType, ReqQueryParamType & BaseReqQueryParamType>;
type ResponseType = Response;

const _schema = Joi.object({
    eventCategory: Joi.array().items(
        Joi.object({
            id: Joi.string().required(),
            isActive: Joi.boolean().required()
        })
    ).required()
}).description('Event category schema');

// Dummy JSON example
/*
{
    "eventCategory": [
        {
            "id": "string",
            "isActive": true
        }
    ]
}
*/


let response: ResponseProps;
const index = async (req: RequestType, res: ResponseType) => {
  try {
    const {} = req.params;
    const {eventCategory} = req.body;
    const { $schema } = req.query;
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
    
    const updateUserCategory = eventCategory.map(async(i) => { 
        await prisma.userEventCategory.update({
            where : {
                id : i.id
            },
            data : {
                isActive : i.isActive
            }
        })
    })

    response = responses.generate('success', {
      data: {message : "User Prefence has been updated"},
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