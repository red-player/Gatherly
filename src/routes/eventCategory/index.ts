import { Router } from 'express';
import controllers from '../../controllers';
import middleware from '../../middleware';


const routes = Router()


routes.post('/user-preference',[middleware.auth.baseAuth],controllers.eventCategory.userEventCategory)

routes.get('/get',[middleware.auth.baseAuth],controllers.eventCategory.getCategory)

routes.patch(`/update-user-preference`,[middleware.auth.baseAuth],controllers.eventCategory.updateUserEventCategory)
routes.patch(`/update-event-category/:eventId`,[middleware.auth.baseAuth],controllers.eventCategory.updateEventMapCategory)


export { routes as eventCategoryRoutes }