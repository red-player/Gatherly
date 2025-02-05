import { Prisma, PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import responses, { ResponseProps } from '../../responses';
import Joi from 'joi';
import { hashing } from '../../utils';

const prisma = new PrismaClient();

type ReqParamType = {};
type ReqBodyType = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};
type ResBodyType = {};
type ReqQueryParamType = {};
type BaseReqQueryParamType = { $schema: any };

type RequestType = Request<ReqParamType, ResBodyType, ReqBodyType, ReqQueryParamType & BaseReqQueryParamType>;
type ResponseType = Response;

const _schema = Joi.object({
    // Define schema here
    firstName: Joi.string().required().description(' '),
    lastName: Joi.string().required().description(' '),
    email: Joi.string().email().required().description(' '),
    password: Joi.string().required().description(' '),
}).description(' ');

// Dummy JSON example
/*
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
*/

let response: ResponseProps;
const index = async (req: RequestType, res: ResponseType) => {
  try {
    const {} = req.params;
    const {email,firstName,lastName,password} = req.body;
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

    const hashPassword = await hashing.hashPassword(password)

    const create = await prisma.user.create({
        data: {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            hashPassword
        },
        });

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