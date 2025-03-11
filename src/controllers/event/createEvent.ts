import { Prisma, PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import responses, { ResponseProps } from '../../responses';
import Joi from 'joi';

const prisma = new PrismaClient();

type ReqParamType = {};
type ReqBodyType = {
    eventName: string;
    eventStartDate: Date;
    eventEndDate: Date;
    eventStartTime: string;
    eventEndTime: string;
    eventLocation: string;
    latitude: string;
    longitude: string;
    isFree: boolean;
    eventDescription: string;
    eventCategoryIds: string[];
};
type ResBodyType = {};
type ReqQueryParamType = {};
type BaseReqQueryParamType = { $schema: any };

type RequestType = Request<ReqParamType, ResBodyType, ReqBodyType, ReqQueryParamType & BaseReqQueryParamType>;
type ResponseType = Response;

const _schema = Joi.object({
    eventName: Joi.string().required().description(' '),
    eventStartDate: Joi.date().required().description(' '),
    eventEndDate: Joi.date().required().description(' '),
    eventStartTime: Joi.string().required().description(' '),
    eventEndTime: Joi.string().required().description(' '),
    eventLocation: Joi.string().required().description(' '),
    latitude: Joi.string().required().description(' '),
    longitude: Joi.string().required().description(' '),
    isFree: Joi.boolean().required().description(' '),
    eventDescription: Joi.string().required().description(' '),
    eventCategoryIds: Joi.array().items(Joi.string()).required().description(' '),
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
  "eventCategoryIds": ["123456"]
}
*/

let response: ResponseProps;
const index = async (req: RequestType, res: ResponseType) => {
  try {
    const {} = req.params;
    const {
        eventName,
        eventStartDate,
        eventEndDate,
        eventStartTime,
        eventEndTime,
        eventLocation,
        latitude,
        longitude,
        isFree,
        eventDescription,
        eventCategoryIds
    } = req.body;
    const { $schema } = req.query;
    const user = req.user;
// console.log("object",user)
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

    const sponsorDetails = await prisma.sponsor.findFirst({
        where :{
            userId : req.user.id,
            isActive : true
        },
        select :{
            id : true,
            isApproved :true,
            User : {
                select :{
                    userType : true
                }
            }
        }
    })
// console.log("sponsorDetails",sponsorDetails)
    if(sponsorDetails?.isApproved === false) {
        throw new Error ('SponsorIsApprovedToPerformThisAction')
    }

    if(sponsorDetails?.User.userType !== "SPONSOR"){
        throw new Error ('SponsorNotFound')
    }

    if(!sponsorDetails) {
        throw new Error('SponsorNotFound')
    }

    const create = await prisma.event.create({
        data: {
            eventName: eventName,
            eventStartDate: new Date(eventStartDate),
            eventEndDate: new Date(eventEndDate),
            eventStartTime: eventStartTime,
            eventEndTime: eventEndTime,
            eventLocation: eventLocation,
            latitude: latitude,
            longitude: longitude,
            isFree: isFree,
            eventDescription: eventDescription,
            createdBy : user.id
        },
    });

    const sponsorEvent = await prisma.eventSponsor.create({
        data :{
            sponsorId : sponsorDetails.id,
            eventId : create.id,
            createdBy : req.user.id
        }
    })

    const eventMap = await prisma.eventMapCategory.createMany({
        data: eventCategoryIds.map(eventCategoryId => ({
            eventId: create.id,
            eventCategoryId: eventCategoryId
        }))
    })

    response = responses.generate('success', {
      data: {create},
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