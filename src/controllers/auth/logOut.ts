import { Prisma, PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import responses, { ResponseProps } from '../../responses';
import Joi from 'joi';
import createError from "http-errors";
import { jwt } from "../../utils";

const prisma = new PrismaClient();

type ReqParamType = {};
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
    const {} = req.params;
    const {} = req.body;
    const { $schema } = req.query;
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        return (createError.Unauthorized("Authorization header is required"));
    }

    const [tokenType, accessToken] = authHeader.split(" ");
    
    if (!accessToken) {
        return (createError.Unauthorized("Access token is required"));
    }

    if (tokenType !== "Bearer") {
        return (createError.Unauthorized("Invalid token type"));
    }    
    
    const decodedToken = await jwt.verifyAccessToken(accessToken) as { sid: string };

    const { sid: sessionId } = decodedToken;

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

    const isValid = await prisma.userSession.findFirst({
        where: {
            id: sessionId,
            isActive: true,
        },
    });

    if (!isValid || !isValid.isActive) {
        return (createError.Unauthorized("Please login again Isvalid"));
    }

    const deactivateSession = await prisma.userSession.update({
        where: {
            id: sessionId,
        },
        data: {
            isActive: false,
        },
    });

    response = responses.generate('success', {
      data: {message : "Logged out successfully"},
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