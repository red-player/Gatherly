import { Router, Request, Response } from 'express'
import controllers from '../controllers';
import { authRoutes } from './auth';


const routes = Router();

const baseUrl = '/gatherly/api/v1';
routes.use(`${baseUrl}/auth`,[],authRoutes)


export { routes };


