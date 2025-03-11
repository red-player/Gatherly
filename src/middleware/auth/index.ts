import { jwt } from "../../utils";
import responses from "../../responses";
import { NextFunction, Request, Response } from "express";
import { PrismaClient, User } from "@prisma/client";
import createError from "http-errors";
// import {  userActivityLog } from "../../service/log";
const prisma = new PrismaClient();

declare global {
	namespace Express {
		interface Request {
			userId: string;
			user: User;
		}
	}
}

const baseAuth = async (req: Request, res: Response, next: NextFunction) => {
	try {
		if (!req.headers.authorization) {
			return next(createError.Unauthorized("Access token is required"));
		}

		const authHeader = req.headers["authorization"];

		const [tokenType, accessToken] = authHeader.split(" ");

		if (!accessToken) {
			return next(createError.Unauthorized("Access token is required"));
		}

		if (tokenType !== "Bearer") {
			return next(createError.Unauthorized("Invalid token type"));
		}


		const decodedToken = await jwt.verifyAccessToken(accessToken) as { sid: string };
		const { sid: sessionId } = decodedToken;

		if (!sessionId) {
			return next(createError.Unauthorized("Session id is required"));
		}

		const isValid = await prisma.userSession.findFirst({
			where: {
				id: sessionId,
				isActive: true,
			},
		});
		if (!isValid || !isValid.isActive) {
			return next(createError.Unauthorized("Please login again "));
		}

		await jwt.verifyAccessToken(accessToken).then(async (user) => {
			const userData = user as any;

			req.userId = userData.uid;
			const foundUser = await findUser(userData.uid);

			if (!foundUser) {
				return next(createError.Unauthorized("User not found"));
			}

			req.user = foundUser;

			const userId = foundUser.id || '';
			
			// await userActivityLog(userId);

			next();
		});
	} catch (error: any) {
		await prisma.$disconnect();

		if (error.message == "jwt expired") {
			res
				.status(401)
				.send(
					responses.generic.generateErrResponse(
						"tokenExpired",
						"Token expired, Kindly login again.",
						error.message
					)
				);
		} else {
			res
				.status(401)
				.send(
					responses.generic.generateErrResponse(
						"error",
						"Auth Error.",
						error.message
					)
				);
		}
	}
};

async function findUser(userId: string) {
	return prisma.user.findFirst({
		where: {
			id: userId,
		},
	});
}

const auth = {
	baseAuth,
};

export default auth;
