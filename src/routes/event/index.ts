import { Router } from 'express';
import controllers from '../../controllers';
import middleware from '../../middleware';


const routes = Router()


routes.post('/create',[middleware.auth.baseAuth],controllers.event.createEvent)
routes.post('/register/:id',[middleware.auth.baseAuth],controllers.event.registerOrCancelEvent)
routes.post(`/delete`,[middleware.auth.baseAuth],controllers.event.deleteEvent)

routes.patch(`/update/:id`,[middleware.auth.baseAuth],controllers.event.updateEvent)
routes.get('/get',[middleware.auth.baseAuth],controllers.event.getEvent)


export { routes as eventRoutes }