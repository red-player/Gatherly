import { Prisma, PrismaClient, UserType } from "@prisma/client";
import { Request, Response } from "express";
import responses, { ResponseProps } from "../../responses";
import Joi from "joi";
import bcrypt from "bcrypt";
import jwt from "../../utils/jwt";
import { v4 as uuid } from "uuid";

const prisma = new PrismaClient();

type ReqParamType = {};
type ReqBodyType = {
	userName: string;
	password: string;
};
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

const _schema = Joi.object({
    // Define schema here
    userName: Joi.string().required().description(" "),
    password: Joi.string().required().description(" "),
}).description(" ");

// Dummy JSON example
/*
{
    "userName": "exampleUser",
    "password": "examplePassword"
}
*/

let response: ResponseProps;
const index = async (req: RequestType, res: ResponseType) => {
	try {
		const {} = req.params;
		const { userName, password } = req.body;
		const { $schema } = req.query;

		// Describe schema
		if ($schema === "true") {
			response = responses.generate("success", {
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
		const user = await prisma.user.findFirst({
			where: {
				email: userName,
			},
		});

		if (!user) {
			throw "Invalid username or password";
		}

		const isPasswordMatched = bcrypt.compareSync(
			password,
			user?.hashPassword || ""
		);

		if (!isPasswordMatched) {
			throw "Invalid username or password";
		}

        const sessionId = uuid();

		const accessToken: string = (await jwt.signAccessToken({
			username:  `${user.firstName} ${user.lastName}`,
			id: user?.id as string,
			idp: "gatherly",
            sid : sessionId
		})) as string;

		const idToken: string = (await jwt.signIdToken(userName)) as string;
		const refreshToken: string = (await jwt.signRefreshToken(
			user,
		)) as string;

		const session = await prisma.userSession.create({
			data: {
				id: sessionId,
				accessToken,
				idToken,
				refreshToken,
				userId: user.id,
			},
		});
		

		response = responses.generate("success", {
			data: {
				userDetails: {
					id: user.id,
					email: user.email,
					firstName: user.firstName,
					lastName: user.lastName,
                    userType : user.userType
				},
				session: {
					accessToken,
					id: sessionId,
					idToken,
					refreshToken,
				},
			},
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
