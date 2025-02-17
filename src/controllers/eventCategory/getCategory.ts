import { Prisma, PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import responses, { ResponseProps } from '../../responses';
import Joi from 'joi';

const prisma = new PrismaClient();

type ReqParamType = {};
type ReqBodyType = {};
type ResBodyType = {};
type ReqQueryParamType = {
    myCategory ?: string
    eventId ?: string
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
    const { $schema,eventId,myCategory } = req.query;

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
    let category

    if(myCategory){
        category = await prisma.userEventCategory.findMany({
            where :{
                userId : req.user.id,
                isActive : true,
                eventCategory :{
                    isActive : true
                }
            },
            select :{
                id : true,
                eventCategory :{
                    select :{
                        id : true,
                        categoryName : true,
                    }
                    
                }
            }
        })
    }

    if(eventId) {
        category = await prisma.eventMapCategory.findMany({
            where :{
                eventId,
                isActive : true,
                eventCategory :{
                    isActive :true
                }
            },
            select :{
                id : true,
                eventCategory :{
                    select :{
                        id : true,
                        categoryName : true
                    }
                }
            }
        })
    }
    
    category = await prisma.eventCategory.findMany({where :{isActive : true}})

    response = responses.generate('success', {
      data: {category},
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