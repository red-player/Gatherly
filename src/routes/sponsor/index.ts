import { Router } from 'express';
import controllers from '../../controllers';
import middleware from '../../middleware';


const routes = Router()


routes.post('/approve',[middleware.auth.baseAuth],controllers.sponsor.approveSponsor)

routes.get('/get',[middleware.auth.baseAuth],controllers.sponsor.getSponsor)

routes.post(`/register`,[middleware.auth.baseAuth],controllers.sponsor.sponsorRegisteration)


export { routes as sponsorRoutes }