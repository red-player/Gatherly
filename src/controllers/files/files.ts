import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import path from "path";
import responses from "../../responses";
import * as fs from "fs";

const prisma = new PrismaClient();

const getFiles = async (req: Request, res: Response) => {
  try {
    const _fileNameId = req.params.id;

    const file = await prisma.fileMetaData.findUnique({
      where: {
        id: _fileNameId,
      },
    });

    const filePath = file?.filePath;
    if (file && filePath && fs.existsSync(filePath)) {
      res.setHeader("Content-Disposition", `attachment; filename=\"${file.orgFileName}\"`);
      res.setHeader("File-Name", `${file.fileName}`);
      res.setHeader("Content-Type", `${file.fileType}`);
      res.setHeader("Content-Length", `${file.fileSize}`);
      res.sendFile(filePath);
    } else {
      res
        .status(500)
        .send(responses.generic.generateErrResponse("error", "Failure", "File not found"));
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).send(responses.generic.generateErrResponse("error", "Failure", error.message));
  }
};

export default getFiles;
