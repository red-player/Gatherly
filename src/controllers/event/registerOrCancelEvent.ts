import { Prisma, PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import responses, { ResponseProps } from '../../responses';
import Joi from 'joi';

const prisma = new PrismaClient();

type ReqParamType = {
    id: string;
};
type ReqBodyType = {};
type ResBodyType = {};
type ReqQueryParamType = {};
type BaseReqQueryParamType = { $schema: any };

type RequestType = Request<ReqParamType, ResBodyType, ReqBodyType, ReqQueryParamType & BaseReqQueryParamType>;
type ResponseType = Response;

const _schema = Joi.object({}).description(' ');

let response: ResponseProps;
const index = async (req: RequestType, res: ResponseType) => {
  try {
    const {
        id,
    } = req.params;
    const {} = req.body;
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

    const isRegistered = await prisma.userEvent.findFirst({
        where: {
            eventId: id,
            userId: req.user.id
        },
        select: {
            id: true,
            serialNo: true,
        }
    });

    const findEvent = await prisma.event.findFirst({
        where: {
            id,
            isActive: true
        }
    });

    const findAnyRegisteredEvent = await prisma.userEvent.findFirst({
        where: {
            isActive: true
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    if (isRegistered) {
        await prisma.userEvent.update({
            where: {
                id: isRegistered.id
            },
            data: {
                isActive: false
            }
        });
    } else {
        await prisma.userEvent.create({
            data: {
                eventId: id,
                userId: req.user.id,
                createdBy: req.user.id,
                ticketId: 'TICKET' + (findAnyRegisteredEvent?.serialNo ? findAnyRegisteredEvent.serialNo + 1 : 1) + (new Date().toString()) + '-' + findEvent?.eventName,
                serialNo: findAnyRegisteredEvent?.serialNo ? findAnyRegisteredEvent.serialNo + 1 : 1
            }
        });
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