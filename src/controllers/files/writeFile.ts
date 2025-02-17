import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import responses, { ResponseProps } from "../../responses";
import Joi from "joi";
import { v4, v4 as uuid } from "uuid";
import { getArrayFromEnumType } from "../../utils";

import { getFileExtension } from "../../utils/general";
import { uploadPath } from "../../config";

const prisma = new PrismaClient();

export const uploadFiles_files = [{ name: "files" }];

type ReqParamType = {};
type ReqBodyType = {};
type ResBodyType = {};
type ReqQueryParamType = {};
type BaseReqQueryParamType = { $schema: any };

type RequestType = Request<
  ReqParamType,
  ResBodyType,
  ReqBodyType,
  ReqQueryParamType & BaseReqQueryParamType
>;

type ResponseType = Response;

// TODO:  Add uan in db
//

const _schema = Joi.object({}).description("Staff onboarding basic details form");

let response: ResponseProps;

const index = async (req: RequestType, res: ResponseType) => {
  try {
    const {} = req.params;
    const { ...body } = req.body;
    const { $schema } = req.query;

    const attachments: any = req.files as Express.Multer.File[];

    // ? describe schema
    if ($schema === "true") {
      response = responses.generate("success", {
        data: { $schema: _schema.describe() },
      });
      return;
    }

    // ? schema validation
    const { error: schemaError } = _schema.validate(req.body);
    if (schemaError) {
      throw schemaError.details[0].message;
    }

    const basicDetails = await prisma.$transaction(async (tx) => {
      if (attachments) {
        const attachment = {
          aadhaar: attachments?.["files"]?.[0],
        };

        const fileMetaData = Object.entries(attachment).map(([name, value]: [string, any]) => ({
          id: v4(),
          fileSize: value.size,
          fileName: value.filename,
          orgFileName: value.originalname,
          fileType: value.mimetype,
          fileExtension: getFileExtension(value?.originalname),
          filePath: `${uploadPath}${value.filename}`,
        }));

        await tx.fileMetaData.createMany({
          data: fileMetaData,
        });
        return fileMetaData;
      }
    });

    response = responses.generate("success", {
      data: { basicDetails },
    });
  } catch (error) {
    response = responses.generate("error", {
      error: error,
    });
  } finally {
    res.status(response.statusCode).send(response);
    await prisma.$disconnect();
  }
};

export default index;
