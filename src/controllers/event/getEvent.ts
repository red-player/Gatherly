import { Prisma, PrismaClient } from '@prisma/client';
import e, { Request, Response } from 'express';
import responses, { ResponseProps } from '../../responses';
import Joi, { any } from 'joi';

const prisma = new PrismaClient();

type ReqParamType = {};
type ReqBodyType = {};
type ResBodyType = {};
type ReqQueryParamType = {
    eventCategoryIds ? : string[];
    myEvents ?: string;
    myCancelledEvents ?: string;
    myPaidEvents ?: string;
    myRegisteredEvents ?: string;
    q ?: string;
    eventStartDate ?: string;
    eventEndDate ?: string;
    eventId ?: string;
    isActiveFalse ?: string;

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
    const { $schema,
        myCancelledEvents,
        myPaidEvents,
        eventCategoryIds,
        myEvents,
        myRegisteredEvents,
        q,
        eventStartDate,
        eventEndDate,
        eventId,
        isActiveFalse
     } = req.query;

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

    let event : any;

    const baseCondition : Prisma.eventWhereInput = {
        isActive: isActiveFalse === "true" ? false : true
    };
    const queryCondition = {
        ...baseCondition
    }

    if(eventCategoryIds) {
        if (!queryCondition.eventMapCategory) {
            queryCondition.eventMapCategory = {};
        }
        if (!queryCondition.eventMapCategory.some) {
            queryCondition.eventMapCategory.some = {};
        }
        queryCondition.eventMapCategory = {
            some: {
                eventCategory: {
                    id: {
                        in: eventCategoryIds
                    }
                }
            }
        };
    }

    if (myRegisteredEvents === "true") {
        queryCondition.UserEvent = {
          some: { userId: req.user.id }
        };
        if (myCancelledEvents === "true") {
          if (!queryCondition.UserEvent.some) {
            queryCondition.UserEvent.some = {};
          }
          queryCondition.UserEvent.some.isActive = false;
        }
        if (myPaidEvents === "true") {
          if (!queryCondition.UserEvent.some) {
            queryCondition.UserEvent.some = {};
          }
          queryCondition.UserEvent.some.isPaid = true;
        }
      }
      

    if(myEvents === "true") {
        const findMyPreference = await prisma.userEventCategory.findMany({
            where :{
                userId : req.user.id,
                isActive : true
            }
        })
        if(findMyPreference) {
            const eventCategoryIds = findMyPreference.map((item) => item.eventCategoryId)
            if (!queryCondition.eventMapCategory) {
                queryCondition.eventMapCategory = {};
            }
            if (!queryCondition.eventMapCategory.some) {
                queryCondition.eventMapCategory.some = {};
            }
            queryCondition.eventMapCategory = {
                some: {
                    eventCategory: {
                        id: {
                            in: eventCategoryIds
                        }
                    }
                }
            };
        }
    }

    if(q) {
        queryCondition.eventName = {
            contains: q
        }
    }

    if (eventStartDate && eventEndDate) {
        queryCondition.eventStartDate = {
            gte: new Date(eventStartDate),
        };
        queryCondition.eventEndDate = {
            lte: new Date(eventEndDate),
        };
    } else if (eventStartDate) {
        queryCondition.eventStartDate = {
            gte: new Date(eventStartDate),
        };
    } else if (eventEndDate) {
        queryCondition.eventEndDate = {
            gte: new Date(),
            lte: new Date(eventEndDate),
        };
    }

     event = await prisma.event.findMany({
        where: queryCondition,
        select: {
            id: true,
            eventName: true,
            eventStartDate: true,
            eventEndDate: true,
            eventStartTime: true,
            eventEndTime: true,
            eventLocation: true,
            latitude: true,
            longitude: true,
            isFree: true,
            eventDescription: true,
            eventSponsor :{
                select :{
                    sponsor :{
                        select :{
                            address : true,
                            phone : true,
                            email : true,
                            city : true,
                            state : true,
                            zip: true,
                            User :{
                                select :{
                                    firstName : true,
                                    lastName : true,
                                    email : true
                                }
                            }
                        }
                    }
                    
                }
            },
            
        }
    }).then((data) => data ? data.map((item) => {
        return {
            id : item?.id || null,
            eventName: item?.eventName || null,
            eventLocation: item?.eventLocation || null,
            latitude: item?.latitude || null,
            longitude: item?.longitude || null,
            isFree: item?.isFree || null,
            eventDescription: item?.eventDescription || null,
            eventSponsorName : item?.eventSponsor[0].sponsor?.User?.firstName + ' ' + item?.eventSponsor[0].sponsor?.User?.lastName || null,
            eventSponsorEmail : item?.eventSponsor[0].sponsor?.User?.email || null,
            eventSponsorPhone : item?.eventSponsor[0].sponsor?.phone || null,
            eventSponsorAddress : item?.eventSponsor[0].sponsor?.address || null,
            eventSponsorCity : item?.eventSponsor[0].sponsor?.city || null,
            eventSponsorState : item?.eventSponsor[0].sponsor?.state || null,
            eventSponsorZip : item?.eventSponsor[0].sponsor?.zip || null, 
            eventStartTime: item?.eventStartTime || null,
            eventEndTime: item?.eventEndTime || null,
            eventStartDate: item?.eventStartDate.toISOString() || null,
            eventEndDate: item?.eventEndDate.toISOString() || null,
            }
        }) : []);

   

    if(eventId) {
        event = await prisma.event.findFirst({
            where: {
                id: eventId,
            },
            select: {
                id: true,
                eventName: true,
                eventStartDate: true,
                eventEndDate: true,
                eventStartTime: true,
                eventEndTime: true,
                eventLocation: true,
                latitude: true,
                longitude: true,
                isFree: true,
                eventDescription: true,
                eventSponsor :{
                    select :{
                        sponsor :{
                            select :{
                                address : true,
                                phone : true,
                                email : true,
                                city : true,
                                state : true,
                                zip: true,
                                User :{
                                    select :{
                                        firstName : true,
                                        lastName : true,
                                        email : true
                                    }
                                }
                            }
                        }
                        
                    }
                },
            }
        }).then((data) => {
            return {
                id : data?.id || null,
                eventName: data?.eventName || null,
                eventLocation: data?.eventLocation || null,
                latitude: data?.latitude || null,
                longitude: data?.longitude || null,
                isFree: data?.isFree || null,
                eventDescription: data?.eventDescription || null,
                eventSponsorName : data?.eventSponsor[0].sponsor?.User?.firstName + ' ' + data?.eventSponsor[0].sponsor?.User?.lastName || null,
                eventSponsorEmail : data?.eventSponsor[0].sponsor?.User.email || null,
                eventSponsorPhone : data?.eventSponsor[0].sponsor?.phone || null,
                eventSponsorAddress : data?.eventSponsor[0].sponsor?.address || null,
                eventSponsorCity : data?.eventSponsor[0].sponsor?.city || null,
                eventSponsorState : data?.eventSponsor[0].sponsor?.state || null,
                eventSponsorZip : data?.eventSponsor[0].sponsor?.zip || null, 
                eventStartTime: data?.eventStartTime || null,
                eventEndTime: data?.eventEndTime || null,
                eventStartDate: data?.eventStartDate.toISOString() || null,
                eventEndDate: data?.eventEndDate.toISOString() || null,
            }
        })
    }

    response = responses.generate('success', {
      data: {event},
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