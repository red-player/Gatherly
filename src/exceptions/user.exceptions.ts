import { IExceptionGroup } from "../types";

const userExceptions:IExceptionGroup = {
  userWithSameMailExist: {
    statusCode: 500,
    code: "userWithSameMailExist",
    message: "User with same mail already exists",
  },
  userNotExist: {
    statusCode: 500,
    code: "userNotExist",
    message: "User not exists",
  },
  userNotCheckedIn: {
    statusCode: 500,
    code: "userNotCheckedIn",
    message: "User not checked in",
  },
};

export default userExceptions;
