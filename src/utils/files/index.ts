import multer from "multer";
import { getFileExtension } from "../general";
import path from "path";
import { uploadPath } from "../../config";

export const getStorage = () =>
  multer.diskStorage({
    destination: uploadPath,
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
      cb(
        null,
        path.parse(file.originalname).name +
          "_" +
          uniqueSuffix +
          "." +
          getFileExtension(file.originalname),
      );
    },
  });

export let getUploadObj = () => multer({ storage: getStorage() });
