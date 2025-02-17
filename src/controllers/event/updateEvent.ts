import { Prisma, PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import responses, { ResponseProps } from '../../responses';
import Joi from 'joi';

const prisma = new PrismaClient();

type ReqParamType = {id : string};
type ReqBodyType = {
    eventName ?: string;
    eventStartDate ?: Date;
    eventEndDate ?: Date;
    eventStartTime ?: string;
    eventEndTime ?: string;
    eventLocation ?: string;
    latitude ?: string;
    longitude ?: string;
    isFree ?: boolean;
    eventDescription ?: string;
    eventCategoryId ?: string;
};
type ResBodyType = {};
type ReqQueryParamType = {};
type BaseReqQueryParamType = { $schema: any };

type RequestType = Request<ReqParamType, ResBodyType, ReqBodyType, ReqQueryParamType & BaseReqQueryParamType>;
type ResponseType = Response;

const _schema = Joi.object({
    eventName: Joi.string().optional(),
    eventStartDate: Joi.date().optional(),
    eventEndDate: Joi.date().optional(),
    eventStartTime: Joi.string().optional(),
    eventEndTime: Joi.string().optional(),
    eventLocation: Joi.string().optional(),
    latitude: Joi.string().optional(),
    longitude: Joi.string().optional(),
    isFree: Joi.boolean().optional(),
    eventDescription: Joi.string().optional(),
    eventCategoryId: Joi.string().optional()
}).description(' ');

// Dummy JSON example
/*
{
  "eventName": "Event Name",
  "eventStartDate": "2021-12-31",
  "eventEndDate": "2021-12-31",
  "eventStartTime": "12:00",
  "eventEndTime": "15:00",
  "eventLocation": "Event Location",
  "latitude": "123.456",
  "longitude": "123.456",
  "isFree": true,
  "eventDescription": "Event Description",
  "eventCategoryId": "123456"
}
*/

let response: ResponseProps;
const index = async (req: RequestType, res: ResponseType) => {
  try {
    const {
        id
    } = req.params;
    const {
        ...body
    } = req.body;
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

    const isEvent = await prisma.event.findFirst({
        where :{
            id, isActive : true
        }
    })

    if(isEvent){
        const updateEvent = await prisma.event.update({
            where :{id },
            data :{
                ...body
            }
        })
    }
    else {
        throw new Error ('Event Not Found')
    }

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