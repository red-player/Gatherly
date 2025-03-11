import { Prisma, PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import responses, { ResponseProps } from '../../responses';
import Joi from 'joi';
import { hashing } from '../../utils';


const prisma = new PrismaClient();

type ReqParamType = {};
type ReqBodyType = {
    email ?: string
    firstName ?: string
    lastName ? : string
    password ?: string
    sponsorEmail ?: string
    phone ?: string
    address ?: string
    city ?: string
    state ?: string
    zip ?: string
    isUserExist : boolean
};
type ResBodyType = {};
type ReqQueryParamType = {};
type BaseReqQueryParamType = { $schema: any };

type RequestType = Request<ReqParamType, ResBodyType, ReqBodyType, ReqQueryParamType & BaseReqQueryParamType>;
type ResponseType = Response;

const _schema = Joi.object({
    email: Joi.string().email().optional(),
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    password: Joi.string().optional(),
    sponsorEmail: Joi.string().email().optional(),
    phone: Joi.string().optional(),
    address: Joi.string().optional(),
    city: Joi.string().optional(),
    state: Joi.string().optional(),
    zip: Joi.string().optional(),
    isUserExist : Joi.boolean().required()
}).description(' ');

let response: ResponseProps;
const index = async (req: RequestType, res: ResponseType) => {
  try {
    const {} = req.params;
    const {
        isUserExist,
        ...body
    } = req.body;
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

    if(isUserExist === false && body.password && body.firstName && body.lastName && body.email) {
        const hashPassword = await hashing.hashPassword(body?.password)
        
            const createUser = await prisma.user.create({
                data: {
                    firstName: body.firstName,
                    lastName: body.lastName,
                    email: body.email,
                    password: body.password,
                    hashPassword
                },
                })
                console.log("createUser",createUser)
            const spposor = await prisma.sponsor.create({
                data :{
                    address : body.address || "",
                    userId : createUser.id,
                    createdBy : user.id,
                    city : body.city || "",
                    email : body.sponsorEmail || "",
                    phone : body.phone || "",
                    state : body.state || "",
                    zip : body.zip || "",
                    isApproved : false
                }
            })
            console.log("spposor",spposor)

    }else {
        const spposor = await prisma.sponsor.create({
            data :{
                address : body.address || "",
                userId : user.id,
                createdBy : user.id,
                city : body.city || "",
                email : body.sponsorEmail || "",
                phone : body.phone || "",
                state : body.state || "",
                zip : body.zip || "",
                isApproved : false
            }
        })
    }

    response = responses.generate('success', {
      data: {message : "sponsor has been created"},
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