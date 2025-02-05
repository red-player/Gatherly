import {  IExceptionGroup } from "../types";

const authExceptions:IExceptionGroup = {
  incorrectPassword: {
    statusCode:400,
    code: "incorrectPassword",
    message: "Incorrect Password",
  },
  userNotExist: {
    statusCode:400,
    code: "userNotExist",
    message: "User does not exist",
  },
  bcryptErr: {
    statusCode:400,
    code: "userNotExist",
    message: "Something went wrong",
  },
  missingTokenTypeInPayload: {
    statusCode:400,
    code: "missingTokenTypeInPayload",
    message: "Please Provide the type of the token",
  },
  missingTokenInPayload: {
    statusCode:400,
    code: "missingTokenInPayload",
    message: "Please Provide the token in payload",
  },
  missingToken: {
    statusCode:400,
    code: "missingToken",
    message: "Please Provide the token in ",
  },
  accessTokenMissing: {
    statusCode:400,
    code: "accessTokenMissing",
    message: "Access token is required",
  },
  sessionExpired:{
    statusCode:400,
    code: "sessionExpired",
    message: "Session Expired",
  },
  sessionIdMissing:{
    statusCode:400,
    code: "sessionIdMissing",
    message: "Session ID missing",
  }
};

export default authExceptions;
