import { Router } from "express";
import controllers from "../../controllers";
import { getUploadObj } from "../../utils/files";
import { uploadFields } from "../../utils/general";

const routes = Router();

const upload = getUploadObj();

routes.get("/:id", [], controllers.files.getFiles);
routes.post("/", [upload.fields([{ name: "files" }])], controllers.files.writeFile);

export { routes as filesPath };
