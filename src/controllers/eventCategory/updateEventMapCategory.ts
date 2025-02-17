import { Prisma, PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import responses, { ResponseProps } from '../../responses';
import Joi from 'joi';

const prisma = new PrismaClient();

type ReqParamType = {eventId : string};
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
    const {eventId} = req.params;
    const {eventCategory} = req.body;
    const { $schema } = req.query;

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

    const findEvent = await prisma.event.findFirst({where :{id : eventId, isActive : true}})

    if(!findEvent) {throw new Error ("EventNotFound")}

    const findEventMappedCategory = await prisma.eventMapCategory.findMany({
        where:{
            id :{
                in : eventCategory.map(i => i.id)
            }
        }
    })

    const updateEventMap = eventCategory.map(async(i) => {
        await prisma.eventMapCategory.update({
            where :{
                id : i.id
            },
            data : {
                isActive : i.isActive
            }
        })
    })

    response = responses.generate('success', {
      data: {},
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