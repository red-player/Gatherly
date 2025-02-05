import { IExceptionGroup } from "../types";

const settingExceptions:IExceptionGroup = {
  deviceModelNeedForAddingBrand: {
    statusCode:500,
    code: "deviceModelNeedForAddingBrand",
    message: "Need to pass minimum one device model to create new brand",
  },
};

export default settingExceptions;
