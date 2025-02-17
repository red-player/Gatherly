import { Router, Request, Response } from 'express'
import controllers from '../controllers';
import { authRoutes } from './auth';
import { filesPath } from './file';
import { sponsorRoutes } from './sponsor';
import { eventRoutes } from './event';
import { eventCategoryRoutes } from './eventCategory';


const routes = Router();

const baseUrl = '/gatherly/api/v1';

routes.use(`${baseUrl}/auth`,[],authRoutes)
routes.use(`${baseUrl}/file`, filesPath);
routes.use(`${baseUrl}/sponsor`,sponsorRoutes)
routes.use(`${baseUrl}/event`,eventRoutes)
routes.use(`${baseUrl}/event-category`,eventCategoryRoutes)

export { routes };


